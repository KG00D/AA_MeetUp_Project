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
        url: 'www.23478487437843872431.com',
        preview: true
      },
      {
        groupId:  2,
        url: 'www.io42892389299843298423.com',
        preview: false
      },
      {
        groupId:  3,
        url: 'www.342423233323124321.io',
        preview: false
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "groupImages";
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