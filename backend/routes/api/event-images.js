const express = require('express');
const sequelize = require('sequelize');
const { body, validationResult } = require('express-validator');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { groupImage, Group, eventImage} = require('../../db/models');
const router = express.Router();

router.use(restoreUser)

// Delete an existing image for an Event
router.delete('/:eventImageId', async (req, res) => {
  const imageId = req.params.eventImageId;
  const userId = req.user.id;
  
  try {
    const image = await groupImage.findOne({ where: { id: imageId } });
    if (!image) {
      return res.status(404).json({
        message: "Event image couldn't be found",
        statusCode: 404
      });
    }
    const group = await image.getGroup();
    if (group.organizerId !== userId && group.coHostId !== userId) {
      return res.status(403).json({
        message: "Current user is not authorized to delete the image",
        statusCode: 403
      });
    }
    await image.destroy();
    return res.json({
      message: "Successfully deleted group image"
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
});


module.exports = router;
