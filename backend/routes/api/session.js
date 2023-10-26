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

// router.post('/', validateLogin, async (req, res, next) => {
//   try {
//     const { credential, password } = req.body;
//     const authenticatedUser = await User.login({ credential, password});
//     if (!authenticatedUser) {
//       return res.status(401).json({
//         message: 'Invalid Credentials',
//         statusCode: 401,
//       });
//     }
//     await setTokenCookie(res, authenticatedUser);
//     return res.json({
//       // user: authenticatedUser.toSafeObject(),
//       user
//     })
//   } catch (error) {
//     next(error);
//   }
// });

router.post(
  '/',
  validateLogin,
  async (req, res, next) => {
    const { credential, password } = req.body;

    const user = await User.login({ credential, password });

    if (!user) {
      const errorObj = {
        message: 'Invalid credentials',
        statusCode: 401
      }
      return res.status(401).json(errorObj);
    }

    await setTokenCookie(res, user);
    console.log('Response Data:', user);

    return res.json({
      user
    });
  }
);

router.delete('/', (_req, res) => {
  res.clearCookie('token');
  return res.json({ message: 'success' });
});

router.get('/', restoreUser, (req, res) => {
  const { user } = req;
  if (user) {
    return res.json({ user: user.toSafeObject(),})
        }
  else {
    return res.json({ user: null });
  }
});

module.exports = router;
