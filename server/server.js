require('dotenv').config()
const express = require('express');
const path = require('path');
const app = express();
const mysql = require('mysql')
const cors = require('cors')
app.use(express.json())
app.use(cors())
const stripe = require('stripe')('sk_test_51NbpB6H1mJlHYnBWQqiqjA7TDO7T3E3fvS5ewaLaU5bZg84xVQN47PexrTw76g55XNhts0gxLZRVkJw8MFlTzN6m00h9Pld2B0');
const axios = require('axios');
const e = require('express');
//app.use(express.static(path.join(__dirname, '../client/build')));
//app.use(express.static("public"))
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');


const db = mysql.createConnection({
    user:'root',
    host:'localhost',
    password:'password',
    charset:'utf8mb4',
    database:'andale_db',
 }
)
app.post('/api/createintent', async(req, res) => {
    const amount = req.body.amount
    const userid = req.body.userid
    const accountid = req.body.accountid
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'usd',
            automatic_payment_methods: {
              enabled: true,
            },
            application_fee_amount: 123,
            transfer_data: {
              destination: accountid,
            },
          });
          res.json({client_secret: paymentIntent.client_secret});
    } catch(e) {
        console.log(e)
        res.status(500).json({ error: "Failed to create payment intent" });
    }
})
app.post('/api/createaccount', async (req, res) => {
    try {
        const account = await stripe.accounts.create({
            type: 'express',
        });
        res.json(account);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to create account link" });
    }
});
app.post('/api/createaccountlink', async (req, res) => {
    const accountid = req.body.accountid
    const ownerid = req.body.ownerid
    const campaignid = req.body.campaignid
    const email = req.body.email
    const firstname = req.body.firstname
    const lastname = req.body.lastname
    const username = req.body.username
    db.query(`INSERT INTO campaigns (campaignid, ownerid, accountid, email, firstname, lastname, username) VALUES (?,?,?,?,?,?,?)`,
    [campaignid, ownerid, accountid, email, firstname, lastname, username], (err, dbRes) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ error: "Failed to insert into database" });
        } else {
          stripe.accountLinks.create({
            account: accountid, 
            refresh_url: 'http://localhost:3000/',
            return_url: `http://localhost:3000/createcampaign/${campaignid}`,
            type: 'account_onboarding',
        }, (stripeError, accountLink)=> {
            if (stripeError) {
                console.log(stripeError)
                return res.status(500).json({ error: "Failed to create account link" });
            }            
            res.json(accountLink);
        })
    }
    })
});
app.get('/api/getaccountlink', async(req, res)=> {
    const accountid = req.query.accountid
    const username = req.query.username
    stripe.accountLinks.create({
        account: accountid, 
        refresh_url: 'http://localhost:3000/',
        return_url: `http://localhost:3000/${username}`,
        type: 'account_onboarding',
    }, (stripeError, accountLink)=> {
        if (stripeError) {
            console.log(stripeError)
            return res.status(500).json({ error: "Failed to create account link" });
        }            
        res.json(accountLink);
    })
})
app.get('/api/getconfirmedstripe/:accountid/:userid', async (req, res) => {
    const accountid = req.params.accountid
    const userid = req.params.userid
    try {
        const account = await stripe.accounts.retrieve(accountid)
        if (account) {
            db.query(`UPDATE users SET accountid = ?, payouts = ?, charges = ? WHERE userid = ?`, 
            [accountid, account.payouts_enabled, account.charges_enabled, userid])
            res.send(account)
        }
    } catch(e) {
        console.log(e)
        res.status(500).json({ success: false, message: 'Server error.' });
    }
})
app.put('/api/confirmstripe/:accountid/:userid', async (req, res) => {
    const accountid = req.params.accountid
    const userid = req.params.userid
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
        console.log(e)
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

app.put('/api/confirmcampaign', (req,res) => {
    const ownerid = req.body.ownerid
    const campaignid = req.body.campaignid
    const campaignname = req.body.campaignname
    const goal = req.body.goal
    const description = req.body.description
    const shareName = req.body.shareName
    const theme = req.body.theme
    const sql = `UPDATE campaigns SET `+
    `campaignname = ?, goal = ?, description = ?, shareName = ?, theme = ?, verified = true ` +
    `WHERE campaignid = ? AND ownerid = ?;` 
    db.query(sql, 
    [campaignname, goal, description, shareName, theme, campaignid, ownerid],
    (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
//

app.get('/api/getusers', (req, res) => {
    db.query('SELECT * FROM users', (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
app.get('/api/getuserlist/:next/:current', (req, res) => {
    const next = Number(req.params.next)
    const current = Number(req.params.current)
    db.query('SELECT * FROM users LIMIT ? OFFSET ?', [next, current], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
app.get('/api/getuserslist/:next/:current', (req, res) => {
    const next = Number(req.params.next)
    const current = Number(req.params.current)
    const userid = req.query.userid
    const sql = `SELECT users.*, CASE `+
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
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

app.get('/api/searchuserlist/:next/:current/:query', (req, res) => {
    const next = Number(req.params.next)
    const current = Number(req.params.current)
    const query = String(req.params.query)
    const sql = `SELECT * FROM users WHERE (username LIKE ? OR `+
    `firstname LIKE ? OR lastname LIKE ? OR CONCAT(firstname, ' ', lastname) LIKE ?) `+
    `LIMIT ? OFFSET ?;`
    db.query(sql, 
    [`%${query}%`,`%${query}%`,`%${query}%`,`%${query}%`, next, current], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
app.get('/api/searchuserslist/:next/:current/:query', (req, res) => {
    const next = Number(req.params.next)
    const current = Number(req.params.current)
    const query = String(req.params.query)
    const userid = req.query.userid
    const sql = `SELECT users.*, CASE `+
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
            console.log(err)
        } else {
            res.send(result)
        }
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

app.get('/api/getarchive/:userid', (req,res)=> {
    const userid = req.params.userid
    const sql = `SELECT charities.charityid, charity_name, overall_score, financial_score, accountability_score, city, state, size, type1, archive.figure, archive.isfavorite `+
                `FROM andale_db.charities `+
                `INNER JOIN andale_db.archive ON charities.charityid = archive.charityid `+
                `WHERE charities.charityid IN (SELECT archive.charityid FROM andale_db.archive WHERE userid = ?);`
    db.query(sql, [userid],
    (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
app.get('/api/profilefavorites/:userid', (req,res) => {
    const userid = req.params.userid
    const sql = `SELECT charities.charityid, charities.charity_name, charities.overall_score, charities.size, charities.type1 FROM andale_db.charities `+
    `INNER JOIN andale_db.archive ON charities.charityid = archive.charityid `+
    `WHERE archive.userid = ? AND archive.isfavorite = true;`
    db.query(sql, [userid], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
app.get('/api/getfavorites/:userid', (req,res)=> {
    const userid = req.params.userid
    const sql = `SELECT charities.charityid, charity_name, overall_score, financial_score, accountability_score, city, state, size, type1, archive.figure, archive.isfavorite `+
                `FROM andale_db.charities `+
                `INNER JOIN andale_db.archive ON charities.charityid = archive.charityid `+
                `WHERE charities.charityid IN (SELECT archive.charityid FROM andale_db.archive WHERE userid = ? AND isfavorite = true);`
    db.query(sql, [userid],
    (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

app.get('/api/getlatestarchived/:userid', (req,res)=> {
    const userid = req.params.userid
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
            console.log(err)
        } else {
            res.send(result)
        }
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

// auth
// check if username or email is already taken
app.get('/api/validate', (req,res)=> {
    const email = String(req.query.email)
    const username = String(req.query.username)
    const sql = `SELECT SUM(CASE WHEN ? IN (email) THEN 1 ELSE 0 END) as emailTaken, `+
                `SUM(CASE WHEN ? IN (username) THEN 1 ELSE 0 END) as usernameTaken `+
                `FROM andale_db.users;`
    db.query(sql, [email, username],
    (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
// get login info of user
app.get('/api/getuser', (req,res)=> {
    const username = String(req.query.username)
    db.query('SELECT * FROM users WHERE username = ?', [username],
    (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
app.get('/api/getaccount', (req,res)=> {
    const username = String(req.query.username)
    const userid = req.query.userid
    const sql = `SELECT users.*, `+
    `campaigns.campaignid, campaigns.accountid, campaigns.verified `+
    `FROM andale_db.users `+
    `INNER JOIN andale_db.campaigns ON users.userid = campaigns.ownerid `+
    `WHERE users.username = ? AND users.userid = ?;`
    db.query(sql, [username, userid],
    (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
app.get('/api/getprofile', (req,res)=> {
    const username = String(req.query.username)
    const userid = req.query.userid
    const sql = `SELECT users.*, CASE `+
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
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
app.get('/api/getfollowstatus', (req, res)=> {
    const requesterid = req.query.requesterid
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
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
app.get('/api/getuserinfo', (req,res)=> {
    const userid = req.query.userid
    db.query('SELECT * FROM users WHERE userid = ?', [userid],
    (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

app.get('/api/getbasket', (req,res)=> {
    const ownerid = req.query.userid
    const sql = `SELECT *, CONCAT_WS('-',LPAD(charityid, 3,'0'), SUBSTRING(UPPER(basketid), 1,7)) as subkey `+
                `FROM andale_db.basket where ownerid = ?;`
    db.query(sql, [ownerid],
    (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

app.get('/api/getbasketitem', (req,res)=> {
    const basketid = req.query.basketid
    const sql = `SELECT * FROM andale_db.basket WHERE basketid = ?;`
    db.query(sql, [basketid],
    (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

app.get('/api/getfollowers/:next/:current', (req, res)=> {
    const userid = req.query.userid
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
app.get('/api/searchfollowers/:next/:current/:query', (req, res)=> {
    const userid = req.query.userid
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


app.get('/api/getfollowing/:next/:current', (req, res)=> {
    const userid = req.query.userid
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
app.get('/api/searchfollowing/:next/:current/:query', (req, res)=> {
    const userid = req.query.userid
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

app.get('/api/getfollowrequests/:next/:current', (req, res)=> {
    const userid = req.query.userid
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
app.get('/api/searchfollowrequests/:next/:current/:query', (req, res)=> {
    const userid = req.query.userid
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


app.post('/api/followrequest', (req, res) => {
    const idrequest = req.body.idrequest
    const requesterid = req.body.requesterid
    const recipientid = req.body.recipientid
    const sql = `INSERT INTO andale_db.followers (idrequest, requesterid, recipientid, approved)  `+
                `VALUES (?,?,?, `+
                `(CASE `+
                `WHEN (SELECT public FROM andale_db.users WHERE userid = ?) = true THEN true ELSE false `+
                `END));`
    db.query(sql, [idrequest, requesterid, recipientid, recipientid], (err, result) => {
        if(err) {
            console.log(err)
        } else {
            res.send("user successfully registered")
        }   
    })
})

app.post('/api/createuser', (req, res) => {
    const userid = req.body.userid
    const username = req.body.username
    const firstname = req.body.firstname
    const lastname = req.body.lastname
    const email = req.body.email
    const password = req.body.password
    const confirmed = req.body.confirmed
    db.query('INSERT INTO users (userid, username, firstname, lastname, email, password, confirmed) VALUES (?,?,?,?,?,?,?)', 
    [userid, username, firstname, lastname, email, password, confirmed], (err, result) => {
        if(err) {
            console.log(err)
        } else {
            res.send("user successfully registered")
        }
    })
})


app.post('/api/pushbasket', (req, res) => {
    const basketid = req.body.basketid
    const ownerid = req.body.userid
    const charityid = req.body.charityid
    const charityname = req.body.charityname
    const type = req.body.type
    const amount = req.body.amount
    const message = req.body.message
    const shareEmail = req.body.shareEmail
    const shareName = req.body.shareName
    db.query('INSERT INTO basket (basketid, ownerid, charityid, charityname, type, amount, message, shareEmail, shareName) VALUES (?,?,?,?,?,?,?,?,?)', 
    [basketid, ownerid, charityid, charityname, type, amount, message, shareEmail, shareName], (err, result) => {
        if(err) {
            console.log(err)
        } else {
            res.send("user successfully registered")
        }
    })
})

app.get('/api/getdonations', (req,res)=> {
    const ownerid = req.query.userid
    const sql = `SELECT DISTINCT * FROM donations WHERE ownerid = ?`
    db.query(sql, [ownerid],
    (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

app.get('/api/getdonationbatch', (req,res)=> {
    const groupid = req.query.groupid
    const sql = `SELECT * FROM donations WHERE groupid = ?`
    db.query(sql, [groupid],
    (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
app.post('/api/pushdonation', (req, res) => {
    const donationid = req.body.donationid
    const ownerid = req.body.ownerid
    const charityid = req.body.charityid
    const charityname = req.body.charityname
    const type = req.body.type
    const amount = req.body.amount
    const message = req.body.message
    const groupid = req.body.groupid
    const shareEmail = req.body.shareEmail
    const shareName = req.body.shareName
    const public = req.body.public
    db.query('INSERT INTO donations (donationid, ownerid, charityid, charityname, type, amount, message, groupid, shareEmail, shareName, public) VALUES (?,?,?,?,?,?,?,?,?,?,?)', 
    [donationid, ownerid, charityid, charityname, type, amount, message, groupid, shareEmail, shareName, public], (err, result) => {
        if(err) {
            console.log(err)
        } else {
            res.send("successfully confirmed donation")
        }
    })
})
app.post('/api/postdonation', (req, res) => {
    const inputData = req.body.donations;
    if (!inputData || !Array.isArray(inputData) || inputData.length === 0) {
        return res.status(400).send('Invalid data');
    }
    const valuesArray = inputData.map(donation => [
        donation.donationid,
        donation.ownerid,
        donation.charityid,
        donation.charityname,
        donation.type,
        donation.amount,
        donation.message,
        donation.groupid,
        donation.subkey,
        donation.shareEmail,
        donation.shareName,
        donation.public
    ]);
    const placeholders = valuesArray.map(() => '(?,?,?,?,?,?,?,?,?,?,?,?)').join(',');
    const flattenedData = valuesArray.flat();
    db.query(`INSERT INTO donations (donationid, ownerid, charityid, charityname, type, amount, message, groupid, subkey, shareEmail, shareName, public) VALUES ${placeholders}`, 
    flattenedData, (err, result) => {
        if(err) {
            console.log(err)
        } else {
            res.send("successfully confirmed donation")
        }
    })
})
app.put('/api/confirmdonations', (req, res) => {
    const groupid = req.body.groupid
    const sql = `UPDATE donations SET confirmed = true WHERE groupid = ?`
    db.query(sql, [groupid], (err, result) => {
        if(err) {
            console.log(err)
        } else {
            res.send("successfully confirmed donations")
        }
    })
})

app.delete('/api/emptybasket', (req, res) => {
    const groupid = req.body.groupid
    db.query("DELETE FROM basket WHERE groupid = ?", [groupid], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send('members cleared')
        }
    })
})

app.post('/api/addarchive', (req, res) => {
    const userid = req.body.userid
    const charityid = req.body.charityid
    db.query('INSERT INTO archive (userid, charityid) VALUES (?,?)', 
    [userid, charityid], (err, result) => {
        if(err) {
            console.log(err)
        } else {
            res.send("successfully added to archive")
        }
    })
})
// new
app.post('/api/createpost', (req, res) => {
    const postid = req.body.postid
    const campaignid = req.body.campaignid
    const ownerid = req.body.ownerid
    const title = req.body.title
    const description = req.body.description
    const image = req.body.image
    const link = req.body.link
    db.query('INSERT INTO posts (postid, campaignid, ownerid, title, description, image, link) VALUES (?,?,?,?,?,?,?)', 
    [postid, campaignid, ownerid, title, description, image, link], (err, result) => {
        if(err) {
            console.log(err)
        } else {
            res.send("successfully created post")
        }
    })
})

app.put('/api/editpost', (req, res) => {     
    const ownerid = req.body.ownerid
    const campaignid = req.body.campaignid
    const postid = req.body.postid
    const title = req.body.title
    const description = req.body.description
    const image = req.body.image
    const link = req.body.link
    const sql = `UPDATE posts SET title = ?, description = ?, image = ?, link = ? `+
    `WHERE ownerid = ? AND campaignid = ? AND postid = ?;`
    db.query(sql, [title, description, image, link, ownerid, campaignid, postid],
    (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

app.delete('/api/deletepost', (req, res) => {
    const postid = req.body.postid
    db.query("DELETE FROM posts WHERE postid = ?", [postid], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send('deleted post')
        }
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

app.put('/api/acceptrequest', (req, res) => {     
    const recipientid = req.body.recipientid
    const requesterid = req.body.requesterid
    db.query('UPDATE andale_db.followers SET approved = true WHERE recipientid = ? AND requesterid = ?', [recipientid, requesterid],
    (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

app.put('/api/confirmuser', (req, res) => {     // for email confirmation on register; not needed
    const username = String(req.body.username)
    db.query('UPDATE users SET confirmed = true WHERE name = ?', [username],
    (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

app.put('/api/editbasketitem', (req, res) => {     
    const basketid = req.body.basketid
    const amount = Number(req.body.amount)
    const message = String(req.body.message)
    const shareEmail = req.body.shareEmail
    const shareName = req.body.shareName
    db.query('UPDATE basket SET amount = ?, message = ?, shareEmail = ?, shareName = ? WHERE basketid = ?',
    [amount, message, shareEmail, shareName, basketid],
    (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

app.put('/api/updateuser', (req, res) => {     
    const userid = req.body.userid
    const username = req.body.username
    const firstname = req.body.firstname
    const lastname = req.body.lastname
    const email = req.body.email
    const bio = req.body.bio
    const location = req.body.location
    const social = req.body.social
    const profilepic = req.body.profilepic
    const public = req.body.public
    const sql = `UPDATE users SET username = ?, firstname = ?, lastname = ?, email = ?, ` +
                `bio = ?, location = ?, social = ?, profilepic = ?, public = ? `+
                `WHERE userid = ?`;
    db.query(sql,
    [username, firstname, lastname, email, bio, location, social, profilepic, public, userid],
    (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

app.put('/api/changearchivefigure', (req, res)=> {
    const userid = req.body.userid
    const charityid = req.body.charityid
    const figure = req.body.figure
    db.query('UPDATE andale_db.archive SET figure = ? WHERE (userid = ? AND charityid = ?);', 
    [figure, userid, charityid],
    (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
app.put('/api/editfavorites', (req, res) => {
    const userid = req.body.userid
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
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
app.put('/api/archivefavorite', (req,res) => {
    const userid = req.body.userid
    const charityid = req.body.charityid
    const isfavorite = req.body.isfavorite
    db.query('UPDATE andale_db.archive SET isfavorite = ? WHERE userid = ? AND charityid = ?);', 
    [isfavorite, userid, charityid],
    (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

app.put('/api/confirmbasket', (req, res)=> {
    const ownerid = req.body.ownerid
    const groupid = req.body.groupid
    db.query('UPDATE andale_db.basket SET groupid = ? WHERE ownerid = ?;', [groupid, ownerid],
    (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

app.delete('/api/removearchiveitem', (req, res) => {
    const userid = req.body.userid
    const charityid = req.body.charityid
    db.query("DELETE FROM archive WHERE (charityid = ? AND userid = ?);",
    [charityid, userid], (err, result)=> {
        if (err) {
            console.log(e)
        } else {
            res.send(`item removed from archive`)
        }
    })
})
app.delete('/api/deletebasketitem', (req, res) => {
    const basketid = req.body.basketid
    db.query("DELETE FROM basket WHERE basketid = ?", [basketid], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send('members cleared')
        }
    })
})
app.delete('/api/clearbasket', (req, res) => {
    const ownerid = req.body.ownerid
    db.query("DELETE FROM basket WHERE ownerid = ?", [ownerid], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send('members cleared')
        }
    })
})
app.delete('/api/emptybasket', (req, res) => {
    const groupid = req.body.groupid
    db.query("DELETE FROM basket WHERE groupid = ?", [groupid], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send('members cleared')
        }
    })
})

app.delete('/api/canceldonations', (req, res) => {
    const groupid = req.body.groupid
    db.query("DELETE FROM andale_db.donations WHERE groupid = ?", 
    [groupid], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send('members cleared')
        }
    })
})

app.delete('/api/removerequest', (req, res) => {
    const recipientid = req.body.recipientid
    const requesterid = req.body.requesterid
    db.query("DELETE FROM andale_db.followers WHERE recipientid = ? AND requesterid = ?;", 
    [recipientid, requesterid], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send('members cleared')
        }
    })
})
app.delete('/api/removeaccountrequests', (req, res) => {
    const userid = req.body.userid
    db.query("DELETE FROM andale_db.followers WHERE recipientid = ? OR requesterid = ?;", 
    [userid], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send('members cleared')
        }
    })
})
//app.get('*', (req, res) => {
//    res.sendFile(path.join(__dirname, '../client/build/index.html'));
//  });
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`))