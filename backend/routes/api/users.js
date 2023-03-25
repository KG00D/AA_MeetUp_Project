const express = require('express');
const { Op } = require('sequelize');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSignup = [
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Invalid email'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
  ];

const userEmailExists = async (req, res, next) => {
  const { email, username} = req.body;
  const user = await User.scope('currentUser').findOne({
    where: {
      [Op.or]: [{username: username}, { email: email}],
    },
  })

  if (user) {
    const error = new Error('User already exists');
    error.status = 403;
    if (user.email === email) {
      error.errors = ['User with that email already exists'];
    } else if (user.username === username) {
      error.errors = ['User with that username already exists'];
    }
    throw error; 
  }
  next();
};

router.post('/', validateSignup, userEmailExists, async (req, res) => {
    const {email, firstName, lastName, username, password} = req.body;
    const user = await User.signup({ email, firstName, lastName, username, password });
    // TODO: Add a try/catch block to handle errors and figure out why I have that on line 55.
    await setTokenCookie(res, user);
    return res.json(user);
  }
);


//TODO These two look like shit. Why can't I just combine them.
router.use((err, req, res, next) => {
  if (err.status === 403) {
    return res.status(403).json({
      message: err.message,
      statusCode: err.status,
      errors: err.errors,
    });
  }
  next(err);
});

router.use((err, req, res, next) => {
  if (err.status === 400) {
    return res.status(400).json({
      message: err.message,
      statusCode: err.status,
      errors: err.errors,
    });
  }
  next(err);
});

module.exports = router;
 
