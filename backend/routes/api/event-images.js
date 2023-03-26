const express = require('express');
const sequelize = require('sequelize');
const { body, validationResult } = require('express-validator');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { eventImage} = require('../../db/models');
const router = express.Router();

router.use(restoreUser)



router.delete('/:eventImageId', requireAuth, async (req, res) => {
  const imageId = req.params.eventImageId;

  console.log(req)
  try {
    const image = await eventImage.findByPk(imageId);
    console.log(image);

  } catch (error) {
 
  }
});


module.exports = router;
