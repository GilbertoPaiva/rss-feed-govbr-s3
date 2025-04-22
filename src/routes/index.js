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
    const cachedFeed = await s3Service.getFileFromS3(process.env.CACHE_FILE_KEY || 'rss-gov/rss-data.json');
    if (cachedFeed) {
      res.json(cachedFeed);
    } else {
      res.status(404).json({ error: 'Cache não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/s3-status', async (req, res) => {
  try {
    const result = await s3Service.testS3Connection();
    if (result.success) {
      res.json({
        status: 'success',
        message: result.message,
        config: {
          bucket: process.env.S3_BUCKET_NAME,
          region: process.env.AWS_REGION,
          endpoint: process.env.S3_ENDPOINT || 'AWS padrão',
          cacheFileKey: process.env.CACHE_FILE_KEY || 'rss-gov/rss-data.json'
        }
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: result.message,
        config: {
          bucket: process.env.S3_BUCKET_NAME,
          region: process.env.AWS_REGION,
          endpoint: process.env.S3_ENDPOINT || 'AWS padrão',
          cacheFileKey: process.env.CACHE_FILE_KEY || 'rss-gov/rss-data.json'
        }
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

module.exports = router;