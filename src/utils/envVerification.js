const Joi = require('joi');
/**
 * Verifies which environment variables are required, present and well formed
 */
module.exports = {
  verify() {
    const schema = {
      NODE_ENV: Joi.valid('production', 'development', 'test').required(),
      DEBUG: Joi.string(),
      JWT_SECRET: Joi.string().required(),
      COOKIE_SECRET: Joi.string().required(),
      SENTRY_DSN: Joi.string().uri(),
      AUTH0_DOMAIN: Joi.string().required(),
      AUTH0_CLIENT_ID: Joi.string().required(),
      AUTH0_CLIENT_SECRET: Joi.string().required(),
      AUTH0_CALLBACK_URL: Joi.string().uri().required(),
      CLIENT_BASE_URL: Joi.string().uri().required(),
      API_BASE_URL: Joi.string().uri().required(),
    };

    const result = Joi.validate(
      process.env,
      schema,
      { abortEarly: false, allowUnknown: true },
    );
    if (result.error) throw result.error;
  },
};
