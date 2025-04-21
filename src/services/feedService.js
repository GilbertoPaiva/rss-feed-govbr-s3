const Parser = require('rss-parser');
const s3Service = require('./s3Service');
const dotenv = require('dotenv');

dotenv.config();

const parser = new Parser();

const RSS_URL = process.env.RSS_URL_GOVBR || 'https://www.gov.br/br/pt-br/rss';

async function getAllFeeds(source) {
    try {
        const fileName = source ? `${source}-feeds.json` : 'gov-feeds.json';
        const feeds = await s3Service.getFileFromS3(fileName);
        return feeds;
    } catch (error) {
        return [];
    }
}

async function refreshFeeds(source) {
    try {
        const feed = await parseRssFeed(RSS_URL);
        const fileName = source ? `${source}-feeds.json` : 'gov-feeds.json';
        
        await s3Service.saveToS3(fileName, feed.items);
        
        return feed.items;
    } catch (error) {
        throw error;
    }
}

async function parseRssFeed(url) {
    try {
        const feed = await parser.parseURL(url);
        return feed;
    } catch (error) {
        throw error;
    }
}

async function initializeFeeds() {
    try {
        const feeds = await getAllFeeds();
        
        if (!feeds || feeds.length === 0) {
            await refreshFeeds();
        }
    } catch (error) {
        console.error(`Erro na inicialização dos feeds: ${error.message}`);
    }
}

initializeFeeds();

module.exports = {
    getAllFeeds,
    refreshFeeds,
    parseRssFeed
};