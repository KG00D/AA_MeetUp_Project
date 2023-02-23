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
        name: 'Girls who Code',
        about: 'A Group for Girls who Write Code',
        type: 'A group',
        private: true,
        city: 'Oakland',
        state: 'California'
      },
      {
        organizerId: 2,
        name: 'Kids who Code',
        about: 'A Group for Kids who Write Code',
        type: 'A group',
        private: true,
        city: 'San Jose',
        state: 'California'
      },
      {
        organizerId: 3,
        name: 'Guys who Code',
        about: 'A Group for Guys who Write Code',
        type: 'A group',
        private: true,
        city: 'Los Angelas',
        state: 'California'
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "Groups";
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