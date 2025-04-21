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

module.exports = {
  getAllFeeds,
  getFeedById,
  refreshFeeds
};