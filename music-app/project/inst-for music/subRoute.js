const express = require('express');
const { getNewTracksAndSubscribe } = require('./controllers/subController');
const router = express.Router();

router.get('/check-new-tracks', getNewTracksAndSubscribe);

module.exports = router;
