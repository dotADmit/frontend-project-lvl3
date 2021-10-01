const createElement = (el, elClass, elContent = '') => {
  const element = document.createElement(el);
  element.setAttribute('class', elClass);
  element.textContent = elContent;

  return element;
};

const buildCard = (nameHeader) => {
  const card = createElement('div', 'card');
  const cardBody = createElement('div', 'card-body');
  const cardBodyHeader = createElement('h2', 'card-title h4', nameHeader);
  const cardUl = createElement('ul', 'list-group');

  cardBody.append(cardBodyHeader);
  card.append(cardBody, cardUl);

  return card;
};

const buildFeedLi = (title, description) => {
  const cardLi = createElement('li', 'list-group-item');
  const liHeader = createElement('h3', 'h6', title);
  const p = createElement('p', 'small text-black-50', description);
  cardLi.append(liHeader, p);

  return cardLi;
};

const buildPostLi = (title, link, i18Instance) => {
  const cardLi = createElement('li', 'list-group-item d-flex justify-content-between');
  const cardLink = createElement('a', 'fw-bold', title);
  cardLink.setAttribute('href', link);
  cardLink.setAttribute('target', '_blank');
  const cardButton = createElement('button', 'btn btn-outline-primary', i18Instance.t('buttons.preview'));
  cardLi.append(cardLink, cardButton);

  return cardLi;
};

const renderFeeds = (elements, value, prevValue, i18Instance) => {
  if (prevValue.length === 0) elements.feeds.append(buildCard(i18Instance.t('feeds')));
  const cardUl = elements.feeds.querySelector('.card ul');
  const { title, description } = value[0];
  cardUl.prepend(buildFeedLi(title, description));
};

const renderPosts = (elements, value, prevValue, i18Instance) => {
  if (prevValue.length === 0) elements.posts.append(buildCard(i18Instance.t('posts')));
  const cardUl = elements.posts.querySelector('.card ul');
  cardUl.innerHTML = '';
  value.forEach(({ title, link }) => {
    const li = buildPostLi(title, link, i18Instance);
    cardUl.append(li);

    const liLink = li.querySelector('a');
    liLink.addEventListener('click', () => { liLink.classList.add('link-secondary'); });
  });
};

const handleProcessState = (elements, i18Instance, value) => {
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
      throw new Error(`${i18Instance.t('errors.unknown_process')}: ${value}`);
  }
};

export default (elements, i18Instance) => (path, value, prevValue) => {
  switch (path) {
    case 'error':
      elements.feedback.classList.add('text-danger');
      elements.feedback.textContent = value;
      break;

    case 'urlInputValid':
      elements.input.classList.remove('is-invalid');
      if (!value) elements.input.classList.add('is-invalid');
      break;

    case 'processState':
      handleProcessState(elements, i18Instance, value);
      break;

    case 'feeds':
      renderFeeds(elements, value, prevValue, i18Instance);
      break;

    case 'posts':
      renderPosts(elements, value, prevValue, i18Instance);
      break;

    default:
      break;
  }
};
