const mongoose = require('mongoose');
const passport = require('passport');
const express = require('express');
const session = require('express-session');
const csrf = require('csurf');

const { v4: uuidv4 } = require('uuid');
const app = express();
//const csrf = require('csrf');

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const csrfProtection = csrf();
const path = require('path');
app.set('view engine', 'ejs');
const profileRouter = require('./routes/profile');
const Team = require('../verificationnebula/models/Team.js');
const TeamMember = require('../verificationnebula/models/TeamMember'); // Adjust the path accordingly
const User = require('../verificationnebula/models/team_users.js');
const isAuthenticated = require('../verificationnebula/middleware/isAuthenticated.js');


function generateSecretKey() {
  return uuidv4();
}

// Session configuration
app.use(session({
  secret: generateSecretKey(),
  resave: true,
  saveUninitialized: true
}));



app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// MongoDB connection
mongoose.connect('mongodb+srv://sai:nebula123@cluster0.l9c5xyp.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


app.set('views', path.join(__dirname, 'views'));

// User schema


app.use(passport.initialize());
app.use(passport.session());



app.use('/profile', isAuthenticated);

// Passport configuration
passport.use(
  new GoogleStrategy(
    {
      
    clientID: '772787922-vhcqcla66i15hqduocfgb6c9jga9et09.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:3000/auth/google/callback',
    },async (accessToken, refreshToken, profile, done) => {
     
    
      
      try {
        const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : '';
        const existingUser = await User.findOne({ googleId: profile.id });

        if (existingUser) {
          return done(null, existingUser);
        }

       
        const newUser = new User({
          googleId: profile.id,
          displayName: profile.displayName,
          gmail: email,
        });

        await newUser.save();
        done(null, newUser);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id)
      .exec()
      .then((user) => {
        done(null, user);
      })
      .catch((err) => {
        done(err, null);
      });
  });
// Express middleware

app.use((err, req, res, next) => {
  if (err.code !== 'EBADCSRFTOKEN') return next(err);

  // Handle CSRF token errors here
  res.status(403).send('CSRF Token Error');
});
// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/');
  }
);





  app.get('/verify-and-fetch', (req, res) => {
    const filePath = path.join(__dirname, 'verify-and-fetch.html');
    res.sendFile(filePath);
  });
  app.post('/verify-and-fetch', async (req, res) => {
    try {
      const { collegeName, acceptanceCode } = req.body;
      const userEmail = req.user.gmail;
  
      // Find the teamData based on the user's Gmail, college name, and isVerified condition
      const teamData = await Team.findOne({
        gmail: userEmail,
        collegeName: collegeName, // Filter by college name
        isVerified: true,
      });
  
      if (teamData) {
        const storedAcceptanceCode = teamData.acceptanceCode;
  
        if (acceptanceCode === storedAcceptanceCode) {
          // If teamData is found, fetch or create corresponding team_user data
          let teamUserData = await User.findOne({
            gmail: userEmail,
            collegeName: collegeName, // Filter by college name
          });
  
          // If teamUserData not found, create a new record
          if (!teamUserData) {
            teamUserData = await User.create({
              gmail: userEmail,
              collegeName: collegeName, // Include college name
              acceptanceCode: storedAcceptanceCode,
              // Add other fields as needed
            });
          } else {
            // Update the acceptance code in team_users collection
            teamUserData.acceptanceCode = storedAcceptanceCode;
            await teamUserData.save();
          }
  
          res.json({
            success: true,
            teamData,
            teamUserData,
            acceptanceCode: storedAcceptanceCode,
          });
        } else {
          res.json({
            success: false,
            message: 'Acceptance code does not match.',
          });
        }
      } else {
        res.json({
          success: false,
          message: 'User not found in Team collection or is not verified for the provided college name.',
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  app.use('/profile', profileRouter);
  app.get('/dashboard', async (req, res) => {
    try {
      const userEmail = req.user.gmail;
  
      // Check if the user has an acceptance code in team_users collection
      const teamUserData = await User.findOne({
        gmail: userEmail,
        acceptanceCode: { $exists: true, $ne: null },
      });
  
      if (teamUserData) {
        // Redirect to the dashboard if the acceptance code is present
        res.render('dashboard', { user: req.user, teamUserData }); // Adjust this line based on your rendering logic
      } else {
        // Redirect to the verify-and-fetch page if the acceptance code is not present
        res.redirect('/verify-and-fetch');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  
  });
  
  
 
  
 
  







 
  
  
  

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;