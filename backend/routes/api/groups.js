const express = require('express');
const sequelize = require('sequelize');
const { body, validationResult } = require('express-validator');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Group, Membership, groupImage } = require('../../db/models');
const router = express.Router();

router.use(restoreUser)

// Start of all my GETs
// Get All Groups - GH
// Get All Groups - PM
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const groups = await Group.findAll({
      attributes: {include: [[sequelize.fn("COUNT", sequelize.col("Memberships.id")), "numMembers"]]},
      include: [{model: Membership, attributes: []}],
      group: ['Group.id']
    });
    return res.status(200).json({ Groups: groups });
  } catch (error) {
    next(error);
  }
});


// Get All Groups Joined or oganized by Current User - GH
// Get all Groups by current User - PM
router.get('/current', requireAuth, async (req, res, next) => {
  try {
    console.log(req)
    const { user } = req;
    console.log(user)
    const groups = await Group.findAll({
      where: {
        organizerId: user.id,
      },
      attributes: ['id', 'organizerId', 'name', 'about', 'type', 
      'private', 'city', 'state', 'createdAt', 'updatedAt']
    });
    return res.status(200).json({ groups });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.get("/:id/venues", async (req, res, next) => {
    try {
      const { id } = req.params;
      const group = await Group.findByPk(id);
      if (!group) {
        const err = new Error(`Group does not exist with id ${id}`);
        err.status = 404;
        return next(err);
      }
  
      const venues = await Venue.findAll({
        where: {
          groupId: id,
        },
      });
  
      return res.status(200).json(venues);
    } catch (err) {
      next(err);
    }
});

router.get("/:id", async (req, res, next) => {
    try {
      const id = req.params.id;
  
      const group = await Group.findOne({
        where: { id },
        attributes: {
          include: [
            [sequelize.fn("COUNT", sequelize.col("Memberships.id")), "numMembers"]
          ]
        },
        include: [
          {
            model: Membership,
            attributes: []
          },
          {
            model: groupImage,
            attributes: ['id', 'url']
          }
        ],
        group: ["Group.id", "groupImages.id"]
      });
  
      if (!group) {
        const err = new Error('Group not found');
        err.status = 404;
        return next(err);
      }
  
      return res.status(200).json(group);
    } catch (err) {
      return next(err);
    }
});


// Start of all my posts
// Create a Group
// TODO Changed a lot of the migration names, need to 100% double-check these.....
// TODO and compare with postman body to ensure it's synched...
// TODO check database for creation.
// TODO see if I can remove the array. Looks sloppy as hell...
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
    return res.status(201).json({ Group: group });
  } catch (error) {
    next(error);
  }
});

// Add an Image to a Group - PM
// Add an Image to a Group based on the Group's id - GH
// Removing extra error handling. Add back in for pportfolio? Don't need unwanted errors for now..
router.post('/:groupId/images', requireAuth, async (req, res, next) => {
  try {
    const { user } = req;
    console.log(user)
    const groupId = req.params.groupId;
    console.log(groupId)
    const { url, preview } = req.body;
    console.log(url, preview)
    const group = await Group.findByPk(groupId);
    if (!group) {
      const err = new Error(`Group couldn't be found with ID ${groupId}`);
      err.status = 404;
      return next(err);
    }
    // TODO is this bad styling on line 164? ask, google, something
    const groupImage = await groupImage.create({
      groupId,
      url,
      preview,
    });
    return res.status(200).json({
      id: groupImage.id,
      url: groupImage.url,
      preview: groupImage.preview,
    });
  } catch (err) {
    return next(err);
  }
});

router.post("/:id/venues", async (req,res,next) => {
  const {user} = req
  const id = req.params.id
  const {address, city, state, lat, lng} = req.body
  const group = await Group.findByPk(id)
  if (!group) {
    const err = new Error(`Group does not exist with id ${id}`)
    err.status = 404
    return next(err)
}
if (!user) {
    const err = new Error("Not logged in")
    err.status = 400
    return next(err)
}
if (user.id !== group.organizerId) {
    const cohost = await Membership.findOne({
        where: {
            groupId: id,
            userId: user.id,
            status: "co-host"
        }
    })

    if (!cohost) {
        const err = new Error("Only group organizer or co-host can add a venue")
        err.status = 400
        return next(err)
    }
}
if (!address || !city || !state || !lat || !lng) {
    const err = new Error("Requires address, city, state, latitude, and longitude")
    err.status = 400
    return next(err)
}
const venue = await Venue.create({
    groupId: id,
    address,
    city,
    state,
    lat,
    lng
  })
return res.status(200).json(venue)
})


// Start of all my puts
router.put("/:id", async (req, res, next) => {
  const { user } = req;
  const { id } = req.params;
  const { name, about, type, private, city, state } = req.body;
  try {
    const group = await Group.findByPk(id);
    if (!group) {
      throw new Error(`Group does not exist with id ${id}`);
    }
    if (!user) {
      throw new Error("Not logged in");
    }
    if (user.id !== group.organizerId) {
      throw new Error("Only group organizer can edit a group");
    }
    if (!name || !about || !type || !private || !city || !state) {
      throw new Error(
        "Requires name, about, type, privacy, city, state"
      );
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
  } catch (err) {
    err.status = err.status || 500;
    return next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  const { user } = req;
  const id = req.params.id;

  try {
    const group = await Group.findByPk(id);
    if (!group) {
      throw new Error(`Group does not exist with id ${id}`);
    }
    if (!user) {
      throw new Error("Not logged in");
    }
    if (user.id !== group.organizerId) {
      throw new Error("Only group organizer can delete a group");
    }
    await Group.destroy({
      where: {
        id: id,
      },
    });
    res.status(200).json({ message: `Group ${id} deleted` });
  } catch (err) {
    err.status = err.status || 500;
    next(err);
  }
});

module.exports = router;
