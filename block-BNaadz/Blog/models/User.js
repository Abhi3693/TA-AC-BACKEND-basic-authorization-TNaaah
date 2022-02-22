let mongoose = require("mongoose");
let slugger = require("slugger");
let Schema = mongoose.Schema;
let bcrypt = require("bcrypt");

let userSchema = new Schema({
  firstName:{type:String, required:true},
  lastName:{type:String, required:true},
  email:{type:String, unique:true},
  password:{type:String, minlength:5},
  city:String,
});

userSchema.pre("save", function (next) {
  if(this.password && this.isModified("password")) {
    bcrypt.hash(this.password, 10 , (err, hashed)=>{
      if(err) return next(err);
      this.password = hashed;
      return next();
    });
  } else {
    return next();
  }
});

userSchema.methods.verifypassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, result)=>{
    return cb(err, result);
  });
}

userSchema.methods.fullName = function () {
  return this.firstName + " " + this.lastName;
}

let User = mongoose.model("User", userSchema);

module.exports = User; 