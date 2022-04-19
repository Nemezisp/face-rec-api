const express = require('express')
const bcrypt = require('bcrypt');
const saltRounds = 10;

require('dotenv').config();

const register = require('./controllers/register')
const signIn = require('./controllers/signIn')
const image = require('./controllers/image')
const profile = require('./controllers/profile')
const auth = require('./controllers/authorization')

const cors = require('cors');

const db = require('knex')({ //Heroku database connection
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    }
})

const app = express()

app.use(express.json());
app.use(cors())

app.get('/', (req, res) => {res.send('success')})
app.post('/signin', (req, res) => {signIn.signInAuthentication(req, res, db, bcrypt)})
app.post('/register', (req, res) => {register.registerAuthentication(req, res, db, bcrypt, saltRounds)})
app.get('/profile/:id', auth.requireAuth, (req, res) => {profile.handleProfileGet(req, res, db)})
app.post('/profile/:id', auth.requireAuth, (req, res) => {profile.handleProfileUpdate(req, res, db)})
app.put('/image', auth.requireAuth, (req, res) => {image.handleImage(req, res, db)})
app.post('/imageurl', auth.requireAuth, (req, res) => {image.handleApiCall(req, res)})

app.listen(process.env.PORT || 3000, () => {
    console.log(`app is running on port ${process.env.PORT}`)
})
