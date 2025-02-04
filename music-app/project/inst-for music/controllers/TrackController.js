const TrackService = require('../services/TrackService.js');

/**
 * @swagger
 * tags:
 *   name: Tracks
 *   description: API для управления треками
 */

class TrackController {
    static async getAllTracks(req, res) {
        try {
            const tracks = await TrackService.getAllTracks();
            res.json(tracks);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
/**
 * @swagger
 * /tracks/{id}:
 *   get:
 *     summary: Получение трека по ID
 *     tags: [Tracks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID трека
 *     responses:
 *       200:
 *         description: Успешное получение трека
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Track'
 *       400:
 *         description: Неверный ID трека
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid track ID
 *       404:
 *         description: Трек не найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Track not found
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

    static async getTrackById(req, res) {
        try {
            const trackId = parseInt(req.params.id, 10); 
            if (isNaN(trackId)) {
                return res.status(400).json({ error: 'Invalid track ID' });
            }

            const track = await TrackService.getTrackById(trackId);
            if (track) {
                res.json(track);
            } else {
                res.status(404).json({ error: 'Track not found' });
            }
        } catch (err) {
            console.error('Ошибка при обработке запроса:', err); 
            res.status(500).json({ error: err.message });
        }
    }

    /**
     * @swagger
     * /tracks/user/{userId}:
     *   get:
     *     summary: Получение треков по ID пользователя
     *     tags: [Tracks]
     *     parameters:
     *       - in: path
     *         name: userId
     *         schema:
     *           type: integer
     *         required: true
     *         description: Идентификатор пользователя
     *     responses:
     *       200:
     *         description: Список треков пользователя
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Track'
     *       404:
     *         description: Треки не найдены
     */
    static async getTracksByUser(req, res) {
        try {
            const userId = parseInt(req.params.userId, 10);
            if (isNaN(userId)) {
                return res.status(400).json({ error: 'Invalid user ID' });
            }

            const tracks = await TrackService.getTracksByUser(userId);
            res.json(tracks);
        } catch (err) {
            console.error('Ошибка при обработке запроса:', err);
            res.status(500).json({ error: err.message });
        }
    }

    /**
     * @swagger
     * /tracks:
     *   post:
     *     summary: Создание нового трека
     *     tags: [Tracks]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Track'
     *     responses:
     *       201:
     *         description: Трек успешно создан
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Track'
     *       500:
     *         description: Ошибка на сервере
     */
    static async createTrack(req, res) {
        try {
            const trackData = req.body;
            if (!trackData.musician_id) {
                return res.status(400).json({ error: '"musician_id" is required' });
            }
            const track = await TrackService.createTrack(trackData);
            res.status(201).json(track);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
/**
 * @swagger
 * /tracks/{id}:
 *   put:
 *     summary: Обновление трека
 *     tags: [Tracks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID трека
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Название трека
 *               artist:
 *                 type: string
 *                 description: Исполнитель трека
 *               genre:
 *                 type: string
 *                 description: Жанр трека
 *               releaseDate:
 *                 type: string
 *                 format: date
 *                 description: Дата выхода трека
 *     responses:
 *       200:
 *         description: Трек успешно обновлен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Track updated successfully
 *       400:
 *         description: Неверный ID трека
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid track ID
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

    static async updateTrack(req, res) {
        try {
            const trackId = parseInt(req.params.id, 10); 
            if (isNaN(trackId)) {
                return res.status(400).json({ error: 'Invalid track ID' });
            }

            await TrackService.updateTrack(trackId, req.body);
            res.json({ message: 'Track updated successfully' });
        } catch (err) {
            console.error('Ошибка при обработке запроса:', err);
            res.status(500).json({ error: err.message });
        }
    }
/**
 * @swagger
 * /tracks/{id}:
 *   delete:
 *     summary: Удаление трека
 *     tags: [Tracks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID трека
 *     responses:
 *       200:
 *         description: Трек успешно удален
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Track deleted successfully
 *       400:
 *         description: Неверный ID трека
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid track ID
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

    static async deleteTrack(req, res) {
        try {
            const trackId = parseInt(req.params.id, 10); 
            if (isNaN(trackId)) {
                return res.status(400).json({ error: 'Invalid track ID' });
            }

            await TrackService.deleteTrack(trackId);
            res.json({ message: 'Track deleted successfully' });
        } catch (err) {
            console.error('Ошибка при обработке запроса:', err); 
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = TrackController;
