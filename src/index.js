import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import * as yup from 'yup';
import onChange from 'on-change';

const state = {
  urlValidation: {
    value: '',
    valid: true,
  },
  feeds: [],
};

const form = document.querySelector('form');
const input = document.querySelector('.form-control');

const schema = yup.string().url();

const isValidUrl = (field) => schema.isValid(field);

const watchedState = onChange(state, (path, value) => {
  if (path === 'urlValidation.valid') {
    input.classList.remove('is-invalid');

    if (!value) input.classList.add('is-invalid');
    else {
      form.reset();
      input.focus();
    }
  }
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  state.urlValidation.value = formData.get('url');

  isValidUrl(state.urlValidation.value)
    .then((value) => {
      if (state.feeds.includes(state.urlValidation.value)) watchedState.urlValidation.valid = false;
      else {
        if (value) state.feeds.push(state.urlValidation.value);
        watchedState.urlValidation.valid = value;
      }
    });
});
