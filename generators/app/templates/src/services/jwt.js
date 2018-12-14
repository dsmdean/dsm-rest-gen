import jwt from 'jsonwebtoken'

export const getToken = (user) =>
    jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: "2 days"
    })

export const user = (req, res, next) => {
    var token = req.body.token || req.query.token || req.headers['access-token']

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                var error = new Error('You are not authenticated!')
                error.status = 401
                return next(error)
            } else {
                req.user = user
                next()
            }
        })
    } else {
        var err = new Error('No token provided!')
        err.status = 401
        return next(err)
    }
}

export const loggedIn = (req, res, next) => {
    if (req.user._id === req.params.userId || req.user._id === req.body.userId) {
        next()
    } else {
        var err = new Error('Unauthorized: You are authenticated but are not allowed to view this data!')
        err.status = 403
        return next(err)
    }
}

export const admin = (req, res, next) => {
    if (req.user.role === "admin") {
        next()
    } else {
        var err = new Error('Unauthorized: You are authenticated but not an admin!')
        err.status = 403
        return next(err)
    }
}
