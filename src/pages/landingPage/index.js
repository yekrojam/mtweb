const landingPage = require('./template.marko');

module.exports = (req, res) => {
  res.marko(landingPage, {});
};
