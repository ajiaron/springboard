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
  
app.get('/catalog/getitems', (req,res)=> {
    db.query('SELECT * FROM charities', (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

app.get('/catalog/getbatch/:next/:current', (req,res)=> {
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
app.get('/charity/getcharity/:charityid', (req,res)=> {
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
app.get('/donate/getcharity/:charityid', (req,res)=> {
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
app.get('/archive/getcharityid/:name', (req,res)=> {
    const name = req.params.name
    db.query('SELECT charityid FROM charities WHERE charity_name LIKE ?', [`%${name}%`],
    (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
app.get('/archive/getarchive/:userid', (req,res)=> {
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
app.get('/catalog/getfiltered/:next/:current', (req,res)=> {
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
app.get('/catalog/searchbatch/:next/:current/:query', (req,res)=> {
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
app.get('/catalog/searchfiltered/:next/:current/:query', (req,res)=> {
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
app.get('/register/validate', (req,res)=> {
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
app.get('/login/getuser', (req,res)=> {
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


app.post('/register/createuser', (req, res) => {
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

app.put('/login/confirmuser', (req, res) => {     // for email confirmation on register
    const username = String(req.body.username)
    db.query('UPDATE users SET confirmed = true WHERE name = ?', [username],
    (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    }
    )
})


//app.get('*', (req, res) => {
//    res.sendFile(path.join(__dirname, '../client/build/index.html'));
//  });
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`))