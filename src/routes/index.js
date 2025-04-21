const express = require('express');
const rssService = require('../services/rssService');
const s3Service = require('../services/s3Service');

const router = express.Router();

router.get('/feed', async (req, res) => {
  try {
    const feed = await rssService.fetchRSSFeed();
    res.json(feed);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/cache', async (req, res) => {
  try {
    const cachedFeed = await s3Service.getRSSFromS3();
    if (cachedFeed) {
      res.json(cachedFeed);
    } else {
      res.status(404).json({ error: 'Cache não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;