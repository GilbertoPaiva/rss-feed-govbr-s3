import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../config/awsConfig.js';
import RSSService from '../services/rssService.js';

export const extractAndSaveRSS = async (req, res) => {
  try {
    const feed = await RSSService.fetchRSSFeed();
    
    // Tenta salvar no S3 (opcional)
    try {
      await s3Client.send(new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `rss-${Date.now()}.json`,
        Body: JSON.stringify(feed),
        ContentType: 'application/json'
      }));
    } catch (s3Error) {
      console.warn('Aviso: Falha ao salvar no S3', s3Error.message);
    }

    res.json({
      items: feed.items.slice(0, 5).map(item => ({
        title: item.title || 'Sem título',
        link: item.link || '#',
        description: item.description || 'Descrição não disponível',
        image: item.image || 'Sem imagem'
      }))
    });

  } catch (error) {
    console.error('Erro no controller:', error);
    res.status(500).json({ 
      error: 'Erro ao processar o RSS',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
};