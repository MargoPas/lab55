'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Campaigns', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      CampaignName: {
        type: Sequelize.STRING
      },
      CampaignQuest: {
        type: Sequelize.STRING
      },
      CampaignSituation: {
        type: Sequelize.STRING
      },
      User_id: {
        type: Sequelize.STRING
      },
      Number: {
        type: Sequelize.INTEGER
      },
      UserList: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Campaigns');
  }
};