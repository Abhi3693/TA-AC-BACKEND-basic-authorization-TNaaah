var express = require('express');
let User = require('../Models/User');
let Podcast = require('../Models/Podcast');
let auth = require('../middlewares/auth');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', (req, res, next) => {
  let error = req.flash('error');
  res.render('register', { error });
});

router.post('/register', (req, res, next) => {
  User.create(req.body, (err, user) => {
    if (err) {
      req.flash('error', 'Username,email,password required');
      res.redirect('/users/register');
    } else {
      res.redirect('/users/login');
    }
  });
});

router.get('/login', (req, res, next) => {
  let error = req.flash('error');
  res.render('login', { error });
});

router.post('/login', (req, res, next) => {
  let { email, password } = req.body;
  if (!email && !password) {
    req.flash('error', 'Email/password required');
    res.redirect('/users/login');
  } else {
    User.findOne({ email }, (err, user) => {
      if (err) {
        req.flash('error', err);
        return res.redirect('/users/login');
      }
      if (user) {
        user.verifypassword(password, (err, result) => {
          if (err) {
            req.flash('error', 'Password validation failed');
            return res.redirect('/users/login');
          }
          if (result) {
            req.session.userId = user._id;
            res.redirect('/podcasts/all');
          } else {
            req.flash('error', 'Enter Valid password');
            return res.redirect('/users/login');
          }
        });
      } else {
        req.flash('error', 'Enter valid Email');
        return res.redirect('/users/login');
      }
    });
  }
});

router.use(auth.isloggedUser);

router.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.clearCookie();
  res.redirect('/users/login');
});

router.use(auth.isAdmin);

router.get('/all', (req, res, next) => {
  User.find({}, (err, users) => {
    if (err) return next(err);
    res.render('allUsers', { users });
  });
});

router.get('/:id', (req, res, next) => {
  let id = req.params.id;
  User.findById(id, (err, singleUser) => {
    if (err) return next(err);
    res.render('userDetails', { singleUser });
  });
});

module.exports = router;
