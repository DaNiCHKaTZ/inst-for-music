const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Music API',
            version: '1.0.0',
            description: 'API документация для вашего музыкального приложения'
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Local server'
            }
        ],
        components: {
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', description: 'Идентификатор пользователя' },
                        login: { type: 'string', description: 'Логин пользователя' },
                        password: { type: 'string', description: 'Пароль пользователя' },
                        email: { type: 'string', description: 'Электронная почта пользователя' },
                        role: { type: 'string', description: 'Роль пользователя' },
                        name: { type: 'string', description: 'Имя пользователя' }
                    },
                    required: ['login', 'password', 'email', 'role', 'name']
                },
                Track: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', description: 'Идентификатор трека' },
                        title: { type: 'string', description: 'Название трека' },
                        artist: { type: 'string', description: 'Исполнитель трека' },
                        album: { type: 'string', description: 'Альбом трека' },
                        duration: { type: 'string', description: 'Длительность трека' }
                    },
                    required: ['title', 'artist', 'album', 'duration']
                },
                Comment: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', description: 'Идентификатор комментария' },
                        userId: { type: 'integer', description: 'Идентификатор пользователя' },
                        trackId: { type: 'integer', description: 'Идентификатор трека' },
                        content: { type: 'string', description: 'Содержание комментария' },
                        timestamp: { type: 'string', format: 'date-time', description: 'Время создания комментария' }
                    },
                    required: ['userId', 'trackId', 'content']
                },
                Subscription: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', description: 'Идентификатор подписки' },
                        userId: { type: 'integer', description: 'Идентификатор пользователя' },
                        trackId: { type: 'integer', description: 'Идентификатор трека' },
                        startDate: { type: 'string', format: 'date', description: 'Дата начала подписки' },
                        endDate: { type: 'string', format: 'date', description: 'Дата окончания подписки' }
                    },
                    required: ['userId', 'trackId', 'startDate', 'endDate']
                },
                Like: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', description: 'Идентификатор лайка' },
                        userId: { type: 'integer', description: 'Идентификатор пользователя' },
                        trackId: { type: 'integer', description: 'Идентификатор трека' }
                    },
                    required: ['userId', 'trackId']
                }
            }
        }
    },
    apis: ['./controllers/*.js']
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwagger = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwagger;
