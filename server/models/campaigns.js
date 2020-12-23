'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Campaigns extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Campaigns.init({
    CampaignName: DataTypes.STRING,
    CampaignQuest: DataTypes.STRING,
    CampaignSituation: DataTypes.STRING,
    User_id: DataTypes.STRING,
    Number: DataTypes.INTEGER,
    UserList: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Campaigns',
  });
  return Campaigns;
};