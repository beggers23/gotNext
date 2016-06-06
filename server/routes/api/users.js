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
  });
})


userRouter.post('/', function(req, res){
  User.create(req.body.user, function(err, user){
    res.json({ user: user });
  })
})

userRouter.put('/:facebookID', function(req, res){
  console.log( req.body );
  User.findOneAndUpdate( { facebookID: req.params.facebookID }, req.body, {new: true}, function(err, user){
    res.json( user );
  });
});


userRouter.delete('/:facebookID', function(req, res){
  User.findOneAndDelete({facebookID: req.params.facebookID }, function( err ){
    console.log(' we dead ');
  })
})

module.exports = userRouter;
