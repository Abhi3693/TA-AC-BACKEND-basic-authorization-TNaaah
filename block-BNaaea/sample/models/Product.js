let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let productSchema = new Schema({
  name:{type:String, required:true},
  price:{type:String, required:true},
  img:{type:String},
  quantity:{type:Number},
  likes:{type:Number, default:0},
  comments:[{type:Schema.Types.ObjectId, ref:"Comment"}],
  category:[{type:String}],
});

let Product = mongoose.model("Product", productSchema);

module.exports = Product;

