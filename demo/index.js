const bcrypt = require('bcrypt')
const express = require('express')
const path = require('path')

// Load environmental variables
require('dotenv').config({ path: path.join(__dirname, '/.env') })

// Database configuration for passport and for knex to use in the example
const client = 'mysql'
const connection = {
  host: '127.0.0.1',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'expressjs-authenticate'
}

// Import the expressjs-authenticate middleware
const { setup, requireAuth } = require('../lib/index.js')({
  jwtSecret: process.env.JWT_SECRET,
  cookieSecret: process.env.COOKIE_SECRET,
  client,
  connection,
  usernameField: 'email'
})
/* const init = require('../lib/index.js')
const { setup, requireAuth } = init(props) */

// Create an Express application and knex connection
const app = express()
const knex = require('knex')({ client, connection })

// Parse requests to routes
app.use('/signup', express.json(), express.urlencoded({ extended: false }))

// Apply the expressjs-authenticate middleware to the Express app
setup(app)

// Require all routes to have authentication; be careful, this doesn't allow unprotected /signup or /login routes
// app.use(requireAuth)

// Add a view engine for the authentication example's signup and login pages
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))

// Examples of a route that doesn't require authentication
app.get('/signup', (req, res, next) => {
  // Display the signup form page
  res.render('signup', { _csrf: req.csrfToken() })
})

app.post('/signup', (req, res, next) => {
  // Upon signup form submit, create a user with the form data; careful, there's no validation
  knex('Users').insert({ username: req.body.email, email: req.body.email, password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync()) }).then(() => {
    res.redirect('/login')
  })
})

app.get('/login', (req, res, next) => {
  // Display the login form page
  res.render('login', { _csrf: req.csrfToken() })
})

// Example of a route that requires authentication
app.get('/home', requireAuth, (req, res, next) => {
  // If you're logged in, you should be able to go to /home, if not you should get an error
  res.send('Authenticated')
})

// Make Express listen to port 3000 and display success message
const port = 3000
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
