const jwt = require('jsonwebtoken')

if (process.env.REDISTOGO_URL) {
  const rtg = require("url").parse(process.env.REDISTOGO_URL);
  const redisClient = require("redis").createClient(rtg.port, rtg.hostname);
  redisClient.auth(rtg.auth.split(":")[1]);
} else {
  const redisClient = require("redis").createClient();
}

const handleSignIn = (req, res, db, bcrypt) => {
  const {email, password} = req.body

  if (!email || !password) {
      return Promise.reject('incorrect form submission')
  }

  return db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
        const isValid = bcrypt.compareSync(password, data[0].hash);
        if (isValid) {
            return db.select('*').from('users')
              .where('email', '=', email)
              .then(user => user[0])
              .catch(err =>  Promise.reject('unable to get user'))
        } else {
            Promise.reject('wrong credentials')
        }
    })
    .catch(err => Promise.reject('wrong credentials'))
}

const getAuthTokenId = (req, res) => {
  const { authorization } = req.headers;
  return redisClient.get(authorization, (err, reply) => {
    if (err || !reply) {
      return res.status(400).json('Unauthorized')
    }
    return res.json({id: reply})
  })
}

const signToken = (email) => {
  const jwtPayload = { email }
  return jwt.sign(jwtPayload, process.env.JWTSECRET, {expiresIn: '2 days'});
}

const setToken = (token, id) => {
  console.log(redisClient)
  console.log(token, id)
  return Promise.resolve(redisClient.set(token, id))
}

const createSession = (user) => {
  const { email, id } = user;
  const token = signToken(email);
  return setToken(token, id)
    .then(() => { return {success: 'true', userId: id, token}})
    .catch(console.log)
}

const signInAuthentication = (req, res, db, bcrypt) => {
  const { authorization } = req.headers;
  return authorization ? getAuthTokenId(req, res) : 
    handleSignIn(req, res, db, bcrypt)
      .then(data => {
        return data.id && data.email ? createSession(data) : Promise.reject('Error')
      })
      .then(session => res.json(session))
      .catch(err => res.status(400))
}

module.exports = {
    signInAuthentication
}