const {Sequelize} = require('sequelize');
const config = require('./config/config.json').development

const db_module = require('./db')
const sequelize = db_module.sequelize

const Campaign = require('./models/campaigns')(sequelize, Sequelize);


exports.Campaign = Campaign