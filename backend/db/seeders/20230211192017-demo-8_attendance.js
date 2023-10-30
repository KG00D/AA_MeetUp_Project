'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Attendances';
    try {
      return await queryInterface.bulkInsert(options, [
        {
          eventId: 1,
          userId: 2,
          status: 'Open'
        },
        {
          eventId: 2,
          userId: 3,
          status: 'Open'
        },
        {
          eventId: 3,
          userId: 1,
          status: 'Open'
        }
      ], {});
    } catch (error) {
      console.error('Error inserting data into Attendances table: ', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Attendances';
    const Op = Sequelize.Op;
    try {
      return await queryInterface.bulkDelete(
        options,
        {
          eventId: { [Op.in]: [1, 2, 3] },
        },
        {}
      );
    } catch (error) {
      console.error('Error deleting data from Attendances table: ', error);
      throw error; 
    }
  },
};
