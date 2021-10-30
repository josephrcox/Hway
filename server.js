if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bcrypt = require('bcrypt')

const users = []

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))

const mongoose = require('mongoose')
mongoose.connect(process.env.DATEBASE_URL)
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log("Connected to Mongoose"))

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

app.post('/register', async (req, res) => {
    const {name, email, password} = req.body
    
    try {
        const hashedPW = await bcrypt.hash(password, 10)
        users.push({
            name: name,
            email: email,
            password: hashedPW
        })
        res.redirect('/login')
    } catch {
        res.redirect('/register')
    }

})

app.listen(process.env.PORT || 5000)