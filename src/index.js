import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
import ru from './locales/ru.js';

const i18Instance = i18next.createInstance();
i18Instance.init({
  lng: 'ru',
  debug: true,
  resources: {
    ru,
  }
}).then(() => {
  const schema = yup.string().url(i18Instance.t('errors.invalid_url'));
  const validateURL = (field, addedLinks) => schema.notOneOf(addedLinks, 'RSS уже существует').validate(field);
  
  const state = {
    urlInputValid: true,
    addedUrls: [],
    error: [],
  };
  console.log(i18Instance.t('errors.invalid_url'))
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
      })
      .catch((er) => {
        watchedState.error = er.errors;
        //watchedState.urlInputValid = false;
      });
  });
});
