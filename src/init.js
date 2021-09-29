// import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
import axios from 'axios';
import resources from './locales/index.js';
import parse from './parser.js';
// import getId from './getId.js';

const init = () => {
  const i18Instance = i18next.createInstance();
  i18Instance.init({
    lng: 'ru',
    debug: true,
    resources,
  }).then(() => {
    yup.setLocale({
      mixed: { notOneOf: i18Instance.t('errors.not_unique') },
      string: { url: i18Instance.t('errors.invalid_url') },
    });

    const schema = yup.string().url();
    const validateURL = (field, addedLinks) => schema.notOneOf(addedLinks).validate(field);

    const state = {
      urlInputValid: true,
      processState: 'sent',
      addedUrls: [],
      error: [],
      feeds: [],
      posts: [],
    };

    const proxy = 'https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=';

    const elements = {
      form: document.querySelector('form'),
      input: document.querySelector('.form-control'),
      feedback: document.querySelector('.feedback'),
      submitButton: document.querySelector('button[type="submit"]'),
    };

    const watchedState = onChange(state, (path, value) => {
      if (path === 'error') {
        if (value.length > 0) {
          elements.feedback.classList.add('text-danger');
        }
        elements.feedback.textContent = value;
      }

      if (path === 'urlInputValid') {
        elements.input.classList.remove('is-invalid');
        if (!value) elements.input.classList.add('is-invalid');
      }

      if (path === 'processState') {
        switch (value) {
          case 'sending':
            elements.input.classList.remove('is-invalid');
            elements.submitButton.disabled = true;
            elements.input.disabled = true;
            elements.feedback.classList.remove('text-danger', 'text-success');
            elements.feedback.textContent = i18Instance.t('loading');
            break;

          case 'sent':
            elements.submitButton.disabled = false;
            elements.input.disabled = false;
            break;

          case 'sentSuccess':
            elements.feedback.textContent = i18Instance.t('successful_download');
            elements.feedback.classList.add('text-success');
            elements.form.reset();
            elements.input.focus();
            break;

          default:
            throw new Error(`Неизвестный процесс: ${value}`);
        }
      }
    });

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

          const data = parse(response);
          // console.log(data)
          if (data.querySelector('parsererror')) {
            watchedState.error = [i18Instance.t('errors.not_valid_rss')];
            return;
          }

          watchedState.processState = 'sentSuccess';
          state.addedUrls.push(userUrl);
        })
        .catch((error) => {
          watchedState.processState = 'sent';
          if (error.message !== 'validation') {
            watchedState.error = [i18Instance.t('errors.network')];
          }
        });
    });
  });
};

export default init;
