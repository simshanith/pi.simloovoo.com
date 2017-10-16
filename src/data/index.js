const context = require.context('.', true, /\.yaml$/);

export default context.keys().reduce((memo, key) => {
  // wrapped in try/catch to handle malformed yaml
  let normalized;
  try {
    normalized = key.replace(/^\.\/(.*)\.yaml/, '$1');
    memo[normalized] = context(key);
  } catch (err) {
    // emit build warning
    console.warn('Failed to resolve  or normalize %s - %s \n', key, normalized, err);
  }
  return memo;
}, {});
