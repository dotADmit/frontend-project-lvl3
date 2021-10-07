import * as yup from 'yup';

export default (elements, i18Instance, value) => {
  yup.setLocale({
    mixed: {
      notOneOf: i18Instance.t('errors.not_unique'),
      required: i18Instance.t('errors.required'),
    },
    string: { url: i18Instance.t('errors.invalid_url') },
  });

  const buttons = elements.lang.querySelectorAll('button');
  buttons.forEach((button) => {
    button.className = 'btn btn-sm';
    const { lng } = button.dataset;
    button.classList.add(lng === value ? 'btn-info' : 'btn-outline-info');
  });

  const feedsTitle = elements.feeds.querySelector('h2');
  if (feedsTitle) feedsTitle.textContent = i18Instance.t('feeds');
  const postsTitle = elements.posts.querySelector('h2');
  if (postsTitle) postsTitle.textContent = i18Instance.t('posts');
  const postsButtons = elements.posts.querySelectorAll('button');
  postsButtons.forEach((btn) => { btn.textContent = i18Instance.t('buttons.preview'); });

  elements.headerTitle.textContent = i18Instance.t('header_title');
  elements.headerText.textContent = i18Instance.t('header_text');
  elements.input.setAttribute('placeholder', i18Instance.t('input_label'));
  elements.label.textContent = i18Instance.t('input_label');
  elements.submitButton.textContent = i18Instance.t('buttons.submit');
  elements.modal.btnViewAll.textContent = i18Instance.t('buttons.view_all');
  elements.modal.btnClose.textContent = i18Instance.t('buttons.close');
  elements.example.textContent = i18Instance.t('example');
  elements.feedback.textContent = '';
};
