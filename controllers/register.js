const redisClient = require('./signIn.js').redisClient
const jwt = require('jsonwebtoken')

const signToken = (email) => {
    const jwtPayload = { email }
    return jwt.sign(jwtPayload, process.env.JWTSECRET, {expiresIn: '2 days'});
  }
  
const setToken = (token, id) => {
    return Promise.resolve(redisClient.set(token, id))
}
  
const createSession = (user) => {
    const { email, id } = user;
    const token = signToken(email);
    return setToken(token, id)
      .then(() => { return {success: 'true', userId: id, token}})
      .catch(console.log)
}

const handleRegister = (req, res, db, bcrypt, saltRounds) => {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
        return Promise.reject('incorrect form submission')
    }

    const hash = bcrypt.hashSync(password, saltRounds)

    return db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
            .returning('*')
            .insert({
                email: loginEmail[0].email,
                name: name, 
                joined: new Date()
            })
            .then(user => user[0])
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => Promise.reject('something went wrong'))

}

const registerAuthentication = (req, res, db, bcrypt, saltRounds) => {
    return handleRegister(req, res, db, bcrypt, saltRounds)
            .then(data => {
                return data.id && data.email ? createSession(data) : Promise.reject('Error')
            })
            .then(session => res.json(session))
            .catch(err => res.status(400))
}

module.exports = {
    registerAuthentication
}