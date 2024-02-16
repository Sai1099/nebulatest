const User = require('../models/User');

const getCurrentUser = async (req, res, next) => {
    try {
        // Check if user is authenticated
        if (!req.isAuthenticated()) {
            // If not authenticated, move to the next middleware or route handler
            return next();
        }

        // If authenticated, retrieve the user from the database
        const userId = req.user._id; // Assuming the user ID is stored in the session
        const user = await User.findById(userId);

        console.log('Current user:', user); // Add this line to check if user is correctly fetched

        // Attach the user object to the request object for future use
        req.currentUser = user;
        next();
    } catch (error) {
        console.error('Error fetching current user:', error);
        // Handle errors or redirect as needed
        res.status(500).send('Internal Server Error');
    }
};

module.exports = getCurrentUser;

