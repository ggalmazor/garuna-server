const Option = require("../fp/option");

const remove = key => object => {
  delete object[key];
  return object;
};

const toInt = text => parseInt(text, 10);

module.exports = class Page {
  constructor(rows, size, limit, offset, total) {
    this.rows = rows;
    this.size = size;
    this.limit = limit;
    this.offset = offset;
    this.total = total;
  }

  static of(rows, limit, offset) {
    const total = Option.of(rows[0].total).orThrow("Can't extract total from rows");
    return new Page(rows.map(remove('total')), rows.length, toInt(limit), toInt(offset), total);
  }

  static empty() {
    return new Page([], 0, 0, 0, 0);
  }
};