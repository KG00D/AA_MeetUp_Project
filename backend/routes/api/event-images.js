const express = require('express');
const sequelize = require('sequelize');
const { body, validationResult } = require('express-validator');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { groupImage, Group, eventImage} = require('../../db/models');
const router = express.Router();

router.use(restoreUser)

router.delete('/:eventImageId', requireAuth, async (req, res) => {
  const imageId = req.params.eventImageId;
  console.log(imageId)
  const eventImage = await eventImage.findByPk({ where: { id: imageId } });

  try {
    if (eventImage) {
      eventImage.destroy({
        where: { id: imageId }
      });
      return res.json({
        message: "Successfully deleted group image"

  } catch (error) {
    console.error(error);
    throw error;
  }
});


module.exports = router;
