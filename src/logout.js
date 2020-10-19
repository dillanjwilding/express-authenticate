const Router = require('express').Router

const router = Router()

module.exports = ({ jwtCookie, callback }) => {
  if (typeof jwtCookie !== 'string') {
    throw new Error('Unacceptable value for JWT cookie name')
  }

  router.post('/', (req, res, next) => {
    res.clearCookie(jwtCookie)
    if (callback) {
      callback()
    } else {
      return res.json({ success: true }) // check if cookie was deleted? rather than just assuming
    }
  })
}
