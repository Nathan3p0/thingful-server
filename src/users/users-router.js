const express = require('express')
const UsersService = require('./users-service')
const path = require('path')

const usersRouter = express.Router()
const jsonBodyParser = express.json()

usersRouter.post('/', jsonBodyParser, (req, res, next) => {
    const { password, user_name, full_name, nickname } = req.body
    for (const field of ['user_name', 'full_name', 'password']) {
        if (!req.body[field]) {
            return res.status(400).json({
                error: `Missing ${field} in request body`
            })
        }
    }

    const passwordError = UsersService.validatePassword(password)

    if (passwordError) {
        return res.status(400).json({
            error: passwordError
        })
    }

    UsersService.hasUserWithUserName(req.app.get('db'), user_name)
        .then(hasUserWithUserName => {
            if (hasUserWithUserName) {
                return res.status(400).json({
                    error: 'You need to pick a different name Matey. That one is taken.'
                })
            }
            const newUser = {
                user_name,
                password,
                full_name,
                nickname,
                date_created: 'now()'
            }
            return UsersService.insertUser(req.app.get('db'), newUser)
                .then(user => {
                    res.status(201)
                        .location(path.posix.join(req.originalUrl, `/${user.id}`))
                        .json({
                            user
                            // UsersService.serializeUser(user)
                        })
                })
        })
        .catch(next)
})

module.exports = usersRouter