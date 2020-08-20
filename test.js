const express = require('express')
const authenticate = require('./index.js')

const app = express()
app.use(authenticate)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const port = 3000
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
