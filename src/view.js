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
  const cardLi = createElement('li', 'list-group-item');
  const liHeader = createElement('h3', 'h6', title);
  const p = createElement('p', 'small text-black-50', description);
  cardLi.append(liHeader, p);

  return cardLi;
};

const buildPostListItem = (elements, post, i18Instance) => {
  const card = createElement('li', 'list-group-item d-flex justify-content-between');
  const cardLink = createElement('a', 'fw-bold', post.title);
  cardLink.setAttribute('href', post.link);
  cardLink.setAttribute('target', '_blank');
  cardLink.setAttribute('data-id', post.id);
  // const cardButton =
  // createElement('button', 'btn btn-outline-primary', i18Instance.t('buttons.preview'));
  // cardButton.setAttribute('type', 'button');
  // cardButton.setAttribute('data-bs-toogle', 'modal');
  // cardButton.setAttribute('data-bs-target', '#exampleModal');
  card.append(cardLink);
  const btnBootstrap = `
    <button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#reviewModal">
      ${i18Instance.t('buttons.preview')}
    </button>
  `;
  card.innerHTML += btnBootstrap;

  const cardButton = card.querySelector('button');
  const cardTitle = card.querySelector('a');

  cardTitle.addEventListener('click', () => {
    cardTitle.className = 'fw-normal link-secondary';
  });

  cardButton.addEventListener('click', () => {
    const modalTitle = elements.modal.querySelector('.modal-title');
    const modalBody = elements.modal.querySelector('.modal-body');
    const modalLink = elements.modal.querySelector('a');
    modalTitle.textContent = post.title;
    modalBody.textContent = post.description;
    modalLink.setAttribute('href', post.link);
    cardTitle.className = 'fw-normal link-secondary';
  });

  return card;
};

const renderFeeds = (elements, value, prevValue, i18Instance) => {
  if (prevValue.length === 0) elements.feeds.append(buildCard(i18Instance.t('feeds')));
  const cardUl = elements.feeds.querySelector('.card ul');
  const { title, description } = value[0];
  cardUl.prepend(buildFeedListItem(title, description));
};

const renderPosts = (elements, value, prevValue, i18Instance) => {
  if (prevValue.length === 0) elements.posts.append(buildCard(i18Instance.t('posts')));
  const cardUl = elements.posts.querySelector('.card ul');
  cardUl.innerHTML = '';
  value.forEach((postObj) => {
    const postElement = buildPostListItem(elements, postObj, i18Instance);
    cardUl.append(postElement);
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

    case 'veiwedPostsId':
      break;

    default:
      break;
  }
};
