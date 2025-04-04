import express from 'express';
import axios from 'axios';
import Parser from'rss-parser';
import AWS from 'aws-sdk';
import fs from 'fs';

const app = express();
const port = 3000;

const parser = new Parser();
const s3 = new AWS.S3({ region: 'us-east-1' });
const bucketName = 'seu-bucket-s3';

app.get('/extract', async (req, res) => {
  try {
    const feed = await parser.parseURL('https://www.gov.br/pt-br/rss');
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
});

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});