const jsonWebToken = require('jsonwebtoken');

module.exports = function generateAPIToken(user = {}) {
  const tokenUser = {};
  if (user.id) tokenUser.id = user.id;
  else if (user.email) tokenUser.email = user.email;

  return jsonWebToken.sign(
    tokenUser,
    process.env.JWT_SECRET,
    { expiresIn: '24h' },
  );
};
