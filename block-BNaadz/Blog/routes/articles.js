var express = require('express');
let Article = require("../models/Article");
var router = express.Router();
var auth = require("../middlewares/auth");
let Comment = require("../models/Comment");

/* GET home page. */


// All Articles list
router.get('/', function(req, res, next) {
  console.log(req.query, "Req.Querry ============")
  Article.find(req.query, (err, articles)=>{
    if(err) return next(err);
    res.render('articles', {articles});
  });
});


//  New Article form
router.get('/new', auth.isUserLogged, function(req, res, next) {
  res.render('addArticle');
});


//  Article Details

router.get("/:slug", (req,res,next)=>{
  let slug = req.params.slug;
  let errMsg = req.flash("error")
  Article.findOne({slug}).populate("comments").populate("author").exec((err, article)=>{
    if(err) return next(err);
    res.render("articleDetails", {article, errMsg});
  });

});






router.use(auth.isUserLogged);


// Add new Article

router.post('/', function(req, res, next) {
  req.body.author = req.user._id;
    Article.create(req.body, (err, article)=>{
      if(err) return next(err);
      res.redirect("/articles/" + article.slug);
  });
});


// Like article
router.get("/:slug/likes", (req,res,next)=>{
  let slug = req.params.slug;
  Article.findOneAndUpdate({slug}, {$inc: {likes: 1}}, {new:true}, (err, article)=>{
    if(err) return next(err);
    res.redirect("/articles/"+ slug);
  });
});

// Edit Article form

router.get("/:slug/edit", (req,res,next)=>{
  let slug = req.params.slug;
  Article.findOne({slug, author:req.user._id }, (err, article)=>{
    if(err) return next(err);
    if(article) {
      return res.render("updateArticle", {article});
    } else {
      req.flash("error", "Only Author can Edit Article.");
      return res.redirect("/articles/" + slug);
    }
  });

});

// Edit Article 

router.post("/:slug/edit", (req,res,next)=>{
  let slug = req.params.slug;
  Article.findOneAndUpdate({slug, author:req.user._id }, req.body, {new:true},(err, article)=>{
    if(err) return next(err);
    if(article) {
    res.redirect("/articles/" + slug );
    } else {
      req.flash("error", "Only Author can Edit Article.");
      return res.redirect("/articles/" + slug);
    }
  });
});




// Comment on Article
router.post("/:slug/comment", (req,res,next)=>{
    let slug = req.params.slug;
    Article.findOne({slug}, (err, article)=>{
      if(err) return next(err);
      req.body.article = article._id;
      req.body.slug = slug;
      req.body.author=req.user._id;
      Comment.create(req.body, (err,comment)=>{
        if(err) return next(err);
        Article.findOneAndUpdate({slug}, { $push: {comments: comment._id }}, (err, article)=>{
          if(err) return next(err);
          res.redirect("/articles/"+ slug);
        });
      });
    });
});

// Delete Article

router.get("/:slug/delete", (req,res,next)=>{
    let slug = req.params.slug;
    Article.findOneAndDelete({slug, author:req.user._id },(err,article)=>{
      if(err) return next(err);
      if(article) {
        Comment.deleteMany({article:article._id}, (err, comments)=>{
          if(err) return next(err);
          res.redirect("/articles");
        });
      } else {
        req.flash("error", "Only Author can Delete Article.");
        return res.redirect("/articles/" + slug);
      }
    });
});



module.exports = router;