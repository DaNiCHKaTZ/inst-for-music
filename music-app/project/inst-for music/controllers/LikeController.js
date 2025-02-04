const LikeService = require('../services/LikeService.js');

/**
 * @swagger
 * tags:
 *   name: Likes
 *   description: API для управления лайками
 */

class LikeController {
    /**
     * @swagger
     * /likes:
     *   get:
     *     summary: Получение всех лайков или лайков по треку
     *     tags: [Likes]
     *     parameters:
     *       - in: query
     *         name: track_id
     *         schema:
     *           type: integer
     *         description: Идентификатор трека
     *     responses:
     *       200:
     *         description: Список всех лайков или лайков по треку
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Like'
     */
    static async getAllLikes(req, res) {
        try {
            const trackId = req.query.track_id;
            const likes = trackId 
                ? await LikeService.getLikesByTrackId(trackId) 
                : await LikeService.getAllLikes();
            res.json(likes);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    /**
     * @swagger
     * /likes/{id}:
     *   get:
     *     summary: Получение лайка по ID
     *     tags: [Likes]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: Идентификатор лайка
     *     responses:
     *       200:
     *         description: Информация о лайке
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Like'
     *       404:
     *         description: Лайк не найден
     */
    static async getLikeById(req, res) {
        try {
            const like = await LikeService.getLikeById(req.params.id);
            if (like) {
                res.json(like);
            } else {
                res.status(404).json({ error: 'Like not found' });
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    /**
     * @swagger
     * /likes:
     *   post:
     *     summary: Создание нового лайка
     *     tags: [Likes]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Like'
     *     responses:
     *       201:
     *         description: Лайк успешно создан
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Like'
     *       500:
     *         description: Ошибка на сервере
     */
    static async createLike(req, res) {
        try {
            const { user_id, track_id } = req.body;
            if (!user_id) {
                return res.status(400).json({ error: '"user_id" is required' });
            }
            if (!track_id) {
                return res.status(400).json({ error: '"track_id" is required' });
            }
            const like = await LikeService.createLike(req.body);
            res.status(201).json(like);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    /**
     * @swagger
     * /likes/{id}:
     *   delete:
     *     summary: Удаление лайка
     *     tags: [Likes]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: Идентификатор лайка
     *     responses:
     *       200:
     *         description: Лайк успешно удален
     *       500:
     *         description: Ошибка на сервере
     */
    static async deleteLike(req, res) {
        try {
            await LikeService.deleteLike(req.params.id);
            res.json({ message: 'Like deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    /**
     * @swagger
     * /likes/user/{userId}/track/{trackId}:
     *   get:
     *     summary: Получение лайка по user_id и track_id
     *     tags: [Likes]
     *     parameters:
     *       - in: path
     *         name: userId
     *         schema:
     *           type: integer
     *         required: true
     *         description: Идентификатор пользователя
     *       - in: path
     *         name: trackId
     *         schema:
     *           type: integer
     *         required: true
     *         description: Идентификатор трека
     *     responses:
     *       200:
     *         description: Информация о лайке
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Like'
     *       404:
     *         description: Лайк не найден
     */
        static async getLikeByUserAndTrack(req, res) {
            try {
                const userId = parseInt(req.params.userId, 10);
                const trackId = parseInt(req.params.trackId, 10);
    
                if (isNaN(userId) || isNaN(trackId)) {
                    return res.status(400).json({ error: 'Invalid user ID or track ID' });
                }
    
                const like = await LikeService.getLikeByUserAndTrack(userId, trackId);
                res.json(like); 
            } catch (err) {
                console.error('Ошибка при обработке запроса:', err);
                res.status(500).json({ error: err.message });
            }
        }
    }
    

    


module.exports = LikeController;
