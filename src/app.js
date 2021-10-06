import * as yup from 'yup';
import onChange from 'on-change';
import axios from 'axios';
import { parseFeed } from './parser.js';
import { render, updateModal } from './view.js';
import updatePosts from './updatePosts.js';
import getProxyUrl from './proxy';

export default (state, elements, i18Instance) => {
  yup.setLocale({
    mixed: {
      notOneOf: i18Instance.t('errors.not_unique'),
      required: i18Instance.t('errors.required'),
    },
    string: { url: i18Instance.t('errors.invalid_url') },
  });

  const schema = yup.string().required().url();
  const validateURL = (field, addedLinks) => schema.notOneOf(addedLinks).validate(field);

  const watchedState = onChange(state, render(elements, i18Instance));

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const userUrl = formData.get('url').trim();

    validateURL(userUrl, state.addedUrls)
      .catch((error) => {
        watchedState.urlInputValid = false;
        watchedState.error = error.errors;
        throw new Error('validation');
      })
      .then((value) => {
        watchedState.processState = 'sending';
        watchedState.urlInputValid = true;
        return axios.get(getProxyUrl(value));
      })
      .then((response) => {
        // watchedState.urlInputValid = true;
        watchedState.processState = 'filling';

        const { feed, posts } = parseFeed(response);
        // if no errors
        watchedState.processState = 'sentSuccess';
        watchedState.feeds = [feed, ...state.feeds];
        watchedState.posts = [...posts, ...state.posts];
        watchedState.addedUrls.push(userUrl);
      })
      .catch((error) => {
        console.log(error.message);
        watchedState.processState = 'filling';

        if (error.message === 'validation') return;
        if (error.message === 'parseError') {
          watchedState.error = [i18Instance.t('errors.not_valid_rss')];
          return;
        }
        watchedState.error = [i18Instance.t('errors.network')];
      });
  });

  elements.posts.addEventListener('click', ({ target }) => {
    const postId = parseInt(target.dataset.postId, 10);
    if (target.type === 'button') {
      const currenPost = state.posts.find((post) => post.id === postId);
      updateModal(elements.modal, currenPost);
    }
    if (!postId || state.viewedPostsId.includes(postId)) return;

    watchedState.viewedPostsId.push(postId);
  });

  updatePosts(state, watchedState);
};
