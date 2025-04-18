// src/controllers/rssController.js
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../config/awsConfig.js';
import RSSService from '../services/rssService.js';

const bucketName = process.env.AWS_BUCKET_NAME;

export const extractAndSaveRSS = async (req, res) => {
  try {
    const feed = await RSSService.fetchRSSFeed();
    const jsonData = JSON.stringify(feed, null, 2);

    await s3Client.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: `rss-${Date.now()}.json`,
      Body: jsonData,
      ContentType: 'application/json'
    }));

    res.json({ 
      message: 'RSS extraído e salvo no S3 com sucesso',
      data: feed.items.slice(0, 3) // Retorna os 3 primeiros itens
    });
  } catch (error) {
    console.error('[extractAndSaveRSS] erro completo:', error);
    res.status(500).json({ error: error.message || 'Erro ao processar RSS' });
  }
};