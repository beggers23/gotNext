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



passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: 'http://localhost:3000/auth/facebook/callback'
  },
  function(accessToken, refreshToken, profile, done){
    User.findOne({ 'facebookID': profile.id }, function(err, user) {
      if (err){
        return done(err);}
      if (user) {
        console.log('found one');
        return done(null, user)} // user found, return that user
      else {
        // if there is no user found with that facebook id, create them
        var newUser = {
          facebookID: profile.id,
          displayName: profile.displayName,
          token: accessToken
        }

        User.create(newUser, function(err, user){
          if(err){ return done(err)}
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


mongoose.connect( process.env.MONGODB_URI || "mongodb://localhost/gotNext" )

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'client/public/views'));
app.use(express.static(__dirname + '/client/public/'));


app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({secret: 'tacos', resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());


app.get('/', function(req, res){
  res.render('index');
});

app.get('/login', function(req, res){
  res.render('login');
});

app.get('/auth/facebook', passport.authenticate('facebook', {session: true, scope: ['public_profile', 'email', 'user_friends']}));

app.get('/auth/facebook/callback',passport.authenticate('facebook', {session: true ,  successRedirect: '/profile', failureRedirect: '/login'}));

app.get('/user', function(req, res){
  res.send({ user: req.user });
})
app.get('/profile', function(req, res){
  res.locals.user = req.user
  res.render('profile');
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

app.put('/api/users/:id', function(req, res, next){
  User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
    res.json( user );
  })
})

app.get('/api/checkins', function(req, res, next){
  Checkin.find(function(err, checkins){
    res.json( checkins );
  })
})

app.post('/api/checkins', function(req, res, next){
  Checkin.create( req.body , function( err, checkin){
    res.json({ checkin: checkin });
  });
});

app.delete('/api/checkins', function(req, res, next){
  var currentTime = new Date.now();
  var threeHoursAgo = new Date.now() - (3 * 60 * 60 * 1000);
  Checkin.delete({created_at: threeHoursAgo}, function(err){
    if(err){ return err }
    console.log( 'deleted' );
  }) // Time minus 3 hours
})

var port = process.env.PORT || 3000;

app.listen( port, function(){
  console.log( 'listening in on port '+port);
})
