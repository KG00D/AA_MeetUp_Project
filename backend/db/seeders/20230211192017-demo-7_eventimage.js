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
        url:  'https://motoiq.com/wp-content/uploads/2018/05/i-xZGXvdJ.jpg',
        preview: true
      },
      {
        eventId: 2,
        url:  'https://hagadone.media.clients.ellingtoncms.com/img/photos/2021/03/21/IMG_0576_t1170.jpg?5cc718665ab672dba93d511ab4c682bb370e5f86',
        preview: true
      },
      {
        eventId: 3,
        url:  'https://i.pinimg.com/736x/e1/2c/be/e12cbef2e1f92a1ad8952543f31ec305.jpg',
        preview: true
      },
      {
        eventId: 4,
        url:  'https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F630279769%2F1808573398723%2F1%2Foriginal.20231028-055725?w=512&auto=format%2Ccompress&q=75&sharp=10&rect=56%2C0%2C3920%2C1960&s=5306168ec4bd0f2a6598ac69b9122191',
        preview: true
      },
      {
        eventId: 5,
        url:  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQutnplKjHqDZAJKEJA7ROGJqyqiBfNv9G0Zw&usqp=CAU',
        preview: true
      },
      {
        eventId: 6,
        url:  'https://prd-rteditorial.s3.us-west-2.amazonaws.com/wp-content/uploads/2018/05/15161046/Fight-Club.jpg',
        preview: true
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('eventImages', null, {});
  }
};