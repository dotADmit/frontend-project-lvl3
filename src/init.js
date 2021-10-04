import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
import axios from 'axios';
import resources from './locales/index.js';
import { parseFeed } from './parser.js';
import render from './view.js';
import updatePosts from './updatePosts.js';

const init = () => {
  const i18Instance = i18next.createInstance();
  i18Instance.init({
    lng: 'ru',
    debug: true,
    resources,
  }).then(() => {
    yup.setLocale({
      mixed: {
        notOneOf: i18Instance.t('errors.not_unique'),
        required: i18Instance.t('errors.required'),
      },
      string: { url: i18Instance.t('errors.invalid_url') },
    });

    const schema = yup.string().required().url();
    const validateURL = (field, addedLinks) => schema.notOneOf(addedLinks).validate(field);

    const state = {
      urlInputValid: true,
      processState: 'sent',
      addedUrls: [],
      error: [],
      feeds: [],
      posts: [],
      viewedPostsId: [],
    };

    const proxy = 'https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=';

    const elements = {
      form: document.querySelector('form'),
      input: document.querySelector('.form-control'),
      feedback: document.querySelector('.feedback'),
      submitButton: document.querySelector('button[type="submit"]'),
      feeds: document.querySelector('.feeds'),
      posts: document.querySelector('.posts'),
      modal: document.querySelector('.modal'),
    };

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
          return axios.get(`${proxy}${value}`);
        })
        .then((response) => {
          watchedState.urlInputValid = true;
          watchedState.processState = 'sent';

          const { feed, posts } = parseFeed(response);
          watchedState.processState = 'sentSuccess';
          watchedState.feeds = [feed, ...state.feeds];
          watchedState.posts = [...posts, ...state.posts];
          watchedState.addedUrls.push(userUrl);

          updatePosts(state, watchedState, proxy);
        })
        .catch((error) => {
          console.log(error.message);
          watchedState.processState = 'sent';
          if (error.message === 'validation') return;
          if (error.message === 'parseError') {
            watchedState.error = [i18Instance.t('errors.not_valid_rss')];
            return;
          }
          watchedState.error = [i18Instance.t('errors.network')];
        });
    });
  });
};

export default init;
