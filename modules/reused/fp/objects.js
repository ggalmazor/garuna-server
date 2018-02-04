const callMethod = (method, ...args) => obj => obj[method].apply(obj, args);

module.exports = {callMethod};