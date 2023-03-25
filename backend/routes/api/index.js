
const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const groupRouter = require('./groups.js');
const eventsRouter = require('./events.js');
const venuesRouter = require('./venues.js');
const eventImages = require('./event-images.js');
const groupImagesrouter = require('./group-images.js')
const { restoreUser } = require("../../utils/auth.js");

router.use(restoreUser);
router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/groups', groupRouter)
router.use('/events', eventsRouter)
router.use('/venues', venuesRouter)
router.use('/group-images', groupImagesrouter)
router.use('/event-images', eventImages)

module.exports = router;
 