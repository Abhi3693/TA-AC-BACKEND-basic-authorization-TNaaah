let mongoose = require('mongoose');
let bcrypt = require('bcrypt');

let Schema = mongoose.Schema;

let commentSchema = new Schema({
  text: { type: String, required: true },
  product: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
  author: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
});

let Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
