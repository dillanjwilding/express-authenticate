const express = require('express')

require('dotenv').config()
const { setup, requireAuth } = require('./index.js')

const app = express()
setup(app)

// app.use(requireAuth)

app.get('/unauthenticated', (req, res) => {
  res.send('Unauthenticated')
})

app.get('/authenticated', requireAuth, (req, res) => {
  res.send('Authenticated')
})

const port = 3000
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
