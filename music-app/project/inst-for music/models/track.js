const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db.js');
const User = require('./user.js');

const Track = sequelize.define('Track', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    genre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    link: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'tracks',
    timestamps: false
});

Track.belongsTo(User, { foreignKey: 'musician_id' });

module.exports = Track;
