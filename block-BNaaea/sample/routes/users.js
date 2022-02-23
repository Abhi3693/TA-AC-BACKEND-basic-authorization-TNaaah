var express = require('express');
var router = express.Router();
let User = require('../models/User');
let Comment = require('../models/Comment');
let auth = require('../middlewares/auth');
const { render } = require('../app');

// Rendering login form
router.get('/login', (req, res, next) => {
  let err = req.flash('error');
  res.render('login', { err });
});

// Rendering register form
router.get('/register', (req, res, next) => {
  let err = req.flash('error');

  res.render('register', { err });
});

// Fetching register data
router.post('/register', (req, res, next) => {
  User.create(req.body, (err, singleUser) => {
    if (err) {
      req.flash('error', 'username, email, password-minlength-3 required');
      res.redirect('/users/register');
    } else {
      return res.redirect('/users/' + singleUser.id);
    }
  });
});

// Fetching login data
router.post('/login', (req, res, next) => {
  let { email, password } = req.body;
  if (!email && !password) {
    req.flash('error', 'Email/password required');
    res.redirect('/users/login');
  } else {
    User.findOne({ email }, (err, singleUser) => {
      if (err) return next(err);
      if (singleUser) {
        if (singleUser.isBlocked) {
          req.flash('error', 'User is blocked');
          return res.redirect('/users/login');
        } else {
          singleUser.verifypassword(password, (err, result) => {
            if (err) return next(err);

            if (result) {
              req.session.userId = singleUser._id;
              return res.redirect('/users/' + singleUser.id);
            } else {
              req.flash('error', 'Enter valid password required');
              return res.redirect('/users/login');
            }
          });
        }
      } else {
        req.flash('error', 'Enter valid email');
        return res.redirect('/users/login');
      }
    });
  }
});

router.use(auth.isLoggedUser);

router.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/users/login');
});

router.get('/all', (req, res, next) => {
  User.find({ role: 'user' }, (err, users) => {
    if (err) return next(err);
    res.render('allUsers', { users });
  });
});

router.get('/myBag', (req, res, next) => {
  let userId = req.user._id;
  User.findById(userId)
    .populate('bag')
    .exec((err, user) => {
      if (err) return next(err);
      res.render('myBag', { user });
    });
});

router.get('/', (req, res, next) => {
  let id = req.query.name;
  User.findById(id, (err, user) => {
    if (err) return next(err);
    res.render('users', { user });
  });
});

router.get('/block', (req, res, next) => {
  User.findByIdAndUpdate(
    req.query.id,
    { isBlocked: true },
    (err, singleUser) => {
      if (err) return next(err);
      res.redirect('/users/' + singleUser.id);
    }
  );
});

router.get('/unblock', (req, res, next) => {
  User.findByIdAndUpdate(
    req.query.id,
    { isBlocked: false },
    (err, singleUser) => {
      if (err) return next(err);
      res.redirect('/users/' + singleUser.id);
    }
  );
});

router.get('/addBag/:id', (req, res, next) => {
  let productId = req.params.id;

  User.findByIdAndUpdate(
    req.user._id,
    { $push: { bag: productId } },
    { new: true },
    (err, user) => {
      if (err) return next(err);
      res.redirect('/products/' + productId);
    }
  );
});

// Rendering Single user
router.get('/:id', (req, res, next) => {
  let id = req.params.id;
  User.findById(id, (err, singleUser) => {
    if (err) return next(err);
    res.render('users', { singleUser });
  });
});

module.exports = router;
