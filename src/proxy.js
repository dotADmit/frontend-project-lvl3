export default (url) => {
  const proxyUrl = `https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url)}&disableCache=true`;
  return proxyUrl;
};
