const express = require('express');
const router = express.Router();
const path = require('path'); 
// Import csurf middleware
const isAuthenticated = require('../middleware/isAuthenticated');
const Team = require('../models/Team'); // Import your Team model

// Set the views directory
router.use(express.static(path.join(__dirname, '..', 'views')));

// Set EJS as the view engine


// Apply CSRF protection middleware to the router

// Route handler for /profile
router.get('/', isAuthenticated, async (req, res) => {
    try {
      // Fetch the team details for the logged-in user
      const teamDetails = await Team.findOne({ gmail: req.user.gmail });
  
      if (!teamDetails) {
        return res.status(404).send('Team not found.');
      }
      const successMessage = 'Profile updated successfully!';
      // Render the profile view with existing details
      res.render('profile', { teamDetails, successMessage });
    } catch (error) {
      console.error('Error fetching team details:', error);
      res.status(500).send('Internal Server Error');
    }
});

// Route handler for POST /profile/update
router.post('/update', isAuthenticated, async (req, res) => {
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
