var express = require('express');
var router = express.Router();
var session = require('express-session');
var passport = require('../lib/passportStrategy.js');
var User = require('../models/user.js');


router.get('/', function(req, res){
  res.render('index');
});

// router.get('/auth/facebook', passport.authenticate('facebook', {session: true, scope: ['email','user_friends','public_profile']} ));
//
// router.get('/auth/facebook/callback', passport.authenticate('facebook', {session: true, successRedirect: '/profile', failureRedirect: '/login' } ));
//
// router.get('/user', function(req, res){
//   res.send({user: req.user});
// })

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
})

module.exports = router;
