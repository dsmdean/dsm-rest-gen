import crypto from 'crypto'
import passport from 'passport'
import { sendMail } from '../../services/sendgrid'
import { getToken } from '../../services/jwt'
import User, { defaultSelection } from './model'

// reusable variables
const minutes = 1000 * 60
const hours = minutes * 60

export const getAllUsers = (req, res) =>
  User.find({}, defaultSelection, (err, users) => {
    if (err) return res.status(500).json({ err: err })
    return res.status(200).json({ message: '', users })
  })

export const register = (req, res) =>
  crypto.randomBytes(20, (err, buf) => {
    if (err) return res.status(500).json({ err: err })
    let token = buf.toString('hex')

    crypto.randomBytes(4, (err, buf) => {
      if (err) return res.status(500).json({ err: err })
      let pass = buf.toString('hex')

      User.register(
        new User({ username: req.body.username, name: req.body.name, company: req.body.company, email: req.body.email, authToken: token }),
        pass, (err, user) => {
          if (err) return res.status(500).json({ err: err })

          let activation_url = process.env.FRONTEND_LINK + "/verify?auth=" + token
          let content = `
            Hey, ${user.name}.<br><br>
            Welcome to your <%= name %> account.<br>
            Please click on the following link, or paste this into your browser to complete the process and activate your account.<br><br>
            <a href="${activation_url}">${activation_url}</a><br><br>
            Once you've clicked on the link, you can use your username and the following password to log in.<br><br>
            Password: <strong>${pass}</strong><br><br>
            We advice you to change your password in settings as soon as possible.<br><br>
            If this request isn't meant for you, then you can safely ignore this email. :)<br><br>
            &mdash; <%= name %> Team
          `
          sendMail(user.email, '<%= name %> - Registration', content)
          return res.status(200).json({ message: 'Registration Successful! We have sent an email to verify the account.' })
        })
    })
  })

export const verify = (req, res) => {
  if (!req.query.auth) return res.status(500).json({ err: { message: 'No authentication token provided' } })

  User.findOneAndUpdate({ authToken: req.query.auth }, { $set: { isAuthenticated: true, authToken: undefined } }, { new: true }, (err, user) => {
    if (err) return res.status(500).json({ err: err })
    if (!user) return res.status(404).json({ err: { message: 'User not found' } })
    return res.status(200).json({ message: 'Account has been verified' })
  })
}

export const forgot = (req, res) =>
  User.findOne({ email: req.query.email }, (err, user) => {
    if (err) return res.status(500).json({ err: err })
    if (!user) return res.status(404).json({ err: { message: 'There is no user with this email' } })

    crypto.randomBytes(20, (err, buf) => {
      if (err) return res.status(500).json({ err: err })

      let token = buf.toString('hex')
      user.resetPasswordToken = token
      user.resetPasswordExpires = Date.now() + 3600000

      user.save((err) => {
        if (err) return res.status(500).json({ err: err })

        let reset_url = process.env.FRONTEND_LINK + "/reset/" + token
        let content = `
            Hey, ${user.name}.<br><br>
            You requested a new password for your <%= name %> account.<br>
            Please use the following link to set a new password. It will expire in 1 hour.<br><br>
            <a href="${reset_url}">${reset_url}</a><br><br>
            If you didn't make this request then you can safely ignore this email. :)<br><br>
            &mdash; <%= name %> Team
        `
        sendMail(user.email, '<%= name %> - Reset Password', content)
        return res.status(200).json({ message: 'Reset email sent!' })
      })
    })
  })

export const reset = (req, res) =>
  User.findOne({ resetPasswordToken: req.body.token, resetPasswordExpires: { $gt: Date.now() } }, (err, user) => {
    if (err) return res.status(500).json({ err: err })
    if (!user) return res.status(401).json({ err: { message: 'Your password reset link is expired' } })

    user.setPassword(req.body.password, () => {
      user.resetPasswordToken = undefined
      user.resetPasswordExpires = undefined

      user.save((err) => {
        if (err) return res.status(500).json({ err: err })

        let content = `
            Hey, ${user.name}.<br><br>
            This is a confirmation that the password for your account has just been changed.<br><br>
            &mdash; <%= name %> Team
        `
        sendMail(user.email, '<%= name %> - Password has been reset', content)
        return res.status(200).json({ message: '' })
      })
    })
  })

export const login = (req, res, next) =>
  passport.authenticate('local', (err, user, info) => {
    if (err) return res.status(500).json({ err: err })
    if (!user) return res.status(401).json({ err: { message: 'This account is not recognized. ' + info.message } })
    if (!user.isAuthenticated) return res.status(401).json({ err: { message: 'This account is not verified' } })
    if (!user.isActive) return res.status(403).json({ err: { message: 'This account is no longer active' } })

    req.logIn(user, (err) => {
      if (err) return res.status(500).json({ err: err })

      let tokenExp = Date.now() + (8 * hours)
      let token = getToken({ "_id": user._id, "username": user.username, "company": user.company, "email": user.email, "role": user.role })

      return res.status(200).json({ message: '', token: token, user: user, tokenExp: tokenExp })
    })
  })(req, res, next)

export const logout = (req, res) => {
  req.logout()
  return res.status(200).json({ message: '' })
}

export const getByUsername = (req, res) =>
  User.findOne({ username: req.params.username }, defaultSelection, (err, user) => {
    if (err) return res.status(500).json({ err: err })
    return res.status(200).json({ message: '', user: user })
  })

export const getById = (req, res) =>
  User.findById(req.params.userId, defaultSelection, (err, user) => {
    if (err) return res.status(500).json({ err: err })
    return res.status(200).json({ message: '', user: user })
  })

export const putById = (req, res) =>
  User.findByIdAndUpdate(req.params.userId, { $set: req.body }, { fields: defaultSelection, new: true }, (err, user) => {
    if (err) return res.status(500).json({ err: err })
    return res.status(200).json({ message: 'You updated your profile', user: user })
  })

export const deleteById = (req, res) =>
  User.findByIdAndUpdate(req.params.userId, { $set: { isActive: false } }, { fields: defaultSelection, new: true }, (err, user) => {
    if (err) return res.status(500).json({ err: err })
    return res.status(200).json({ message: '', user: user })
  })

export const resetPassword = (req, res, next) =>
  passport.authenticate('local', function (err, user) {
    if (err) return res.status(500).json({ err: err })
    if (!user) return res.status(401).json({ err: { message: 'Your current password is not correct' } })

    user.setPassword(req.body.newPassword, () => {
      user.save((err) => {
        if (err) return res.status(500).json({ err: err })
        return res.status(200).json({ message: 'Password has been reset' })
      })
    });
  })(req, res, next)
