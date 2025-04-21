const axios = require('axios');
const Parser = require('rss-parser');
const s3Service = require('./s3Service');
const dotenv = require('dotenv');

dotenv.config();

const parser = new Parser();
const RSS_URL = process.env.RSS_URL_GOVBR;
const CACHE_FILE_KEY = process.env.CACHE_FILE_KEY || 'rss-gov/rss-data.json';

async function fetchRSSFeed() {
  try {
    const response = await axios.get(RSS_URL);
    const feed = await parser.parseString(response.data);
    
    const processedFeed = {
      title: feed.title,
      description: feed.description,
      link: feed.link,
      lastUpdated: new Date().toISOString(),
      items: feed.items.map(item => ({
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        content: item.content,
        contentSnippet: item.contentSnippet,
        categories: item.categories || [],
        creator: item.creator || 'Governo Brasileiro'
      }))
    };
    
    await s3Service.saveToS3(CACHE_FILE_KEY, processedFeed);
    return processedFeed;
  } catch (error) {
    console.error('Erro ao buscar feed RSS:', error);
    
    try {
      const cachedFeed = await s3Service.getFileFromS3(CACHE_FILE_KEY);
      console.log('Usando feed RSS em cache do S3');
      return cachedFeed;
    } catch (cacheError) {
      throw new Error('Não foi possível obter o feed RSS nem do cache');
    }
  }
}

module.exports = {
  fetchRSSFeed
};