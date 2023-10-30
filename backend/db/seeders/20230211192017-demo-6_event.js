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
        groupId: 1,
        name: 'GT-R WorkShop',
        description: 'Learn how to maintain, repair, and upgrade your GT-R',
        type: 'Online',
        capacity: 100,
        price: 499,
        startDate: new Date('2023-12-01'),
        endDate: new Date('2023-12-03')
      },
      {
        venueId: 1,
        groupId: 1,
        name: 'Coffee MeetUp',
        description: 'Grab some coffee, meet some cool people, show off your obnoxious car.',
        type: 'In Person',
        capacity: 100,
        price: 0,
        startDate: new Date('2020-07-01'),
        endDate: new Date('2022-07-01')
      },
      {
        venueId: 1,
        groupId: 1,
        name: 'Track Day!',
        description: 'Race your GT-R\s at Track Day!',
        type: 'In Person',
        capacity: 50,
        price: 0,
        startDate: new Date('2020-08-01'),
        endDate: new Date('2022-08-01')
      },
      {
        venueId: 2,
        groupId: 2,
        name: 'Why Python Backend is Bad',
        description: 'Python has rusty edges. It\s not great, it has issues...',
        type: 'Online',
        capacity: 1000,
        price: 749,
        startDate: new Date('2020-05-01'),
        endDate: new Date('2022-05-01')
      },
      {
        venueId: 2,
        groupId: 2,
        name: 'GO, Rust, Julia are the future',
        description: 'Learn programming languages that will define the next 15 years..',
        type: 'Online',
        capacity: 50,
        price: 99,
        startDate: new Date('2020-05-01'),
        endDate: new Date('2022-05-01')
      },
      {
        venueId: 3,
        groupId: 3,
        name: 'We don\'t talk about it.',
        description: 'We don\'t talk about it.',
        type: 'In Person',
        capacity: 1000000,
        price: 0,
        startDate: new Date('2020-05-01'),
        endDate: new Date('2099-05-01')
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
