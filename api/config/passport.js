const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('User');

passport.use(new LocalStrategy({
      usernameField: 'email'
    },
    function (username, password, done) {
      User.findOne({ email: username }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, {
            message: 'Email or password is incorrect'
          });
        }
        if (!user.validPassword(user, password)) {
          return done(null, false, {
            message: 'Email or password is incorrect'
          });
        }
        return done(null, user);
      });
    }
));