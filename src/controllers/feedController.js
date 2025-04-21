const feedService = require('../services/feedService');

exports.getAllFeeds = async (req, res) => {
    try {
        const source = req.query.source || 'govbr';
        const feedFileName = `${source}-feeds.json`;
        const feeds = await feedService.getAllFeeds(feedFileName);
        
        if (!feeds || feeds.length === 0) {
            const freshFeeds = await feedService.refreshFeeds(source);
            return res.json(freshFeeds);
        }
        
        res.json(feeds);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao obter feeds', error: error.message });
    }
};

exports.refreshFeeds = async (req, res) => {
    try {
        const source = req.body.source || 'govbr';
        const feeds = await feedService.refreshFeeds(source);
        res.json(feeds);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar feeds', error: error.message });
    }
};

module.exports = {
  getAllFeeds,
  refreshFeeds
};