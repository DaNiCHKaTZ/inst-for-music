const TrackRepository = require('../repositories/TrackRepository.js');
const UserRepository = require('../repositories/UserRepository.js'); 
const logDbOperation = require('../dbLogger.js');

class TrackService {
    static async getAllTracks() {
        const tracks = await TrackRepository.findAll();
        await logDbOperation('read', 'tracks', null);

        return tracks.map(track => ({
            ...track.dataValues,
            link: track.link
        }));
    }

    static async getTrackById(id) {
        if (isNaN(id)) {
            throw new Error('Invalid track ID');
        }

        const track = await TrackRepository.findById(id);
        if (track) {
            const user = await UserRepository.findById(track.musician_id); 
            await logDbOperation('read', 'tracks', id);
            return { ...track.dataValues, artist: user ? user.name : 'Unknown' }; 
        }
        return null;
    }

    static async getTracksByUser(userId) {
        const tracks = await TrackRepository.findByUserId(userId);
        await logDbOperation('read', 'tracks', userId);
        return tracks;
    }

    static async createTrack(track) {
        const newTrack = await TrackRepository.create(track);
        await logDbOperation('create', 'tracks', newTrack.id);
        return newTrack;
    }

    static async updateTrack(id, track) {
        if (isNaN(id)) {
            throw new Error('Invalid track ID');
        }

        const updatedTrack = await TrackRepository.update(id, track);
        await logDbOperation('update', 'tracks', id);
        return updatedTrack;
    }

    static async deleteTrack(id) {
        if (isNaN(id)) {
            throw new Error('Invalid track ID');
        }

        await TrackRepository.delete(id);
        await logDbOperation('delete', 'tracks', id);
    }
}

module.exports = TrackService;
