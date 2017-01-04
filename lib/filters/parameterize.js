function parameterizeFilter() {
  function parameterize(string) {
    return string
      ? string
          .toString() // might be a number
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g,'_')
          .replace(/(^_|_$)/g,'')
      : ''
  }

  return parameterize;
};

export default parameterizeFilter
