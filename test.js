const express = require('express')
const setup = require('./index.js')

const app = express()
setup(app)

// app.use(setup.requireAuth)

app.get('/', setup.requireAuth, (req, res) => {
  res.send('Hello World!')
})

const port = 3000
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
