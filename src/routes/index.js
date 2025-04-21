const express = require('express');
const feedController = require('../controllers/feedController');

const router = express.Router();

router.get('/feeds', feedController.getAllFeeds);
router.get('/feeds/:id', feedController.getFeedById);
router.post('/refresh', feedController.refreshFeeds);

module.exports = router;