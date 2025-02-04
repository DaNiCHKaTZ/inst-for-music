const request = require('supertest');
const express = require('express');
const AuthController = require('../controllers/AuthController');
const User = require('../models/user.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sequelize = require('../db');

const app = express();
app.use(express.json());

app.post('/register', AuthController.register);
app.post('/login', AuthController.login);

jest.mock('../models/user.js');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

beforeAll(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});

afterAll(async () => {
    await sequelize.close();
});

describe('AuthController', () => {
    describe('POST /register', () => {
        it('should register a new user', async () => {
            const mockUser = { id: 1, login: 'test', email: 'test@example.com', role: 'user', name: 'Test User' };
            bcrypt.hash.mockResolvedValue('hashedPassword');
            User.create.mockResolvedValue(mockUser);

            const response = await request(app)
                .post('/register')
                .send({ login: 'test', password: 'password', email: 'test@example.com', role: 'user', name: 'Test User' });

            expect(response.status).toBe(201);
            expect(response.body).toMatchObject(mockUser);
        });

        it('should return 500 on server error', async () => {
            bcrypt.hash.mockRejectedValue(new Error('hash error'));

            const response = await request(app)
                .post('/register')
                .send({ login: 'test', password: 'password', email: 'test@example.com', role: 'user', name: 'Test User' });

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('error', 'hash error');
        });
    });

    describe('POST /login', () => {
        it('should authenticate user', async () => {
            const mockUser = { id: 1, login: 'test', password: 'hashedPassword', email: 'test@example.com', role: 'user', name: 'Test User' };
            const token = 'jwtToken';

            User.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue(token);

            const response = await request(app)
                .post('/login')
                .send({ login: 'test', password: 'password' });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Login successful');
            expect(response.body).toHaveProperty('token', token);
            expect(response.body).toHaveProperty('user');
        });

        it('should return 401 for invalid login', async () => {
            User.findOne.mockResolvedValue(null);

            const response = await request(app)
                .post('/login')
                .send({ login: 'invalid', password: 'password' });

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('error', 'Invalid login or password');
        });

        it('should return 401 for invalid password', async () => {
            const mockUser = { id: 1, login: 'test', password: 'hashedPassword' };

            User.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(false);

            const response = await request(app)
                .post('/login')
                .send({ login: 'test', password: 'wrongpassword' });

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('error', 'Invalid login or password');
        });

        it('should return 500 on server error', async () => {
            User.findOne.mockRejectedValue(new Error('findOne error'));

            const response = await request(app)
                .post('/login')
                .send({ login: 'test', password: 'password' });

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('error', 'findOne error');
        });
    });
});
