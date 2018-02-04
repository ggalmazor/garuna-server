const {pipeArray: pipe} = require('./predicates');

class Option {
  static of(value) {
    if (value instanceof Option)
      return value;
    if (value === null || value === undefined)
      return NONE;
    return new Some(value);
  }

  static none() {
    return NONE;
  }

  static nonNull(value) {
    return Option.of(value).orThrow("No value present");
  }
}

class Some extends Option {
  constructor(value) {
    super();
    this.value = value;
  }

  map(mapper) {
    return new Some(mapper(this.value));
  }

  filter(...predicates) {
    return pipe(predicates)(this.value) ? this : NONE;
  }

  orElse(otherValue) {
    return this.value;
  }

  orNull() {
    return this.value;
  }

  orThrow(message) {
    return this.value;
  }
}

class None extends Option {
  constructor() {
    super();
  }

  map(mapper) {
    return this;
  }

  filter(predicate) {
    return this;
  }

  orElse(otherValue) {
    return otherValue;
  }

  orNull() {
    return null;
  }

  orThrow(message) {
    throw new Error(message);
  }
}

const NONE = new None();

module.exports = Option;