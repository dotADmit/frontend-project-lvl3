import getNextId from './getId.js';

const parseRssToObj = (rss) => {
  const titleEl = rss.querySelector('title');
  const descriptionEl = rss.querySelector('description');
  const linkEl = rss.querySelector('link');
  const children = rss.querySelectorAll('item');
  const posts = [];

  children.forEach((post) => posts.push(parseRssToObj(post)));

  const result = {
    title: titleEl.textContent,
    description: descriptionEl.textContent,
    link: linkEl.textContent,
  };

  if (posts.length > 0) result.posts = posts;

  return result;
};

export default (response) => {
  const parser = new DOMParser();
  const data = parser.parseFromString(response.data?.contents || response.data, 'text/xml');

  if (data.querySelector('parsererror')) {
    throw new Error('parseError');
  }

  const parsingData = parseRssToObj(data);
  const feedId = getNextId('feed');
  const feed = {
    id: feedId,
    title: parsingData.title,
    description: parsingData.description,
    link: parsingData.link,
  };
  const posts = parsingData.posts.map((post) => ({
    id: getNextId('post'),
    feedId,
    title: post.title,
    description: post.description,
    link: post.link,
  }));

  return { feed, posts };
};
