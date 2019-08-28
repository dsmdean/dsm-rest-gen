import crypto from 'crypto'
import mongoose, { Schema } from 'mongoose'
import passportLocalMongoose from 'passport-local-mongoose'
import passportLocalMongooseEmail from 'passport-local-mongoose-email';
const roles = ['user', 'admin']

const userSchema = new Schema({
    <%_ if (defaultAuth) {_%>
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },<%_ } _%>
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        match: /^\S+@\S+\.\S+$/,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    role: {
        type: String,
        enum: roles,
        default: 'user'
    },
    picture: {
        type: String,
        trim: true
    },
    authToken: String,
    isAuthenticated: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
}, { timestamps: true })

userSchema.path('email').set(function (email) {
    if (!this.picture || this.picture.indexOf('https://gravatar.com') === 0) {
        const hash = crypto.createHash('md5').update(email).digest('hex')
        this.picture = `https://gravatar.com/avatar/${hash}?d=identicon`
    }

    return email
})

export const defaultSelection = '<%_ if (defaultAuth) {_%>username <%_ } _%> name email website role picture isActive stripeCustomerId createdAt'
export const minSelection = '<%_ if (defaultAuth) {_%>username <%_ } _%> name email'

<%_ if (defaultAuth) {_%>
userSchema.plugin(passportLocalMongoose);
<%_ } else { _%>
userSchema.plugin(passportLocalMongooseEmail, {
  usernameField: 'email'
});
<%_ } _%>
const model = mongoose.model('User', userSchema)
export default model
