const express = require('express');
const session = require('express-session');
const csrf = require('csurf');
const path = require('path'); 
const crypto = require('crypto');

const router = express.Router();
const csrfProtection = csrf();


router.use(csrfProtection);

router.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

module.exports = isAuthenticated;
