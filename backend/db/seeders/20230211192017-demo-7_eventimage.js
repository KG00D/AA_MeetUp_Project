let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'eventImages';
    return queryInterface.bulkInsert(options, [
      {
        eventId: 1,
        url:  'www.picturesofstuff.com/12345',
        preview: false
      },
      {
        eventId: 2,
        url:  'www.picturesofstuff.com/abcdez',
        preview: true
      },
      {
        eventId: 3,
        url:  'www.picturesofstuff.com/93249873289',
        preview: true
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('eventImages', null, {});
  }
};