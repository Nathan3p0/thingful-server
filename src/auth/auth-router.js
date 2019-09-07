const express = require('express')
const AuthService = require('./auth-service')
const authRouter = express.Router()
const jsonBodyParser = express.json()
const bcrypt = require('bcrypt')

authRouter.post('/login', jsonBodyParser, (req, res, next) => {
    const { user_name, password } = req.body
    const loginUser = {
        user_name,
        password
    }

    for (const [key, value] of Object.entries(loginUser)) {
        if (value == '') {
            return res.status(400).json({ error: 'Missing username or password' })
        }
    }

    AuthService.getUserWithUserName(req.app.get('db'), loginUser.user_name)
        .then(user => {
            if (!user) {
                return res.status(400).json({ error: 'Invalid Username' })
            }
            return bcrypt.compare(loginUser.password, user.password)
                .then(passwordsMatch => {
                    if (!passwordsMatch) {
                        return res.status(400).json({ error: 'Incorrect Password' })
                    }

                    const subject = user.user_name
                    const payload = {
                        user_id: user.user_id
                    }

                    res.send({
                        authToken: AuthService.createJWT(subject, payload)
                    })


                });
        })

})


module.exports = authRouter
