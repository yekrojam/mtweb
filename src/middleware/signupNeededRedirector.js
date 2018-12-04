const USER_SIGNUP_PAGE = '/u/signup';

module.exports = (req, res, next) => {
  if (req.user && !req.user.id && req.originalUrl !== USER_SIGNUP_PAGE) {
    return res.redirect(USER_SIGNUP_PAGE);
  }

  return next();
};
