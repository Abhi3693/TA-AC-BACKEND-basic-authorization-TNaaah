let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let podcastSchema = new Schema({
  name:{type:String, required:true},
  section:{type:String, default:free},
  category:{type:String},
  isVarified:{type:Boolean, default:false},
});

let Podcast = mongoose.model("Podcast", podcastSchema);

module.exports = Podcast;
