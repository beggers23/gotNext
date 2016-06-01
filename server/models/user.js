var express = require('express');
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var crypto = require('crypto');


var UserSchema = mongoose.Schema({
  facebookID: { type: String },
  displayName: { type: String },
  token: {type: String},
  homecourt: {type: String}
},{ timestamps: true });


// UserSchema.methods.authenticate = function(passwordTry){
//   return bcrypt.compareSync(passwordTry, this.password);
// };

module.exports = mongoose.model('User', UserSchema);
