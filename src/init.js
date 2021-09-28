// import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
import axios from 'axios';
import resources from './locales/index.js';

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
      },
      string: {
        url: i18Instance.t('errors.invalid_url'),
      },
    });

    const schema = yup.string().url();
    const validateURL = (field, addedLinks) => schema.notOneOf(addedLinks).validate(field);

    const state = {
      urlInputValid: true,
      addedUrls: [],
      error: [],
    };

    const form = document.querySelector('form');
    const input = document.querySelector('.form-control');
    const feedback = document.querySelector('.feedback');

    const watchedState = onChange(state, (path, value) => {
      if (path === 'error') {
        input.classList.remove('is-invalid');
        if (value.length === 0) {
          form.reset();
          input.focus();
        } else input.classList.add('is-invalid');
        feedback.textContent = state.error;
      }
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(e.target);
      const userUrl = formData.get('url');

      validateURL(userUrl, state.addedUrls)
        .then((value) => {
          watchedState.error = [];
          state.addedUrls.push(value.trim());
          // watchedState.urlInputValid = true;
          const cors = 'https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=';

          axios.get(`${cors}${value}`)
            .then((response) => {
              const parser = new DOMParser();
              const data = parser.parseFromString(response.data?.contents || response.data, 'application/xml');
              console.log(data);
            });
          // .catch(() => {console.log('Network Problems. Try again.')});
        })
        .catch((er) => {
          watchedState.error = er.errors;
          // watchedState.urlInputValid = false;
        });
    });
  });
};

export default init;
