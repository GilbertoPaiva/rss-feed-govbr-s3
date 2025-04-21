const express = require('express');
const router = express.Router();
const feedController = require('../controllers/feedController');

router.get('/feeds', feedController.getAllFeeds);
router.get('/feeds/:id', feedController.getFeedById);
router.post('/feeds/refresh', feedController.refreshFeeds);
router.post('/feeds', feedController.fetchAndSaveFeed);
router.get('/feed/:feedId', feedController.getFeed);

module.exports = router;