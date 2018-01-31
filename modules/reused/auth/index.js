const jwt = require('jsonwebtoken');

// Easily changeable to a key pair backed jwt by transforming
// this module into a function that gets the key. Example:
// var cert = fs.readFileSync('private.key');  // get private key
// var token = jwt.sign({ foo: 'bar' }, cert, { algorithm: 'RS256'});

const jwtSecret = 'supersecretodelamuerte';

const verifyToken = async (ctx, next) => {
  ctx.session = jwt.verify(ctx.cookies.get('token'), jwtSecret);
  await next();
};

const createToken = payload => {
  return jwt.sign(payload, jwtSecret, {expiresIn: 30 * 24 * 60 * 60});
};

module.exports = {verifyToken, createToken};