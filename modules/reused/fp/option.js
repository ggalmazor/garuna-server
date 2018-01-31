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
}

class Some extends Option {
  constructor(value) {
    super();
    this.value = value;
  }

  orThrow(message) {
    return this.value;
  }
}

class None extends Option {
  constructor() {
    super();
  }

  orThrow(message) {
    throw Error(message);
  }
}

const NONE = new None();

module.exports = Option;