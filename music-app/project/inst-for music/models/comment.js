const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db.js');
const User = require('./user.js');
const Track = require('./track.js');

const Comment = sequelize.define('Comment', {
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    created_data: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'сomments',
    timestamps: false
});

Comment.belongsTo(User, { foreignKey: 'user_id' });
Comment.belongsTo(Track, { foreignKey: 'track_id' });

module.exports = Comment;
