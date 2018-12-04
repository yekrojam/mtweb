const _ = require('lodash');
const passport = require('passport');
const { series } = require('middleware-flow');
const debug = require('debug')('@majorkey2/web:auth');
const signupNeededRedirector = require('./signupNeededRedirector');

const GENERIC_LOGIN_ERROR = 'Sorry, something went wrong while logging you in.';

function handleIncomingErrors(req, res, next) {
  if (req.query.error) {
    debug(`Incoming auth error from auth0: ${req.query}`);
    throw new Error(GENERIC_LOGIN_ERROR);
  }

  next();
}

function successfulLoginRedirector(req, res) {
  const userId = _.get(req, 'user.id');
  const redirectURL = _.get(req, 'session.redirect', '/');

  if (req.session && req.session.redirect) {
    delete req.session.redirect;
  }

  if (userId) return res.redirect(redirectURL);
  debug(`Login reported as successful, but user messed up: ${req.user}`);
  throw new Error(GENERIC_LOGIN_ERROR);
}

module.exports = series(
  handleIncomingErrors,
  passport.authenticate('auth0', { failureRedirect: '/fail' }),
  signupNeededRedirector,
  successfulLoginRedirector,
);
