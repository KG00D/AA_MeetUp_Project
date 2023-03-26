const express = require('express');
const sequelize = require('sequelize');
const { body, validationResult } = require('express-validator');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { eventImage} = require('../../db/models');
const router = express.Router();

router.use(restoreUser)

router.delete('/:eventImageId', requireAuth, async (req, res, next) => {
  const imageId = req.params.eventImageId;
  try {
    const image = await eventImage.findByPk(imageId);
    if (!image) {
      return res.status(404).json({
        message: "Event image couldn't be found",
        statusCode: 404,
      });
    }
    await eventImage.destroy({ where: { id: imageId } });
    return res.json({
      message: "Successfully deleted event image",
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
