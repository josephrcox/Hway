if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bcrypt = require('bcryptjs')

const users = []

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))

const mongoose = require('mongoose')
mongoose.connect(process.env.DATEBASE_URL, {
	useUnifiedTopology: true
})
const connection = mongoose.connection;

connection.once("open", function() {
  console.log("MongoDB database connection established successfully");
});

const User = require('./models/user')
const jwt = require('jsonwebtoken')

const JWT_SECRET = 'sdjkfh8923yhjdksbfma@#*(&@*!^#&@bhjb2qiuhesdbhjdsfg839ujkdhfjk'

const bp = require('body-parser')
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.render('index.ejs', { name: 'Joey'})
})

app.get('/login', (req, res) => {
    res.render('login.ejs')
})

app.get('/register', (req, res) => {
    res.render('register.ejs')
})

app.post('/login', (req, res) => {
    
})

app.post('/register', async(req, res) => {
    const { name, password: plainTextPassword} = req.body
    console.log(name)
    console.log(plainTextPassword)

    const password = await bcrypt.hash(plainTextPassword, 10)
    console.log(password)

    var user = new User({
        name: name,
        password: password
    })

    user.save(function(err, result) {
        if (err) {
            if (err.code == 11000) {
                return res.json({ status: 'error', error: 'Username already in use'})
            }
        }
        res.json({ status: 'ok'})
        
    })
})

app.listen(process.env.PORT || 5000)