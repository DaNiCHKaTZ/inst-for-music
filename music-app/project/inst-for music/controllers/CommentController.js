const CommentService = require('../services/CommentService.js');
const UserService = require('../services/UserService.js');
/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: API для управления комментариями
 */

class CommentController {
    /**
 * @swagger
 * /comments:
 *   get:
 *     summary: Получение всех комментариев
 *     tags: [Comments]
 *     parameters:
 *       - in: query
 *         name: track_id
 *         schema:
 *           type: string
 *         required: false
 *         description: ID трека для фильтрации комментариев
 *     responses:
 *       200:
 *         description: Успешное получение комментариев
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       500:
 *         description: Ошибка на сервере
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Ошибка на сервере
 */

    static async getAllComments(req, res) {
        try {
            const { track_id } = req.query;
            const comments = await CommentService.getAllComments(track_id);
            res.json(comments);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
/**
 * @swagger
 * /comments/{id}:
 *   get:
 *     summary: Получение комментария по ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID комментария
 *     responses:
 *       200:
 *         description: Успешное получение комментария
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Комментарий не найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Comment not found
 *       500:
 *         description: Ошибка на сервере
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Ошибка на сервере
 */

    static async getCommentById(req, res) {
        try {
            const comment = await CommentService.getCommentById(req.params.id);
            if (comment) {
                res.json(comment);
            } else {
                res.status(404).json({ error: 'Comment not found' });
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Создание нового комментария
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - track_id
 *               - content
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: ID пользователя
 *               track_id:
 *                 type: string
 *                 description: ID трека
 *               content:
 *                 type: string
 *                 description: Содержание комментария
 *     responses:
 *       201:
 *         description: Комментарий успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       500:
 *         description: Ошибка на сервере
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Ошибка на сервере
 */

    static async createComment(req, res) {
        try {
            const { user_id, track_id, content } = req.body;
            const user = await UserService.getUserById(user_id);
            const comment = await CommentService.createComment({
                user_id,
                track_id,
                content,
                user_name: user.name,
                created_data: new Date()
            });
            res.status(201).json(comment);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
/**
 * @swagger
 * /comments/{id}:
 *   put:
 *     summary: Обновление комментария
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID комментария
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: Новое содержание комментария
 *     responses:
 *       200:
 *         description: Комментарий успешно обновлен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       500:
 *         description: Ошибка на сервере
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Ошибка на сервере
 */

    static async updateComment(req, res) {
        try {
            await CommentService.updateComment(req.params.id, req.body);
            res.json({ message: 'Comment updated successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Удаление комментария
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID комментария
 *     responses:
 *       200:
 *         description: Комментарий успешно удален
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Comment deleted successfully
 *       400:
 *         description: Неверный ID комментария
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid comment ID
 *       500:
 *         description: Ошибка на сервере
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Ошибка на сервере
 */

    static async deleteComment(req, res) {
        try {
            const userId = req.user.id;
            const userRole = req.user.role;
            const commentId = parseInt(req.params.id, 10);
    
            if (isNaN(commentId)) {
                return res.status(400).json({ error: 'Invalid comment ID' });
            }
    
            await CommentService.deleteComment(userId, userRole, commentId);
            res.json({ message: 'Comment deleted successfully' });
        } catch (err) {
            console.error('Ошибка при удалении комментария:', err);
            res.status(500).json({ error: err.message });
        }
    }
    /**
 * @swagger
 * /comments/user/{userId}:
 *   get:
 *     summary: Получение комментариев пользователя по ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Успешное получение комментариев
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       500:
 *         description: Ошибка на сервере
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Ошибка на сервере
 */

    static async getCommentsByUser(req, res) {
        try {
            const userId = req.params.userId;
            const comments = await CommentService.getCommentsByUser(userId);
            res.json(comments);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    

}

module.exports = CommentController;
