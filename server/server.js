require('dotenv').config()
const express = require('express');
const path = require('path');
const app = express();
const mysql = require('mysql')
const cors = require('cors')
app.use(express.json())
app.use(cors())
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

/*
app.get('/paypal/:description/:value', (req, res) => {
    const description = req.params.description;
    const value = Number(req.params.value); 
    console.log(description)
    console.log(value)
    res.render('paypal', { description, value }); // pass them into the view
});
*/
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


app.post('/api/addarchive', (req, res) => {
    const userid = req.body.userid
    const charityid = req.body.charityid
    db.query('INSERT INTO archive (userid, charityid) VALUES (?,?)', 
    [userid, charityid], (err, result) => {
        if(err) {
            console.log(err)
        } else {
            res.send("succ")
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

//app.get('*', (req, res) => {
//    res.sendFile(path.join(__dirname, '../client/build/index.html'));
//  });
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`))