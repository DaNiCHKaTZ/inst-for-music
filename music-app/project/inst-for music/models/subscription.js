const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db.js');
const User = require('./user.js');
const Track = require('./track.js');
const Subscription = sequelize.define('Subscription', {}, {
    tableName: 'subscriptions',
    timestamps: false
});

Subscription.belongsTo(User, { foreignKey: 'user_id' });
Subscription.belongsTo(Track, { foreignKey: 'track_id'});

module.exports = Subscription;
