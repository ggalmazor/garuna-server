module.exports = {
  name: 'create-therapist',
  secure: false,
  handler: async (ctx, {username, password, email}) => ctx.db.query(`
      INSERT INTO consulta.therapist(id, username, password, email) 
      VALUES (nextval('consulta.therapist_id_seq'), $1, crypt($2, gen_salt('bf')), $3)
    `, [username, password, email])
};

