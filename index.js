require('marko/node-require');
require('lasso/node-require-no-op').enable('.less', '.css');


const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const csrf = require('csurf');
const express = require('express');
const { DateTime } = require('luxon');
const markoExpress = require('marko/express');
const lasso = require('lasso');
const lassoMiddleware = require('lasso/middleware');
const compression = require('compression');

const routers = require('./routers');

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
// const fourOhFour = require('./middleware/not_found');

/** ************************
  WEB APP CONFIGURATION
************************** */
const webapp = express();

webapp.use(compression());
webapp.use(cookieParser(process.env.COOKIE_SECRET));
webapp.use(cookieSession({
  secret: process.env.COOKIE_SECRET,
  expires: DateTime.local().plus({ years: 1 }),
}));
webapp.use(csrf({ ignoreMethods: ['GET', 'HEAD', 'OPTIONS'] }));
webapp.use(markoExpress());
webapp.use(lassoMiddleware.serveStatic());

webapp.use(routers);


// webapp.use(fourOhFour); // Catch everything else with a 404 response

// Catch all the errors from all the other web routes
// webapp.use(devErrorHandler);
// webapp.use(prodErrorHandler);

module.exports = webapp;
