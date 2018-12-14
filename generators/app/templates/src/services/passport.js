import passport from 'passport'
import local from 'passport-local'
const LocalStrategy = local.Strategy
import User from '../api/users/model'

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());