<%_
var authMiddlewares = [];
var httpVerbs = [
  { method: 'POST', router: 'post', controller: 'create', desc: 'Create' },
  { method: 'GET LIST', router: 'get', controller: 'index', desc: 'Retrieve' },
  { method: 'GET ONE', router: 'get', controller: 'show', desc: 'Retrieve' },
  { method: 'PUT', router: 'put', controller: 'update', desc: 'Update' },
  { method: 'DELETE', router: 'delete', controller: 'destroy', desc: 'Delete' }
];
methods = httpVerbs.filter(function (verb) {
  if (methods.indexOf(verb.method) === -1) {
    return false;
  }
  return true
});
_%>
import express from 'express'
import { user, loggedIn, admin } from '../../services/jwt'
<%_ if (methods.length) { _%>
import { <%= methods.map(function (method) { return method.controller }).join(', ') %> } from './controller'
<%_ } _%>

const router = express.Router()

<%_ methods.forEach(function (method) { _%>
/**
 * @api {<%= method.router %>} /<%= ['GET ONE', 'PUT', 'DELETE'].indexOf(method.method) !== -1 ? ':id' : '' %> <%= method.desc %> <%= method.method === 'GET LIST' ? lowers : lower %>
 * @apiName <%= method.desc + (method.method === 'GET LIST' ? pascals : pascal) %>
 * @apiGroup <%= pascal %>
 <%_ if (method.method === 'GET LIST') { _%>
 * @apiSuccess {Object[]} List of <%= lowers %>.
 <%_ } else if (method.method === 'GET ONE') { _%>
 * @apiSuccess {Object[]} Details of <%= lowers %>.
 * @apiError 404 <%= start %> Not found.
 <%_ } else if (method.method === 'DELETE') { _%>
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 <%= start %> Not found.
 <%_ } else if (method.method === 'POST' || method.method === 'PUT') { _%>
 * @apiSuccess (Success 201) {Object} <%= start %>'s data.
 <%_ } _%>
 <%_ if (method.permission) { _%>
 * @apiError 403 Unauthorized: <%= method.permission %> access only.
 <%_ } _%>
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.<%= method.router %>('/<%= ['GET ONE', 'PUT', 'DELETE'].indexOf(method.method) !== -1 ? ':id' : '' %>', <%= method.controller %>)

<%_ }); _%>
export default router
