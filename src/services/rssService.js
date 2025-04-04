class RSSService {
    static async fetchRSSFeed(url) {

        const feed = await parser.parseURL(url);

        const newData = {
            title: feed.title,
            items: feed.items.map((item) => ({
                title: item.title,
                link: item.link,
                description: item.content || "Descrição indisponível.",
                putDate: item.pubDate,
                image: item.enclosuse ? item.enclosure.url : "Sem imagem",
            })),
        };
    }
}