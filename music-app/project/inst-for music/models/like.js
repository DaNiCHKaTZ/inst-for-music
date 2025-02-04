const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db.js');
const User = require('./user.js');
const Track = require('./track.js');

const Like = sequelize.define('Like', {}, {
    tableName: 'likes',
    timestamps: false
});

Like.belongsTo(User, { foreignKey: 'user_id' });
Like.belongsTo(Track, { foreignKey: 'track_id' });

module.exports = Like;
