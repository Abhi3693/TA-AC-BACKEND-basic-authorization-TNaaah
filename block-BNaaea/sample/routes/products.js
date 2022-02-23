let express = require('express');
let Product = require('../models/Product');
const User = require('../models/User');
const Comment = require('../models/Comment');
let auth = require('../middlewares/auth');

let router = express.Router();

router.get('/dashboard', (req, res, next) => {
  let products = [];
  let users = [];
  Product.find(req.query)
    .then((allProducts) => {
      products = allProducts;
      return User.find({});
    })
    .then((allUsers) => {
      users = allUsers;
      return Product.find().distinct('category');
    })
    .then((categories) => {
      let err = req.flash('error');
      res.render('dashboard', { products, users, categories, err });
    });
});

router.get('/addProduct', auth.isAdmin, (req, res, next) => {
  res.render('addProduct');
});

router.post('/new', auth.isAdmin, (req, res, next) => {
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

router.use(auth.isAdmin);

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
