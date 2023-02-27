const express = require('express');
const sequelize = require('sequelize');
const { body, validationResult } = require('express-validator');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Group, Membership, groupImage, Venue } = require('../../db/models');
const router = express.Router();

router.use(restoreUser)
// Start of PATCHES
// Edit a Venue specified by its id - GH
// Edit a Venue specified by its id - PM
router.put('/:venueId', [
    body('address').notEmpty().withMessage('Street address is required'),
    body('city').notEmpty().withMessage('City is required'),
    body('state').notEmpty().withMessage('State is required'),
    body('lat').isNumeric().withMessage('Latitude is not valid'),
    body('lng').isNumeric().withMessage('Longitude is not valid')
  ], requireAuth, async (req, res, next) => {
    const { user } = req;
    const { venueId } = req.params;
    const { address, city, state, lat, lng } = req.body;
    try {
      const venue = await Venue.findByPk(venueId);
      if (!venue) {
        return res.status(404).json({
          message: "Venue couldn't be found",
          statusCode: 404
        });
      }
      const group = await Group.findByPk(venue.groupId);
      if (!group) {
        return res.status(404).json({
          message: "Group couldn't be found",
          statusCode: 404
        });
      }
      const membership = await Membership.findAll({
        where: {
          groupId: venue.groupId,
          userId: user.id,
          status: 'co-host'
        }
      });
      if (!membership) {
        return res.status(403).json({
          message: "User is not authorized to edit venue",
          statusCode: 403
        });
      }
      await venue.update({
        address,
        city,
        state,
        lat,
        lng
      });
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        return res.status(400).json({
          message: 'Validation error',
          statusCode: 400,
          errors: errorMessages
        });
      }
      return res.status(200).json({
        id: venue.id,
        groupId: venue.groupId,
        address: venue.address,
        city: venue.city,
        state: venue.state,
        lat: venue.lat,
        lng: venue.lng
      });
    } catch (err) {
      err.status = err.status || 500;
      return next(err);
    }
  });

  module.exports = router;
