const identity = i => i;
const compose = (a, b) => value => b(a(value));
const pipe = (...fns) => fns.reduce(compose, identity);

module.exports = {identity, compose, pipe};