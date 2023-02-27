const express = require('express');
const sequelize = require('sequelize');
const { body, validationResult } = require('express-validator');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { groupImage, Group, eventImage} = require('../../db/models');
const router = express.Router();

router.use(restoreUser)

// Delete an existing image for an Event
router.delete('/:eventImageId', async (req, res) => {
  const imageId = req.params.imageId;
  const userId = req.user.id;

  try {
    const eventImage = await eventImage.findByPk(imageId, {
      include: [{ model: Event }],
    });

    if (!eventImage) {
      return res.status(404).json({
        message: 'Event Image couldn\'t be found',
        statusCode: 404,
      });
    }

    const event = eventImage.Event;
    const groupId = event.groupId;

    const isOrganizer = event.organizerId === userId;
    const isCoHost = event.coHostId === userId;
    if (!isOrganizer && !isCoHost) {
      return res.status(403).json({
        message: 'Unauthorized access',
        statusCode: 403,
      });
    }

    await eventImage.destroy();

    return res.status(200).json({
      message: 'Successfully deleted',
      statusCode: 200,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error',
      statusCode: 500,
    });
  }
});

module.exports = router;
