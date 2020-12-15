const {Sequelize} = require('sequelize');
const config = require('./config/config.json').development
const sequelize = new Sequelize('users', 'Rita', 'no_passwd', {
    host: config.host,
    dialect: 'postgres'
});

const User = require('./models/user')(sequelize, Sequelize);

async function connect() {
    sequelize
        .authenticate()
        .then(() => console.log('Connected.'))
        .catch(err => console.error('Connection error: ', err))
}

//модель

//создание таблицы
async function synchronize(){
sequelize.sync().then(result=>{
    console.log('table is done');
})
    .catch(err=> console.log(err));
}



exports.synchronize = synchronize()
module.exports.sequelize = sequelize
exports.connect = connect()
exports.User = User
