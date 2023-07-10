const express = require('express');
const app = express();
const mysql = require('mysql')
const cors = require('cors')
app.use(express.json())
app.use(cors())

const db = mysql.createConnection({
    user:'root',
    host:'localhost',
    password:'password',
    charset:'utf8mb4',
    database:'andale_db',
 }
)

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

app.listen(3000, () => console.log('Listening on port 3000'))