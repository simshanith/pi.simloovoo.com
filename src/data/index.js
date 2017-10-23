import u from 'updeep';

const context = require.context('.', true, /\.yaml$/);

export default context.keys().reduce((data, key) => {
  // wrapped in try/catch to handle malformed yaml
  let normalized;
  try {
    // remove leading dotslash and trailing extension
    normalized = key.replace(/^\.\/(.*)\.yaml/, '$1');
    // break into path components
    normalized = normalized.split('/');
    // construct nested object from path
    normalized = normalized.reduceRight((memo, part) => {
      return {
        [part]: memo
      };
    }, context(key));
    // deep merge
    return u(data, normalized);
  } catch (err) {
    // emit build warning
    console.warn('Failed to resolve  or normalize %s - %s \n', key, normalized, err);
  }
  return data;
}, {});
