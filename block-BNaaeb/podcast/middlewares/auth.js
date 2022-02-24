const User = require('../Models/User');

module.exports = {
  isloggedUser: (req, res, next) => {
    if (req.session && req.session.userId) {
      next();
    } else {
      req.flash('error', 'Needs login first');
      res.redirect('/users/login');
    }
  },
  userInfo: (req, res, next) => {
    let userId = req.session && req.session.userId;
    if (userId) {
      User.findById(
        userId,
        ['username', 'email', 'isAdmin', 'member'],
        (err, user) => {
          if (err) return next(err);
          req.user = user;
          res.locals.user = user;
          next();
        }
      );
    } else {
      req.user = null;
      res.locals.user = null;
      next();
    }
  },
  isAdmin: (req, res, next) => {
    let userId = req.session && req.session.userId;
    User.findById(userId, (err, user) => {
      if (err) return next(err);
      console.log(user);
      if (user) {
        if (user.isAdmin) {
          next();
        } else {
          req.flash('error', 'Only Admin have Authority');
          res.redirect('/podcasts/all');
        }
      } else {
        req.flash('error', 'Needs login First');
        res.redirect('/users/login');
      }
    });
  },
};
