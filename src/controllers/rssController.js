import AWS from 'aws-sdk';
import RSSService from '../services/rssService.js';

const s3 = new AWS.S3({ region: 'us-east-1' });
const bucketName = 'seu-bucket-s3'; 

export const extractAndSaveRSS = async (req, res) => {
  try {
    const feed = await RSSService.fetchRSSFeed(); 
    const jsonData = JSON.stringify(feed, null, 2);

    const params = {
      Bucket: bucketName,
      Key: 'rss-data.json',
      Body: jsonData,
      ContentType: 'application/json',
    };

    await s3.upload(params).promise();

    res.send('RSS extraído e salvo no S3 com sucesso.');
  } catch (error) {
    console.error('Erro ao processar RSS:', error);
    res.status(500).send('Erro ao processar RSS.');
  }
};
