const router = require('express-promise-router')();
const orgSpecificRouter = require('./orgSpecific');
const generalRouter = require('./general');

router.use(
  generalRouter,
  orgSpecificRouter,
);

module.exports = router;
