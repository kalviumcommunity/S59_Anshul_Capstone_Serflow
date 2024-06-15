require('dotenv').config();
const passport = require('passport');
const User = require('../Models/userSchema');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async function(accessToken, refreshToken, profile, done) {
    try {
      let user = await User.findOne({ email: profile.emails[0].value });

      if (user) {
        return done(null, user);
      } 

      const newUser = new User({
        username: profile.displayName,
        email: profile.emails[0].value,
        oauthId: profile.id,
        image : profile.photos[0].value,
        isVerified : true
      });

      user = await newUser.save();
      return done(null, user);

    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(async function(id, done) {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
});
