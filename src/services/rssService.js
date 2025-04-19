import Parser from 'rss-parser';

const parser = new Parser({
  timeout: 5000, // 5 segundos de timeout
  maxRedirects: 3
});

class RSSService {
  static async fetchRSSFeed() {
    try {
      const url = process.env.RSS_URL;
      if (!url) throw new Error('URL do RSS não configurada no .env');

      const feed = await parser.parseURL(url);

      if (!feed?.items?.length) {
        throw new Error('O feed RSS está vazio ou mal formatado');
      }

      return {
        title: feed.title || 'Feed sem título',
        items: feed.items.map(item => ({
          title: item.title || 'Sem título',
          link: item.link || '#',
          description: item.content || item.description || "Descrição indisponível.",
          pubDate: item.pubDate || '',
          image: item.enclosure?.url || item.image || "Sem imagem"
        }))
      };

    } catch (error) {
      console.error('[RSS Service] Erro:', error);
      throw new Error(`Falha ao buscar RSS: ${error.message}`);
    }
  }
}

export default RSSService;