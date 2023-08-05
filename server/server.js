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
    const sql = `SELECT charityid, charity_name, overall_score, city, state, size, type1 FROM andale_db.charities `+
                `WHERE charityid IN (SELECT charityid FROM andale_db.archive WHERE userid = ?);`
    db.query(sql, [userid],
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