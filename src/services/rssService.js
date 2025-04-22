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
    console.log(`Tentando buscar feed RSS de: ${RSS_URL}`);
    const response = await axios.get(RSS_URL, { 
      timeout: 10000,
      headers: {
        'User-Agent': 'RSS Reader/1.0'
      }
    });
    
    const feed = await parser.parseString(response.data);
    
    const processedFeed = {
      title: feed.title,
      description: feed.description || 'Portal de Notícias do Governo Digital',
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
    
    console.log(`Feed RSS obtido com sucesso. Total de itens: ${processedFeed.items.length}`);
    
    try {
      await s3Service.saveToS3(CACHE_FILE_KEY, processedFeed);
      console.log('Feed salvo com sucesso no S3');
    } catch (s3Error) {
      console.error('Falha ao salvar feed no S3, mas continuando com o feed online:', s3Error.message);
    }
    
    return processedFeed;
  } catch (error) {
    console.error('Erro ao buscar feed RSS:', error.message);
    
    try {
      console.log('Tentando obter feed do cache S3...');
      const cachedFeed = await s3Service.getFileFromS3(CACHE_FILE_KEY);
      console.log('Feed obtido do cache S3 com sucesso');
      
      cachedFeed.fromCache = true;
      cachedFeed.retrievedFromCache = new Date().toISOString();
      
      return cachedFeed;
    } catch (cacheError) {
      console.error('Erro ao buscar feed do cache:', cacheError.message);
      
      if (cacheError.code === 'NoSuchKey') {
        console.log('Arquivo de cache não encontrado. Criando um feed vazio inicial.');
        const emptyFeed = {
          title: 'Portal Gov.br',
          description: 'Portal de Notícias do Governo Digital',
          link: RSS_URL,
          lastUpdated: new Date().toISOString(),
          items: [],
          isEmptyInitialFeed: true
        };
        
        try {
          await s3Service.saveToS3(CACHE_FILE_KEY, emptyFeed);
          console.log('Feed vazio inicial salvo com sucesso no S3');
          return emptyFeed;
        } catch (saveError) {
          console.error('Erro ao salvar feed vazio inicial:', saveError.message);
        }
      }
      
      await s3Service.testS3Connection();
      
      return {
        title: 'Portal Gov.br',
        description: 'Feed temporariamente indisponível',
        link: RSS_URL,
        lastUpdated: new Date().toISOString(),
        items: [],
        error: true,
        errorMessage: 'Não foi possível obter o feed RSS nem do cache'
      };
    }
  }
}

module.exports = {
  fetchRSSFeed
};