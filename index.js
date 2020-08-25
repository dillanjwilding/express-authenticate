module.exports = ({ loginRoute = '/login', session = false, ...props }) => {
  // Validation
  if (typeof loginRoute !== 'string') {
    throw new Error('Unsupported value for loginRoute parameter.')
  }
  if (typeof session !== 'boolean') {
    throw new Error('Unsupported value for session parameter.')
  }

  // Set up Passport
  const passport = require('./passport.js')(props)

  return {
    setup: app => {
      // Authentication (Passport Strategies, JWT Tokens, etc.)
      app.use(passport.initialize())

      // Routes: Authentication
      app.use(loginRoute, require('./login.js')({ session, ...props }))
    },
    requireAuth: passport.authenticate('jwt', { session })
  }
}
