export default (response) => {
  const parser = new DOMParser();
  return parser.parseFromString(response.data?.contents || response.data, 'application/xml');
};
