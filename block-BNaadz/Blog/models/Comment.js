let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let commentSchema = new Schema({
  article:{type:Schema.Types.ObjectId, ref:"Article", required:true},
  text:String,
  likes:{type:Number, default:0},
  slug:String,
  author:{type:Schema.Types.ObjectId, ref:"User", required:true},
});

let Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;