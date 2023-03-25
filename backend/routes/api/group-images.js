const express = require('express');
const sequelize = require('sequelize');
const { body, validationResult } = require('express-validator');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { groupImage, Group } = require('../../db/models');
const router = express.Router();

router.use(restoreUser)

router.delete('/:groupImageId', requireAuth, async (req, res) => {
  const imageId = req.params.groupImageId;
  const userId = req.user.id;
  
  try {
    const image = await GroupImage.findOne({ where: { id: imageId } });
    if (!image) {
      return res.status(404).json({
        message: "Group image couldn't be found",
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
