module.exports = class Action {
  constructor(name, secure, handler) {
    this.name = name;
    this.secure = secure;
    this.handler = handler;
  }

  static secure(name, handler) {
    return new Action(name, true, handler);
  }

  static insecure(name, handler) {
    return new Action(name, false, handler);
  }
};