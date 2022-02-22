let mongoose = require("mongoose");
let slugger = require("slugger");
let Schema = mongoose.Schema;

let articleSchema = new Schema({
  title:{type:String, required:true},
  description:{type:String},
  likes:{type:Number, default:0},
  comments:[{type:Schema.Types.ObjectId, ref:"Comment"}],
  author:{type:Schema.Types.ObjectId, ref:"User",required:true},
  slug:{type:String, unique:true},
});

articleSchema.pre("save", function (next) {
  if(this.title){
    this.slug = slugger(this.title);
    return next();
  } else {
    return next();
  }
});

let Article = mongoose.model("Article", articleSchema);

module.exports = Article; 