const express = require('express')

require('dotenv').config()
const { setup, requireAuth } = require('./index.js')({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'express-authenticate'
  },
  usernameField: 'email'
})
/* const init = require('./index.js')
const { setup, requireAuth } = init(props) */

const app = express()
setup(app)

// app.use(requireAuth)

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
