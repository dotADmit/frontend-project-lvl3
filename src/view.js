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

const buildFeedListItem = (title, description) => {
  const el = createElement('li', 'list-group-item');
  const elHeader = createElement('h3', 'h6', title);
  const elText = createElement('p', 'small text-black-50', description);
  el.append(elHeader, elText);

  return el;
};

const buildPostListItem = (elements, post, i18Instance) => {
  const card = createElement('li', 'list-group-item d-flex justify-content-between');

  const cardTitle = createElement('a', 'fw-bold', post.title);
  cardTitle.setAttribute('href', post.link);
  cardTitle.setAttribute('target', '_blank');
  cardTitle.setAttribute('data-id', post.id);

  const cardButton = createElement('button', 'btn btn-outline-primary', i18Instance.t('buttons.preview'));
  cardButton.setAttribute('data-bs-toggle', 'modal');
  cardButton.setAttribute('data-bs-target', '#reviewModal');

  card.append(cardTitle, cardButton);

  cardTitle.addEventListener('click', () => { cardTitle.className = 'fw-normal link-secondary'; });

  cardButton.addEventListener('click', () => {
    elements.modal.title.textContent = post.title;
    elements.modal.body.textContent = post.description;
    elements.modal.btnViewAll.setAttribute('href', post.link);
    cardTitle.className = 'fw-normal link-secondary';
  });

  return card;
};

const renderFeeds = (elements, value, prevValue, i18Instance) => {
  if (prevValue.length === 0) {
    const card = buildCard(i18Instance.t('feeds'));
    elements.feeds.append(card);
    elements.feeds.list = elements.feeds.querySelector('.card ul');
  }

  const { title, description } = value[0];
  const feedListItem = buildFeedListItem(title, description);
  elements.feeds.list.prepend(feedListItem);
};

const renderPosts = (elements, value, prevValue, i18Instance) => {
  if (prevValue.length === 0) {
    const card = buildCard(i18Instance.t('posts'));
    elements.posts.append(card);
    elements.posts.list = elements.posts.querySelector('.card ul');
  }

  elements.posts.list.innerHTML = '';
  value.forEach((postObj) => {
    const postElement = buildPostListItem(elements, postObj, i18Instance);
    elements.posts.list.append(postElement);
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

    case 'filling':
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

    case 'veiwedPostsId':
      break;

    default:
      break;
  }
};
