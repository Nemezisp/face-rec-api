const express = require('express')
const bcrypt = require('bcryptjs');
const saltRounds = bcrypt.genSaltSync(10);

const register = require('./controllers/register')
const signIn = require('./controllers/signIn')
const image = require('./controllers/image')
const profile = require('./controllers/profile')

const cors = require('cors');

const db = require('knex')({ 
	client: 'pg', 
	connection: process.env.POSTGRES_URI
})

const app = express()

app.use(express.json());
app.use(cors())

console.log('life is life')

app.get('/', (req, res) => {res.send('success')})
app.post('/signin', (req, res) => {signIn.handleSignIn(req, res, db, bcrypt)})
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt, saltRounds)})
app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)})
app.put('/image', (req, res) => {image.handleImage(req, res, db)})
app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)})

app.listen(process.env.PORT || 3000, () => {
    console.log(`app is running on port ${process.env.PORT}`)
})
