const express = require('express');
const sequelize = require('sequelize');
const { body, validationResult } = require('express-validator');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { groupImage, Group } = require('../../db/models');
const router = express.Router();

router.use(restoreUser)

router.delete('/:imageId', requireAuth, async (req, res) => {
  const imageId = Number(req.params.imageId);

  try {
    const groupImage = await GroupsImage.findByPk(imageId);
  
    if (!groupImage) {
      return res.status(404).json({
        message: "Group image couldn't be found",
        statusCode: 404
      });
    }

    await groupImage.destroy();
    return res.json({
      message: "Successfully deleted group image"
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
});

 
  // Delete the image
  await image.destroy();

  // Return success message
  return res.status(200).json({
    message: 'Successfully deleted',
    statusCode: 200
  });
});


module.exports = router;
