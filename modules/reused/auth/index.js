const jwt = require('jsonwebtoken');

const jwtSecret = 'supersecretodelamuerte';

const verifyToken = async (ctx, next) => {
  ctx.session = jwt.verify(ctx.cookies.get('token'), jwtSecret);
  await next();
};

const createToken = payload => {
  return jwt.sign(payload, jwtSecret, {expiresIn: 30 * 24 * 60 * 60});
};

module.exports = {verifyToken, createToken};