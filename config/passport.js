const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
//Loading Model
const User = mongoose.model('users');
const keys = require('./keys');

module.exports = function (passport) {
  passport.use(new GoogleStrategy({
    clientID: keys.googleClientId,
    clientSecret: keys.googleClientSecret,
    callbackURL: "/auth/google/callback",
    proxy: true
  },
    function (accessToken, refreshToken, profile, done) {
      const imagepath = profile.photos[0].value.substring(0, profile.photos[0].value.indexOf('?')) || profile.photos[0].value;
      const newUser = {
        googleId: profile.id,
        email: profile.emails[0].value,
        firstname: profile.name.givenName,
        lastname: profile.name.familyName,
        image: imagepath
      };
      //Check Existing User
      User.findOne({ googleId: profile.id })
        .then(user => {
          if (user) {
            //Return User
            done(null, user);
          }
          else {
            //Create User
            new User(newUser)
              .save()
              .then(user => done(null, user))
              .catch(err => console.log(err));
          }
        })
        .catch(err => console.log(err));
    }
  ));
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
}