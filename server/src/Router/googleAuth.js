const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();


router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/oauth/failureRedirect' }),
  (req, res) => {
    const token = jwt.sign({ userId: req.user._id }, process.env.SECRET, { expiresIn: '1h' });
    const redirectUrl = `${process.env.FRONTEND_URL}/oauth?token=${token}&userName=${req.user.username}`;
    console.log('redirectUrl', redirectUrl);
    res.redirect(redirectUrl);
  }
);

router.get('/failureRedirect', (req, res) => {
  res.send('<h1>Failure Authenticating with Google</h1>');
});

module.exports = router;
