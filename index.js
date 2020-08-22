module.exports = function (props) {
  const passport = require('./passport.js')(props)

  return {
    setup: function (app) {
      console.log('setup')
      app.use(passport.initialize())
    },
    requireAuth: passport.authenticate('jwt', { session: false })
  }
}
