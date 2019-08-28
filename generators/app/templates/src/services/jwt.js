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
                var status = 401;
                var message = 'You are not authenticated!';
                var err = {status, message };
                return res.status(status).json({ err })
            } else {
                req.user = user
                next()
            }
        })
    } else {
        var status = 401;
        var message = 'No token provided!';
        var err = {status, message };
        return res.status(status).json({ err })
    }
}

export const loggedIn = (req, res, next) => {
    if (req.user._id === req.params.userId || req.user._id === req.body.userId) {
        next()
    } else {
        var status = 403;
        var message = 'Unauthorized: logged in user access only.';
        var err = {status, message };
        return res.status(status).json({ err })
    }
}

export const admin = (req, res, next) => {
    if (req.user.role === "admin") {
        next()
    } else {
        var status = 403;
        var message = 'Unauthorized: admin access only.';
        var err = {status, message };
        return res.status(status).json({ err })
    }
}
