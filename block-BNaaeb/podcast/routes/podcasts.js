var express = require('express');
let Podcast = require('../Models/Podcast');
let auth = require('../middlewares/auth');
var router = express.Router();

/* GET home page. */

router.get('/addPodcast', (req, res, next) => {
  res.render('addPodcast');
});

router.get('/all', (req, res, next) => {
  let error = req.flash('error');

  if (req.user.isAdmin) {
    Podcast.find({}, (err, podcasts) => {
      if (err) return next(err);
      res.render('allPodcast', { podcasts, error });
    });
  } else {
    if (req.user.member === 'free') {
      Podcast.find({ section: 'free', isVarified: true }, (err, podcasts) => {
        if (err) return next(err);
        res.render('allPodcast', { podcasts, error });
      });
    } else if (req.user.member === 'vip') {
      Podcast.find(
        { section: ['free', 'VIP'], isVarified: true },
        (err, podcasts) => {
          if (err) return next(err);
          res.render('allPodcast', { podcasts, error });
        }
      );
    } else if (req.user.member === 'premium') {
      Podcast.find({ isVarified: true }, (err, podcasts) => {
        if (err) return next(err);
        res.render('allPodcast', { podcasts, error });
      });
    }
  }
});

router.get('/:id', (req, res, next) => {
  let id = req.params.id;
  Podcast.findById(id, (err, podcast) => {
    if (err) return next(err);
    res.render('podcastDetails', { podcast });
  });
});

router.post('/addPodcast', (req, res, next) => {
  if (req.user.isAdmin) {
    req.body.isVarified = true;
  } else {
    req.body.section = 'free';
    req.body.isVarified = false;
  }
  Podcast.create(req.body, (err, podcast) => {
    if (err) return next(err);
    res.redirect('/podcasts/' + podcast._id);
  });
});

router.use(auth.isAdmin);

router.get('/:id/edit', (req, res, next) => {
  let id = req.params.id;
  Podcast.findById(id, (err, podcast) => {
    if (err) return next(err);
    res.render('updatePodcast', { podcast });
  });
});

router.post('/:id/edit', (req, res, next) => {
  let id = req.params.id;
  Podcast.findByIdAndUpdate(id, req.body, { new: true }, (err, podcast) => {
    if (err) return next(err);
    res.redirect('/podcasts/' + podcast._id);
  });
});

router.get('/:id/delete', (req, res, next) => {
  let id = req.params.id;
  Podcast.findByIdAndDelete(id, (err, podcast) => {
    if (err) return next(err);
    res.redirect('/podcasts/all');
  });
});

module.exports = router;
