const feedService = require('../services/feedService');

const getAllFeeds = async (req, res) => {
  try {
    const feeds = await feedService.getAllFeeds();
    return res.status(200).json(feeds);
  } catch (error) {
    console.error('Erro ao obter feeds:', error);
    return res.status(500).json({ error: 'Erro ao buscar feeds' });
  }
};

const getFeedById = async (req, res) => {
  try {
    const { id } = req.params;
    const feed = await feedService.getFeedById(id);
    
    if (!feed) {
      return res.status(404).json({ error: 'Feed não encontrado' });
    }
    
    return res.status(200).json(feed);
  } catch (error) {
    console.error('Erro ao obter feed por ID:', error);
    return res.status(500).json({ error: 'Erro ao buscar feed' });
  }
};

const refreshFeeds = async (req, res) => {
  try {
    const feeds = await feedService.refreshFeeds();
    return res.status(200).json({
      message: 'Feeds atualizados com sucesso',
      count: feeds.length
    });
  } catch (error) {
    console.error('Erro ao atualizar feeds:', error);
    return res.status(500).json({ error: 'Erro ao atualizar feeds' });
  }
};

async function fetchAndSaveFeed(req, res) {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const feed = await feedService.fetchFeed(url);
    const result = await feedService.saveFeedToS3(feed);
    
    res.status(201).json({
      message: 'Feed fetched and saved successfully',
      feedId: result.feedId
    });
  } catch (error) {
    console.error('Error in fetchAndSaveFeed:', error);
    res.status(500).json({ error: error.message });
  }
}

async function getFeed(req, res) {
  try {
    const { feedId } = req.params;
    
    if (!feedId) {
      return res.status(400).json({ error: 'Feed ID is required' });
    }

    const feedData = await feedService.getFeedFromS3(feedId);
    res.status(200).json(feedData);
  } catch (error) {
    console.error('Error in getFeed:', error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getAllFeeds,
  getFeedById,
  refreshFeeds,
  fetchAndSaveFeed,
  getFeed
};