const express = require('express');
const sequelize = require('sequelize');
const { body, validationResult } = require('express-validator');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { groupImage, Group, eventImage} = require('../../db/models');
const router = express.Router();

router.use(restoreUser)



router.delete('/:eventImageId', requireAuth, async (req, res) => {
  const imageId = req.params.eventImageId;

  console.log(req)
  try {
    const image = await eventImage.findOne({ where: { id: imageId } });

    if (!image) {
      return res.status(404).json({
        message: "Event image couldn't be found",
        statusCode: 404
      });
    }
    await image.destroy();
    return res.json({
      message: "Successfully deleted event image",
      statusCode: 200
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
});


module.exports = router;
