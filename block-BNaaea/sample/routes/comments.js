let express = require('express');
let Comment = require('../models/Comment');
let auth = require('../middlewares/auth');

let router = express.Router();

router.get('/:id/edit', (req, res, next) => {
  let id = req.params.id;
  Comment.findById(id, (err, comment) => {
    if (err) return next(err);
    let userid = String(req.user._id);
    let authorid = String(comment.author);
    if (userid === authorid) {
      res.render('updateComment', { comment });
    } else {
      req.flash('error', 'Only Author can edit comment');
      res.redirect('/products/' + comment.product);
    }
  });
});

router.post('/:id/edit', (req, res, next) => {
  let id = req.params.id;
  Comment.findByIdAndUpdate(id, req.body, { new: true }, (err, comment) => {
    if (err) return next(err);
    res.redirect('/products/' + comment.product);
  });
});

router.get('/:id/delete', (req, res, next) => {
  let id = req.params.id;
  Comment.findById(id, (err, comment) => {
    if (err) return next(err);
    let userid = String(req.user._id);
    let authorid = String(comment.author);
    if (userid === authorid) {
      Comment.findByIdAndDelete(id, (err, comment) => {
        if (err) return next(err);
        res.redirect('/products/' + comment.product);
      });
    } else {
      req.flash('error', 'Only Author can delete comment');
      res.redirect('/products/' + comment.product);
    }
  });
});

module.exports = router;
