const AuthService = require('../auth/auth-service')

const requireAuth = (req, res, next) => {
    const authToken = req.get('Authorization') || ''

    let bearerToken
    if (!authToken.toLowerCase().startsWith('bearer ')) {
        return res.status(401).json({ error: 'Missing bearer token' })
    } else {
        bearerToken = authToken.slice('bearer '.length, authToken.length)
    }

}