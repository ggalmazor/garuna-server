const fs = require('fs');
const https = require('https');
const {Client} = require('pg');
const squel = require('squel').useFlavour('postgres');
const Koa = require('koa');
const Router = require('koa-router');
const koaBody = require('koa-body');
const jwt = require('jsonwebtoken');
const {DateTime} = require('luxon');

const jwtSecret = 'supersecretodelamuerte';

const app = new Koa();
const router = new Router();

router.get('/hello/:name', ctx => ctx.body = `Hello ${ctx.params.name}`);
router.get('/secure-hello/:name', ctx => {
  const decoded = jwt.verify(ctx.cookies.get('token'), jwtSecret);
  console.log(decoded);
  ctx.body = `Hello ${ctx.params.name}`
});

router.post('/login', koaBody(), async ctx => {
  const username = ctx.request.body.username;
  const password = ctx.request.body.password;
  const {rows} = await ctx.db.query(squel.select()
      .from('consulta.therapist')
      .field('id')
      .field('email')
      .where('username = $1')
      .where('password = crypt($2, password)')
      .toString(), [username, password]);

  const therapist = {id: rows[0].id, username, email: rows[0].email};
  const token = jwt.sign(therapist, jwtSecret, {expiresIn: 30 * 24 * 60 * 60});
  console.log(therapist);
  console.log(token);
  ctx.cookies.set("token", token, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    expires: DateTime.local().plus({days: 30}).toJSDate(),
    path: '/',
    secure: true,
    httpOnly: true,
    overwrite: true
  });
  ctx.response.status = 204;
});

router.post('/create-therapist', koaBody(), async ctx => {
  const username = ctx.request.body.username;
  const password = ctx.request.body.password;
  const email = ctx.request.body.email;
  await ctx.db.query(squel.insert()
      .into("consulta.therapist")
      .set("id", squel.select().function('nextval(?)', 'consulta.therapist_id_seq'))
      .set("username", username)
      .set("password", squel.select().function('crypt(?, ?)', password, squel.select().function('gen_salt(?)', 'bf')))
      .set("email", email)
      .toString());
  ctx.response.status = 204;
});


app.use(router.routes())
    .use(router.allowedMethods());

const database = require('./database.json').dev;
const run = async () => {
  const db = new Client(database);
  await db.connect();
  console.log("Connected to the database");

  app.context.squel = squel;
  app.context.db = db;

  https.createServer({
    key: fs.readFileSync('ssl/garuna.key'),
    cert: fs.readFileSync('ssl/garuna.crt')
  }, app.callback()).listen(13218);
};

run().catch(e => console.error(e));