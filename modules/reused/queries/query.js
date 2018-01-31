module.exports = class Query {
  constructor(name, secure, handler) {
    this.name = name;
    this.secure = secure;
    this.handler = handler;
  }

  static secure(name, handler) {
    return new Query(name, true, handler);
  }

  static insecure(name, handler) {
    return new Query(name, false, handler);
  }
};