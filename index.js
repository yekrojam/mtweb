require('marko/node-require');

const path = require('path');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const csrf = require('csurf');
const express = require('express');
const { DateTime } = require('luxon');
const markoExpress = require('marko/express');
const lasso = require('lasso');
const lassoMiddleware = require('lasso/middleware');
const compression = require('compression');

const router = require('./src/router');

require('dotenv-safe').config({
  example: path.join(__dirname, '.env.example'),
});

const isProduction = process.env.NODE_ENV === 'production';

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

/** ************************
  WEB APP CONFIGURATION
************************** */
const webApp = express();

webApp.use(compression());
webApp.use(cookieParser(process.env.COOKIE_SECRET));
webApp.use(cookieSession({
  secret: process.env.COOKIE_SECRET,
  expires: DateTime.local().plus({ years: 1 }),
}));
webApp.use(csrf({ ignoreMethods: ['GET', 'HEAD', 'OPTIONS'] }));
webApp.use(markoExpress());
webApp.use(lassoMiddleware.serveStatic());

// Now for the good stuff. Include all the pages we'd like served
webApp.use(router); // Always put this last

// Catch all the errors from all the other web routes
// webapp.use(devErrorHandler);
// webapp.use(prodErrorHandler);

module.exports = webApp;
