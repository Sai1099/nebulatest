// googleAuthMiddleware.js

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/callback'
  },
  (accessToken, refreshToken, profile, done) => {
    console.log('Google Profile:', profile); 
    console.log('Access Token:', accessToken);
    console.log('Refresh Token:',refreshToken);
     // Ensure that the id field represents the googleId
    const { displayName, emails } = profile;
    const email = emails && emails.length > 0 ? emails[0].value : null;

    // Return the user object with the extracted information
    const user = {
      username: displayName || 'User',
      emails: emails,
    };

    return done(null, user);
  }
));

module.exports = passport.authenticate('google', { scope: ['profile', 'email'] });
