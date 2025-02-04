const Like = require('../models/like.js');

class LikeRepository {
    static findAll() {
        return Like.findAll();
    }

    static findByTrackId(trackId) {
        return Like.findAll({ where: { track_id: trackId } });
    }

    static findById(id) {
        return Like.findByPk(id);
    }

    static findByUserAndTrack(userId, trackId) {
        return Like.findOne({ where: { user_id: userId, track_id: trackId } });
    }

    static create(like) {
        return Like.create(like);
    }

    static delete(id) {
        return Like.destroy({ where: { id } });
    }
}

module.exports = LikeRepository;
