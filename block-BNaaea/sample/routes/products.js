let express = require('express');
let Product = require('../models/Product');
const User = require('../models/User');
const Comment = require('../models/Comment');

let router = express.Router();

router.get('/dashboard', (req, res, next) => {
  Product.find(req.query, (err, products) => {
    if (err) return next(err);
    User.find({}, (err, users) => {
      if (err) return next(err);

      Product.find().distinct('category', (err, categories) => {
        if (err) return next(err);
        err = req.flash('error');
        return res.render('dashboard', { products, users, categories, err });
      });
    });
  });
});

router.get('/addProduct', (req, res, next) => {
  if (req.user.role === 'admin') {
    res.render('addProduct');
  } else {
    req.flash('error', 'Only Admin can add product');
    res.redirect('/products/dashboard');
  }
});

router.post('/new', (req, res, next) => {
  Product.create(req.body, (err, product) => {
    if (err) return next(err);
    res.redirect('/products/' + product._id);
  });
});

router.get('/:id', (req, res, next) => {
  let id = req.params.id;
  Product.findById(id)
    .populate('comments')
    .exec((err, product) => {
      if (err) return next(err);
      err = req.flash('error');
      res.render('productDetails', { product, err });
    });
});

router.post('/:id/comments', (req, res, next) => {
  let id = req.params.id;
  req.body.product = req.params.id;
  req.body.author = req.user._id;
  Comment.create(req.body, (err, comment) => {
    if (err) return next(err);
    Product.findByIdAndUpdate(
      id,
      { $push: { comments: comment._id } },
      { new: this.true },
      (err, product) => {
        if (err) return next(err);
        res.redirect('/products/' + product.id);
      }
    );
  });
});

router.get('/:id/likes', (req, res, next) => {
  let id = req.params.id;
  Product.findByIdAndUpdate(
    id,
    { $inc: { likes: 1 } },
    { new: this.true },
    (err, product) => {
      if (err) return next(err);
      res.redirect('/products/' + product.id);
    }
  );
});

router.get('/:id/delete', (req, res, next) => {
  let id = req.params.id;
  Product.findByIdAndDelete(id, (err, product) => {
    if (err) return next(err);
    res.redirect('/products/dashboard');
  });
});

router.get('/:id/edit', (req, res, next) => {
  let id = req.params.id;
  Product.findById(id, (err, product) => {
    if (err) return next(err);
    res.render('updateProduct', { product });
  });
});

router.post('/:id/edit', (req, res, next) => {
  let id = req.params.id;
  Product.findByIdAndUpdate(id, req.body, { new: true }, (err, product) => {
    if (err) return next(err);
    res.redirect('/products/' + product.id);
  });
});

module.exports = router;
