<%_ if (generateModel && methods.length) { _%>
import <%= pascal %> from './model'
<%_ } _%>

<%_ if (methods.indexOf('POST') !== -1) { _%>
export const create = (req, res) =>
  <%_ if (generateModel) { _%>
  <%= pascal %>.create(req.body, (err, <%= camel %>) => {
    if (err) return res.status(400).json({err})
    return res.status(200).json({<%= camel %>})
  })
  <%_ } else { _%>
  res.status(201).json(body)
  <%_ } _%>
<%_ } _%>

<%_ if (methods.indexOf('GET LIST') !== -1) { _%>
export const index = (req, res) =>
  <%_ if (generateModel) { _%>
  <%= pascal %>.find({}, (err, <%= camel %>) => {
    if (err) return res.status(400).json({err})
    return res.status(200).json({<%= camel %>})
  })
  <%_ } else { _%>
  return res.status(200).json([])
  <%_ } _%>
<%_ } _%>

<%_ if (methods.indexOf('GET ONE') !== -1) { _%>
export const show = (req, res) =>
  <%_ if (generateModel) { _%>
  <%= pascal %>.findById(req.params.id, (err, <%= camel %>) => {
    if (err) return res.status(400).json({err})
    return res.status(200).json({<%= camel %>})
  })
  <%_ } else { _%>
  res.status(200).json({})
  <%_ } _%>
<%_ } _%>

<%_ if (methods.indexOf('PUT') !== -1) { _%>
export const update = (req, res) =>
  <%_ if (generateModel) { _%>
  <%= pascal %>.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true}, (err, <%= camel %>) => {
    if (err) return res.status(400).json({err})
    return res.status(200).json({<%= camel %>})
  })
  <%_ } else { _%>
  res.status(200).json({})
  <%_ } _%>
<%_ } _%>

<%_ if (methods.indexOf('DELETE') !== -1) { _%>
export const destroy = (req, res) =>
  <%_ if (generateModel) { _%>
  <%= pascal %>.deleteOne({_id: req.params.id}, (err, <%= camel %>) => {
    if (err) return res.status(400).json({err})
    return res.status(200).json({<%= camel %>})
  })
  <%_ } else { _%>
  res.status(204).end()
  <%_ } _%>
<%_ } _%>
