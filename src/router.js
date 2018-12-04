const _ = require('lodash');
const router = require('express-promise-router')();
const authCallback = require('./middleware/authCallback');
const logout = require('./middleware/logout');
const signupNeededRedirector = require('./middleware/signupNeededRedirector');
const routeHandler = require('./utils/routeHandlerForTemplate');

router.use(signupNeededRedirector);

// Routes that do some work, but then redirect
router.get('/auth/callback', authCallback);
router.get('/auth/logout', logout);

// List all routes to pages here. Just keep adding to the list
router.get('/', routeHandler('landingPage'));
router.get('/u/signup',
  (req, res, next) => (_.get(req, 'user.id') ? res.redirect('/') : next()),
  routeHandler('userSignup'));

// Last effort, go to 404
router.use(routeHandler('notFound'));

module.exports = router;
