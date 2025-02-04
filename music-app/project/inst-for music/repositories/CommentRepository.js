const Comment = require('../models/comment.js');
const User = require('../models/user.js');
const Track = require('../models/track.js');
class CommentRepository {
    static async findAll(filter) {
        return Comment.findAll({
            where: filter,
            include: [{ model: User, attributes: ['name'] },
            { model: Track, attributes: ['title'] }]
        });
    }

    static findById(id) {
        return Comment.findByPk(id, {
            include: [{ model: User, attributes: ['name'] },
            { model: Track, attributes: ['title'] }]
        });
    }

    static create(comment) {
        return Comment.create(comment);
    }

    static update(id, comment) {
        return Comment.update(comment, { where: { id } });
    }

    static delete(id) {
        return Comment.destroy({ where: { id } });
    }
    static async findByUserId(userId) { 
        return Comment.findAll({ where: { user_id: userId }, include: [
            { model: User, attributes: ['name'] },
            { model: Track, attributes: ['title'] }
        ] });
    }
}

module.exports = CommentRepository;
