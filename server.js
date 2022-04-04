const express = require('express')
const bcrypt = require('bcrypt');
const saltRounds = 10;

const register = require('./controllers/register')
const signIn = require('./controllers/signIn')
const image = require('./controllers/image')
const profile = require('./controllers/profile')

const cors = require('cors');
const db = require('knex')({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'test',
        database: 'face-rec'
    }
})

const app = express()

app.use(express.json());
app.use(cors())

app.get('/', (req, res) => {res.send('success')})
app.post('/signin', (req, res) => {signIn.handleSignIn(req, res, db, bcrypt)})
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt, saltRounds)})
app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)})
app.put('/image', (req, res) => {image.handleImage(req, res, db)})
app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)})

app.listen(3000, () => {
    console.log('app is running on port 3000')
})
