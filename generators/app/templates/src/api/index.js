import express from 'express'

const router = express.Router()

/**
 * @api {get} / Retrieve default API page
 * @apiName RetrieveDefaultApiPage
 * @apiGroup Default
 * @apiSuccess {html} html Welcome HTML page
 */
router.get('/', (req, res) => {
  res.render('index', { title: '<%= name %>' });
})

module.exports = router
