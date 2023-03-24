const express = require('express');
const sequelize = require('sequelize');
const { body, validationResult } = require('express-validator');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { groupImage, Group } = require('../../db/models');
const router = express.Router();

router.use(restoreUser)

router.delete('/:groupImageId', async (req, res) => {
  const imageId = req.params.imageId;
  const userId = req.user.id; 
  const image = await groupImage.findOne({
    where: { id: imageId },
    include: [{ model: Group, as: 'group' }]
  });

  if (!image) {
    return res.status(404).json({
      message: 'Group Image couldn\'t be found',
      statusCode: 404
    });
  }

  // Check if the user is authorized to delete the image
  const group = image.group;
  if (group.organizerId !== userId && group.coHostId !== userId) {
    return res.status(403).json({
      message: 'Current user is not authorized to delete the image',
      statusCode: 403
    });
  }
 
  // Delete the image
  await image.destroy();

  // Return success message
  return res.status(200).json({
    message: 'Successfully deleted',
    statusCode: 200
  });
});


module.exports = router;
