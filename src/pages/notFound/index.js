const _ = require('lodash');
const notFound = require('./template.marko');

module.exports = (req, res) => {
  const fromInternalLink = _.includes(req.get('Referrer'), process.env.WEB_DOMAIN);
  if (fromInternalLink) {
    // We caused this 404, so report it as an error
    // TODO (makinde): Fill this in
  }

  res.status(404);
  return res.marko(notFound, {});
};
