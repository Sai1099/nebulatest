const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  
 
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
     // Set default role to 'user'
  },
  isVerified: {
    type: Boolean,
     // Set default isVerified to false
  },
  verificationToken: String,
  sessionExpiration: Date, // Assuming you want to store session expiration date
});

  
  const User = mongoose.model('users', userSchema);
  // In your route/controller where you fetch the user
  module.exports = User;