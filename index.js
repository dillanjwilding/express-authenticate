require('dotenv').config()
const passport = require('./passport.js')

module.exports = function (app) {
  console.log('setup')
  app.use(passport.initialize())
}

module.exports.requireAuth = function (req, res, next) {
  console.log('require auth')
  next()
}
