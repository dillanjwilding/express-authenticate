const Router = require('express').Router
const passport = require('passport')
const jwt = require('jsonwebtoken')

const router = Router()

/**
 *
 * @param string jwtString
 * @param object cookieConfig
 * httpOnly: Disable accessing cookie on the client side
 * secure: Force https
 * maxAge: TTL in ms (remove this option and cookie will die when browser is closed)
 * signed: Sign if secret is supplied to cookieParser
 * @param boolean session
 */
module.exports = ({ jwtSecret, cookieConfig = { httpOnly: true, secure: true, maxAge: 60 * 60 * 60 * 24, signed: true }, session = false }) => {
  // Validation
  if (typeof jwtSecret === 'undefined') {
    throw new Error('Unacceptable value for JWT secret')
  }
  if (typeof cookieConfig === 'object' && !['httpOnly', 'secure', 'maxAge', 'signed'].every(prop => Object.prototype.hasOwnProperty.call(cookieConfig, prop))) {
    throw new Error('Connection object missing required properties.')
  }
  if (typeof session !== 'boolean') {
    throw new Error('Unsupported value for session parameter.')
  }

  // Set up authentication/login endpoint/route
  router.post('/', (req, res, next) => {
    passport.authenticate('local', { session }, (err, user, info) => {
      if (err || !user) return res.status(400).json({ error: info ? info.message : 'Login Failed' })
      req.login(user, { session }, async err => {
        if (err) return res.status(400).json({ error: info ? info.message : 'Login Failed' })
        delete user.password // protect password by never returning it
        // Possibly use a limited set of user data to generate JWT rather than all the values in the whole table
        res.cookie('token', jwt.sign({ ...user }, jwtSecret, { expiresIn: '6h' }), cookieConfig)
        return res.json({ user })
      })
    })(req, res, next)
  })
  return router
}
