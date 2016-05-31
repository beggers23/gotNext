var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var dotEnv = require('dotenv').config();
var app = express();
var path = require('path');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var session = require('express-session');

var User = require('./server/models/user.js');
var Checkin = require('./server/models/checkin.js');

mongoose.connect( process.env.MONGOLAB_URI || "mongodb://localhost/gotNext" )

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'client/public/views'));
app.use(express.static(__dirname + '/client/public/'));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());


passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: 'http://localhost:3000/auth/facebook/callback'
  },
  function(accessToken, refreshToken, profile, done){
    // User.findOne({ 'facebookID': profile.id }, function(err, user) {
    //   if (err){
    //     return done(err);}
    //   if (user) {
    //     return done(null, user)} // user found, return that user
    //   else {
    //     // if there is no user found with that facebook id, create them
        var newUser = {
          facebookID: profile.id,
          displayName: profile.displayName,
          token: accessToken
        }

        User.create(newUser, function(err, user){
          if(err){ return done(err)}
          return done(null, user);
        });
  //     }
  //  });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  User.findById(user.id, function(err, user){
    done(err, user);
  });
});


app.get('/', function(req, res){
  res.render('index');
});

app.get('/login', function(req, res){
  res.render('login');
});

app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['public_profile', 'email', 'user_friends']}));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/profile', failureRedirect: '/login' })
)

app.get('/profile', function(req, res){
  res.render('profile', {user: req.user});
});

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.get('/api/users', function(req, res, next){
  User.find( function(err, users){
    res.json( users );
  });
});


//TODO Need to solve the Checkins issue
app.get('/api/checkins', function(req, res, next){
  Checkin.find(function(err, checkins){
    res.json( checkins );
  })
})

//TODO Need to solve the Checkins issue
app.post('/api/checkins', function(req, res, next){
  console.log( req );
  // Checkin.create( req.body , function( err, checkin){
  //   res.json({ checkin: checkin });
  // });
});

var port = process.env.PORT || 3000;

app.listen( port, function(){
  console.log( 'listening in on port '+port);
})
