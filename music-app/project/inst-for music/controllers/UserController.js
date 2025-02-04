const UserService = require('../services/UserService.js');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API для управления пользователями
 */

class UserController {
    /**
     * @swagger
     * /users:
     *   get:
     *     summary: Получение всех пользователей
     *     tags: [Users]
     *     responses:
     *       200:
     *         description: Список всех пользователей
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/User'
     */
    static async getAllUsers(req, res) {
        try {
            const users = await UserService.getAllUsers();
            res.json(users);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    /**
     * @swagger
     * /users/{id}:
     *   get:
     *     summary: Получение пользователя по ID
     *     tags: [Users]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: Идентификатор пользователя
     *     responses:
     *       200:
     *         description: Информация о пользователе
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     *       403:
     *         description: Доступ запрещен
     *       404:
     *         description: Пользователь не найден
     */
    static async getUserById(req, res) {
        try {
            const userIdFromToken = req.user.id;
            if (req.user.role !== 'admin' && userIdFromToken !== parseInt(req.params.id)) {
                return res.status(403).json({ message: 'Forbidden: Access is denied' });
            }

            const user = await UserService.getUserById(req.params.id);
            if (user) {
                res.json(user);
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    /**
     * @swagger
     * /users:
     *   post:
     *     summary: Создание нового пользователя
     *     tags: [Users]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/User'
     *     responses:
     *       201:
     *         description: Пользователь успешно создан
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     *       500:
     *         description: Ошибка на сервере
     */
    static async createUser(req, res) {
        try {
            const user = await UserService.createUser(req.body);
            res.status(201).json(user);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    /**
     * @swagger
     * /users/{id}:
     *   put:
     *     summary: Обновление информации о пользователе
     *     tags: [Users]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: Идентификатор пользователя
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/User'
     *     responses:
     *       200:
     *         description: Пользователь успешно обновлен
     *       403:
     *         description: Доступ запрещен
     *       500:
     *         description: Ошибка на сервере
     */
    static async updateUser(req, res) {
        try {
            const userIdFromToken = req.user.id;
            if (req.user.role !== 'admin' && userIdFromToken !== parseInt(req.params.id)) {
                return res.status(403).json({ message: 'Forbidden: Access is denied' });
            }

            const updateData = { name: req.body.name, email: req.body.email, login: req.body.login };

            await UserService.updateUser(req.params.id, updateData);
            res.json({ message: 'User updated successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }






    /**
     * @swagger
     * /users/{id}:
     *   delete:
     *     summary: Удаление пользователя
     *     tags: [Users]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: Идентификатор пользователя
     *     responses:
     *       200:
     *         description: Пользователь успешно удален
     *       403:
     *         description: Доступ запрещен
     *       500:
     *         description: Ошибка на сервере
     */
    static async deleteUser(req, res) {
        try {
            const userIdFromToken = req.user.id;
            if (req.user.role !== 'admin' && userIdFromToken !== parseInt(req.params.id)) {
                return res.status(403).json({ message: 'Forbidden: Access is denied' });
            }

            await UserService.deleteUser(req.params.id);
            res.json({ message: 'User deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Удаление пользователя по ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Пользователь успешно удален
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User deleted successfully
 *       403:
 *         description: Доступ запрещен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Forbidden: Only admins can delete users
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

    static async deleteUserById(req, res) {
    try {
        const userRole = req.user.role;
        if (userRole !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Only admins can delete users' });
        }

        const userId = req.params.id;
        await UserService.deleteUserById(userId);
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
    
}

module.exports = UserController;
