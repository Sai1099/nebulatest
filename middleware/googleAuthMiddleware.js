// googleAuthMiddleware.js

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/callback'
  },
  (accessToken, refreshToken, profile, done) => {
    console.log('Access Token:', accessToken);
    console.log('Refresh Token:',refreshToken);
    const user = {
      username: profile.displayName,
      emails: profile.emails,
      // Add any other relevant user information
    };
    
    return done(null, user);
  }
));

module.exports = passport.authenticate('google', { scope: ['profile', 'email'] });
