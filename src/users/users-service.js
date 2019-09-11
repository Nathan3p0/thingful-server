const REGEX = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/


const UsersService = {
    validatePassword(password) {
        if (password.length < 8) {
            return 'Alas, Password be shorter than 8 characters matey. RRRRR!'
        }
        if (password.length > 72) {
            return 'Blimey, password be longer then 72 characters. You scurvy dog!'
        }
        if (password.startsWith(' ') || password.endsWith(' ')) {
            return 'Our ship wasn\'t made for space'
        }
        if (!REGEX.test(password)) {
            return 'Password must contain 1 upper case, lower case, number and special character'
        }
        return null
    },
    hasUserWithUserName(db, user_name) {
        return db('thingful_users').where({ user_name }).first()
            .then(user => !!user)
    },
    insertUser(db, newUser) {
        return db('thingful_users').insert(newUser).returning('*')
            .then(([user]) => user)
    }
}

module.exports = UsersService