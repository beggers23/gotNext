var express = require('express');
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var crypto = require('crypto');


var UserSchema = mongoose.Schema({
  facebookID: { type: String },
  displayName: { type: String },
  email: {type: String},
  checkins: {type: Array},
  homecourt: {type: String},
  picture: {type: String},
  friends: {type: Array},
  comments: {type: Array}
},{ timestamps: true });


module.exports = mongoose.model('User', UserSchema);
