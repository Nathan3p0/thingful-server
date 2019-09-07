const jwt = require('jsonwebtoken')
const config = require('../config')

const AuthService = {
    getUserWithUserName(db, user_name) {
      return db('thingful_users')
        .where({ user_name })
        .first()
    },
    parseBasicToken(token) {
      return Buffer
        .from(token, 'base64')
        .toString()
        .split(':')
    },
    createJWT(subject, payload) {
      return jwt.sign(payload, config.JWT_SECRET, {
        subject,
        algorithm : 'HS256'
      })
    }
  }
  
  module.exports = AuthService