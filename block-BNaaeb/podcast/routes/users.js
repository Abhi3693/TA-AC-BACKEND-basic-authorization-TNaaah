var express = require('express');
let User = require("../Model/User");
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get("/register", (req,res,next)=>{
  let error = req.flash("error");
  res.render("register", {error});
});

router.get("/login", (req,res,next)=>{
  let error = req.flash("error");
  res.render("login", {error});
});

router.post("/login", (req,res,next)=>{
  let {email, password} = req.body;
  if(!email && !password) {
    req.flash("error", "Email/password required");
    res.redirect("/users/login");
  } else {
    User.findOne({email}, (err, user)=>{
      if(err) {
        req.flash("error", err);
        return res.redirect("/users/login");
      }
      if(user) {
        user.varifypassword(password, (err,result)=>{
          if(err) {
            req.flash("error", "Password validation failed");
            return res.redirect("/users/login");
          }
          if(result) {
            req.session.userId = user._id;
            res.redirect("/users/" + user._id);
          } else {
            req.flash("error", "Enter Valid password");
            return res.redirect("/users/login");
          }
        });
      } else {
        req.flash("error", "Enter valid Email");
        return res.redirect("/users/login");
      }
    });
  }
});

router.post("/register", (req,res,next)=>{
  User.create(req.body, (err, user)=>{
    if(err) {
      req.flash("error", "Username,email,password required");
      res.redirect("/users/register");
    } else {
      res.redirect("/users/login");
    }
  });
});

router.get("/:id", (req,res,next)=>{
  console.log(req.session,"==SESSION==");
  console.log(req.user,"==USER==");
  let id = req.params.id;
  User.findById(id, (err, singleUser)=>{
    if(err) return next(err);
    res.render("userDetails", {singleUser});
  });
});

module.exports = router;
