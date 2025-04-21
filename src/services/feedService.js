const Parser = require('rss-parser');
const { v4: uuidv4 } = require('uuid');
const { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const { sdkStreamMixin } = require('@aws-sdk/util-stream-node');

const parser = new Parser();
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1'
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'rss-feeds-bucket';
const DEFAULT_RSS_URL = process.env.DEFAULT_RSS_URL || 'https://rss.uol.com.br/feed/tecnologia.xml';

async function fetchFeed(url) {
  try {
    const feed = await parser.parseURL(url);
    return feed;
  } catch (error) {
    console.error('Error fetching feed:', error);
    throw new Error(`Failed to fetch feed from ${url}: ${error.message}`);
  }
}

async function saveFeedToS3(feed) {
  const feedId = uuidv4();
  const timestamp = new Date().toISOString();
  
  const feedData = {
    id: feedId,
    title: feed.title,
    description: feed.description,
    link: feed.link,
    items: feed.items.map(item => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      content: item.content,
      contentSnippet: item.contentSnippet
    })),
    fetchedAt: timestamp
  };

  const key = `feeds/${feedId}.json`;
  
  try {
    await s3Client.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: JSON.stringify(feedData),
      ContentType: 'application/json'
    }));
    
    return { feedId, key };
  } catch (error) {
    console.error('Error saving feed to S3:', error);
    throw new Error(`Failed to save feed to S3: ${error.message}`);
  }
}

async function getFeedFromS3(feedId) {
  const key = `feeds/${feedId}.json`;
  
  try {
    const response = await s3Client.send(new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key
    }));
    
    const stream = sdkStreamMixin(response.Body);
    const chunks = [];
    
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    
    const feedData = JSON.parse(Buffer.concat(chunks).toString('utf-8'));
    return feedData;
  } catch (error) {
    console.error('Error retrieving feed from S3:', error);
    throw new Error(`Failed to retrieve feed ${feedId} from S3: ${error.message}`);
  }
}

async function getAllFeeds() {
  try {
    const response = await s3Client.send(new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: 'feeds/'
    }));

    if (!response.Contents || response.Contents.length === 0) {
      return [];
    }

    const feeds = [];
    for (const item of response.Contents) {
      try {
        const feedKey = item.Key;
        // Extrair o ID do feed da chave
        const feedId = feedKey.replace('feeds/', '').replace('.json', '');
        
        const feedData = await getFeedFromS3(feedId);
        feeds.push({
          id: feedData.id,
          title: feedData.title,
          description: feedData.description,
          fetchedAt: feedData.fetchedAt
        });
      } catch (error) {
        console.error(`Error getting feed from key ${item.Key}:`, error);
      }
    }

    return feeds;
  } catch (error) {
    console.error('Error listing feeds from S3:', error);
    throw new Error(`Failed to list feeds from S3: ${error.message}`);
  }
}

async function getFeedById(id) {
  try {
    return await getFeedFromS3(id);
  } catch (error) {
    console.error(`Error getting feed with ID ${id}:`, error);
    return null;
  }
}

async function refreshFeeds() {
  try {
    const currentFeeds = await getAllFeeds();
    const refreshedFeeds = [];

    for (const feed of currentFeeds) {
      try {
        // Buscar a URL original do feed
        const fullFeed = await getFeedById(feed.id);
        const feedUrl = fullFeed.link;
        
        // Buscar feed atualizado
        const updatedFeed = await fetchFeed(feedUrl);
        const result = await saveFeedToS3(updatedFeed);
        refreshedFeeds.push(result);
      } catch (error) {
        console.error(`Error refreshing feed ${feed.id}:`, error);
      }
    }

    // Se não houver feeds, buscar pelo feed padrão
    if (refreshedFeeds.length === 0 && DEFAULT_RSS_URL) {
      const feed = await fetchFeed(DEFAULT_RSS_URL);
      const result = await saveFeedToS3(feed);
      refreshedFeeds.push(result);
    }

    return refreshedFeeds;
  } catch (error) {
    console.error('Error refreshing feeds:', error);
    throw new Error(`Failed to refresh feeds: ${error.message}`);
  }
}

module.exports = {
  fetchFeed,
  saveFeedToS3,
  getFeedFromS3,
  getAllFeeds,
  getFeedById,
  refreshFeeds
};