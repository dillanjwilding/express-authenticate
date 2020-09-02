const express = require('express')

module.exports = ({ loginRoute = '/login', session = false, ...props }) => {
  // Validation
  if (typeof loginRoute !== 'string') {
    throw new Error('Unsupported value for loginRoute parameter.')
  }
  if (typeof session !== 'boolean') {
    throw new Error('Unsupported value for session parameter.')
  }
  // @todo: Limit the acceptable props and do more validation

  // Set up Passport
  const passport = require('./passport.js')(props)

  return {
    setup: app => {
      // Parse requests to routes
      app.use(loginRoute, express.json(), express.urlencoded({ extended: false }))

      // Authentication (Passport Strategies, JWT Tokens, etc.)
      app.use(passport.initialize())

      // Routes: Authentication
      app.use(loginRoute, require('./login.js')({ session, ...props }))
    },
    requireAuth: passport.authenticate('jwt', { session })
  }
}
