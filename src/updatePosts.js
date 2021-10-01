import axios from 'axios';
import { parseUpdates } from './parser.js';
import getNextId from './getId.js';

const getFeedIdByTitle = (feeds, feedTitle) => {
  const feed = feeds.find(({ title }) => title === feedTitle);
  return feed.id;
};

const getNewPosts = (state, watchedState, proxy) => {
  setTimeout(() => {
    const addedPostslLinks = state.posts.map((post) => post.link);
    const promises = state.addedUrls.map((url) => axios.get(`${proxy}${url}`));
    Promise.all(promises).then((contents) => {
      contents.forEach((content) => {
        const { feedTitle, posts } = parseUpdates(content);
        console.log(posts);
        const contentNewPosts = posts.filter(({ link }) => !addedPostslLinks.includes(link));
        if (contentNewPosts.length === 0) return;

        const feedId = getFeedIdByTitle(state.feeds, feedTitle);
        const postsWithId = contentNewPosts.map((post) => ({
          feedId,
          id: getNextId('post'),
          ...post,
        }));
        console.log(postsWithId);
        watchedState.posts = [...postsWithId, ...state.posts];
      });
    });

    getNewPosts(state, watchedState, proxy);
  }, 5000);
};

export default getNewPosts;
