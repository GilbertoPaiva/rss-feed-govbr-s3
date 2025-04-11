import Parser from 'rss-parser';
const parser = new Parser();

class RSSService {
  static async fetchRSSFeed() {
    const url = 'https://www.gov.br/pt-br/noticias/RSS'; 

    const feed = await parser.parseURL(url);

    const newData = {
      title: feed.title,
      items: feed.items.map((item) => ({
        title: item.title,
        link: item.link,
        description: item.content || "Descrição indisponível.",
        pubDate: item.pubDate,
        image: item.enclosure ? item.enclosure.url : "Sem imagem",
      })),
    };

    return newData;
  }
}

export default RSSService;