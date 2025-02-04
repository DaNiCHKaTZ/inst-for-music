const CommentRepository = require('../repositories/CommentRepository.js');
const UserService = require('../services/UserService.js');
const logDbOperation = require('../dbLogger.js');

class CommentService {
    static async getAllComments(track_id) {
        const comments = await CommentRepository.findAll({ track_id });
        const enrichedComments = await Promise.all(comments.map(async (comment) => {
            const user = await UserService.getUserById(comment.user_id);
            return {
                ...comment.dataValues,
                user_name: user.name
            };
        }));
        await logDbOperation('read', 'comments', null);
        return enrichedComments;
    }

    static async getCommentById(id) {
        const comment = await CommentRepository.findById(id);
        await logDbOperation('read', 'comments', id);
        return comment;
    }

    static async createComment(comment) {
        const newComment = await CommentRepository.create(comment);
        await logDbOperation('create', 'comments', newComment.id);
        return newComment;
    }

    static async updateComment(id, comment) {
        const updatedComment = await CommentRepository.update(id, comment);
        await logDbOperation('update', 'comments', id);
        return updatedComment;
    }

    static async deleteComment(userId, userRole, commentId) {
        const comment = await CommentRepository.findById(commentId);
        if (!comment) {
            throw new Error('Comment not found');
        }
        if (comment.user_id !== userId && userRole !== 'admin') {
            throw new Error('You are not authorized to delete this comment');
        }
        await CommentRepository.delete(commentId);
        await logDbOperation('delete', 'comments', commentId);
    }

    static async getCommentsByUser(userId) { 
        return await CommentRepository.findByUserId(userId); 
    }
    
}

module.exports = CommentService;
