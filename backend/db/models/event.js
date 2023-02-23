'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Event.hasMany(models.eventImage, {foreignKey: 'eventId'});
      Event.belongsTo(models.Venue, {foreignKey: 'venueId'});
      Event.hasMany(models.Attendance, {foreignKey: 'eventId'});
      Event.belongsTo(models.Group, {foreignKey: 'groupId'});
    }
  }
  Event.init({
    venueId: DataTypes.STRING,
    groupId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    type: DataTypes.STRING,
    capacity: DataTypes.INTEGER,
    price: DataTypes.FLOAT,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};