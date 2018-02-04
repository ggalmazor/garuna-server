const Try = require('../../reused/fp/try');
const {callMethod} = require('../../reused/fp/objects');
const Action = require('../../reused/actions/action');
const errors = require('../../reused/errors');
const Patient = require('../patient');

module.exports = Action.secure('create-patient', async (ctx, payload) => {
  const patient = Try.of(() => Patient.from(payload)).orThrow(errors.badRequest);
  await ctx.db.query(
      // language=PostgreSQL
      `INSERT INTO consulta.patient(id, number, first_name, last_name, sex, phone_numbers, emails, birth_date, fiscal_id, address, location, zipcode, bank_account, notes) 
        VALUES (
          nextval('consulta.patient_id_seq'), 
          nextval('consulta.patient_number_seq'), 
          $1, $2, $3, $4 :: TEXT[], $5 :: TEXT[], $6 :: DATE, $7, $8, $9, $10, $11, $12
        )`,
      [
        patient.first_name,
        patient.last_name,
        patient.sex,
        patient.phone_numbers,
        patient.emails,
        patient.birth_date.map(callMethod("toString")).orNull(),
        patient.fiscal_id.orNull(),
        patient.address.orNull(),
        patient.location.orNull(),
        patient.zipcode.orNull(),
        patient.bank_account.orNull(),
        patient.notes.orNull()
      ]
  )
});
