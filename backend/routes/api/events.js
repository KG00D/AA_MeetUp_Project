const express = require('express');
const sequelize = require('sequelize');
const { body, validationResult } = require('express-validator');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Group, Membership, groupImage, Venue, Event } = require('../../db/models');
const router = express.Router();

router.use(restoreUser)

// PM Get all Events
// GH -- Need to add it for sanity checks
router.get('/events', async (req, res, next) => {
    try {
      const events = await Event.findAll({
        include: [
          {
            model: Group,
            attributes: ['id', 'name', 'city', 'state'],
          },
          {
            model: Venue,
            attributes: ['id', 'city', 'state'],
          },
        ],
      });
      return res.status(200).json({ Events: events });
    } catch (err) {
      return next(err);
    }
  });
  
  
  