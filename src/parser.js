import getNextId from './getNextId.js';

const parseRssToXml = (rss) => {
  const parser = new DOMParser();
  const dataXml = parser.parseFromString(rss.data?.contents || rss.data, 'text/xml');

  if (dataXml.querySelector('parsererror')) {
    throw new Error('parseError');
  }

  return dataXml;
};

const parseXmlToObj = (xml) => {
  const channelEl = xml.querySelector('channel');
  const titleEl = xml.querySelector('title');
  const descriptionEl = xml.querySelector('description');
  const linkEl = xml.querySelector('link');
  const children = xml.querySelectorAll('item');
  const posts = [];

  children.forEach((post) => posts.push(parseXmlToObj(post)));

  const result = {
    title: titleEl.textContent,
    description: descriptionEl.textContent,
    link: linkEl.textContent,
  };

  // is feed?
  if (channelEl) result.posts = posts;

  return result;
};

const parseUpdates = (response) => {
  const responseInXml = parseRssToXml(response);
  const parsingData = parseXmlToObj(responseInXml);

  const feedTitle = parsingData.title;

  const posts = parsingData.posts.map((post) => ({
    title: post.title,
    description: post.description,
    link: post.link,
  }));

  return { feedTitle, posts };
};

const parseFeed = (response) => {
  const responseInXml = parseRssToXml(response);
  const parsingData = parseXmlToObj(responseInXml);

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

export { parseUpdates, parseFeed };
