const SubscriptionService = require('../services/SubscriptionService.js');

/**
 * @swagger
 * tags:
 *   name: Subscriptions
 *   description: API для управления подписками
 */

class SubscriptionController {
    /**
     * @swagger
     * /subscriptions:
     *   get:
     *     summary: Получение всех подписок
     *     tags: [Subscriptions]
     *     responses:
     *       200:
     *         description: Список всех подписок
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Subscription'
     */
        static async getAllSubscriptions(req, res) {
            try {
                const { user_id } = req.query;
                const subscriptions = await SubscriptionService.getAllSubscriptions(user_id);
                subscriptions.forEach(subscription => {
                    console.log(subscription.Track.link); 
                });
                res.json(subscriptions);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        }

    /**
     * @swagger
     * /subscriptions/{id}:
     *   get:
     *     summary: Получение подписки по ID
     *     tags: [Subscriptions]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: Идентификатор подписки
     *     responses:
     *       200:
     *         description: Информация о подписке
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Subscription'
     *       404:
     *         description: Подписка не найдена
     */
    static async getSubscriptionById(req, res) {
        try {
            const subscription = await SubscriptionService.getSubscriptionById(req.params.id);
            if (subscription) {
                res.json(subscription);
            } else {
                res.status(404).json({ error: 'Subscription not found' });
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    /**
     * @swagger
     * /subscriptions:
     *   post:
     *     summary: Создание новой подписки
     *     tags: [Subscriptions]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Subscription'
     *     responses:
     *       201:
     *         description: Подписка успешно создана
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Subscription'
     *       500:
     *         description: Ошибка на сервере
     */
    static async createSubscription(req, res) {
        try {
            const { track_id, user_id } = req.body;
            console.log('User ID:', user_id);
            console.log('Track ID:', track_id);
    
            if (!user_id) {
                return res.status(400).json({ error: 'user_id is required' });
            }
    
            if (!track_id) {
                return res.status(400).json({ error: 'trackId is required' });
            }
    
            const subscriptionData = { user_id, track_id };
            console.log('Creating subscription with data:', subscriptionData);
    
            const subscription = await SubscriptionService.createSubscription(subscriptionData);
            console.log('Subscription created:', subscription);
            res.status(201).json(subscription);
        } catch (err) {
            console.error('Error creating subscription:', err);
            res.status(500).json({ error: err.message });
        }
    }
    
    

    /**
     * @swagger
     * /subscriptions/{id}:
     *   delete:
     *     summary: Удаление подписки
     *     tags: [Subscriptions]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: Идентификатор подписки
     *     responses:
     *       200:
     *         description: Подписка успешно удалена
     *       500:
     *         description: Ошибка на сервере
     */
    static async deleteSubscription(req, res) {
        try {
            await SubscriptionService.deleteSubscription(req.params.id);
            res.json({ message: 'Subscription deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = SubscriptionController;
