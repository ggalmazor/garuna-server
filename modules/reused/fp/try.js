const Option = require('./option');

class Try {
  static of(block) {
    try {
      return new Success(block());
    } catch (e) {
      return new Failure(e);
    }
  }
}

class Success extends Try {
  constructor(value) {
    super();
    this.value = value;
  }

  toOption() {
    return Option.of(this.value);
  }

  orThrow() {
    return this.value;
  }
}

class Failure extends Try {
  constructor(error) {
    super();
    this.error = error;
  }

  toOption() {
    return Option.none();
  }

  orThrow(error) {
    if (typeof error === 'function')
      throw error(this.error);
    if (error)
      error.message = `${error} - Caused by ${this.error.message}`;
    throw this.error;
  }
}

module.exports = Try;