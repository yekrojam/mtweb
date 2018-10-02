const router = require('express-promise-router')();
const basePage = require('./landingPage');

router.get('/', (req, res) => {
  res.marko(basePage, {});
});

module.exports = router;
