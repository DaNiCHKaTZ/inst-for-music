const { DataTypes } = require('sequelize');
const sequelize = require('../db.js');

const HttpLog = sequelize.define('HttpLog', {
    method: DataTypes.STRING,
    url: DataTypes.STRING,
    status: DataTypes.INTEGER,
    responseTime: DataTypes.FLOAT,
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});


const DbLog = sequelize.define('DbLog', {
    operation: DataTypes.STRING,
    table: DataTypes.STRING,
    recordId: DataTypes.INTEGER,
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

module.exports = { HttpLog, DbLog };
