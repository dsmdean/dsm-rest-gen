import 'dotenv/config'
// import createError from 'http-errors'
import express from 'express'
import cors from 'express-cors'
import path from 'path'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import mongoose from 'mongoose'
<%_ if (generateUserApi) {_%>
import passport from 'passport'
import './services/passport'

import usersRouter from './api/users'
<%_ } _%>
// import indexRouter from './api/index'

mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))  // eslint-disable-line no-console
db.once('open', () => {
  console.log("Connected to server")  // eslint-disable-line no-console
})

const app = express()

app.use(cors({
  allowedOrigins: [
    'http://localhost:3000'
  ],
  headers: [
    'Cache-Control', 'Pragma, Origin', 'Authorization', 'Content-Type', 'X-Requested-With', 'access-token'
  ]
}))

// view engine setup
app.set('views', path.join(__dirname, 'default/views'));
app.set('view engine', 'jade');

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
<%_ if (generateUserApi) {_%>
app.use(passport.initialize())
<%_ } _%>
app.use(express.static(path.join(__dirname, 'default/public')))

<%_ if (generateUserApi) {_%>
/**
 * @apiDefine admin Admin access only
 * You must pass `access_token` authorization header
 * to access this endpoint.
 */
/**
 * @apiDefine loggedIn Logged in user access only
 * The `userId` must be passed through req.params or req.body and be equal to the logged in user ID
 * to access this endpoint.
 */
/**
 * @apiDefine user User access only
 * You must pass `token` to req.body, req.query or pass `access_token` parameter into the header
 * to access this endpoint.
 */
<%_ } _%>
/**
 * @apiDefine listParams
 * @apiParam {String} [q] Query to search.
 * @apiParam {Number{1..30}} [page=1] Page number.
 * @apiParam {Number{1..100}} [limit=30] Amount of returned items.
 * @apiParam {String[]} [sort=-createdAt] Order of returned items.
 * @apiParam {String[]} [fields] Fields to be returned.
 */

<%_ if (generateUserApi) {_%>
app.use('/users', usersRouter)
<%_ } _%>
// app.use('/*', indexRouter)

// catch 404 and forward to error handler
// app.use((req, res, next) => {
//   next(createError(404))
// })

// error handler
// app.use((err, req, res) => {
//   // set locals, only providing error in development
//   res.locals.message = err.message
//   res.locals.error = req.app.get('env') === 'development' ? err : {}

//   // render the error page
//   res.status(err.status || 500)
//   res.render('error')
// })

module.exports = app
