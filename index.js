const passport = require('./passport.js')

module.exports.setup = function (app) {
  console.log('setup')
  app.use(passport.initialize())
}

module.exports.requireAuth = passport.authenticate('jwt', { session: false })
