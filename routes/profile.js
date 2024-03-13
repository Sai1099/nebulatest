const express = require('express');
const router = express.Router();
const app = express();
const path = require('path');
const csurf = require('csurf'); 
// Import csurf middleware
const isAuthenticated = require('../middleware/isAuthenticated');
const verifyjwt = require('../middleware/verifyJwt');
const Team = require('../models/Team'); // Import your Team model

app.set('views', path.join(__dirname, '..', 'views')); // Set the views directory for the app
app.set('view engine', 'ejs');
router.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
router.use(express.json()); // Parse JSON bodies

// Apply CSRF protection middleware to the router


// Route handler for /profile
router.get('/', verifyjwt, async (req, res) => {
    try {
      // Fetch the team details for the logged-in user
      const userEmail = req.user.gmail;

      // Fetch the team details for the logged-in user
      const teamData = await Team.findOne({ gmail: userEmail });
      
  
      if (!teamData) {
        return res.status(404).send('Team not found.');
      }
      const successMessage = 'Profile updated successfully!';
      // Render the profile view with existing details
      res.render('profile', { teamData, successMessage });
    } catch (error) {
      console.error('Error fetching team details:', error);
      res.status(500).send('Internal Server Error');
    }
});
router.get('/profile-update', verifyjwt, async (req, res) => {
  console.log('Reached profile-update route');
  try {
      
      const email = req.user.gmail;

    // Find the team based on the user's email address
    const teamDetails = await Team.findOne({ gmail: email });

      
      const errorMessage = req.flash('error')[0] || '';
      // Render the profile-update.ejs view with the CSRF token
      res.render('profile-update', { csrfToken, errorMessage });
  } catch (error) {
      console.error('Error rendering profile update form:', error);
      res.status(500).send('Internal Server Error');
  }
});

// Route handler for POST /profile/update
router.post('/profile-update', verifyjwt, async (req, res) => {
    try {
      const userEmail = req.user.email;
  
      // Update the team details based on the form data
      const updateFields = {
        profilePic: req.body.profilePic,
        instagramBio: req.body.instagramBio,
        bio: req.body.bio,
        customFields: req.body.customFields,
        // Add other fields as needed
      };
  
      // Update the team details in the teams collection
      const updatedTeam = await Team.findOneAndUpdate(
        { gmail: userEmail },
        { $set: updateFields },
        { new: true }
      );
  
      if (!updatedTeam) {
        return res.status(404).send('Team not found.');
      }
  
      // Pass CSRF token to the view
      const csrfToken = req.csrfToken();
  
      // Render the profile-update.ejs view with the CSRF token
      res.render('profile-update', {
        csrfToken: csrfToken,
        teamDetails: updatedTeam, // You can pass other data to the view as needed
      });
    } catch (error) {
      console.error('Error updating team profile:', error);
      res.status(500).send('Internal Server Error');
    }
});


// Export the router
module.exports = router;
