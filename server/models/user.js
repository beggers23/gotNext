var express = require('express');
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var crypto = require('crypto');


var UserSchema = mongoose.Schema({
  facebookID: { type: String },
  displayName: { type: String },
  email: {type: String},
  checkins: {type: Array},
  homecourt: {type: String, default: ''},
  picture: {
    data: {
      height: {type: Number},
      is_silhouette: {type: Boolean},
      width: {type: Number },
      url: { type: String }
    }
  },
  friends: [{
    name: {type: String},
    id: {type: String}
  }],
  comments: {type: Array}
},{ timestamps: true });


module.exports = mongoose.model('User', UserSchema);
