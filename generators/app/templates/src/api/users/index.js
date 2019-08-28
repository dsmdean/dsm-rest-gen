import express from 'express'
import { user, loggedIn, admin } from '../../services/jwt'
import { getAllUsers, register, verify, forgot, reset, login, logout, <%_ if (defaultAuth) {_%> getByUsername, <%_ } else { _%> getByEmail, <%_ } _%> getById, putById, deleteById, resetPassword } from './controller'

const router = express.Router()

/**
 * @api {get} /users Retrieve users
 * @apiName RetrieveUsers
 * @apiGroup User
 * @apiPermission admin
 * @apiSuccess {Object[]} users List of users.
 * @apiError {Object} 403 Unauthorized: You are authenticated but not an admin!
 */
router.get('/', user, admin, getAllUsers)

/**
 * @api {post} /users/register Register user
 * @apiName RegisterUser
 * @apiGroup User
 * @apiSuccess {Object} user Newly created user.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.post('/register', register)

/**
 * @api {get} /users/verify Verify user
 * @apiName VerifyUser
 * @apiGroup User
 * @apiSuccess {Object{message}} message Acount verified!
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/verify', verify)

/**
 * @api {get} /users/forgot Forgot user
 * @apiName ForgotUser
 * @apiGroup User
 * @apiSuccess {Object{message}} message Forgot email send
 * @apiError {Object{error, message}} 404 There is no user with this username.
 */
router.get('/forgot', forgot)

/**
 * @api {post} /users/reset Reset user password
 * @apiName ResetUserPassword
 * @apiGroup User
 * @apiSuccess {Object{message}} message Password has been reset
 * @apiError {Object{error, message}} 401 Your password reset link is expired.
 * @apiError {Object{error}} 400 Some parameters may contain invalid values.
 */
router.post('/reset', reset)

/**
 * @api {post} /users/login Login user
 * @apiName LoginUser
 * @apiGroup User
 * @apiSuccess {Object{message, user, token, tokenExp}} loggedInData Logged in user, generated token, and tokn expiration
 * @apiError {Object{error, message}} 401 This account is not recognized
 * @apiError {Object{error, message}} 401 This account is not verified
 * @apiError {Object{error, message}} 401 This account is no longer active
 * @apiError {Object{error}} 400 Some parameters may contain invalid values.
 */
router.post('/login', login)

/**
 * @api {get} /users/logout Logout user
 * @apiName LogoutUser
 * @apiGroup User
 * @apiSuccess {Object{message}} message Log out message
 * @apiError {Object{error}} 400 Some parameters may contain invalid values.
 */
router.get('/logout', user, logout)

router.route('/:userId')
  .all(user)
  /**
   * @api {get} /users/:userId Retrieve user
   * @apiName RetrieveUser
   * @apiGroup User
   * @apiPermission user
   * @apiParam {String} userId Users unique ID.
   * @apiSuccess {Object{user}} user Retrieved user
   * @apiError {Object{error}} 404 User not found.
   * @apiError {Object{error}} 400 Some parameters may contain invalid values.
   */
  .get(getById)
  /**
   * @api {put} /users/:userId Update user
   * @apiName UpdateUser
   * @apiGroup User
   * @apiPermission loggedIn
   * @apiParam {String} userId Users unique ID.
   * @apiSuccess {Object{user}} user Updated user
   * @apiError {Object{error}} 404 User not found.
   * @apiError {Object{error}} 400 Some parameters may contain invalid values.
   */
  .put(loggedIn, putById)
  /**
   * @api {delete} /users/:userId Remove user
   * @apiName RemoveUser
   * @apiGroup User
   * @apiPermission loggedIn
   * @apiParam {String} userId Users unique ID.
   * @apiSuccess {Object{user}} user Remove user
   * @apiError {Object{error}} 404 User not found.
   * @apiError {Object{error}} 400 Some parameters may contain invalid values.
   */
  .delete(loggedIn, deleteById)

/**
 * @api {put} /users/:userId/reset Update user password
 * @apiName UpdateUserPassword
 * @apiGroup User
 * @apiPermission loggedIn
 * @apiParam {String} userId Users unique ID.
 * @apiSuccess {Object{message}} message Password has been reset
 * @apiError {Object{error}} 401 Your current password is not correct
 * @apiError {Object{error}} 400 Some parameters may contain invalid values.
 */
router.put('/:userId/reset', user, loggedIn, resetPassword)

<%_ if (defaultAuth) {_%>
/**
 * @api {get} /users/username/:username Retrieve user by username
 * @apiName RetrieveUserByUsername
 * @apiGroup User
 * @apiPermission user
 * @apiParam {String} username Users unique ID.
 * @apiSuccess {Object{user}} user Retrieved user
 * @apiError {Object{error}} 404 User not found.
 * @apiError {Object{error}} 400 Some parameters may contain invalid values.
 */
router.get('/username/:username', user, getByUsername)
<%_ } else {_%>
/**
 * @api {get} /users/email/:email Retrieve user by email
 * @apiName RetrieveUserByEmail
 * @apiGroup User
 * @apiPermission user
 * @apiParam {String} username Users unique ID.
 * @apiSuccess {Object{user}} user Retrieved user
 * @apiError {Object{error}} 404 User not found.
 * @apiError {Object{error}} 400 Some parameters may contain invalid values.
 */
router.get('/email/:email', user, getByEmail)
<%_ } _%>

export default router
