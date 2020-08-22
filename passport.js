// import bcrypt from 'bcrypt'
const passport = require('passport')
const jwt = require('passport-jwt')
const LocalStrategy = require('passport-local').Strategy

const JwtStrategy = jwt.Strategy
const ExtractJwt = jwt.ExtractJwt

const { JWT_SECRET } = process.env

module.exports = function (props) {
  passport.use(new LocalStrategy({
    usernameField: 'email'
  }, (uniqueId, password, callback) => {
    /* return User.findOne({
      where: { email }
    }).then(user => {
      if (!user || !bcrypt.compareSync(password, user.password)) return callback(null, false)
      return callback(null, user)
    }).catch(error => {
      console.log(error)
    }) */
  }))
  passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET
  }, ({ id }, callback) => {
    /* User.findByPk(id).then(user => {
      if (!user) return callback(new Error('Unauthorized'), false)
      return callback(null, user)
    }) */
  }))
  return passport
}
