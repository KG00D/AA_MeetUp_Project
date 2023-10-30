let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Groups';
    return queryInterface.bulkInsert(options, [
      {
        organizerId: 1,
        name: 'GT-R Meet & Greet',
        about: 'A group for current and past GT-R owners',
        type: 'In Person',
        private: false,
        city: 'Oakland',
        state: 'California'
      },
      {
        organizerId: 2,
        name: 'Learn to Code!',
        about: 'A group for people that want to learn how to code',
        type: 'Online',
        private: false,
        city: 'San Jose',
        state: 'California'
      },
      {
        organizerId: 3,
        name: 'Fight Club',
        about: 'We don\'t talk about Fight Club',
        type: 'In Person',
        private: true,
        city: 'Philadelphia',
        state: 'Pennsylvania'
      }
    ], );
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Groups';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        name: {
          [Op.in]: [
            "Kids who Code",
            "Girls who Code",
            "Guys who Code",
          ],
        },
      },
      {}
    );
  },
};