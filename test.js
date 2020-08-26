const bcrypt = require('bcrypt')
const express = require('express')

require('dotenv').config()
const client = 'mysql'
const connection = {
  host: '127.0.0.1',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'express-authenticate'
}
const { setup, requireAuth } = require('./index.js')({
  client,
  connection,
  usernameField: 'email'
})
/* const init = require('./index.js')
const { setup, requireAuth } = init(props) */

const app = express()
const knex = require('knex')({ client, connection })

app.use(
  ['/login', '/signup'],
  express.json(), express.urlencoded({ extended: false })
)

setup(app)
// app.use(requireAuth)

app.set('view engine', 'ejs')

app.get('/signup', (req, res, next) => {
  res.render('signup')
})

app.post('/signup', (req, res, next) => {
  knex('Users').insert({ username: req.body.email, email: req.body.email, password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync()) }).then(() => {
    res.redirect('/login')
  })
})

app.get('/login', (req, res, next) => {
  res.render('login')
})

app.get('/unauthenticated', (req, res, next) => {
  res.send('Unauthenticated')
})

app.get('/authenticated', requireAuth, (req, res, next) => {
  res.send('Authenticated')
})

const port = 3000
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
