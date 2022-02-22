let Comment = require("../models/Comment");
var express = require('express');
let Article = require("../models/Article");
const { default: mongoose } = require("mongoose");
var router = express.Router();

router.get("/:id/likes", (req,res,next)=>{
  let id = req.params.id;
  Comment.findByIdAndUpdate(id,{ $inc: { likes: 1 }}, (err, comment)=>{
    if(err) return next(err);
    res.redirect("/articles/" + comment.slug);
  });
});

router.get("/:id/edit", (req,res,next)=>{
  let id = req.params.id;


  Comment.findById(id, (err,comment)=>{
    if(err) return next(err);

    let commentAuthor = String(comment.author._id)
    let user = String(req.user._id);

    if(commentAuthor === user) {
      if(err) return next(err);
      res.render("updateComment", {comment});
    }else {
      req.flash("error", "Only Author can Edit Comment.");
      return res.redirect("/articles/" + comment.slug);
    }
  });

});

router.post("/:id/edit", (req,res,next)=>{
  let id = req.params.id;
  Comment.findByIdAndUpdate(id, req.body, {new:true}, (err, comment)=>{
    if(err) return next(err);
    res.redirect("/articles/" + comment.slug);
  });
});


router.get("/:id/delete", (req,res,next)=>{
  let id = req.params.id;

  Comment.findById(id, (err,comment)=>{
    if(err) return next(err);

    let commentAuthor = String(comment.author._id)
    let user = String(req.user._id);

    if(commentAuthor === user) {
      Comment.findByIdAndDelete(id, (err, comment) =>{
        if(err) return next(err);
        res.redirect("/articles/" + comment.slug);
      });
    } else {
      req.flash("error", "Only Author can Delete Comment.");
      return res.redirect("/articles/" + comment.slug);
    }
  });
});

module.exports = router;