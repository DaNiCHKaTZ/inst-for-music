const request = require('supertest');
const express = require('express');
const UserController = require('../controllers/UserController');
const UserService = require('../services/UserService');
const passport = require('passport');
const { jwtSecret } = require('../config');
const jwt = require('jsonwebtoken');
const sequelize = require('../db');

const app = express();
app.use(express.json());
app.use(passport.initialize());

app.get('/users/:id', (req, res, next) => {
    req.user = { id: 1, login: 'testUser', role: 'admin' };
    next();
}, UserController.getUserById);


jest.mock('../services/UserService');

describe('GET /users/:id', () => {
    let token;
    beforeAll(() => {
        token = jwt.sign({ id: 1, login: 'testUser', role: 'admin' }, jwtSecret, { expiresIn: '1h' });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it('should return user by ID', async () => {
        const user = {
            id: 1,
            login: 'testUser',
            email: 'test@example.com',
            role: 'user',
            name: 'Test User'
        };

        UserService.getUserById.mockResolvedValue(user);
        const response = await request(app)
            .get('/users/1')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('login', 'testUser');
    });

    it('should return 404 if user not found', async () => {
        UserService.getUserById.mockResolvedValue(null);
        const response = await request(app)
            .get('/users/999')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', 'User not found');
    });
});
