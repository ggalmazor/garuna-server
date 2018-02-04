const {DateTime} = require('luxon');
const Option = require('../reused/fp/option');
const {not} = require('../reused/fp/predicates');
const string = require('../reused/fp/strings');
const list = require('../reused/fp/lists');

module.exports = class Patient {
  constructor(id, number, first_name, last_name, sex, phone_numbers, emails, birth_date, fiscal_id, address, location, zipcode, bank_account, notes) {
    if (list.isEmpty(phone_numbers) && list.isEmpty(emails))
      throw Error("At least a phone number or an email address must be provided");

    this.id = id;
    this.number = number;
    this.first_name = Option.of(first_name).map(string.trim).filter(not(string.isEmpty)).orThrow("Missing first name");
    this.last_name = Option.of(last_name).map(string.trim).filter(not(string.isEmpty)).orThrow("Missing last name");
    this.sex = sex;
    this.phone_numbers = phone_numbers;
    this.emails = emails;
    this.birth_date = birth_date;
    this.fiscal_id = fiscal_id;
    this.address = address;
    this.location = location;
    this.zipcode = zipcode;
    this.bank_account = bank_account;
    this.notes = notes;
  }

  static from(json) {
    return new Patient(
        Option.of(json.id),
        Option.of(json.number),
        json.first_name,
        json.last_name,
        Option.of(json.sex).map(string.trim),
        Option.of(json.phone_numbers).orElse([]).map(string.trim),
        Option.of(json.emails).orElse([]).map(string.trim),
        Option.of(json.birth_date).map(DateTime.fromISO),
        Option.of(json.fiscal_id).map(string.trim),
        Option.of(json.address).map(string.trim),
        Option.of(json.location).map(string.trim),
        Option.of(json.zipcode).map(string.trim),
        Option.of(json.bank_account).map(string.trim),
        Option.of(json.notes).map(string.trim).filter(not(string.isEmpty))
    );
  }
};