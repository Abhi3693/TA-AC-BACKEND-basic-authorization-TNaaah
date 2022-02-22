let User = require("../models/User");

module.exports = {
  isUserLogged : (req,res,next)=>{
    if (req.session && req.session.userId) {
      next();
    } else {
      req.flash("error", "Needs login first");
      res.redirect("/users/login");
    }
  },

  userInfo: (req,res,next)=>{
    var userId = req.session && req.session.userId;
    // console.log(userId, "===userId=========");

    if (userId) {
      User.findById(userId, ["firstName", "lastName"], (err, user)=>{
        // console.log(user, "============");
        if(err) return next(err);
        req.user = user;
        res.locals.user = user;
        next();
      });
    } else {
      req.user = null;
      res.locals.user = null;
      next();
    }
  }
}