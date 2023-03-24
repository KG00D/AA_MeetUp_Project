const express = require('express');
const sequelize = require('sequelize');
const { body, validationResult } = require('express-validator');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Group, Membership, groupImage, Venue, Event, eventImage, Attendance, User } = require('../../db/models');
const router = express.Router();
const { Op } = require('sequelize');

router.use(restoreUser)

// PM Get all Events
// GH -- Need to add it for sanity checks
router.get('/', async (req, res, next) => {
    try {
      const events = await Event.findAll({
        attributes: [
        'id',
        'groupId',
        'venueId',
        'name',
        'type',
        'startDate',
        'endDate',
        [sequelize.fn('COUNT', sequelize.col('Event.id')), 'numAttending']
        ],
        include: [
          {
            model: Group,
            attributes: ['id', 'name', 'city', 'state'],
          },
          {
            model: Venue,
            attributes: ['id', 'city', 'state'],
          },
        ],
        group: ['Event.id']
      });
      return res.status(200).json({ Events: events });
    } catch (error) {
      return next(error);
    }
});

router.get('/:eventId', async (req, res, next) => {
    const id = req.params.eventId;
    const events = await Event.findByPk(id)
    if (!events) {
      res.status(404).json(
        { message: "Event couldn't be found", 
          status: 404 })
    }
    const event = await Event.findByPk( id, {
      where: {
        id: id
      },
      include: [
        {
          model: Group,
          attributes: ["id", "name", "private" , "city", "state"],
          subQuery: false,
        },
        {
          model: Venue,
          attributes: ["id", "address", "city", "state" , "lat", "lng"],
          subQuery: false,
        },
        {
          model: eventImage,
          attributes: ["id", "url", "preview"],
          subQuery: false,
        },
      ]
    })
    return res.json(event)
  })

router.get("/:eventId/attendees", async (req, res) => {
    const id = req.params.eventId;
  
    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({
        message: "Event couldn't be found",
        statusCode: 404
      });
    }
  
    const group = await Group.findOne({
      where: {
        id: event.groupId,
      },
    });
  
    const user = req.user;
    let attend;
    if (user && (user.id === group.organizerId || (await Membership.findOne({
      where: {
        groupId: group.id,
        userId: user.id,
        status: "co-host",
      },
    })))) {
      attend = await User.findAll({
        attributes: ["id", "firstName", "lastName"],
        include: [
          {
            model: Attendance,
            where: {
              eventId: event.id,
            },
            attributes: ["status"],
          },
        ],
      });
    } else {
      attend = await User.findAll({
        attributes: ["id", "firstName", "lastName"],
        include: [
          {
            model: Attendance,
            where: {
              eventId: event.id,
              [Op.or]: [
                { status: "member" },
                { status: "waitlist" },
              ],
            },
            attributes: ["status"],
          },
        ],
      });
    }  
    return res.status(200).json({ Attendees: attend });
});  


router.get('/api/events', async (req, res) => {
    try {
      const { page = 0, size = 20, name, type, startDate } = req.query;
      const pageNum = parseInt(page);
      const sizeNum = parseInt(size);
      const offset = pageNum * sizeNum;
  
      const events = await Event.findAll({
        include: [
          {
            model: Group,
          },
          {
            model: Venue,
          },
        ],
        where: {
          ...(name && { name }),
          ...(type && { type }),
          ...(startDate && { startDate }),
        },
        limit: sizeNum,
        offset: offset,
      });
      return res.status(200).json({ Events: events });
    } catch (error) {
      return res.status(500).json({ message: error.message, statusCode: 500 });
    }
  });


// Add an Image to an Event based on the Event's ID --GH
// Add an Image to an Event -- PM
router.post("/:eventId/images", requireAuth, async (req, res, next) => {
    const { eventId } = req.params;
    const { user } = req;
    console.log(eventId, '#########')
    const event = await Event.findByPk(eventId);

    if (!event) {
        const error = new Error(`Event couldn't be found`);
        return res.status(404).json({
            message: "Event couldn't be found",
            statusCode: error.status
    });
    }
    console.log(eventId, '#########')
    const attend = await Attendance.findAll({
        where: 
        {eventId: event.id, 
         userId: user.id}
    });
    console.log('#########')
    try {
        if (!user) {
            const error = new Error(`Authentication required`);
            error.status = 401;
            throw error;
        }
        if (!attend) {
            const error = new Error(`You must be an attendee to add an image`);
            error.status = 400;
            throw error;
        }
        const { url, preview } = req.body;
        const newEventImage = await eventImage.create({
            eventId: event.id,
            url,
            preview
        });
        return res.status(200).json({
            url: newEventImage.url,
            preview: newEventImage.preview
        });
    } catch (error) {
        return next(error);
    }
});

router.post('/:eventId/attendance', async (req, res) => {
    const eventId = req.params.eventId;
    const userId = req.user.id;
  
    try {
      const event = await Event.findByPk(eventId);
      if (!event) {
        return res.status(404).json({ 
            message: 'Event couldn\'t be found', 
            statusCode: 404 });
      }  
      const attendance = await Attendance.findOne({
        where: { eventId: eventId, userId: userId }
      });
      if (attendance && attendance.status === 'pending') {
        return res.status(400).json({ message: 'Attendance has already been requested', statusCode: 400 });
      }  
      const attendee = await Attendance.findOne({
        where: { eventId: eventId, userId: userId, status: { [Op.ne]: 'pending' } }
      });
      if (attendee) {
        return res.status(400).json({ message: 'User is already an attendee of the event', statusCode: 400 });
      }  
      const newAttendance = await Attendance.create({ eventId: eventId, userId: userId, status: 'pending' });
      return res.status(200).json(newAttendance);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error', statusCode: 500 });
    }
  });
  


// PUTS
router.put("/:eventId", async (req, res, next) => {
    const { eventId } = req.params;
    console.log('#########', eventId, '#########')
    const { user } = req; //I think this is the error here?
    console.log('#########', user, '#########')
    const {
      venueId,
      name,
      type,
      capacity,
      price,
      description,
      startDate,
      endDate,
    } = req.body;
  
    try {
      if (!user) throw new Error(`Authentication required`);
  
      const event = await Event.findByPk(eventId);
      if (!event) return res.status(403).json({
        message: "Venue couldn't be found",
        statusCode: 403
      })
  
      const member = await Membership.findAll({
        where: {
          groupId: event.groupId,
          userId: req.user.id,
          status: ["organizer", "co-host"],
        },
      });
      if (!member) throw new Error(`You must be the organizer or a co-host to edit this event`);
      const venue = await Venue.findByPk(venueId);
      if (!venue) throw new Error(`Venue couldn't be found`);

      await event.update({
        venueId,
        name,
        type,
        capacity,
        price,
        description,
        startDate,
        endDate,
      });
  
      res.json({
        venueId: event.venueId,
        name: event.name,
        type: event.type,
        capacity: event.capacity,
        price: event.price,
        description: event.description,
        startDate: event.startDate,
        endDate: event.endDate
      });
    } catch (error) {
      next(error);
    }
  });

  
  router.put("/:eventId/attendance", requireAuth, async (req, res, next) => {
    const id = req.params.id;
    const { userId, status } = req.body;
    const { user } = req;
  
    if (!user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    if (status === "pending") {
      return res.status(400).json({ message: "Cannot change an attendance status to pending" });
    }
    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ 
        message: "Event couldn't be found" });
    }  
    const group = await Group.findByPk(event.groupId);
    if (user.id !== group.organizerId) {
      const coHost = await Membership.findByPk({
        where: {
          groupId: group.id,
          memberId: user.id,
          status: "co-host"
        }
      });
      if (!coHost) {
        return res.status(403).json({ message: "Not Co-Host" });
      }
    }
    const attendance = await Attendance.findByPk({
      where: {
        eventId: event.id,
        userId: userId,
        status: "pending"
      }
    });
    if (!attendance) {
      return res.status(404).json({ message: "Attendance not found" });
    }

    await attendance.update({ status });
    return res.status(200).json(attendance);
  });
  
  // DELETE
// Delete an Event specified by its id - GH
// Delete an event - Send twice.... -- PM
  router.delete("/:eventId", async (req, res, next) => {
    const { eventId } = req.params;
    const { user } = req;
    try {
      if (!user) {
        const error = new Error(`Authentication required`);
        error.status = 401;
        throw error;
      }
      const event = await Event.findByPk(eventId);
      if (!event) {
        return res.status(404).json({
            message: "Event couldn't be found",
            statusCode: 404,
          });
      }
      const group = await event.getGroup();
      const attendee = await Attendance.findOne({
        where: { eventId: event.id, userId: user.id },
      });
      const member = await Member.findOne({
        where: { groupId: group.id, userId: user.id },
      });
      if (
        user.id !== event.organizerId &&
        (!attendee || attendee.status !== "co-host") &&
        (!member || member.status !== "co-host")
      ) {
        const error = new Error(`Not authorized to delete this event`);
        error.status = 403;
        throw error;
      }
      await event.destroy();
      return res.status(200).json({ message: "Successfully deleted" });
    } catch (error) {
      return next(error);
    }
  });

  router.delete('/:eventId/attendance', async (req, res) => {
    const { eventId } = req.params.eventId;
    console.log('#########', eventId, '#########')
    const { userId } = req.body;
    console.log('#########', userId, '#########')
  
    try {
      const event = await Event.findByPk(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event couldn't be found",
         statusCode: 404 });
      }
      const attendance = await Attendance.findOne({ where: { eventId, userId } });
      if (!attendance) {
        return res.status(404).json({ message: 'Attendance does not exist for this User', statusCode: 404 });
      }
      if (req.user.id !== event.hostId && req.user.id !== userId) {
        return res.status(403).json({ message: 'Only the User or organizer may delete an Attendance', statusCode: 403 });
      }
      await attendance.destroy();
      return res.status(200).json({ message: 'Successfully deleted attendance from event' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error', statusCode: 500 });
    }
  });

module.exports = router;

  
  