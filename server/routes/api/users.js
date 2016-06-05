var express = require('express');
var userRouter = express.Router();
var User = require('../../models/user.js');


userRouter.get('/', function(req, res){
  User.find({}, function(err, users){
    res.json({ users: users });
  })
});

userRouter.get('/:facebookID', function(req, res){
  User.find({ facebookID: req.params.facebookID }, function(err, user){
    res.json({user: user });
  })
})


userRouter.post('/', function(req, res){
  User.create(req.body.user, function(err, user){
    res.json({ user: user });
  })
})

userRouter.put('/:id', function(req, res){
  User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
    res.json( user );
  });
});


module.exports = userRouter;
