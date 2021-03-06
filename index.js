require('marko/node-require');
require('./src/utils/envVerification').verify();
require('./src/utils/auth0PassportStrategy').install();

const cookieSession = require('cookie-session');
const passport = require('passport');
const express = require('express');
const dayjs = require('dayjs');
const markoExpress = require('marko/express');
const lasso = require('lasso');
const lassoMiddleware = require('lasso/middleware');
const compression = require('compression');
const Sentry = require('@sentry/node');
const apiApp = require('@majorkey2/api');

const router = require('./src/router');

const isProduction = process.env.NODE_ENV === 'production';

if (process.env.SENTRY_DSN) {
  Sentry.init({ dsn: process.env.SENTRY_DSN });
}

// Configure lasso to control how JS/CSS/etc. is delivered to the browser
lasso.configure({
  plugins: [
    'lasso-marko', // Allow Marko templates to be compiled and transported to the browser
    'lasso-sass', // Allow Marko templates to use SASS internally
  ],
  outputDir: `${__dirname}/static`, // Place all generated JS/CSS/etc. files into the "static" dir
  bundlingEnabled: isProduction, // Only enable bundling in production
  minify: isProduction, // Only minify JS and CSS code in production
  fingerprintsEnabled: isProduction, // Only add fingerprints to URLs in production
});

// const {
//   devErrorHandler,
//   prodErrorHandler,
// } = require('./middleware/error_handlers');

const webApp = express();

// Host the API off the same server since the website depends on it
webApp.use(apiApp);

/** ************************
  WEB APP CONFIGURATION
************************** */
webApp.use(Sentry.Handlers.requestHandler());
webApp.use(compression());
webApp.use(lassoMiddleware.serveStatic());
webApp.use(cookieSession({
  secure: isProduction,
  httpOnly: true,
  secret: process.env.COOKIE_SECRET,
  expires: dayjs().add(1, 'year').toDate(),
  sameSite: 'strict',
  resave: true,
  saveUninitialized: true,
}));
webApp.use(passport.initialize());
webApp.use(passport.session());
webApp.use(markoExpress());

webApp.use(router); // Add all the web routes to the app

// Catch all the errors from all the other web routes
webApp.use(Sentry.Handlers.errorHandler());
// webapp.use(devErrorHandler);
// webapp.use(prodErrorHandler);

module.exports = webApp;
