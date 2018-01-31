const Page = require('../../reused/queries/Page');

module.exports = {
  name: 'page-of-therapists',
  secure: true,
  handler: async (ctx, {limit, offset}) => {
    const {rows} = await ctx.db.query(`
      SELECT id, username, email, count(id) OVER () :: INT as total 
      FROM consulta.therapist 
      LIMIT $1 
      OFFSET $2
    `, [limit, offset]);
    return rows.length === 0 ? Page.empty() : Page.of(rows, limit, offset);
  }
};