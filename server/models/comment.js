var mongoose = require('mongoose');


var commentSchema = mongoose.Schema({
  court_id: { type: String},
  user_id: {type: String },
  content: {type: String },
  score: {type: Number}
}, { timestamps: true });


var Comment = mongoose.model('Comment', commentSchema);


module.exports = Comment;
