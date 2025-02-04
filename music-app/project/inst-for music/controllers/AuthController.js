const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const { jwtSecret } = require('../config.js');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API для аутентификации пользователей
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Регистрация нового пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - login
 *               - password
 *               - email
 *               - role
 *               - name
 *             properties:
 *               login:
 *                 type: string
 *                 description: Логин пользователя
 *               password:
 *                 type: string
 *                 description: Пароль пользователя
 *               email:
 *                 type: string
 *                 description: Электронная почта пользователя
 *               role:
 *                 type: string
 *                 description: Роль пользователя
 *               name:
 *                 type: string
 *                 description: Имя пользователя
 *     responses:
 *       201:
 *         description: Пользователь успешно зарегистрирован
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Ошибка на сервере
 */
exports.register = async (req, res) => {
    const { login, password, email, role, name } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            login,
            password: hashedPassword,
            email,
            role,
            name
        });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Аутентификация пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - login
 *               - password
 *             properties:
 *               login:
 *                 type: string
 *                 description: Логин пользователя
 *               password:
 *                 type: string
 *                 description: Пароль пользователя
 *     responses:
 *       200:
 *         description: Успешная аутентификация
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 token:
 *                   type: string
 *                   description: JWT токен
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Неверный логин или пароль
 *       500:
 *         description: Ошибка на сервере
 */
exports.login = async (req, res) => {
    const { login, password } = req.body;

    try {
        const user = await User.findOne({ where: { login } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid login or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid login or password' });
        }

        const token = jwt.sign({ id: user.id, login: user.login, role: user.role }, jwtSecret, { expiresIn: '1h' });

        res.json({ message: 'Login successful', token, user }); 
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
