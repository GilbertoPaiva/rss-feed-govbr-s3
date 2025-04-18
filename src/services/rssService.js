import Parser from 'rss-parser';
const parser = new Parser();

class RSSService {
  static async fetchRSSFeed() {
    const url = process.env.RSS_URL;
    const feed = await parser.parseURL(url);

    return {
      title: feed.title,
      items: feed.items.map(item => ({
        title: item.title,
        link: item.link,
        description: item.content || "Descrição indisponível.",
        pubDate: item.pubDate,
        image: item.enclosure?.url || "Sem imagem"
      }))
    };
  }
}

export default RSSService;