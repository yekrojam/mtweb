const _ = require('lodash');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const validator = require('validator');
const debug = require('debug')('@majorkey2/web:auth');
const api = require('../node_modules/axiosAPI');
const generateAPIToken = require('./generateAPIToken');

const auth0Options = {
  domain: process.env.AUTH0_DOMAIN,
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  callbackURL: process.env.AUTH0_CALLBACK_URL,
  scope: 'profile',
  state: false,
};

async function sessionUserFromEmail(email, done) {
  let result;

  try {
    result = await api(
      '/user',
      { params: { email } },
      { apiToken: generateAPIToken({ email }) },
    );
  } catch (err) {
    debug(err);
    return done(err);
  }

  // console.log(token)
  console.log(result.data, { email }, generateAPIToken({ email }));
  const foundUser = _.get(result, 'data[0]');
  const sessionUser = foundUser ? { id: foundUser.id } : { email };
  debug(`sessionUser from '${email}':`, sessionUser);

  return done(null, sessionUser);
}

async function verifyCallback(accessToken, refreshToken, extraParams, profile, done) {
  const email = _.get(profile, '_json.email');

  return sessionUserFromEmail(email, done);
}

function serializeUser(user, done) {
  done(null, user.id || user.email);
}

async function deserializeUser(id, done) {
  console.log(id);
  if (!validator.isEmail(id)) {
    return done(null, { id });
  }

  // They logged in with an email address that wasn't registered yet.
  // See if we can convert it to a real user id.
  const email = id;
  return sessionUserFromEmail(email, done);
}

module.exports = {
  install() {
    passport.use(new Auth0Strategy(auth0Options, verifyCallback));
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);
  },
};
