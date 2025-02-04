const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
const sequelize = require('./db.js');
const UserController = require('./controllers/UserController.js');
const TrackController = require('./controllers/TrackController.js');
const CommentController = require('./controllers/CommentController.js');
const LikeController = require('./controllers/LikeController.js');
const SubscriptionController = require('./controllers/SubscriptionController.js');
const AuthController = require('./controllers/AuthController.js');
const passport = require('./Passport.js');
const { validateUser, validateTrack, validateComment, validateLike, validateSubscription } = require('./validation/MiddlewareValidation.js');
const checkRole = require('./middleware/RoleMiddleware.js');
const morgan = require('morgan');
const fs = require('fs');
const setupSwagger = require('./swagger.js');
const { HttpLog } = require('./models/logModel.js');

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:3001', credentials: true }));
app.use(passport.initialize());
app.use(fileUpload()); 
app.use(morgan(':method :url :status :response-time ms', {
    stream: {
        write: async (message) => {
            const logParts = message.trim().split(' ');
            const method = logParts[0];
            const url = logParts[1];
            const status = parseInt(logParts[2], 10);
            const responseTime = parseFloat(logParts[3]);

            await HttpLog.create({ method, url, status, responseTime });
        }
    }
}));


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

setupSwagger(app);

app.get('/', (req, res) => {
    res.send('Welcome to the music API!');
});

app.post('/register', validateUser, AuthController.register);
app.post('/login', AuthController.login);

app.get('/users', passport.authenticate('jwt', { session: false }), checkRole(['admin', 'user']), UserController.getAllUsers);
app.get('/users/:id', passport.authenticate('jwt', { session: false }), checkRole(['admin', 'user']), UserController.getUserById);
app.post('/users', passport.authenticate('jwt', { session: false }), checkRole(['admin']), validateUser, UserController.createUser);
app.put('/users/:id', passport.authenticate('jwt', { session: false }), checkRole(['admin', 'user']), validateUser, UserController.updateUser);
app.delete('/users/:id', passport.authenticate('jwt', { session: false }), checkRole(['admin', 'user']), UserController.deleteUser);
app.delete('/users/deleteById/:id', passport.authenticate('jwt', { session: false }), checkRole(['admin']), UserController.deleteUserById);

app.get('/tracks', passport.authenticate('jwt', { session: false }), checkRole(['admin', 'user']), TrackController.getAllTracks);
app.get('/tracks/:id', passport.authenticate('jwt', { session: false }), checkRole(['admin', 'user']), TrackController.getTrackById);
app.post('/tracks', passport.authenticate('jwt', { session: false }), checkRole(['admin', 'user']), validateTrack, TrackController.createTrack);
app.put('/tracks/:id', passport.authenticate('jwt', { session: false }), checkRole(['admin', 'user']), validateTrack, TrackController.updateTrack);
app.delete('/tracks/:id', passport.authenticate('jwt', { session: false }), checkRole(['admin', 'user']), TrackController.deleteTrack);
app.get('/tracks/user/:userId', passport.authenticate('jwt', { session: false }), checkRole(['admin', 'user']), TrackController.getTracksByUser);

app.get('/comments', passport.authenticate('jwt', { session: false }), checkRole(['admin', 'user']), CommentController.getAllComments);
app.get('/comments/:id', passport.authenticate('jwt', { session: false }), checkRole(['admin', 'user']), CommentController.getCommentById);
app.post('/comments', passport.authenticate('jwt', { session: false }), checkRole(['admin', 'user']), validateComment, CommentController.createComment);
app.put('/comments/:id', passport.authenticate('jwt', { session: false }), checkRole(['admin']), validateComment, CommentController.updateComment);
app.delete('/comments/:id', passport.authenticate('jwt', { session: false }), checkRole(['admin', 'user']), CommentController.deleteComment);
app.get('/comments/user/:userId', passport.authenticate('jwt', { session: false }), checkRole(['admin']), CommentController.getCommentsByUser);

app.get('/likes', passport.authenticate('jwt', { session: false }), checkRole(['admin', 'user']), LikeController.getAllLikes);
app.get('/likes/:id', passport.authenticate('jwt', { session: false }), checkRole(['admin', 'user']), LikeController.getLikeById);
app.post('/likes', passport.authenticate('jwt', { session: false }), checkRole(['admin', 'user']), validateLike, LikeController.createLike);
app.delete('/likes/:id', passport.authenticate('jwt', { session: false }), checkRole(['admin', 'user']), LikeController.deleteLike);
app.get('/likes/user/:userId/track/:trackId', passport.authenticate('jwt', { session: false }), checkRole(['admin', 'user']), (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    const trackId = parseInt(req.params.trackId, 10);
    if (isNaN(userId) || isNaN(trackId)) {
        return res.status(400).json({ error: 'Invalid user ID or track ID' });
    }
    LikeController.getLikeByUserAndTrack(req, res);
});

app.get('/subscriptions', passport.authenticate('jwt', { session: false }), checkRole(['admin', 'user']), SubscriptionController.getAllSubscriptions);
app.get('/subscriptions/:id', passport.authenticate('jwt', { session: false }), checkRole(['admin', 'user']), SubscriptionController.getSubscriptionById);
app.post('/subscriptions', passport.authenticate('jwt', { session: false }), checkRole(['admin', 'user']), validateSubscription, SubscriptionController.createSubscription);
app.delete('/subscriptions/:id', passport.authenticate('jwt', { session: false }), checkRole(['admin', 'user']), SubscriptionController.deleteSubscription);

app.post('/upload', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    const file = req.files.file;
    const uploadPath = path.join(__dirname, 'uploads', file.name);

    fs.mkdirSync(path.join(__dirname, 'uploads'), { recursive: true });

    file.mv(uploadPath, (err) => {
        if (err) {
            return res.status(500).send(err);
        }

        const filePath = `/uploads/${file.name}`;
        const fullPath = `http://localhost:3000${filePath}`;
        res.json({ filePath: fullPath });
    });
});


const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

sequelize.sync()
    .then(() => {
        console.log('Database created!');
    });
