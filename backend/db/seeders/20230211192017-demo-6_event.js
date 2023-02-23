let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Events';
    return queryInterface.bulkInsert(options, [
      {
        venueId: 1,
        groupId: 2,
        name: 'Full',
        description: 'Coder Groups',
        type: 'group',
        capacity: 100,
        price: 999,
        startDate: new Date('2020-05-01'),
        endDate: new Date('2022-05-01')
      },
      {
        venueId: 2,
        groupId: 3,
        name: 'Full',
        description: 'Coder Groups',
        type: 'group',
        capacity: 100,
        price: 999,
        startDate: new Date('2020-05-01'),
        endDate: new Date('2022-05-01')
      },
      {
        venueId: 3,
        groupId: 1,
        name: 'Full',
        description: 'Coder Groups',
        type: 'group',
        capacity: 100,
        price: 999,
        startDate: new Date('2020-05-01'),
        endDate: new Date('2022-05-01')
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Events';
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
