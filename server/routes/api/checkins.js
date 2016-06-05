var express = require('express');
var checkinRouter = express.Router();
var Checkin = require('../../models/checkin.js');


checkinRouter.get('/', function(req, res, next){
  Checkin.find({}, function(err, checkins){
    res.json( checkins );
  })
})


checkinRouter.post('/', function(req, res){
  Checkin.create( req.body, function(err, checkin){
    res.json( {checkin: checkin} );
  })
})


checkinRouter.delete('/:id', function(req, res){
  Checkin.delete(req.params.id, function(err, checkin){
    console.log('deleted');
  });
});


module.exports = checkinRouter;
