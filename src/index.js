const cookieParser = require('cookie-parser')
const cors = require('cors')
const csurf = require('csurf')
const express = require('express')
const helmet = require('helmet')

module.exports = ({ jwtSecret, cookieSecret, client, connection, userTable, usernameField, passwordField, loginRoute = '/login', session = false }) => {
  // Validation
  // jwtSecret
  if (typeof cookieSecret !== 'string') {
    throw new Error('Unsupported value for cookieSecret parameter.')
  }
  // client, connection, userTable, usernameField, passwordField
  if (typeof loginRoute !== 'string') {
    throw new Error('Unsupported value for loginRoute parameter.')
  }
  if (typeof session !== 'boolean') {
    throw new Error('Unsupported value for session parameter.')
  }
  // @todo: Limit the acceptable props and do more validation

  // Set up Passport
  const passport = require('./passport.js')({ jwtSecret, client, connection, userTable, usernameField, passwordField })

  return {
    setup: app => {
      // Parse requests to routes
      app.use(loginRoute, express.json(), express.urlencoded({ extended: false }))

      // @todo: Change secure to true
      const cookieConfig = {
        httpOnly: true, // Disable accessing cookie on the client side
        secure: false, // Force https
        maxAge: 1000000000, // TTL in ms (remove this option and cookie will die when browser is closed)
        signed: true // Sign if secret is supplied to cookieParser
      }

      if (process.env.NODE_ENV === 'development') {
        // Log HTTP requests
        const morgan = require('morgan')
        app.use(morgan('combined'))
      }

      // Cookies
      app.use(cookieParser(cookieSecret))

      // CSRF for all requests
      app.use(csurf({ cookie: true, ...cookieConfig }))

      // Security/Protection for all requests
      app.use(helmet()) // { dnsPrefetchControl: false, frameguard: false, ieNoOpen: false }
      app.use(cors({
        origin: '*',
        methods: ['GET', 'POST']
        // allowedHeaders: ['Cross-Origin', 'Content-Type', 'Authorization']
      }))

      // Authentication (Passport Strategies, JWT Tokens, etc.)
      app.use(passport.initialize())

      // Routes: Authentication
      app.use(loginRoute, require('./login.js')({ jwtSecret, cookieConfig, session }))
    },
    requireAuth: passport.authenticate('jwt', { session })
  }
}
