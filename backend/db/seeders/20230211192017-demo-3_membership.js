let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Memberships';
    return queryInterface.bulkInsert(options, [
      {
        userId: 1,
        groupId:  1,
        status: 'true'
      },
      {
        userId: 2,
        groupId:  2,
        status: 'true'
      },
      {
        userId: 3,
        groupId:  3,
        status: 'true'
      }
    ], options);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Memberships', null, {});
  }
};