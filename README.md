# express-authenticate
Configurable Express Authentication Middleware

## Setup

```
const { setup, requireAuth } = require('express-authenticate')({
  secret: process.env.JWT_SECRET,
  client,
  connection,
  usernameField: 'email'
})
...
const app = express()
setup(app)
```