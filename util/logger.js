// require load-env, so that value of `DEBUG` environment variable is available during development:
require('dotenv').load();

const Debug = require('debug');
const path = require('path');

const matchFileExtension = /(.*)\.(.*?)$/;

const getDebugKey = (configuration) => {
  const { __filename } = configuration;
  if (__filename) {
    const basename = path.basename(__filename);
    return basename.replace(matchFileExtension, '$1');
  } else if (typeof configuration === 'string') {
    return configuration;
  }

  throw new Error('Logger configuration must be a String, or an Object with a __filename.');
};

module.exports = (configuration) => {
  const subKey = getDebugKey(configuration);
  const debug = Debug(`shippy:${subKey}`);

  debug('logger enabled.');

  return {
    debug
  };
};
