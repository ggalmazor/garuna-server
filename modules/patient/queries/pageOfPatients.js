const Query = require('../../reused/queries/query');
const Page = require('../../reused/queries/page');

module.exports = Query.secure('page-of-patients', async (ctx, {limit, offset}) => {
  // language=PostgreSQL
  const {rows} = await ctx.db.query(`
    SELECT
      id,
      number,
      first_name,
      last_name,
      sex,
      phone_numbers,
      emails,
      birth_date,
      fiscal_id,
      address,
      location,
      zipcode,
      bank_account,
      notes,
      count(id)
      OVER () :: INT AS total
    FROM consulta.patient
    LIMIT $1
    OFFSET $2
  `, [limit, offset]);
  return rows.length === 0 ? Page.empty() : Page.of(rows, limit, offset);
});