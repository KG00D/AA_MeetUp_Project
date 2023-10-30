'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    return queryInterface.bulkInsert(options, [
      {
        email: 'demo@user.io',
        username: 'Demo-lition',
        firstName: 'Ted',
        lastName: 'Johnson',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        email: 'johnsmith@aol.com',
        username: 'jsmith1988',
        firstName: 'John',
        lastName: 'Smith',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        email: 'tdizzle@protonmail.com',
        username: 'tdizzle',
        firstName: 'Tyler',
        lastName: 'Durden',
        hashedPassword: bcrypt.hashSync('password3')
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};