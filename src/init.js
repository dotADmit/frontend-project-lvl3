import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import i18next from 'i18next';
import app from './app.js';
import resources from './locales/index.js';

export default () => {
  const i18Instance = i18next.createInstance();
  i18Instance.init({
    lng: 'ru',
    // debug: true,
    resources,
  }).then(() => {
    const state = {
      urlInputValid: true,
      processState: 'filling',
      addedUrls: [],
      error: [],
      feeds: [],
      posts: [],
      viewedPostsId: [],
    };

    const elements = {
      form: document.querySelector('form'),
      input: document.querySelector('.form-control'),
      feedback: document.querySelector('.feedback'),
      submitButton: document.querySelector('button[type="submit"]'),
      feeds: document.querySelector('.feeds'),
      posts: document.querySelector('.posts'),
      modal: {
        title: document.querySelector('.modal-title'),
        body: document.querySelector('.modal-body'),
        btnViewAll: document.querySelector('.modal .view-all'),
      },
    };

    app(state, elements, i18Instance);
  });
};
