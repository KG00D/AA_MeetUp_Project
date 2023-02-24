const express = require('express');
const sequelize = require('sequelize');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Group, Membership, groupImage } = require('../../db/models');
const router = express.Router();

router.use(restoreUser)

// Start of all my GETs
router.get('/', async (req, res, next) => {
    try {
      const groups = await Group.findAll();
      console.log(groups)
      return res.status(200).json({ Groups: groups });
    } catch (error) {
      next(error);
    }
  });

router.get('/current', requireAuth, async (req, res, next) => {
    try {
      const userId = req.user.id;
      const groups = await Group.findAll({
        include: [
          {
            model: Membership,
            where: { userId },
          },
          {
            model: Membership,
            attributes: ['groupId',
              [sequelize.fn('COUNT', sequelize.col('userId')), 'numMembers'],
          ],
          group:['Membership.groupId'], 
          },
        ],
      });
      return res.status(200).json({ Groups: groups });
    } catch (error) {
      next(error);
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
            model: GroupImage,
            attributes: ['id', 'url']
          }
        ],
        group: ["Group.id", "GroupImages.id"]
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
// Create Group
// TODO Changed a lot of the migration names, need to 100% double-check these.....
// TODO and compare with postman body to ensure it's synched...
// TODO check database for creation.
router.post('/', requireAuth, async (req, res, next) => {
  try {
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


router.post("/:id/images", async (req, res, next) => {
  try {
    const { user } = req;
    const id = req.params.id;
    const { url, preview } = req.body;
    const group = await Group.findByPk(id);
    if (!group) {
      const err = new Error(`No group with id ${id}`);
      err.status = 404;
      return next(err);
    }
    if (!user) {
      const err = new Error("Not logged in");
      err.status = 401;
      return next(err);
    }
    if (user.id !== group.organizerId) {
      const err = new Error("Only group organizer can add images");
      err.status = 403;
      return next(err);
    }
    const groupImage = await groupImage.create({
      groupId: id,
      url,
      preview
    });
    return res.status(201).json(groupImage);
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
