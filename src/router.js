const router = require('express-promise-router')();

// List all routes to pages here. Just keep adding to the list
router.get('/', require('./pages/landingPage'));

// Last effort, go to 404
router.use(require('./pages/notFound'));

module.exports = router;
