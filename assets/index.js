const context = require.context('./images', true);

const patterns={
  dotSlash: /^\.\//,
  self: /^\.\/(index(\.js)?)?$/,
  js: /\.js$/,
  license: /\.LICENSE.md$/,
};

const ignoreSelf = context.keys().filter(key => !key.match(patterns.self));

const images = ignoreSelf.filter(key => !key.match(patterns.license));
const licenses = ignoreSelf.filter(key => !!key.match(patterns.license));

function imageReducer(memo, key) {
  let normalized;
  try {
    const normalized = key.replace(patterns.dotSlash, '');
    memo[normalized] = context(key);
  } catch (err) {
    // emit build warning
    console.warn('Failed to resolve or normalize %s - %s \n', key, normalized, err);
  }
  return memo;
}

function licenseReducer(memo, key) {
  let normalized;
  try {
    const normalized = key
      .replace(patterns.dotSlash, '')
      .replace(patterns.license, '')
      ;

    memo[normalized] = context(key);
  } catch (err) {
    // emit build warning
    console.warn('Failed to resolve or normalize %s - %s \n', key, normalized, err);
  }
  return memo;
}

export default {
  images: images.reduce(imageReducer, {}),
  licenses: licenses.reduce(licenseReducer, {}),
};
