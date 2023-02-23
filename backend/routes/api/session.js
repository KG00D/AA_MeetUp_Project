// backend/routes/api/session.js

const express = require('express');
const router = express.Router();
const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check, validationResult } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateLogin = [
  check('credential')
    .exists({ checkFalsy: true })
    .withMessage('Email is required'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Password is required'),
  handleValidationErrors,
];

// Login a User
router.post('/', validateLogin, async (req, res, next) => {
  try {
    const { credential, password } = req.body;
    const authenticatedUser = await User.login({ credential, password});
    if (!authenticatedUser) {
      return res.status(401).json({
        message: 'Email or password is incorrect',
        statusCode: 401,
      });
    }
    await setTokenCookie(res, authenticatedUser);
    return res.status(200).json({
      user: {
        id: authenticatedUser.id,
        firstName: authenticatedUser.firstName,
        lastName: authenticatedUser.lastName,
        email: authenticatedUser.email,
        username: authenticatedUser.username,
        token: authenticatedUser.token
      },
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/', (_req, res) => {
  res.clearCookie('token');
  return res.json({ message: 'success' });
});

// Get the current user
router.get('/', restoreUser, (req, res) => {
  const { user } = req;
  if (user) {
    return res.json({
      user: {
        id: user.dataValues.id,
        firstName: user.dataValues.firstName,
        lastName: user.dataValues.lastName,
        email: user.dataValues.email,
        username: user.dataValues.username
      }
    });
  } else {
    return res.json({ user: null });
  }
});

module.exports = router;
