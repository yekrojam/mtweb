const _ = require('lodash');
const generateAPIToken = require('./generateAPIToken');

module.exports = function routeHandlerForTemplate(pagePath) {
  return (req, res) => {
    const exportedEnv = _.pick(process.env, [
      'AUTH0_DOMAIN',
      'AUTH0_CLIENT_ID',
      'AUTH0_CALLBACK_URL',
      'API_BASE_URL',
      'CLIENT_BASE_URL',
    ]);

    res.marko(require(`../pages/${pagePath}`), { // eslint-disable-line
      org: req.org,
      $global: {
        apiToken: generateAPIToken(req.user),
        viewer: req.user || 'hello',
        env: exportedEnv,
        serializedGlobals: {
          apiToken: true,
          viewer: true,
          env: true,
        },
      },
    });
  };
};
