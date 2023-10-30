let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Venues';
    return queryInterface.bulkInsert(options, [
      {
        groupId: 1,
        address: '456 Brraaaaap Lane',
        city: 'Oakland',
        state: 'California',
        lat: 44.244167,
        lng: 7.769444,
      },
      {
        groupId: 2,
        address: '123 Happy Lane',
        city: 'San Jose',
        state: 'California',
        lat: -25.344375,
        lng: 131.034401,
      },
      {
        groupId: 3,
        address: 'Classified',
        city: 'Classified',
        state: 'Classified',
        lat: 27.3805833333,
        lng: 33.6318389
        ,
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Venues', null, {});
  }
};