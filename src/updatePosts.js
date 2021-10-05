import axios from 'axios';
import { parseUpdates } from './parser.js';
import getNextId from './getNextId.js';

const getFeedIdByTitle = (feeds, feedTitle) => {
  const feed = feeds.find(({ title }) => title === feedTitle);
  return feed.id;
};

const updatePosts = (state, watchedState, proxy) => {
  setTimeout(() => {
    const addedPostslLinks = state.posts.map((post) => post.link);
    const promises = state.addedUrls.map((url) => axios.get(`${proxy}${url}`));
    Promise.all(promises).then((contents) => {
      contents.forEach((content) => {
        const { feedTitle, posts } = parseUpdates(content);
        const contentNewPosts = posts.filter(({ link }) => !addedPostslLinks.includes(link));

        if (contentNewPosts.length === 0) return;

        const feedId = getFeedIdByTitle(state.feeds, feedTitle);
        const postsWithId = contentNewPosts.map((post) => ({
          feedId,
          id: getNextId('post'),
          ...post,
        }));
        watchedState.posts = [...postsWithId, ...state.posts];
      });
    });

    updatePosts(state, watchedState, proxy);
  }, 5000);
};

export default updatePosts;
