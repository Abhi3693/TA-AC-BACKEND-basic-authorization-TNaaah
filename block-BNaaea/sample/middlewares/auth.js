const User = require('../models/User');

module.exports = {
  isLoggedUser: (req, res, next) => {
    if (req.session && req.session.userId) {
      next();
    } else {
      req.flash('error', 'Needs login First');
      res.redirect('/users/login');
    }
  },
  userInfo: (req, res, next) => {
    let userId = req.session && req.session.userId;

    if (userId) {
      User.findById(userId, ['username', 'email', 'role'], (err, user) => {
        if (err) return next(err);
        req.user = user;
        res.locals.user = user;
        next();
      });
    } else {
      req.user = null;
      res.locals.user = null;
      next();
    }
  },
  isAdmin: (req, res, next) => {
    if (req.user.role === 'admin') {
      next();
    } else {
      req.flash('error', 'Only admin have Authority');
      res.redirect('/products/dashboard');
    }
  },
  isBlocked: (req, res, next) => {
    if (req.user.isBlocked) {
      next();
    } else {
      req.flash('error', 'User is blocked');
      res.redirect('/users/login');
    }
  },
  loginCheck: (req, res, next) => {
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
  },
};
