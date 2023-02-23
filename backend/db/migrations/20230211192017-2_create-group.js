'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    console.log('Starting migration...');
    try {
      console.log('Creating table...');
      await queryInterface.createTable('Groups', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        organizerId: {
          type: Sequelize.INTEGER,
          references: {
            model: "Users",
            key: "id"
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE"
        },
        name: {
          type: Sequelize.STRING
        },
        about: {
          type: Sequelize.STRING
        },
        type: {
          type: Sequelize.STRING
        },
        private: {
          type: Sequelize.BOOLEAN // changed from STRING to BOOLEAN for clarity
        },
        city: {
          type: Sequelize.STRING
        },
        state: {
          type: Sequelize.STRING
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
      });
      console.log('Table created successfully!');
    } catch (error) {
      console.log('Error during migration:', error);
      throw error; // rethrow the error to halt the migration
    }
    console.log('Migration complete!');
  },
  async down(queryInterface, Sequelize) {
    console.log('Starting rollback...');
    try {
      console.log('Dropping table...');
      await queryInterface.dropTable('Groups');
      console.log('Table dropped successfully!');
    } catch (error) {
      console.log('Error during rollback:', error);
      throw error; // rethrow the error to halt the rollback
    }
    console.log('Rollback complete!');
  }
};
