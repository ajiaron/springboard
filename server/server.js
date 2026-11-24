require('dotenv').config()
const express = require('express');
const path = require('path');
const app = express();
const mysql = require('mysql')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const bcrypt = require('bcryptjs')
const { requireAuth, resolveUser, assertSelf } = require('./auth')
const { stripSensitive, USER_PUBLIC_COLUMNS, clampString, parsePositiveInt } = require('./sanitize')
const { fetchCharitiesForSync, searchCharities, getApiKey } = require('./charityNavigator')

const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:3000'
const stripeSecret = process.env.STRIPE_SECRET_KEY
if (!stripeSecret && process.env.NODE_ENV !== 'test') {
    console.error('STRIPE_SECRET_KEY is not set')
}
const stripe = require('stripe')(stripeSecret || 'sk_test_placeholder_for_boot')

app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}))
app.use(express.json({ limit: '100kb' }))
app.use(cors({
    origin: clientOrigin,
    credentials: true,
}))

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, try again later' },
})

const paymentLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many payment requests, try again later' },
})

//app.use(express.static(path.join(__dirname, '../client/build')));
//app.use(express.static("public"))
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');

const dbHost = (!process.env.DB_HOST || process.env.DB_HOST === 'localhost')
    ? '127.0.0.1'
    : process.env.DB_HOST
const db = mysql.createConnection({
    user: process.env.DB_USER || 'root',
    host: dbHost,
    password: process.env.DB_PASSWORD || '',
    charset: 'utf8mb4',
    database: process.env.DB_NAME || 'andale_db',
})

const bindUser = [requireAuth, resolveUser(db)]

app.post('/api/createintent', paymentLimiter, ...bindUser, async (req, res) => {
    const amount = parsePositiveInt(req.body.amount, { min: 50, max: 99999999 })
    const accountid = clampString(req.body.accountid, 128)
    if (amount == null || !accountid) {
        return res.status(400).json({ error: 'Invalid amount or account' })
    }
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            automatic_payment_methods: {
              enabled: true,
            },
            application_fee_amount: 123,
            transfer_data: {
              destination: accountid,
            },
            metadata: {
              userid: String(req.userId),
            },
          });
          res.json({client_secret: paymentIntent.client_secret});
    } catch(e) {
        console.error(e)
        res.status(500).json({ error: "Failed to create payment intent" });
    }
})
app.post('/api/createaccount', paymentLimiter, ...bindUser, async (req, res) => {
    try {
        const account = await stripe.accounts.create({
            type: 'express',
        });
        res.json(account);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create account link" });
    }
});
app.post('/api/createaccountlink', paymentLimiter, ...bindUser, async (req, res) => {
    const accountid = clampString(req.body.accountid, 128)
    const ownerid = req.userId
    const campaignid = clampString(req.body.campaignid, 64)
    const email = clampString(req.body.email, 255)
    const firstname = clampString(req.body.firstname, 100)
    const lastname = clampString(req.body.lastname, 100)
    const username = req.authUsername
    if (!accountid || !campaignid || !email) {
        return res.status(400).json({ error: 'Missing required fields' })
    }
    db.query(`INSERT INTO campaigns (campaignid, ownerid, accountid, email, firstname, lastname, username) VALUES (?,?,?,?,?,?,?)`,
    [campaignid, ownerid, accountid, email, firstname, lastname, username], (err, dbRes) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ error: "Failed to insert into database" });
        } else {
          stripe.accountLinks.create({
            account: accountid, 
            refresh_url: `${clientOrigin}/`,
            return_url: `${clientOrigin}/createcampaign/${campaignid}`,
            type: 'account_onboarding',
        }, (stripeError, accountLink)=> {
            if (stripeError) {
                console.error(stripeError)
                return res.status(500).json({ error: "Failed to create account link" });
            }            
            res.json(accountLink);
        })
    }
    })
});
app.get('/api/getaccountlink', paymentLimiter, ...bindUser, async(req, res)=> {
    const accountid = clampString(req.query.accountid, 128)
    const username = req.authUsername
    if (!accountid) {
        return res.status(400).json({ error: 'Missing accountid' })
    }
    stripe.accountLinks.create({
        account: accountid, 
        refresh_url: `${clientOrigin}/`,
        return_url: `${clientOrigin}/${username}`,
        type: 'account_onboarding',
    }, (stripeError, accountLink)=> {
        if (stripeError) {
            console.error(stripeError)
            return res.status(500).json({ error: "Failed to create account link" });
        }            
        res.json(accountLink);
    })
})
app.get('/api/getconfirmedstripe/:accountid/:userid', paymentLimiter, ...bindUser, async (req, res) => {
    const accountid = clampString(req.params.accountid, 128)
    const userid = req.userId
    if (!assertSelf(req, res, req.params.userid)) return
    try {
        const account = await stripe.accounts.retrieve(accountid)
        if (account) {
            db.query(`UPDATE users SET accountid = ?, payouts = ?, charges = ? WHERE userid = ?`, 
            [accountid, account.payouts_enabled, account.charges_enabled, userid])
            res.send(account)
        }
    } catch(e) {
        console.error(e)
        res.status(500).json({ success: false, message: 'Server error.' });
    }
})
app.put('/api/confirmstripe/:accountid/:userid', paymentLimiter, ...bindUser, async (req, res) => {
    const accountid = clampString(req.params.accountid, 128)
    const userid = req.userId
    if (!assertSelf(req, res, req.params.userid)) return
    try {
        const account = await stripe.accounts.retrieve(accountid)
        if (account.details_submitted) {
            db.query(`UPDATE users SET accountid = ?, payouts = ?, charges = ? WHERE userid = ?`, 
            [accountid, account.payouts_enabled, account.charges_enabled, userid])
            if (account.charges_enabled && account.payouts_enabled) {
                res.json({ success: true, message: 'charges and payouts enabled' });
            } else {
                res.json({ success: false, message: 'details submitted, no charges or payouts' });
            }
        } else {
            res.json({success:false, message: "details have not been submitted."})
        } 
    } catch(e) {
        console.error(e)
        res.status(500).json({ success: false, message: 'Server error.' });
    }
})

// new
app.get('/api/getcampaign/:campaignid', (req, res) => {
    const campaignid = req.params.campaignid
    db.query(`SELECT DISTINCT * FROM campaigns WHERE campaignid = ?`,
    [campaignid], (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

app.put('/api/confirmcampaign', ...bindUser, (req,res) => {
    const ownerid = req.userId
    const campaignid = clampString(req.body.campaignid, 64)
    const campaignname = clampString(req.body.campaignname, 200)
    const goal = req.body.goal
    const description = clampString(req.body.description, 5000)
    const category = clampString(req.body.category, 100)
    const theme = clampString(req.body.theme, 100)
    if (!campaignid || !campaignname) {
        return res.status(400).json({ error: 'Missing required fields' })
    }
    const sql = `UPDATE campaigns SET `+
    `campaignname = ?, goal = ?, description = ?, category = ?, theme = ?, verified = true ` +
    `WHERE campaignid = ? AND ownerid = ?;` 
    db.query(sql, 
    [campaignname, goal, description, category, theme, campaignid, ownerid],
    (err, result)=> {
        if (err) {
            console.error(err)
            return res.status(500).json({ error: 'Server error' })
        }
        res.send(result)
    })
})
//

app.get('/api/getusers', ...bindUser, (req, res) => {
    db.query(`SELECT ${USER_PUBLIC_COLUMNS} FROM users`, (err, result) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ error: 'Server error' })
        }
        res.send(stripSensitive(result))
    })
})
app.get('/api/getuserlist/:next/:current', ...bindUser, (req, res) => {
    const next = Number(req.params.next)
    const current = Number(req.params.current)
    db.query(`SELECT ${USER_PUBLIC_COLUMNS} FROM users LIMIT ? OFFSET ?`, [next, current], (err, result) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ error: 'Server error' })
        }
        res.send(stripSensitive(result))
    })
})
app.get('/api/getuserslist/:next/:current', ...bindUser, (req, res) => {
    const next = Number(req.params.next)
    const current = Number(req.params.current)
    const userid = req.userId
    const sql = `SELECT ${USER_PUBLIC_COLUMNS}, CASE `+
    `WHEN ? IN (SELECT requesterid FROM andale_db.followers WHERE recipientid = users.userid AND approved = true) THEN 'following' `+
    `WHEN ? IN (SELECT requesterid FROM andale_db.followers WHERE recipientid = users.userid AND approved = false) THEN 'pending' `+
    `ELSE "not following" `+
    `END as isfollowing, `+
    `CASE `+
    `WHEN ? IN (SELECT recipientid FROM andale_db.followers WHERE requesterid = users.userid AND approved = true) THEN 'following' `+
    `WHEN ? IN (SELECT recipientid FROM andale_db.followers WHERE requesterid = users.userid AND approved = false) THEN 'pending' `+
    `ELSE "not following" `+
    `END as isfollower `+
    `FROM andale_db.users LIMIT ? OFFSET ?`
    db.query(sql, [userid, userid, userid, userid, next, current], (err, result) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ error: 'Server error' })
        }
        res.send(stripSensitive(result))
    })
})

app.get('/api/searchuserlist/:next/:current/:query', ...bindUser, (req, res) => {
    const next = Number(req.params.next)
    const current = Number(req.params.current)
    const query = clampString(req.params.query, 100)
    const sql = `SELECT ${USER_PUBLIC_COLUMNS} FROM users WHERE (username LIKE ? OR `+
    `firstname LIKE ? OR lastname LIKE ? OR CONCAT(firstname, ' ', lastname) LIKE ?) `+
    `LIMIT ? OFFSET ?;`
    db.query(sql, 
    [`%${query}%`,`%${query}%`,`%${query}%`,`%${query}%`, next, current], (err, result) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ error: 'Server error' })
        }
        res.send(stripSensitive(result))
    })
})
app.get('/api/searchuserslist/:next/:current/:query', ...bindUser, (req, res) => {
    const next = Number(req.params.next)
    const current = Number(req.params.current)
    const query = clampString(req.params.query, 100)
    const userid = req.userId
    const sql = `SELECT ${USER_PUBLIC_COLUMNS}, CASE `+
    `WHEN ? IN (SELECT requesterid FROM andale_db.followers WHERE recipientid = users.userid AND approved = true) THEN 'following' `+
    `WHEN ? IN (SELECT requesterid FROM andale_db.followers WHERE recipientid = users.userid AND approved = false) THEN 'pending' `+
    `ELSE "not following" `+
    `END as isfollowing, `+
    `CASE `+
    `WHEN ? IN (SELECT recipientid FROM andale_db.followers WHERE requesterid = users.userid AND approved = true) THEN 'following' `+
    `WHEN ? IN (SELECT recipientid FROM andale_db.followers WHERE requesterid = users.userid AND approved = false) THEN 'pending' `+
    `ELSE "not following" `+
    `END as isfollower `+
    `FROM andale_db.users `+
    `WHERE (username LIKE ? OR firstname LIKE ? OR lastname LIKE ? OR CONCAT(firstname, ' ', lastname) LIKE ?) `+
    `LIMIT ? OFFSET ?`
    db.query(sql, [userid, userid, userid, userid,`%${query}%`,`%${query}%`,`%${query}%`,`%${query}%`,next, current], (err, result) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ error: 'Server error' })
        }
        res.send(stripSensitive(result))
    })
})

app.get('/api/getitems', (req,res)=> {
    db.query('SELECT * FROM charities', (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

app.get('/api/getbatch/:next/:current', (req,res)=> {
    const next = Number(req.params.next)
    const current = Number(req.params.current)
    db.query('SELECT * FROM charities LIMIT ? OFFSET ?', [next, current],
    (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

const CHARITY_COLUMNS = [
    'charityid', 'charity_name', 'overall_score', 'financial_score', 'accountability_score',
    'city', 'state', 'size', 'type1', 'type2', 'total_contributions', 'excess', 'net_assets',
    'other_revenue', 'program_expenses', 'administrative_expenses', 'fundraising_expenses',
    'admin_expense_ratio', 'charity_url', 'payments_to_affiliates',
]

function upsertCharityRow(row) {
    return new Promise((resolve, reject) => {
        const placeholders = CHARITY_COLUMNS.map(() => '?').join(', ')
        const updates = CHARITY_COLUMNS
            .filter((c) => c !== 'charityid')
            .map((c) => `${c}=VALUES(${c})`)
            .join(', ')
        const values = CHARITY_COLUMNS.map((c) => row[c])
        db.query(
            `INSERT INTO charities (${CHARITY_COLUMNS.join(', ')}) VALUES (${placeholders})
             ON DUPLICATE KEY UPDATE ${updates}`,
            values,
            (err, result) => (err ? reject(err) : resolve(result))
        )
    })
}

/**
 * Pull high-rated orgs from Charity Navigator and upsert into charities.
 * Auth required. Needs CHARITY_NAVIGATOR_API_KEY.
 * Body/query: { limit?: number } (default 50, max 100)
 */
app.post('/api/synccharities', requireAuth, async (req, res) => {
    if (!getApiKey()) {
        return res.status(503).json({
            error: 'CHARITY_NAVIGATOR_API_KEY is not configured',
            docs: 'https://developer.charitynavigator.org/',
        })
    }
    const limit = Math.min(
        parsePositiveInt(req.body?.limit || req.query.limit, { min: 1, max: 100 }) || 50,
        100
    )
    try {
        const rows = await fetchCharitiesForSync(limit)
        for (const row of rows) {
            await upsertCharityRow(row)
        }
        res.json({ synced: rows.length, source: 'charitynavigator' })
    } catch (err) {
        console.error('synccharities', err.message)
        res.status(502).json({ error: err.message || 'Charity Navigator sync failed' })
    }
})

/**
 * Live Charity Navigator search mapped to local charity attributes (does not write DB).
 * Query: term, from, result_size
 */
app.get('/api/cnsearch', async (req, res) => {
    if (!getApiKey()) {
        return res.status(503).json({
            error: 'CHARITY_NAVIGATOR_API_KEY is not configured',
            docs: 'https://developer.charitynavigator.org/',
        })
    }
    try {
        const page = await searchCharities({
            term: clampString(req.query.term || '', 100),
            from: Number(req.query.from) || 0,
            result_size: Math.min(Number(req.query.result_size) || 20, 50),
            ratings: ['3', '4'],
            is_rated: true,
            c3: true,
            order_by: req.query.term ? 'relevance' : 'rating',
        })
        res.json({
            result_count: page.result_count,
            from: page.from,
            results: page.results,
        })
    } catch (err) {
        console.error('cnsearch', err.message)
        res.status(502).json({ error: err.message || 'Charity Navigator search failed' })
    }
})

app.get('/api/getcharity/:charityid', (req,res)=> {
    const charityid = Number(req.params.charityid)
    db.query('SELECT * FROM charities WHERE charityid = ?', [charityid],
    (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

app.get('/api/getcharitypage', (req,res)=> {
    const charityid = Number(req.query.charityid)
    const userid = req.query.userid
    const sql = `SELECT charities.*, `+
                `CASE `+
                `WHEN ? IN (SELECT charityid FROM andale_db.archive WHERE userid = ?) THEN true `+
                `ELSE false `+
                `END as archived `+
                `FROM andale_db.charities `+
                `LEFT JOIN andale_db.archive ON archive.charityid = charities.charityid `+
                `WHERE charities.charityid = ?;`
    db.query(sql, [charityid, userid, charityid],
    (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

app.get('/api/getcharityid/:name', (req,res)=> {
    const name = String(req.params.name)
    db.query('SELECT charityid FROM charities WHERE charity_name = ?', [name],
    (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

app.get('/api/getarchive/:userid', ...bindUser, (req,res)=> {
    if (!assertSelf(req, res, req.params.userid)) return
    const userid = req.userId
    const sql = `SELECT charities.charityid, charity_name, overall_score, financial_score, accountability_score, city, state, size, type1, archive.figure, archive.isfavorite `+
                `FROM andale_db.charities `+
                `INNER JOIN andale_db.archive ON charities.charityid = archive.charityid `+
                `WHERE charities.charityid IN (SELECT archive.charityid FROM andale_db.archive WHERE userid = ?);`
    db.query(sql, [userid],
    (err, result)=> {
        if (err) {
            console.error(err)
            return res.status(500).json({ error: 'Server error' })
        }
        res.send(result)
    })
})
// Public profile favorites (read-only); userid in path is the profile being viewed
app.get('/api/profilefavorites/:userid', (req,res) => {
    const userid = req.params.userid
    const sql = `SELECT charities.charityid, charities.charity_name, charities.overall_score, charities.size, charities.type1 FROM andale_db.charities `+
    `INNER JOIN andale_db.archive ON charities.charityid = archive.charityid `+
    `WHERE archive.userid = ? AND archive.isfavorite = true;`
    db.query(sql, [userid], (err, result) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ error: 'Server error' })
        }
        res.send(result)
    })
})
app.get('/api/getfavorites/:userid', ...bindUser, (req,res)=> {
    if (!assertSelf(req, res, req.params.userid)) return
    const userid = req.userId
    const sql = `SELECT charities.charityid, charity_name, overall_score, financial_score, accountability_score, city, state, size, type1, archive.figure, archive.isfavorite `+
                `FROM andale_db.charities `+
                `INNER JOIN andale_db.archive ON charities.charityid = archive.charityid `+
                `WHERE charities.charityid IN (SELECT archive.charityid FROM andale_db.archive WHERE userid = ? AND isfavorite = true);`
    db.query(sql, [userid],
    (err, result)=> {
        if (err) {
            console.error(err)
            return res.status(500).json({ error: 'Server error' })
        }
        res.send(result)
    })
})

app.get('/api/getlatestarchived/:userid', ...bindUser, (req,res)=> {
    if (!assertSelf(req, res, req.params.userid)) return
    const userid = req.userId
    const limit = req.params.limit
    const offset = req.params.offset
    const sql = `SELECT charities.charityid, charity_name, overall_score, financial_score, accountability_score, city, state, size, type1, archive.figure, archive.isfavorite, archive.date `+
                `FROM andale_db.charities `+
                `INNER JOIN andale_db.archive ON charities.charityid = archive.charityid `+
                `WHERE charities.charityid IN (SELECT archive.charityid FROM andale_db.archive WHERE userid = ? `+
                `ORDER BY date DESC `+
                `LIMIT ? OFFSET ?;`
    db.query(sql, [userid, limit, offset],
    (err, result)=> {
        if (err) {
            console.error(err)
            return res.status(500).json({ error: 'Server error' })
        }
        res.send(result)
    })
})

app.get('/api/getfiltered/:next/:current', (req,res)=> {
    const next = Number(req.params.next)
    const current = Number(req.params.current)
    const categories = req.query.categories
    const sizes = req.query.sizes
    db.query('SELECT * FROM charities WHERE type1 IN (?) AND size IN (?) LIMIT ? OFFSET ?', [categories, sizes, next, current],
    (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

app.get('/api/searchbatch/:next/:current/:query', (req,res)=> {
    const next = Number(req.params.next)
    const current = Number(req.params.current)
    const query = String(req.params.query)
    db.query('SELECT * FROM charities WHERE charity_name LIKE ? LIMIT ? OFFSET ?', [`%${query}%`, next, current],
    (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

app.get('/api/searchfiltered/:next/:current/:query', (req,res)=> {
    const next = Number(req.params.next)
    const current = Number(req.params.current)
    const query = String(req.params.query)
    const categories = req.query.categories
    const sizes = req.query.sizes
    db.query('SELECT * FROM charities WHERE type1 IN (?) AND size IN (?) AND charity_name LIKE ? LIMIT ? OFFSET ?', [categories, sizes,`%${query}%`, next, current],
    (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

app.get('/api/fetchcampaigns/:next/:current', (req,res)=> {
    const next = Number(req.params.next)
    const current = Number(req.params.current)
    const categories = req.query.categories
    db.query('SELECT * FROM campaigns WHERE category IN (?) LIMIT ? OFFSET ?', [categories, next, current],
    (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

app.get('/api/filtercampaigns/:next/:current/:query', (req,res)=> {
    const next = Number(req.params.next)
    const current = Number(req.params.current)
    const query = String(req.params.query)
    const categories = req.query.categories
    db.query('SELECT * FROM campaigns WHERE category IN (?) AND campaignname LIKE ? LIMIT ? OFFSET ?', [categories,`%${query}%`, next, current],
    (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

// auth
// check if username or email is already taken
app.get('/api/validate', authLimiter, (req,res)=> {
    const email = clampString(req.query.email, 255)
    const username = clampString(req.query.username, 100)
    if (!email || !username) {
        return res.status(400).json({ error: 'Missing email or username' })
    }
    const sql = `SELECT SUM(CASE WHEN ? IN (email) THEN 1 ELSE 0 END) as emailTaken, `+
                `SUM(CASE WHEN ? IN (username) THEN 1 ELSE 0 END) as usernameTaken `+
                `FROM andale_db.users;`
    db.query(sql, [email, username],
    (err, result)=> {
        if (err) {
            console.error(err)
            return res.status(500).json({ error: 'Server error' })
        }
        res.send(result)
    })
})
// Public profile lookup for login bootstrap — never returns password
app.get('/api/getuser', authLimiter, (req,res)=> {
    const username = clampString(req.query.username, 100)
    if (!username) {
        return res.status(400).json({ error: 'Missing username' })
    }
    db.query(`SELECT ${USER_PUBLIC_COLUMNS} FROM users WHERE username = ?`, [username],
    (err, result)=> {
        if (err) {
            console.error(err)
            return res.status(500).json({ error: 'Server error' })
        }
        res.send(stripSensitive(result))
    })
})
app.get('/api/getaccount', ...bindUser, (req,res)=> {
    const username = req.authUsername
    const userid = req.userId
    const sql = `SELECT ${USER_PUBLIC_COLUMNS}, `+
    `campaigns.campaignid, campaigns.accountid, campaigns.verified `+
    `FROM andale_db.users `+
    `INNER JOIN andale_db.campaigns ON users.userid = campaigns.ownerid `+
    `WHERE users.username = ? AND users.userid = ?;`
    db.query(sql, [username, userid],
    (err, result)=> {
        if (err) {
            console.error(err)
            return res.status(500).json({ error: 'Server error' })
        }
        res.send(stripSensitive(result))
    })
})
app.get('/api/getprofile', (req,res)=> {
    const username = clampString(req.query.username, 100)
    const userid = req.query.userid || ''
    if (!username) {
        return res.status(400).json({ error: 'Missing username' })
    }
    const sql = `SELECT ${USER_PUBLIC_COLUMNS}, CASE `+
    `WHEN ? IN (SELECT requesterid FROM andale_db.followers WHERE recipientid = users.userid AND approved = true) THEN 'following' `+
    `WHEN ? IN (SELECT requesterid FROM andale_db.followers WHERE recipientid = users.userid AND approved = false) THEN 'pending' `+
    `ELSE "not following" `+
    `END as isfollowing, `+
    `CASE `+
    `WHEN ? IN (SELECT recipientid FROM andale_db.followers WHERE requesterid = users.userid AND approved = true) THEN 'following' `+
    `WHEN ? IN (SELECT recipientid FROM andale_db.followers WHERE requesterid = users.userid AND approved = false) THEN 'pending' `+
    `ELSE "not following" `+
    `END as isfollower, `+
    `campaigns.campaignid, campaigns.accountid `+
    `FROM andale_db.users `+
    `INNER JOIN andale_db.campaigns ON users.userid = campaigns.ownerid `+
    `WHERE users.username = ?;`
    db.query(sql, [userid, userid, userid, userid, username],
    (err, result)=> {
        if (err) {
            console.error(err)
            return res.status(500).json({ error: 'Server error' })
        }
        res.send(stripSensitive(result))
    })
})
app.get('/api/getfollowstatus', ...bindUser, (req, res)=> {
    const requesterid = req.userId
    const recipientid = req.query.recipientid
    const sql = `SELECT CASE `+
    `WHEN ? IN (SELECT requesterid FROM andale_db.followers WHERE recipientid = ? AND approved = true) THEN 'following' `+
    `WHEN ? IN (SELECT requesterid FROM andale_db.followers WHERE recipientid = ? AND approved = false) THEN 'pending' `+
    `ELSE "not following" `+
    `END as isfollowing, `+
    `CASE `+
    `WHEN ? IN (SELECT recipientid FROM andale_db.followers WHERE requesterid = ? AND approved = true) THEN 'following' `+
    `WHEN ? IN (SELECT recipientid FROM andale_db.followers WHERE requesterid = ? AND approved = false) THEN 'pending' `+
    `ELSE "not following" `+
    `END as isfollower `+
    `FROM andale_db.users WHERE userid = ?`
    db.query(sql, 
    [requesterid, recipientid, requesterid, recipientid, requesterid, recipientid, requesterid, recipientid, recipientid],
    (err, result)=> {
        if (err) {
            console.error(err)
            return res.status(500).json({ error: 'Server error' })
        }
        res.send(result)
    })
})
app.get('/api/getuserinfo', ...bindUser, (req,res)=> {
    const userid = req.userId
    db.query(`SELECT ${USER_PUBLIC_COLUMNS} FROM users WHERE userid = ?`, [userid],
    (err, result)=> {
        if (err) {
            console.error(err)
            return res.status(500).json({ error: 'Server error' })
        }
        res.send(stripSensitive(result))
    })
})

app.get('/api/getbasket', ...bindUser, (req,res)=> {
    const ownerid = req.userId
    const sql = `SELECT *, CONCAT_WS('-',LPAD(charityid, 3,'0'), SUBSTRING(UPPER(basketid), 1,7)) as subkey `+
                `FROM andale_db.basket where ownerid = ?;`
    db.query(sql, [ownerid],
    (err, result)=> {
        if (err) {
            console.error(err)
            return res.status(500).json({ error: 'Server error' })
        }
        res.send(result)
    })
})

app.get('/api/getbasketitem', ...bindUser, (req,res)=> {
    const basketid = req.query.basketid
    const sql = `SELECT * FROM andale_db.basket WHERE basketid = ? AND ownerid = ?;`
    db.query(sql, [basketid, req.userId],
    (err, result)=> {
        if (err) {
            console.error(err)
            return res.status(500).json({ error: 'Server error' })
        }
        res.send(result)
    })
})

app.get('/api/getfollowers/:next/:current', ...bindUser, (req, res)=> {
    const userid = req.userId
    const next = Number(req.params.next)
    const current = Number(req.params.current)
    const sql = `SELECT users.userid, users.username, users.firstname, users.lastname, users.profilepic, users.public, users.email, users.bio, `+
                `followers.idrequest, followers.approved, followers.date, CASE`+
                `WHEN ? IN (SELECT requesterid FROM andale_db.followers WHERE recipientid = users.userid AND approved = true) THEN 'following' `+
                `WHEN ? IN (SELECT requesterid FROM andale_db.followers WHERE recipientid = users.userid AND approved = false) THEN 'pending' `+
                `ELSE "not following" `+
                `END as isfollowing, `+
                `CASE `+
                `WHEN ? IN (SELECT recipientid FROM andale_db.followers WHERE requesterid = users.userid AND approved = true) THEN 'following' `+
                `WHEN ? IN (SELECT recipientid FROM andale_db.followers WHERE requesterid = users.userid AND approved = false) THEN 'pending' `+
                `ELSE "not following" `+
                `END as isfollower `+
                `FROM andale_db.users `+
                `INNER JOIN andale_db.followers ON followers.requesterid = users.userid `+
                `WHERE (followers.recipientid = ? AND approved = true) `+
                `ORDER BY followers.date DESC `+
                `LIMIT ? OFFSET ?`
    db.query(sql, [userid, userid, userid, userid, userid,next, current], 
    (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
app.get('/api/searchfollowers/:next/:current/:query', ...bindUser, (req, res)=> {
    const userid = req.userId
    const next = Number(req.params.next)
    const current = Number(req.params.current)
    const query = String(req.params.query)
    const sql = `SELECT users.userid, users.username, users.firstname, users.lastname, users.profilepic, users.public, users.email, users.bio, `+
                `followers.idrequest, followers.approved, followers.date, CASE `+
                `WHEN ? IN (SELECT requesterid FROM andale_db.followers WHERE recipientid = users.userid AND approved = true) THEN 'following' `+
                `WHEN ? IN (SELECT requesterid FROM andale_db.followers WHERE recipientid = users.userid AND approved = false) THEN 'pending' `+
                `ELSE "not following" `+
                `END as isfollowing, `+
                `CASE `+
                `WHEN ? IN (SELECT recipientid FROM andale_db.followers WHERE requesterid = users.userid AND approved = true) THEN 'following' `+
                `WHEN ? IN (SELECT recipientid FROM andale_db.followers WHERE requesterid = users.userid AND approved = false) THEN 'pending' `+
                `ELSE "not following" `+
                `END as isfollower `+
                `FROM andale_db.users  `+
                `INNER JOIN andale_db.followers ON followers.requesterid = users.userid `+
                `WHERE (followers.recipientid = ? AND approved = true AND `+
                `(username LIKE ? OR firstname LIKE ? OR lastname LIKE ? OR CONCAT(firstname, ' ', lastname) LIKE ?)) `+
                `ORDER BY followers.date DESC `+
                `LIMIT ? OFFSET ?`
    db.query(sql, [userid, userid, userid, userid, userid, `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`, next, current], 
    (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})


app.get('/api/getfollowing/:next/:current', ...bindUser, (req, res)=> {
    const userid = req.userId
    const next = Number(req.params.next)
    const current = Number(req.params.current)
    const sql = `SELECT users.userid, users.username, users.firstname, users.lastname, users.profilepic, users.public, users.email, users.bio, `+
                `followers.idrequest, followers.approved, followers.date, CASE `+
                `WHEN ? IN (SELECT requesterid FROM andale_db.followers WHERE recipientid = users.userid AND approved = true) THEN 'following' `+
                `WHEN ? IN (SELECT requesterid FROM andale_db.followers WHERE recipientid = users.userid AND approved = false) THEN 'pending' `+
                `ELSE "not following" `+
                `END as isfollowing, `+
                `CASE `+
                `WHEN ? IN (SELECT recipientid FROM andale_db.followers WHERE requesterid = users.userid AND approved = true) THEN 'following' `+
                `WHEN ? IN (SELECT recipientid FROM andale_db.followers WHERE requesterid = users.userid AND approved = false) THEN 'pending' `+
                `ELSE "not following" `+
                `END as isfollower `+
                `FROM andale_db.users `+
                `INNER JOIN andale_db.followers ON followers.recipientid = users.userid `+
                `WHERE (followers.requesterid = ? AND approved = true) `+
                `ORDER BY followers.date DESC `+
                `LIMIT ? OFFSET ?`
    db.query(sql, [userid, userid, userid, userid, userid, next, current], 
    (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
app.get('/api/searchfollowing/:next/:current/:query', ...bindUser, (req, res)=> {
    const userid = req.userId
    const next = Number(req.params.next)
    const current = Number(req.params.current)
    const query = String(req.params.query)
    const sql = `SELECT users.userid, users.username, users.firstname, users.lastname, users.profilepic, users.public, users.email, users.bio, `+
                `followers.idrequest, followers.approved, followers.date, CASE `+
                `WHEN ? IN (SELECT requesterid FROM andale_db.followers WHERE recipientid = users.userid AND approved = true) THEN 'following' `+
                `WHEN ? IN (SELECT requesterid FROM andale_db.followers WHERE recipientid = users.userid AND approved = false) THEN 'pending' `+
                `ELSE "not following" `+
                `END as isfollowing, `+
                `CASE `+
                `WHEN ? IN (SELECT recipientid FROM andale_db.followers WHERE requesterid = users.userid AND approved = true) THEN 'following' `+
                `WHEN ? IN (SELECT recipientid FROM andale_db.followers WHERE requesterid = users.userid AND approved = false) THEN 'pending' `+
                `ELSE "not following" `+
                `END as isfollower `+
                `FROM andale_db.users  `+
                `INNER JOIN andale_db.followers ON followers.recipientid = users.userid `+
                `WHERE (followers.requesterid = ? AND approved = true AND `+
                `(username LIKE ? OR firstname LIKE ? OR lastname LIKE ? OR CONCAT(firstname, ' ', lastname) LIKE ?)) `+
                `ORDER BY followers.date DESC `+
                `LIMIT ? OFFSET ?`
    db.query(sql, [userid, userid, userid, userid, userid `%${query}%`,`%${query}%`,`%${query}%`,`%${query}%`, next, current], 
    (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

app.get('/api/getfollowrequests/:next/:current', ...bindUser, (req, res)=> {
    const userid = req.userId
    const next = Number(req.params.next)
    const current = Number(req.params.current)
    const sql = `SELECT users.userid, users.username, users.firstname, users.lastname, users.profilepic, users.public, users.email, users.bio, `+
                `followers.idrequest, followers.approved, followers.date, CASE `+
                `WHEN ? IN (SELECT requesterid FROM andale_db.followers WHERE recipientid = users.userid AND approved = true) THEN 'following' `+
                `WHEN ? IN (SELECT requesterid FROM andale_db.followers WHERE recipientid = users.userid AND approved = false) THEN 'pending' `+
                `ELSE "not following" `+
                `END as isfollowing, `+
                `CASE `+
                `WHEN ? IN (SELECT recipientid FROM andale_db.followers WHERE requesterid = users.userid AND approved = true) THEN 'following' `+
                `WHEN ? IN (SELECT recipientid FROM andale_db.followers WHERE requesterid = users.userid AND approved = false) THEN 'pending' `+
                `ELSE "not following" `+
                `END as isfollower `+
                `FROM andale_db.users  `+
                `INNER JOIN andale_db.followers ON followers.requesterid = users.userid `+
                `WHERE (followers.recipientid = ? AND approved = false) `+
                `ORDER BY followers.date DESC `+
                `LIMIT ? OFFSET ?`
    db.query(sql, [userid, userid, userid, userid, userid, next, current], 
    (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
app.get('/api/searchfollowrequests/:next/:current/:query', ...bindUser, (req, res)=> {
    const userid = req.userId
    const next = Number(req.params.next)
    const current = Number(req.params.current)
    const query = String(req.params.query)
    const sql = `SELECT users.userid, users.username, users.firstname, users.lastname, users.profilepic, users.public, users.email, users.bio, `+
                `followers.idrequest, followers.approved, followers.date, CASE `+
                `WHEN ? IN (SELECT requesterid FROM andale_db.followers WHERE recipientid = users.userid AND approved = true) THEN 'following' `+
                `WHEN ? IN (SELECT requesterid FROM andale_db.followers WHERE recipientid = users.userid AND approved = false) THEN 'pending' `+
                `ELSE "not following" `+
                `END as isfollowing, `+
                `CASE `+
                `WHEN ? IN (SELECT recipientid FROM andale_db.followers WHERE requesterid = users.userid AND approved = true) THEN 'following' `+
                `WHEN ? IN (SELECT recipientid FROM andale_db.followers WHERE requesterid = users.userid AND approved = false) THEN 'pending' `+
                `ELSE "not following" `+
                `END as isfollower `+
                `FROM andale_db.users `+
                `INNER JOIN andale_db.followers ON followers.requesterid = users.userid `+
                `WHERE (followers.recipientid = ? AND approved = false AND `+
                `(username LIKE ? OR firstname LIKE ? OR lastname LIKE ? OR CONCAT(firstname, ' ', lastname) LIKE ?)) `+
                `ORDER BY followers.date DESC `+
                `LIMIT ? OFFSET ?`
    db.query(sql, [userid, userid, userid, userid, userid, `%${query}%`,`%${query}%`,`%${query}%`,`%${query}%`, next, current], 
    (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})


app.post('/api/followrequest', ...bindUser, (req, res) => {
    const idrequest = clampString(req.body.idrequest, 64)
    const requesterid = req.userId
    const recipientid = req.body.recipientid
    if (!idrequest || !recipientid) {
        return res.status(400).json({ error: 'Missing required fields' })
    }
    const sql = `INSERT INTO andale_db.followers (idrequest, requesterid, recipientid, approved)  `+
                `VALUES (?,?,?, `+
                `(CASE `+
                `WHEN (SELECT public FROM andale_db.users WHERE userid = ?) = true THEN true ELSE false `+
                `END));`
    db.query(sql, [idrequest, requesterid, recipientid, recipientid], (err, result) => {
        if(err) {
            console.error(err)
            return res.status(500).json({ error: 'Server error' })
        }
        res.send("user successfully registered")
    })
})

app.post('/api/createuser', authLimiter, async (req, res) => {
    const userid = clampString(req.body.userid, 64)
    const username = clampString(req.body.username, 100)
    const firstname = clampString(req.body.firstname, 100)
    const lastname = clampString(req.body.lastname, 100)
    const email = clampString(req.body.email, 255)
    const password = req.body.password
    // Ignore client-controlled confirmed flag; Cognito owns email verification
    const confirmed = false
    if (!userid || !username || !firstname || !lastname || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields' })
    }
    if (String(password).length < 8 || String(password).length > 128) {
        return res.status(400).json({ error: 'Invalid password length' })
    }
    try {
        const passwordHash = await bcrypt.hash(String(password), 12)
        db.query('INSERT INTO users (userid, username, firstname, lastname, email, password, confirmed) VALUES (?,?,?,?,?,?,?)', 
        [userid, username, firstname, lastname, email, passwordHash, confirmed], (err, result) => {
            if(err) {
                console.error(err)
                return res.status(500).json({ error: 'Server error' })
            }
            res.send("user successfully registered")
        })
    } catch (e) {
        console.error(e)
        return res.status(500).json({ error: 'Server error' })
    }
})


app.post('/api/pushbasket', ...bindUser, (req, res) => {
    const basketid = clampString(req.body.basketid, 64)
    const ownerid = req.userId
    const charityid = req.body.charityid
    const charityname = clampString(req.body.charityname, 255)
    const type = clampString(req.body.type, 50)
    const amount = req.body.amount
    const message = clampString(req.body.message, 1000)
    const shareEmail = req.body.shareEmail
    const shareName = req.body.shareName
    if (!basketid || charityid == null) {
        return res.status(400).json({ error: 'Missing required fields' })
    }
    db.query('INSERT INTO basket (basketid, ownerid, charityid, charityname, type, amount, message, shareEmail, shareName) VALUES (?,?,?,?,?,?,?,?,?)', 
    [basketid, ownerid, charityid, charityname, type, amount, message, shareEmail, shareName], (err, result) => {
        if(err) {
            console.error(err)
            return res.status(500).json({ error: 'Server error' })
        }
        res.send("user successfully registered")
    })
})

app.get('/api/getdonations', ...bindUser, (req,res)=> {
    const ownerid = req.userId
    const sql = `SELECT DISTINCT * FROM donations WHERE ownerid = ?`
    db.query(sql, [ownerid],
    (err, result)=> {
        if (err) {
            console.error(err)
            return res.status(500).json({ error: 'Server error' })
        }
        res.send(result)
    })
})

app.get('/api/getdonationbatch', ...bindUser, (req,res)=> {
    const groupid = req.query.groupid
    const sql = `SELECT * FROM donations WHERE groupid = ? AND ownerid = ?`
    db.query(sql, [groupid, req.userId],
    (err, result)=> {
        if (err) {
            console.error(err)
            return res.status(500).json({ error: 'Server error' })
        }
        res.send(result)
    })
})
app.post('/api/pushdonation', ...bindUser, (req, res) => {
    const donationid = clampString(req.body.donationid, 64)
    const ownerid = req.userId
    const charityid = req.body.charityid
    const charityname = clampString(req.body.charityname, 255)
    const type = clampString(req.body.type, 50)
    const amount = req.body.amount
    const message = clampString(req.body.message, 1000)
    const groupid = clampString(req.body.groupid, 64)
    const shareEmail = req.body.shareEmail
    const shareName = req.body.shareName
    const public = req.body.public
    db.query('INSERT INTO donations (donationid, ownerid, charityid, charityname, type, amount, message, groupid, shareEmail, shareName, public) VALUES (?,?,?,?,?,?,?,?,?,?,?)', 
    [donationid, ownerid, charityid, charityname, type, amount, message, groupid, shareEmail, shareName, public], (err, result) => {
        if(err) {
            console.error(err)
            return res.status(500).json({ error: 'Server error' })
        }
        res.send("successfully confirmed donation")
    })
})
app.post('/api/postdonation', ...bindUser, (req, res) => {
    const inputData = req.body.donations;
    if (!inputData || !Array.isArray(inputData) || inputData.length === 0 || inputData.length > 50) {
        return res.status(400).json({ error: 'Invalid data' });
    }
    const valuesArray = inputData.map(donation => [
        clampString(donation.donationid, 64),
        req.userId,
        donation.charityid,
        clampString(donation.charityname, 255),
        clampString(donation.type, 50),
        donation.amount,
        clampString(donation.message, 1000),
        clampString(donation.groupid, 64),
        clampString(donation.subkey, 64),
        donation.shareEmail,
        donation.shareName,
        donation.public
    ]);
    const placeholders = valuesArray.map(() => '(?,?,?,?,?,?,?,?,?,?,?,?)').join(',');
    const flattenedData = valuesArray.flat();
    db.query(`INSERT INTO donations (donationid, ownerid, charityid, charityname, type, amount, message, groupid, subkey, shareEmail, shareName, public) VALUES ${placeholders}`, 
    flattenedData, (err, result) => {
        if(err) {
            console.error(err)
            return res.status(500).json({ error: 'Server error' })
        }
        res.send("successfully confirmed donation")
    })
})
app.put('/api/confirmdonations', ...bindUser, (req, res) => {
    const groupid = clampString(req.body.groupid, 64)
    const sql = `UPDATE donations SET confirmed = true WHERE groupid = ? AND ownerid = ?`
    db.query(sql, [groupid, req.userId], (err, result) => {
        if(err) {
            console.error(err)
            return res.status(500).json({ error: 'Server error' })
        }
        res.send("successfully confirmed donations")
    })
})

app.delete('/api/emptybasket', ...bindUser, (req, res) => {
    const groupid = clampString(req.body.groupid, 64)
    db.query("DELETE FROM basket WHERE groupid = ? AND ownerid = ?", [groupid, req.userId], (err, result) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ error: 'Server error' })
        }
        res.send('members cleared')
    })
})

app.post('/api/addarchive', ...bindUser, (req, res) => {
    const userid = req.userId
    const charityid = req.body.charityid
    db.query('INSERT INTO archive (userid, charityid) VALUES (?,?)', 
    [userid, charityid], (err, result) => {
        if(err) {
            console.error(err)
            return res.status(500).json({ error: 'Server error' })
        }
        res.send("successfully added to archive")
    })
})
app.post('/api/donatecampaign', ...bindUser, (req, res) => {
    const userid = req.userId
    const giftid = clampString(req.body.giftid, 64)
    const campaignid = clampString(req.body.campaignid, 64)
    const accountid = clampString(req.body.accountid, 128)
    const amount = req.body.amount
    const campaignname = clampString(req.body.campaignname, 200)
    const message = clampString(req.body.message, 1000)
    const category = clampString(req.body.category, 100)
    const theme = clampString(req.body.theme, 100)
    const shareName = req.body.shareName
    const shareEmail = req.body.shareEmail
    db.query('INSERT INTO campaigndonations (giftid, userid, campaignid, accountid, amount, campaignname, message, category, theme, shareName, shareEmail) VALUES (?,?,?,?,?,?,?,?,?,?,?)', 
    [giftid, userid, campaignid, accountid, amount, campaignname, message, category, theme, shareName, shareEmail], (err, result) => {
        if(err) {
            console.error(err)
            return res.status(500).json({ error: 'Server error' })
        }
        res.send("successfully added to archive")
    })
})
app.get('/api/getcampaigndonation', ...bindUser, (req, res) => {
    const giftid = req.query.giftid || req.params.giftid
    const sql = `SELECT DISTINCT * FROM campaigndonations WHERE giftid = ? AND userid = ?`
    db.query(sql, [giftid, req.userId], (err, result)=> {
        if (err) {
            console.error(err)
            return res.status(500).json({ error: 'Server error' })
        }
        res.send(result)
    })
})
app.put('/api/confirmcampaigndonation', ...bindUser, (req, res)=> {
    const giftid = clampString(req.body.giftid, 64)
    const sql = `UPDATE campaigndonations SET confirmed = true WHERE giftid = ? AND userid = ?`
    db.query(sql, [giftid, req.userId], (err, result) => {
        if(err) {
            console.error(err)
            return res.status(500).json({ error: 'Server error' })
        }
        res.send("successfully confirmed donations")
    })
})
// new
app.get('/api/getcampaigns', (req,res)=> {
    const sql = `SELECT DISTINCT * FROM campaigns WHERE verified = true;`
    db.query(sql,
    (err, result)=> {
        if (err) {
            console.error(err)
            return res.status(500).json({ error: 'Server error' })
        }
        res.send(result)
    })
})
app.get('/api/getcampaignbatch/:next/:current', (req,res)=> {
    const next = Number(req.params.next)
    const current = Number(req.params.current)
    const sql = `SELECT DISTINCT * FROM campaigns WHERE verified = true LIMIT ? OFFSET ?`
    db.query(sql,[next, current],
    (err, result)=> {
        if (err) {
            console.error(err)
            return res.status(500).json({ error: 'Server error' })
        }
        res.send(result)
    })
})
app.post('/api/createpost', ...bindUser, (req, res) => {
    const postid = clampString(req.body.postid, 64)
    const campaignid = clampString(req.body.campaignid, 64)
    const ownerid = req.userId
    const title = clampString(req.body.title, 200)
    const description = clampString(req.body.description, 5000)
    const image = clampString(req.body.image, 500)
    const link = clampString(req.body.link, 500)
    if (link && /^(javascript:|data:)/i.test(String(link).trim())) {
        return res.status(400).json({ error: 'Invalid link' })
    }
    db.query('INSERT INTO posts (postid, campaignid, ownerid, title, description, image, link) VALUES (?,?,?,?,?,?,?)', 
    [postid, campaignid, ownerid, title, description, image, link], (err, result) => {
        if(err) {
            console.error(err)
            return res.status(500).json({ error: 'Server error' })
        }
        res.send("successfully created post")
    })
})

app.put('/api/editpost', ...bindUser, (req, res) => {     
    const ownerid = req.userId
    const campaignid = clampString(req.body.campaignid, 64)
    const postid = clampString(req.body.postid, 64)
    const title = clampString(req.body.title, 200)
    const description = clampString(req.body.description, 5000)
    const image = clampString(req.body.image, 500)
    const link = clampString(req.body.link, 500)
    if (link && /^(javascript:|data:)/i.test(String(link).trim())) {
        return res.status(400).json({ error: 'Invalid link' })
    }
    const sql = `UPDATE posts SET title = ?, description = ?, image = ?, link = ? `+
    `WHERE ownerid = ? AND campaignid = ? AND postid = ?;`
    db.query(sql, [title, description, image, link, ownerid, campaignid, postid],
    (err, result) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ error: 'Server error' })
        }
        res.send(result)
    })
})

app.delete('/api/deletepost', ...bindUser, (req, res) => {
    const postid = clampString(req.body.postid, 64)
    db.query("DELETE FROM posts WHERE postid = ? AND ownerid = ?", [postid, req.userId], (err, result) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ error: 'Server error' })
        }
        res.send('deleted post')
    })
})
app.get('/api/getposts/:next/:current', (req,res)=> {
    const next = Number(req.params.next)
    const current = Number(req.params.current)
    const sql = `SELECT posts.*, campaigns.campaignname FROM posts `+
    `INNER JOIN campaigns ON campaigns.campaignid = posts.campaignid `+
    `ORDER BY posts.date DESC `+
    `LIMIT ? OFFSET ?`
    db.query(sql, [next, current],
    (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
app.get('/api/getcampaignposts/:campaignid/:next/:current', (req,res)=> {
    const campaignid = req.params.campaignid
    const next = Number(req.params.next)
    const current = Number(req.params.current)
    const sql = `SELECT posts.*, campaigns.campaignname FROM posts `+
    `INNER JOIN campaigns ON campaigns.campaignid = posts.campaignid `+
    `WHERE campaigns.campaignid = ? `+
    `ORDER BY posts.date DESC `+
    `LIMIT ? OFFSET ?;`
    db.query(sql, [campaignid, next, current],
    (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

// end of new

app.put('/api/acceptrequest', ...bindUser, (req, res) => {     
    const recipientid = req.userId
    const requesterid = req.body.requesterid
    db.query('UPDATE andale_db.followers SET approved = true WHERE recipientid = ? AND requesterid = ?', [recipientid, requesterid],
    (err, result) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ error: 'Server error' })
        }
        res.send(result)
    })
})

app.put('/api/confirmuser', ...bindUser, (req, res) => {
    // Only the authenticated user may mark their own row confirmed
    db.query('UPDATE users SET confirmed = true WHERE username = ?', [req.authUsername],
    (err, result) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ error: 'Server error' })
        }
        res.send(result)
    })
})

app.put('/api/editbasketitem', ...bindUser, (req, res) => {     
    const basketid = clampString(req.body.basketid, 64)
    const amount = Number(req.body.amount)
    const message = clampString(req.body.message, 1000)
    const shareEmail = req.body.shareEmail
    const shareName = req.body.shareName
    db.query('UPDATE basket SET amount = ?, message = ?, shareEmail = ?, shareName = ? WHERE basketid = ? AND ownerid = ?',
    [amount, message, shareEmail, shareName, basketid, req.userId],
    (err, result) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ error: 'Server error' })
        }
        res.send(result)
    })
})

app.put('/api/updateuser', ...bindUser, (req, res) => {     
    const userid = req.userId
    // Username must remain the Cognito identity; ignore client-supplied username changes
    const username = req.authUsername
    const firstname = clampString(req.body.firstname, 100)
    const lastname = clampString(req.body.lastname, 100)
    const email = clampString(req.body.email, 255)
    const bio = clampString(req.body.bio, 2000)
    const location = clampString(req.body.location, 200)
    const social = clampString(req.body.social, 200)
    const profilepic = clampString(req.body.profilepic, 500)
    const isPublic = req.body.public
    // Reject attempts to set password / userid via this endpoint
    if (req.body.password !== undefined || (req.body.userid && String(req.body.userid) !== String(userid))) {
        return res.status(400).json({ error: 'Protected fields cannot be modified' })
    }
    const sql = `UPDATE users SET username = ?, firstname = ?, lastname = ?, email = ?, ` +
                `bio = ?, location = ?, social = ?, profilepic = ?, public = ? `+
                `WHERE userid = ?`;
    db.query(sql,
    [username, firstname, lastname, email, bio, location, social, profilepic, isPublic, userid],
    (err, result) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ error: 'Server error' })
        }
        res.send(result)
    })
})

app.put('/api/changearchivefigure', ...bindUser, (req, res)=> {
    const userid = req.userId
    const charityid = req.body.charityid
    const figure = req.body.figure
    db.query('UPDATE andale_db.archive SET figure = ? WHERE (userid = ? AND charityid = ?);', 
    [figure, userid, charityid],
    (err, result) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ error: 'Server error' })
        }
        res.send(result)
    })
})
app.put('/api/editfavorites', ...bindUser, (req, res) => {
    const userid = req.userId
    const favorites = req.body.favorites
    const sql = `UPDATE andale_db.archive SET isfavorite = `+
                `CASE `+
                `WHEN charityid IN (?) THEN true `+
                `ELSE false `+
                `END `+
                `WHERE userid = ?;`
    db.query(sql, [favorites, userid], 
    (err,result)=> {
        if (err) {
            console.error(err)
            return res.status(500).json({ error: 'Server error' })
        }
        res.send(result)
    })
})
app.put('/api/archivefavorite', ...bindUser, (req,res) => {
    const userid = req.userId
    const charityid = req.body.charityid
    const isfavorite = req.body.isfavorite
    db.query('UPDATE andale_db.archive SET isfavorite = ? WHERE userid = ? AND charityid = ?', 
    [isfavorite, userid, charityid],
    (err, result)=> {
        if (err) {
            console.error(err)
            return res.status(500).json({ error: 'Server error' })
        }
        res.send(result)
    })
})

app.put('/api/confirmbasket', ...bindUser, (req, res)=> {
    const ownerid = req.userId
    const groupid = clampString(req.body.groupid, 64)
    db.query('UPDATE andale_db.basket SET groupid = ? WHERE ownerid = ?;', [groupid, ownerid],
    (err, result) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ error: 'Server error' })
        }
        res.send(result)
    })
})

app.delete('/api/removearchiveitem', ...bindUser, (req, res) => {
    const userid = req.userId
    const charityid = req.body.charityid
    db.query("DELETE FROM archive WHERE (charityid = ? AND userid = ?);",
    [charityid, userid], (err, result)=> {
        if (err) {
            console.error(err)
            return res.status(500).json({ error: 'Server error' })
        }
        res.send(`item removed from archive`)
    })
})
app.delete('/api/deletebasketitem', ...bindUser, (req, res) => {
    const basketid = clampString(req.body.basketid, 64)
    db.query("DELETE FROM basket WHERE basketid = ? AND ownerid = ?", [basketid, req.userId], (err, result) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ error: 'Server error' })
        }
        res.send('members cleared')
    })
})
app.delete('/api/clearbasket', ...bindUser, (req, res) => {
    const ownerid = req.userId
    db.query("DELETE FROM basket WHERE ownerid = ?", [ownerid], (err, result) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ error: 'Server error' })
        }
        res.send('members cleared')
    })
})
// Duplicate emptybasket route removed — single authenticated handler above

app.delete('/api/canceldonations', ...bindUser, (req, res) => {
    const groupid = clampString(req.body.groupid, 64)
    db.query("DELETE FROM andale_db.donations WHERE groupid = ? AND ownerid = ?", 
    [groupid, req.userId], (err, result) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ error: 'Server error' })
        }
        res.send('members cleared')
    })
})

app.delete('/api/removerequest', ...bindUser, (req, res) => {
    const recipientid = req.body.recipientid
    const requesterid = req.body.requesterid
    // Caller must be one of the two parties
    if (String(recipientid) !== String(req.userId) && String(requesterid) !== String(req.userId)) {
        return res.status(403).json({ error: 'Forbidden' })
    }
    db.query("DELETE FROM andale_db.followers WHERE recipientid = ? AND requesterid = ?;", 
    [recipientid, requesterid], (err, result) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ error: 'Server error' })
        }
        res.send('members cleared')
    })
})
app.delete('/api/removeaccountrequests', ...bindUser, (req, res) => {
    const userid = req.userId
    db.query("DELETE FROM andale_db.followers WHERE recipientid = ? OR requesterid = ?;", 
    [userid, userid], (err, result) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ error: 'Server error' })
        }
        res.send('members cleared')
    })
})
//app.get('*', (req, res) => {
//    res.sendFile(path.join(__dirname, '../client/build/index.html'));
//  });
const port = process.env.PORT || 5000;
module.exports = { app, db, stripSensitive };

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`)
    })
}