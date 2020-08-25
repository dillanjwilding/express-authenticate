const Router = require('express').Router
const passport = require('passport')

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
        return res.json({
          token: user.generateToken(),
          user
        })
      })
    })(req, res, next)
  })
  return router
}