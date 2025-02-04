const Track = require('../models/track.js');

class TrackRepository {
    static findAll() {
        return Track.findAll();
    }

    static findById(id) {
        if (isNaN(id)) {
            throw new Error('Invalid track ID');
        }
        
        return Track.findByPk(id);
    }

    static findByUserId(userId) {
        return Track.findAll({ where: { musician_id: userId } });
    }

    static create(track) {
        return Track.create(track);
    }

    static update(id, track) {
        if (isNaN(id)) {
            throw new Error('Invalid track ID');
        }

        return Track.update(track, { where: { id } });
    }

    static delete(id) {
        if (isNaN(id)) {
            throw new Error('Invalid track ID');
        }
        
        return Track.destroy({ where: { id } });
    }
}

module.exports = TrackRepository;
