var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var User = require("../models/userMod");

// In server.js require('./config/passport')(passport) is expecting a function
module.exports = function(passport) {

  // Serialize the user.id and save in a cookie in the session
  passport.serializeUser(function(user, done) {
    console.log('serializeUser running')
    done(null, user._id);
  })

  // Deserialise the id, and use the id to find a user
  passport.deserializeUser(function(id, done){
    console.log('deserializeUser running')
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use('local-signup', new LocalStrategy({
    usernameField : 'local.username',
    passwordField : 'local.password',
    passReqToCallback : true
  }, function(req, username, password, done) {
    process.nextTick(function() {
      User.findOne({ 'local.username':  username }, function(err, user) {
        if (err) return done(err);
        if (user) {
          console.log('DUPLICATE USER LOLZ')
          return done(null, false, 'This username already exists, innit');
        } else {
          var newUser = new User();
          newUser.local.username = username;
          newUser.local.password = newUser.encrypt(password);
          newUser.local.is_admin = 0;
          newUser.local.status = 1;
          console.log('RoHo says: ' + newUser);
          newUser.save(function(err) {
            if (err) throw err;
            return done(null, newUser, 'User added to DB');
          });
        }
      });
    });
  }));

  passport.use('local-login', new LocalStrategy({
    usernameField : 'local.username',
    passwordField : 'local.password',
    passReqToCallback : true
  }, function(req, username, password, done){
    // Search for a user with an email from the login form
    User.findOne({ 'local.username' : username }, function(err, user) {
      if (err) { return done(err) };
      // If no user has been found
      if (!user) {
        return done(null, false, 'No user found')
      };
      // If password is invalid
      if (!user.validPassword(password)) {
        return done(null, false, 'user password incorrect');
      } 
      // User has been authenticated, return user
      return done(null, user, 'login proceedure passed');
    });
  }));
}