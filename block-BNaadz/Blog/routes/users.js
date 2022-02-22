var express = require('express');
let Article = require("../models/Article");
let User = require("../models/User");
var auth = require("../middlewares/auth");
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', function(req, res, next) {
  let err = req.flash("error")
  res.render("login", {err});
});

router.get('/register', function(req, res, next) {
  let err = req.flash("error");
  res.render("register", {err});
});

router.post('/register', function(req, res, next) {
  User.create(req.body, (err, user)=>{
    if(err){
      if(err.code === 11000) {
        req.flash("error", "Enter uniqe Email");
        return res.redirect("/users/register");
      } else {
        req.flash("error", "Validation error, require- firstName, lastName, email(unique), password-5-length")
        return res.redirect("/users/register")
      } 
    } else {
      return res.render("dashboard", { user });
    }
  });
});

router.post('/login', function(req, res, next) {
  let {email, password} = req.body;
  if(!email && !password) {
    req.flash("error", "Email/password is required to login");
    return res.redirect("/users/login")
  } else {
    User.findOne({email}, (err,user)=>{
      if(err) return next(err);

      // console.log(user, "USER");

      if(user) {
        user.verifypassword(password, (err, result)=>{
          if(err) return next(err);
          if(result) {
            req.session.userId = user._id
            return res.render("dashboard", { user });
          } else {
            req.flash("error", "Enter valid Password");
            return res.redirect("/users/login");
          }
        });
      } else {
        req.flash("error", "Use valid email to login");
        return res.redirect("/users/login");
      }
    });
  }
});

router.get("/dashboard", (req,res,next)=>{
  res.render("dashboard");
});

router.get("/logout", (req,res,next)=>{
  req.session.destroy();
  res.clearCookie("connect.sid");
  res.redirect("/users/login");
});

module.exports = router;