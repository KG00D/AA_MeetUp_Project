const express = require('express');
const sequelize = require('sequelize');
const { body, validationResult } = require('express-validator');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Group, Membership, groupImage, Venue, Event, eventImage, Attendance, User } = require('../../db/models');
const router = express.Router();
const { Op } = require('sequelize');

router.use(restoreUser)

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
        group: ['Event.id', 'Group.id', 'Venue.id']
      });
      return res.status(200).json({ Events: events });
    } catch (error) {
      return next(error);
    }
});

router.get('/:eventId', async (req, res, next) => {
    const id = req.params.eventId;
    // TODO should line 45 be in a try/catch block?
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
    // TODO should line 79 be in a try/catch block?
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
        // TODO I don't love this, it's hard to read. Is there a better way to do this?
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

  router.post("/:eventId/images", requireAuth, async (req, res, next) => {
    const eventId = req.params.eventId;
    const { url, preview } = req.body;
  
    try {
      const event = await Event.findByPk(eventId);
      if (!event) {
        return res.status(404).json({
          message: "Event not found",
          statusCode: 404,
        });
      }
      const newImage = await eventImage.create({
        eventId,
        url,
        preview,
      });
      res.json({
        id: eventId,
        url: newImage.url,
        preview: newImage.preview,
      });
    } catch (error) {
      next(error);
    }
  });

router.post('/:eventId/attendance', requireAuth, async (req, res) => {
    const { user } = req;
    const eventId = Number(req.params.eventId);
    const event = await Event.findByPk(eventId);
  
    if (!event) {
      return res.status(404).json({
        message: "Event couldn't be found",
        statusCode: 404
      });
    }
    const member = await Membership.findOne({
      where: { userId: user.id }
    });
    if (!member || user.id !== member.userId) {
      return res.status(403).json({
        message: "User is not a member of the event's organization",
        statusCode: 403
      });
    }
    const attendee = await Attendance.findOne({
      where: { userId: user.id }
    });
    if (attendee && attendee.status === 'pending') {
      return res.status(400).json({
        message: "Attendance has already been requested",
        statusCode: 400
      });
    }
    if (attendee) {
      return res.status(400).json({
        message: "User is already an attendee of the event",
        statusCode: 400
      });
    }
    const newAttendee = await Attendance.create({
      userId: user.id,
      eventId,
      status: 'pending'
    });
    return res.json({
      userId: newAttendee.userId,
      status: newAttendee.status
    });
  });


// router.post('/:eventId/attendance', async (req, res) => {
//     const eventId = req.params.eventId;
//     const userId = req.user.id;
  
//     try {
//       const event = await Event.findByPk(eventId);
//       if (!event) {
//         return res.status(404).json({ 
//             message: 'Event couldn\'t be found', 
//             statusCode: 404 });
//       }  
//       const attendance = await Attendance.findOne({
//         where: { eventId: eventId, userId: userId }
//       });
//       if (attendance && attendance.status === 'pending') {
//         return res.status(400).json({ message: 'Attendance has already been requested', statusCode: 400 });
//       }  
//       const attendee = await Attendance.findOne({
//         where: { eventId: eventId, userId: userId, status: { [Op.ne]: 'pending' } }
//       });
//       if (attendee) {
//         return res.status(400).json({ message: 'User is already an attendee of the event', statusCode: 400 });
//       }  
//       const newAttendance = await Attendance.create({ eventId: eventId, userId: userId, status: 'pending' });
//       return res.status(200).json(newAttendance);
//     } catch (error) {
//       return res.status(500).json({ message: 'Internal server error', statusCode: 500 });
//     }
//   });
  
// PUTS
router.put("/:eventId", async (req, res, next) => {
    const { eventId } = req.params;
    const { user } = req; 
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
    try {
      const { status } = req.body;
      const { user } = req;
      const { eventId } = req.params;
      const event = await Event.findByPk(eventId);
      if (!event) {
        return res.status(404).json({
          message: "Event not found",
          statusCode: 404,
        });
      }
      const group = await Group.findByPk(event.groupId);
      const organizerId = group.organizerId;
      const attendingId = await Attendance.findOne({
        where: { eventId, userId: user.id },
      });
      if (attendingId && attendingId.status === "pending") {
        return res.status(400).json({
          message: "Attendance has already been requested",
          statusCode: 400,
        });
      }
      if (attendingId && attendingId.status === "accepted") {
        return res.status(400).json({
          message: "User is already attending the event",
          statusCode: 400,
        });
      }
      await Attendance.create({
        userId: user.id,
        eventId: eventId,
        status: status || "pending",
      });
      res.status(200).json({
        message: "Attendance request created successfully",
        statusCode: 200,
      });
    } catch (error) {
      next(error);
    }
  });


  // DELETE
  router.delete("/:eventId", requireAuth, async (req, res, next) => {
    const eventId  = req.params.eventId;
    try {
      const event = await Event.findByPk(eventId);
      if (!event) {
        return res.status(404).json({
          message: "Event couldn't be found",
          statusCode: 404
        });
      }
      await event.destroy();
      return res.json({
        message: "Successfully deleted event"
      });
    } catch (error) {
      return next(error);
    }
  });
  
  router.delete('/:eventId/attendance', async (req, res) => {
    const eventId = req.params.eventId;
    const { user } = req;
  
    try {
      const attendance = await Attendance.findOne({ where: { eventId } });
      if (!attendance) {
        return res.status(404).json({
          message: "Attendance couldn't be found for this event",
          statusCode: 404
        });
      }
  
      await attendance.destroy();
      return res.json({
        message: "Successfully deleted attendance from event"
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Internal server error",
        statusCode: 500
      });
    }
  });
  

module.exports = router;

  
  