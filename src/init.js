import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import i18next from 'i18next';
import app from './app.js';
import resources from './locales/index.js';
import updateTranslation from './updateTranslation.js';

export default () => {
  const defaultLanguage = 'ru';
  const i18Instance = i18next.createInstance();
  i18Instance.init({
    lng: defaultLanguage,
    resources,
  }).then(() => {
    const state = {
      lng: defaultLanguage,
      urlInputValid: true,
      processState: 'filling',
      addedUrls: [],
      error: [],
      feeds: [],
      posts: [],
      viewedPostsId: [],
    };

    const elements = {
      headerTitle: document.querySelector('h1'),
      headerText: document.querySelector('.lead'),
      label: document.querySelector('.url-label'),
      example: document.querySelector('.example'),
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
        btnClose: document.querySelector('.modal .cancel'),
      },
      lang: document.querySelector('.lang'),
    };

    updateTranslation(elements, i18Instance, defaultLanguage);

    app(state, elements, i18Instance);
  });
};
