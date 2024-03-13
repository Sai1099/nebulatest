const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;

const generateAuthToken = (user) => {
  // Use a cryptographically secure random string generator for stronger tokens
  const randomBytes = crypto.randomBytes(64).toString('hex');
  const tokenId = randomBytes.slice(0, 16);

  const payload = {
    // Use a custom property for user information
    user: user._id,  // Assuming `_id` is the unique user identifier
    // Add a unique identifier for more secure token revocation
    jti: tokenId,  // Add a "jti" (JWT ID) claim for revocation
  };

  return jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
};

const generateTokenMiddleware = async (req, res, next) => {
  try {
    const token = generateAuthToken(req.user);
    req.token = token;
    console(req.token);
    next();
  } catch (error) {
    console.error('Error generating token:', error);
    // Handle token generation error appropriately (e.g., return error response)
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { generateAuthToken, generateTokenMiddleware };
