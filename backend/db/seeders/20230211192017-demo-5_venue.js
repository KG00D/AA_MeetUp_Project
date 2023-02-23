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
        address: 'Classified',
        city: 'Piedmont',
        state: 'Italy',
        lat: 44.244167,
        lng: 7.769444,
      },
      {
        groupId: 2,
        address: 'Classified',
        city: 'Northern Territory',
        state: 'Australia',
        lat: -25.344375,
        lng: 131.034401,
      },
      {
        groupId: 3,
        address: 'Classified',
        city: 'Red Sea Governorate',
        state: 'Egypt',
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