const express = require('express');
const sequelize = require('sequelize');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Group, Membership } = require('../../db/models');

const router = express.Router();


router.use(restoreUser)

// Get Groups
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
        ],
      });
      return res.status(200).json({ Groups: groups });
    } catch (error) {
      next(error);
    }
  });
  

// Create a Group
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const group = await Group.create({
      name,
      description,
      ownerId: req.user.id 
    });
    console.log(group);
    return res.status(201).json({ Group: group });
  } catch (error) {
    next(error);
  }
});






module.exports = router;
