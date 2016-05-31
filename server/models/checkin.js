var mongoose = require('mongoose');

var checkinSchema = mongoose.Schema({
  court_id: {type: String},
  user_id: {type: String},
  facebook_id: {type: String}
});


var Checkin = mongoose.model('Checkin', checkinSchema);


module.exports = Checkin;
