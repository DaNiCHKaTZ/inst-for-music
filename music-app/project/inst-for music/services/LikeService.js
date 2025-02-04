const LikeRepository = require('../repositories/LikeRepository.js');
const logDbOperation = require('../dbLogger.js');

class LikeService {
    static async getAllLikes() {
        const likes = await LikeRepository.findAll();
        await logDbOperation('read', 'likes', null); 
        return likes;
    }

    static async getLikesByTrackId(trackId) {
        const likes = await LikeRepository.findByTrackId(trackId);
        await logDbOperation('read', 'likes', null);
        return likes;
    }

    static async getLikeById(id) {
        const like = await LikeRepository.findById(id);
        await logDbOperation('read', 'likes', id); 
        return like;
    }

    static async getLikeByUserAndTrack(userId, trackId) {
        const like = await LikeRepository.findByUserAndTrack(userId, trackId);
        if (!like) { return null;}
        await logDbOperation('read', 'likes', like.id);
        return like;
    }

    static async createLike(like) {
        const newLike = await LikeRepository.create(like);
        await logDbOperation('create', 'likes', newLike.id);
        return newLike;
    }

    static async deleteLike(id) {
        await LikeRepository.delete(id);
        await logDbOperation('delete', 'likes', id); 
    }
}

module.exports = LikeService;
