const Router = require('express').Router
const passport = require('passport')
const jwt = require('jsonwebtoken')

const router = Router()

module.exports = ({ session = false }) => {
  // Validation
  if (typeof session !== 'boolean') {
    throw new Error('Unsupported value for session parameter.')
  }

  // Set up authentication/login endpoint/route
  router.post('/', (req, res, next) => {
    passport.authenticate('local', { session }, (err, user, info) => {
      if (err || !user) return res.status(400).json({ error: info ? info.message : 'Login Failed' })
      req.login(user, { session }, async err => {
        if (err) return res.status(400).json({ error: info ? info.message : 'Login Failed' })
        delete user.password
        return res.json({
          token: jwt.sign({ ...user }, process.env.JWT_SECRET, { expiresIn: '6h' }),
          user
        })
      })
    })(req, res, next)
  })
  return router
}
