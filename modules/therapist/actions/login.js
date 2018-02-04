const {DateTime} = require('luxon');
const Action = require('../../reused/actions/action');

module.exports = Action.insecure('login', async (ctx, {username, password}) => {
  // language=PostgreSQL
  const {rows} = await ctx.db.query(`
    SELECT
      id,
      email
    FROM consulta.therapist
    WHERE username = $1 AND password = crypt($2, password)
  `, [username, password]);

  const token = ctx.auth.createToken({id: rows[0].id, username, email: rows[0].email});
  ctx.cookies.set("token", token, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    expires: DateTime.local().plus({days: 30}).toJSDate(),
    path: '/',
    secure: true,
    httpOnly: true,
    overwrite: true
  });
});