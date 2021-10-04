const idState = {
  post: 0,
  feed: 0,
};

export default (value) => {
  idState[value] += 1;
  return idState[value];
};
