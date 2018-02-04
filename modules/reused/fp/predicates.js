const not = predicate => value => !predicate(value);
const alwaysTrue = i => true;
const compose = (a, b) => value => a(value) && b(value);
const pipe = (...predicates) => pipeArray(predicates);
const pipeArray = predicates => predicates.reduce(compose, alwaysTrue);

module.exports = {not, alwaysTrue, compose, pipe, pipeArray};