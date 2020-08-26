const bcrypt = require('bcrypt')
// const knex = require('knex')
const passport = require('passport')
const jwt = require('passport-jwt')
const LocalStrategy = require('passport-local').Strategy

const JwtStrategy = jwt.Strategy
const ExtractJwt = jwt.ExtractJwt

const { JWT_SECRET } = process.env

module.exports = ({ client, connection, userTable = 'Users', usernameField = 'username', passwordField = 'password' }) => {
  // Validation
  if (!['mysql', 'pg'].includes(client)) {
    throw new Error('Unsupported database client.')
  }
  if (!connection) {
    throw new Error('Connection parameter not supplied.')
  } else {
    if (typeof connection === 'object') {
      if (!['host', 'user', 'password', 'database'].every(prop => connection.hasOwnProperty(prop))) {
        throw new Error('Connection object missing required properties.')
      }
    } else if (typeof connection !== 'string') {
      throw new Error('Unsupported type of connection.')
    }
  }
  if (!['username', 'email'].includes(usernameField)) {
    throw new Error('Unsupported value for Passport LocalStrategy usernameField property.')
  }
  if (typeof passwordField !== 'string') {
    throw new Error('Unsupported passwordField type.')
  }
  const knex = require('knex')({ client, connection })

  // Setting up local Passport authentication
  passport.use(new LocalStrategy({
    usernameField,
    passwordField
  }, (uniqueId, password, callback) => {
    return knex(userTable)
      // .select(passwordField)
      .where(usernameField, uniqueId)
      .first().then(user => {
        if (!user || !bcrypt.compareSync(password, user[passwordField])) return callback(null, false)
        return callback(null, user)
      }).catch(error => {
        console.log(error)
        return callback(error, false)
      })
  }))

  // Setting up Passport JWT verification
  passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET
  }, ({ id }, callback) => {
    return knex(userTable)
      .where({ id })
      .first().then(user => {
        if (!user) return callback(new Error('Unauthorized'), false)
        return callback(null, user)
      })
  }))
  return passport
}
