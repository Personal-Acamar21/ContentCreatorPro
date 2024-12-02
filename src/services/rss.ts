import Parser from 'rss-parser';

const parser = new Parser();

export async function fetchRSSFeeds(feedUrls: string[]) {
  try {
    const feeds = await Promise.all(
      feedUrls.map(async (url) => {
        const feed = await parser.parseURL(url);
        return {
          title: feed.title,
          description: feed.description,
          items: feed.items.map(item => ({
            title: item.title,
            content: item.content,
            link: item.link,
            pubDate: item.pubDate,
            categories: item.categories,
          }))
        };
      })
    );
    
    return feeds;
  } catch (error) {
    console.error('RSS feed error:', error);
    throw error;
  }
}