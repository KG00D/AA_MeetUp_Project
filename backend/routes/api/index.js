
const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
// TODO Same as below comment.
// const groupRouter = require('./groups.js');
// const eventsRouter = require('./events.js');
// const venuesRouter = require('./venues.js');
const { restoreUser } = require("../../utils/auth.js");

// Connect restoreUser middleware to the API router
  // If current user session is valid, set req.user to the user in the database
  // If current user session is not valid, set req.user to null
router.use(restoreUser);
router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/groups', groupRouter)
// TODO uncomment later from other local branch, leave now for testing.
// router.use('/events', eventsRouter)
// router.use('/venues', venuesRouter)

module.exports = router;
 