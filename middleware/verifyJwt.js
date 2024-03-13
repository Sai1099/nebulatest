// middleware/verifyJwt.js
const express = require('express');
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;
const verifyJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    // If no Authorization header is present, skip verification and proceed to the next middleware
    return next();
  }

  const token = authHeader.split(' ')[1];
  console.log(token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Error verifying JWT:', err);
    // If the token is invalid, skip verification and proceed to the next middleware
    return next();
  }
};
module.exports = verifyJwt;
