const Parser = require('rss-parser');
const { v4: uuidv4 } = require('uuid');
const s3Service = require('./s3Service');

const parser = new Parser();
const RSS_URL = 'https://www.gov.br/governodigital/pt-br/noticias/rss';
const FILE_NAME = 'feeds.json';

const parseRssFeed = async () => {
  try {
    const feed = await parser.parseURL(RSS_URL);
    
    const items = feed.items.map(item => ({
      id: uuidv4(),
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      content: item.content,
      contentSnippet: item.contentSnippet,
      categories: item.categories || [],
      creator: item.creator || 'Gov.br',
      isoDate: item.isoDate
    }));

    return items;
  } catch (error) {
    console.error('Erro ao fazer parse do RSS:', error);
    throw error;
  }
};

const getAllFeeds = async () => {
  try {
    const fileContent = await s3Service.getFileFromS3(FILE_NAME);
    return fileContent ? JSON.parse(fileContent) : [];
  } catch (error) {
    console.error('Erro ao obter feeds do S3:', error);
    return [];
  }
};

const getFeedById = async (id) => {
  try {
    const feeds = await getAllFeeds();
    return feeds.find(feed => feed.id === id);
  } catch (error) {
    console.error('Erro ao obter feed por ID:', error);
    throw error;
  }
};

const refreshFeeds = async () => {
  try {
    const feeds = await parseRssFeed();
    await s3Service.saveToS3(FILE_NAME, JSON.stringify(feeds));
    return feeds;
  } catch (error) {
    console.error('Erro ao atualizar feeds:', error);
    throw error;
  }
};

module.exports = {
  getAllFeeds,
  getFeedById,
  refreshFeeds,
  parseRssFeed
};