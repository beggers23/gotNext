var User = require('../models/user.js');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_SECRET,
  // callbackURL: 'http://localhost:3000/auth/facebook/callback' || 'http://hoopdreamin.herokuapp.com'
  callbackURL: 'http://hoopdreamin.herokuapp.com'
},
  function(accessToken, refreshToken, profile, done){
    User.findOne({'facebookID': profile.id }, function(err, user){
      if(err){
        return done(err);
      }
      if( user ){
        console.log( 'found one' );
        return(null, done);
      }
      else {
        var newUser = {
          displayName: profile.displayName,
          facebookID: profile.id,
          token: accessToken
        }
        User.create( newUser, function(err, user){
          if( err){ return done(err )}
          console.log('created one');
          return done(null, user);
        });
      }
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  User.findById(user._id, function(err, user){
    done(err, user);
  });
});

module.exports= passport;
