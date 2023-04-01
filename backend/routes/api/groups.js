const express = require('express');
const sequelize = require('sequelize');
const { body, validationResult } = require('express-validator');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Group, Membership, groupImage, Venue, User, Event, Attendance, eventImage } = require('../../db/models');
const router = express.Router();
const { Op } = require('sequelize');

router.use(restoreUser)

router.get('/', async (req, res, next) => {
  try {
    const groups = await Group.findAll({
      attributes: {
        include: [[sequelize.fn('COUNT', sequelize.col('Memberships.id')), 'numMembers']]
      },
      include: [
        { 
          model: Membership, 
          attributes: [], 
        },
        { 
          model: groupImage, 
          attributes: ['url'], 
          required: false 
        }
      ],
      group: ['Group.id', 'groupImages.id']
    });
    
    const formattedResponse = groups.map(group => ({
      id: group.id,
      organizerId: group.organizerId,
      name: group.name,
      about: group.about,
      type: group.type,
      private: group.private,
      city: group.city,
      state: group.state,
      createdAt: group.createdAt,
      updatedAt: group.updatedAt,
      numMembers: group.dataValues.numMembers,
      previewImage: group.groupImages.length > 0 && group.groupImages[0].url
    }));

    return res.status(200).json({ Groups: formattedResponse });
  } catch (error) {
    next(error);
  }
});

router.get('/current', restoreUser, async (req, res, next) => {
  try {
    const { user } = req;
    if (!user) {
      return res.status(200).json({ user: null });
    }
    const groups = await Group.findAll({
      where: { organizerId: user.id },
      attributes: { include: [[sequelize.fn("COUNT", sequelize.col("Memberships.id")), "numMembers"]] },
      include: [{ model: Membership, attributes: [] }, { model: groupImage, attributes: ['url'], required: false }],
      group: ['Group.id', 'groupImages.id']
    });
    const formattedGroups = groups.map((group) => {
      return {
        id: group.id,
        organizerId: group.organizerId,
        name: group.name,
        about: group.about,
        type: group.type,
        private: group.private,
        city: group.city,
        state: group.state,
        createdAt: group.createdAt,
        updatedAt: group.updatedAt,
        numMembers: group.dataValues.numMembers,
        previewImage: group.groupImages.length > 0 ? group.groupImages[0].url : null
      }
    });
    return res.status(200).json({ Groups: formattedGroups });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.get("/:groupId/venues", async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group couldn't be found", statusCode: 404});
    }
    const venues = await Venue.findAll({
      where: {
        groupId: groupId,
      },
    });
    const formattedVenues = [];
    for (const venue of venues) {
      formattedVenues.push({
        id: venue.id,
        groupId: venue.groupId,
        address: venue.address,
        city: venue.city,
        state: venue.state,
        lat: venue.lat,
        lng: venue.lng,
      });
    }
    return res.status(200).json({ Venues: formattedVenues });
  } catch (error) {
    next(error);
  }
});

router.get('/:groupId', async (req, res, next) => {
    const id = req.params.groupId;
    const groups = await Group.findByPk(id)
    if (!groups) {
      res.status(404).json({ message: "Group couldn't be found", status: 404 })
    }
    const group = await Group.findAll({
      where: {
        id: id
      },
      include: [
        {
          model: groupImage,
          attributes: ["id", "url", "preview"],
          subQuery: false,
        },
        {
          model: User, as: "Organizer",
          attributes: ["id", "firstName", "lastName"],
          subQuery: false,
        },
        {
          model: Venue,
          attributes: ['id', 'groupId', 'address', 'city', 'state', 'lat', 'lng'],
          subQuery: false,
        },
      ]
    })
    return res.json(group)
  })

router.get('/:eventId', async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const event = await Event.findByPk(eventId, {
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      },
      include: [
        {
          model: Group,
          attributes: ['id', 'name', 'private', 'city', 'state']
        },
        {
          model: Venue,
          attributes: ['id', 'address', 'city', 'state', 'lat', 'lng']
        },
        {
          model: eventImage,
          attributes: ['id', 'url', 'preview']
        },
        {
          model: Attendee,
          attributes: []
        }
      ],
      group: ['Event.id', 'Group.id', 'Venue.id', 'EventImages.id'],
    });
    if (!event) {
      return res.status(404).json({
        message: 'Event could not be found',
        statusCode: 404
      });
    }
    const numAttending = await event.countAttendees();
    return res.status(200).json({
      id: event.id,
      venueId: event.venueId,
      groupId: event.groupId,
      name: event.name,
      description: event.description,
      type: event.type,
      capacity: event.capacity,
      price: event.price,
      startDate: event.startDate,
      endDate: event.endDate,
      numAttending: numAttending,
      Group: event.Group,
      Venue: event.Venue,
      eventImages: event.EventImages
    });
  } catch (error) {
    console.error(error);
  }
});

router.get('/:groupId/events', async (req, res) => {
  try {
    const groupId = Number(req.params.groupId);
    const events = await Event.findAll({
      where: { groupId: groupId },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'capacity', 'price']
      },
      include: [
        {
          model: Group,
          attributes: ['id', 'name', 'city', 'state']
        },
        {
          model: Venue,
          attributes: ['id', 'city', 'state']
        }
      ]
    });

    const group = await Group.findByPk(groupId);

    if (group) {
      return res.json({ Events: events });
    } else {
      return res.status(404).json({
        message: "Group couldn't be found",
        statusCode: 404
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error',
      statusCode: 500
    });
  }
});

router.get("/:groupId/members", async (req, res, next) => {
  const { user } = req;
  const id = req.params.groupId;
  const group = await Group.findByPk(id);

  if (!group) {
    const error = new Error("Group couldn't be found");
    error.status = 404;
    return next(error);
  }
  const cohost = await Membership.findAll({
    where: {
      groupId: group.id,
      userId: user.id,
      status: "co-host",
    },
  });
  let members;
  if (!user || user.id !== group.organizerId && !cohost) {
    members = await User.findAll({
      attributes: ["id", "firstName", "lastName"],
      include: [
        {
          model: Membership,
          where: {
            groupId: group.id,
            [Op.or]: [
              { status: "member" },
              { status: "co-host" },
            ],
          },
          attributes: ["status"],
        },
      ],
    });

    if (!members.length) {
      return res.status(200).json({ message: "No members in this group" });
    }
  } else {
    members = await User.findAll({
      attributes: ["id", "firstName", "lastName"],
      include: [
        {
          model: Membership,
          where: {
            groupId: group.id,
          },
          attributes: ["status"],
        },
      ],
    });

    if (!members.length) {
      return res.status(200).json({ message: "No members in this group" });
    }
  }
  return res.status(200).json(members);
});


router.put('/:groupId', async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const { name, about, type, isPrivate, city, state } = req.body;
    const errors = [];
    if (name && name.length > 60) {
      errors.push("Name must be 60 characters or less");
    }
    if (about && about.length < 50) {
      errors.push("About must be 50 characters or more");
    }
    if (type && !['Online', 'In person'].includes(type)) {
      errors.push("Type must be 'Online' or 'In person'");
    }
    if (isPrivate !== undefined && typeof isPrivate !== 'boolean') {
      errors.push("Private must be a boolean");
    }
    if (!city) {
      errors.push("City is required");
    }
    if (!state) {
      errors.push("State is required");
    }
    if (errors.length > 0) {
      res.status(400).json({
        message: "Validation Error",
        statusCode: 400,
        errors: errors
      });
      return;
    }
    const groups = await Group.findByPk(groupId);
    if (groups) {
      const updatedGroup = await groups.update({
        name: name || groups.name,
        about: about || groups.about,
        type: type || groups.type,
        isPrivate: isPrivate === undefined ? groups.isPrivate : isPrivate,
        city: city || groups.city,
        state: state || groups.state
      });
      res.status(200).json(updatedGroup);
    } else {
      res.status(404).json({ message: "Group couldn't be found" });
    }
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "Group couldn't be found" });
  }
});

router.put("/:id", requireAuth, [
  body('name').isLength({ max: 60 }).withMessage('Name must be 60 characters or less'),
  body('about').isLength({ min: 50 }).withMessage('About must be 50 characters or more'),
  body('type').isIn(['Online', 'In person']).withMessage("Type must be 'Online' or 'In person'"),
  body('private').custom(value => typeof value === 'boolean').withMessage('Private must be a boolean'),
  body('city').notEmpty().withMessage('City is required'),
  body('state').notEmpty().withMessage('State is required'),
  ], async (req, res, next) => {
  const { user } = req;
  const { id } = req.params;
  const { name, about, type, private, city, state } = req.body;
  try {
    const group = await Group.findByPk(id);
    if (!group) {
      const error = new Error("Validation Error");
      error.status = 400;
      error.errors = errors;
      throw error;
    }
    await group.update({
      organizerId: user.id,
      name,
      about,
      type,
      private,
      city,
      state,
    });
    return res.status(200).json(group);
  } catch (error) {
    error.status = error.status;
    return next(error);
  }
});

// Start of all my posts
// Create a Group
router.post('/', requireAuth, [
  body('name').isLength({ max: 60 }).withMessage('Name must be 60 characters or less'),
  body('about').isLength({ min: 50 }).withMessage('About must be 50 characters or more'),
  body('type').isIn(['Online', 'In person']).withMessage("Type must be 'Online' or 'In person'"),
  body('private').isBoolean().withMessage('Private must be a boolean'),
  body('city').notEmpty().withMessage('City is required'),
  body('state').notEmpty().withMessage('State is required'),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const eMessages = [];
      errors.array().forEach(error => eMessages.push(error.msg));
      return res.status(400).json({
        message: 'Validation Error',
        statusCode: 400,
        errors: eMessages,
      });
    }
    const { name, about, type, private, city, state } = req.body;
    const group = await Group.create({
      name,
      about,
      type,
      private,
      city,
      state,
      organizerId: req.user.id 
    });
    console.log(group);
    return res.status(201).json(group);
  } catch (error) {
    next(error);
  }
});

// Add an Image to a Group - PM
// Add an Image to a Group based on the Group's id - GH
router.post('/:groupId/images', restoreUser, requireAuth, async (req, res, next) => {
  try {
    const { user } = req;
    const groupId = req.params.groupId;
    const { url, preview } = req.body;

    const group = await Group.findByPk(groupId);
    
    if (!user) {
      return res.status(401).json({
        message: "Authentication Required",
        statusCode: 401
      });
    }
    
    if (!group) {
      return res.status(404).json({
        message: "Group couldn't be found",
        statusCode: 404
      });
    }

    if (group.organizerId !== user.id) {
      return res.status(403).json({
        message: "Forbidden",
        statusCode: 403
      });
    }

    const image = await groupImage.create({
      groupId: group.id,
      url,
      preview,
    });

    return res.status(200).json({
      id: image.id,
      url: image.url,
      preview: image.preview,
    });
  } catch (error) {
    return next(error);
  }
});

router.post("/:groupId/venues", requireAuth, [
  body('address').notEmpty().withMessage('Street address is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('state').notEmpty().withMessage("State is required"),
  body('lat').isNumeric().withMessage('Latitude must be a number'),
  body('lng').isNumeric().withMessage('Longitude must be a number')
  ], async (req, res, next) => {
  const { user } = req;
  const { groupId } = req.params;
  const { address, city, state, lat, lng } = req.body;
  try {
    const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({
        message: "Group couldn't be found",
        statusCode: 404
      });
    }
    if (!user) {
      const error = new Error("Not logged in");
      error.status = 401;
      throw error;
    }
    if (user.id !== group.organizerId) {
      const cohost = await Membership.findOne({
        where: {
          groupId,
          userId: user.id,
          status: "co-host"
        }
      })
      if (!cohost) {
        const error = new Error("Only group organizer or co-host can add a venue");
        error.status = 403;
        throw error;
      }
    }
    if (!address || !city || !state || !lat || !lng) {
      const error = new Error("Address, city, state, latitude, and longitude are required");
      error.status = 400;
      throw error;
    }
    const venue = await Venue.create({
      groupId,
      address,
      city,
      state,
      lat,
      lng
    });
    return res.status(200).json({
            id: venue.id,
            groupId: venue.groupId,
            address: venue.address,
            city: venue.city,
            state: venue.state,
            lat: venue.lat,
            lng: venue.lng
    });
  } catch (error) {
    next(error);
  }
});

// Create an event for a Group specified by its id - GH
// Create an event by Group ID - PM
// router.post('/:groupId/events', requireAuth, [
//   body('name').trim().isLength({ min: 5 }).withMessage('Name must be at least 5 characters'),
//   body('type').trim().isIn(['Online', 'In person']).withMessage('Type must be Online or In person'),
//   body('capacity').trim().isInt().withMessage('Capacity must be a an integer'),
//   body('price').trim().isFloat({ min: 0 }).withMessage('Price is invalid'),
//   body('description').trim().notEmpty().withMessage('Description is required'),
//   body('startDate').isAfter(new Date().toISOString()).withMessage('Start date must be in the future'),
//   body('endDate').custom((value, { req }) => new Date(value) > 
//       new Date(req.body.startDate)).withMessage('End date is less than start date'),
// ], async (req, res) => {
  
//   const { groupId } = req.params;
//   const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;
//   const userId = req.user.id; 

//   try {
//     const group = await Group.findByPk(groupId);
//     const membership = await Membership.findAll({
//       where: {groupId: groupId,
//       status: 'co-host'
//       }
//     });

//     if (!group) {
//       return res.status(404).json({ message: 'Group could not be found', statusCode: 404 });
//     }
//     const isOrganizer = group.organizerId === userId;
//     if (!isOrganizer && !isCoHost) {
//       return res.status(403).json({ message: 'Forbidden', statusCode: 403 });
//     }
//     const venue = await Venue.findByPk(venueId);
//     if (!venue) {
//       return res.status(400).json({ message: 'Validation error', statusCode: 400, errors: ['Venue does not exist'] });
//     }
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ message: 'Validation error', statusCode: 400, errors: errors.array() });
//     }
//     const event = await Event.create({
//       groupId,
//       venueId,
//       name,
//       type,
//       capacity,
//       price,
//       description,
//       startDate,
//       endDate,
//     });
//     return res.status(200).json({
//       id: event.id,
//       groupId: event.groupId,
//       venueId: event.venueId,
//       name: event.name,
//       type: event.type,
//       capacity: event.capacity,
//       price: event.price,
//       description: event.description,
//       startDate: event.startDate,
//       endDate: event.endDate,
//     });
//   } catch (error) {
//     console.error(error);
//   }
// });
const eventValidators = [
  body('name').trim().isLength({ min: 5 }).withMessage('Name must be at least 5 characters'),
  body('type').trim().isIn(['Online', 'In person']).withMessage('Type must be Online or In person'),
  body('capacity').trim().isInt().withMessage('Capacity must be an integer'),
  body('price').trim().isFloat({ min: 0 }).withMessage('Price is invalid'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('startDate').isAfter(new Date().toISOString()).withMessage('Start date must be in the future'),
  body('endDate').custom((value, { req }) => new Date(value) > new Date(req.body.startDate)).withMessage('End date is less than start date'),
];

router.post('/:groupId/events', requireAuth, eventValidators, async (req, res) => {
  const { user } = req;
  const { venueId, name, type, capacity, price, description, startDate, endDate, previewImage } = req.body;
  const groupId = Number(req.params.groupId);

  try {
    const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group couldn't be found", statusCode: 404 });
    }

    const organizerId = group.organizerId;
    if (user.id !== organizerId) {
      return res.status(403).json({ message: "User not authorized to create event", statusCode: 403 });
    }

    const venue = await Venue.findByPk(venueId);
    if (!venue) {
      return res.status(400).json({ message: 'Validation error', statusCode: 400, errors: ['Venue does not exist'] });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation error', statusCode: 400, errors: errors.array() });
    }

    const newEvent = await Event.create({
      groupId, venueId, name, type, capacity, price, description, startDate, endDate, previewImage
    });

    return res.status(201).json({
      id: newEvent.id,
      groupId,
      venueId: newEvent.venueId,
      name: newEvent.name,
      type: newEvent.type,
      capacity: newEvent.capacity,
      price: newEvent.price,
      description: newEvent.description,
      previewImage: newEvent.previewImage,
      startDate: formatDate(newEvent.startDate),
      endDate: formatDate(newEvent.endDate)
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error", statusCode: 500 });
  }
});

router.post('/:groupId/membership', requireAuth, async (req, res) => {
  const { user } = req;
  const groupId = Number(req.params.groupId);

  try {
    const group = await Group.findByPk(groupId);

    if (!group) {
      return res.status(404).json({
        message: "Group couldn't be found",
        statusCode: 404
      });
    }

    const member = await Membership.findOne({
      where: { userId: user.id }
    });

    if (member) {
      if (member.status === 'pending') {
        return res.status(400).json({
          message: "Membership already been requested",
          statusCode: 400
        });
      } else {
        return res.status(400).json({
          message: "User already a member of the group",
          statusCode: 400
        });
      }
    }

    const newMember = await Membership.create({
      userId: user.id,
      groupId,
      status: 'pending'
    });

    return res.json({
      memberId: newMember.userId,
      status: newMember.status
    });

  } catch (error) {
    console.log(error);
    return res.status(404).json({
      message: "Group couldn't be found",
      statusCode: 404
    });
  }
});

// START OF ALL DELETES

router.delete("/:id", requireAuth, async (req, res, next) => {
  const { user } = req;
  const id = req.params.id;
  try {
    const group = await Group.findByPk(id);
    if (!group) {
      return res.status(404).json({ message: "Group couldn't be found", statusCode: 404 });
    }
    if (user.id !== group.organizerId) {
      throw new Error("Only group organizer can delete a group");
    }
    await Group.destroy({
      where: {
        id: id,
      },
    });
    res.status(200).json({ message: 'Successfully deleted' });
  } catch (error) {
    next(error);
  }
});

router.put('/:groupId/membership', requireAuth, async (req, res) => {
  const { user, params, body } = req;
  const { groupId } = params;
  const { status } = body;

  try {
    const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({
        message: "Group couldn't be found",
        statusCode: 404
      });
    }
    const member = await Membership.findOne({
      where: { groupId }
    });
    const organizerId = group.organizerId;
    if (user.id !== organizerId && member.status !== 'co-host') {
      return res.status(401).json({
        message: "You're not authorized to perform this action",
        statusCode: 401
      });
    }
    member.status = status;
    await Membership.update(
      { status: status },
      { where: { groupId } });
    return res.json({
      id: user.id,
      groupId: groupId,
      memberId: member.userId,
      status: member.status
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Something went wrong',
      statusCode: 500
    });
  }
});

router.delete('/:groupId/membership', requireAuth, async (req, res) => {
  const groupId = req.params.groupId;
  
  try {
    const membership = await Membership.findOne({ where: { groupId } });
    const group = await Group.findByPk(groupId);
  
    if (!group) {
      return res.status(404).json({
        message: "Group couldn't be found",
        statusCode: 404
      });
    }
  
    if (!membership) {
      return res.status(400).json({
        message: "Validation Error",
        statusCode: 400,
        errors: { memberId: "User couldn't be found in the group" }
      });
    }
    await membership.destroy();
    return res.json({
      message: "Successfully deleted membership from group"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      statusCode: 500
    });
  }
});

router.delete('/:groupId', requireAuth, async (req, res) => {
  const groupId = req.params.groupId;

  if (groupId) {
    const group = await Group.findByPk({where: {id: groupId}
    });
    console.log(group)
    await groupDel.destroy();

    return res.json(group);
  } else {
    return res.status(404).json({
      message: "Group couldn't be found",
      statusCode: 404
    });
  }
});



module.exports = router;
