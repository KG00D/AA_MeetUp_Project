let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'groupImages';
    return queryInterface.bulkInsert(options, [
      {
        groupId:  1,
        url: 'https://media.carsandbids.com/cdn-cgi/image/width=2080,quality=80/da4b9237bacccdf19c0760cab7aec4a8359010b0/photos/Fvjv5bp3i5E.ruMVadnSt.jpg?t=160332255519',
        preview: true
      },
      {
        groupId:  2,
        url: 'https://media2.sevendaysvt.com/sevendaysvt/imager/coffee-cupcakes-and-coding-at-girl-develo/u/original/2255666/gdi-code-coffee.jpg',
        preview: true
      },
      {
        groupId:  3,
        url: 'https://inktank.fi/wp-content/uploads/2013/09/Fight-Club-fight-club-30836125-1600-1200.jpg',
        preview: true
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'groupImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        groupid: { [Op.in]: [1, 2, 3] },
      },
      {}
    );
  },
};