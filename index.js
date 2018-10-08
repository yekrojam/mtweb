require('marko/node-require');
require('engine-strict').check();

const path = require('path');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const csrf = require('csurf');
const express = require('express');
const dayjs = require('dayjs');
const markoExpress = require('marko/express');
const lasso = require('lasso');
const lassoMiddleware = require('lasso/middleware');
const compression = require('compression');
const Sentry = require('@sentry/node');
const apiApp = require('@majorkey2/api');

const router = require('./src/router');

require('dotenv-safe').config({
  example: path.join(__dirname, '.env.example'),
});

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
webApp.use(cookieParser(process.env.COOKIE_SECRET));
webApp.use(cookieSession({
  secret: process.env.COOKIE_SECRET,
  expires: dayjs().add(1, 'year').toDate(),
}));
webApp.use(csrf({ ignoreMethods: ['GET', 'HEAD', 'OPTIONS'] }));
webApp.use(markoExpress());
webApp.use(lassoMiddleware.serveStatic());

webApp.use(router); // Add all the web routes to the app

// Catch all the errors from all the other web routes
webApp.use(Sentry.Handlers.errorHandler());
// webapp.use(devErrorHandler);
// webapp.use(prodErrorHandler);

module.exports = webApp;
