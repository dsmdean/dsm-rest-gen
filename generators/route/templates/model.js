import mongoose, { Schema } from 'mongoose'

<%_ if (modelFields.length) { _%>
const <%= camel %>Schema = new Schema({
  <%_ modelFields.forEach(function (field, i) { _%>
  <%= field %>: {
    type: String
  }<%= i !== modelFields.length - 1 ? ',' : ''%>
  <%_ }) _%>
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})
<%_ } else { _%>
const <%= camel %>Schema = new Schema({}, { timestamps: true })
<%_ } _%>

const model = mongoose.model('<%= pascal %>', <%= camel %>Schema)
export default model
