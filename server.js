const fs = require('fs');
const https = require('https');
const {Client} = require('pg');
const Koa = require('koa');
const Router = require('koa-router');
const koaBody = require('koa-body');
const jwt = require('jsonwebtoken');
const {DateTime} = require('luxon');

const database = require('./database.json').dev;

const jwtSecret = 'supersecretodelamuerte';

const app = new Koa();
const router = new Router();

router.get('/hello/:name', ctx => ctx.body = `Hello ${ctx.params.name}`);

// curl -i -k -XGET --cookie "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJndWlsbGVybW8iLCJlbWFpbCI6ImdnYWxtYXpvckBnbWFpbC5jb20iLCJpYXQiOjE1MTczNTA4MjAsImV4cCI6MTUxOTk0MjgyMH0.S00Igj9nKmvx2Gm5v6Wl-E12NbL0YBJvdIs47GpoD3k" https://localhost:13218/secure-hello/amaia
router.get('/secure-hello/:name', ctx => {
  const decoded = jwt.verify(ctx.cookies.get('token'), jwtSecret);
  console.log(decoded);
  ctx.body = `Hello ${ctx.params.name}`
});

// curl -i -k -XPOST https://localhost:13218/login -d'{"username":"guillermo","password":"Gu1ll3rm0"}' -H "Content-Type: application/json"
router.post('/login', koaBody(), async ctx => {
  const username = ctx.request.body.username;
  const password = ctx.request.body.password;
  const {rows} = await ctx.db.query(`
    SELECT id, email
    FROM consulta.therapist
    WHERE username = $1 AND password = crypt($2, password)
  `, [username, password]);

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

// curl -k -i -XPOST https://localhost:13218/create-therapist -d'{"username":"guillermo","password":"trikitriki","email":"ggalmazor@gmail.com"}' -H "Content-Type: application/json"
router.post('/create-therapist', koaBody(), async ctx => {
  const username = ctx.request.body.username;
  const password = ctx.request.body.password;
  const email = ctx.request.body.email;
  await ctx.db.query(`
    INSERT INTO consulta.therapist(id, username, password, email) 
    VALUES (nextval('consulta.therapist_id_seq'), $1, crypt($2, gen_salt('bf')), $3)
  `, [username, password, email]);
  ctx.response.status = 204;
});

app.use(router.routes())
    .use(router.allowedMethods());


const run = async () => {
  const db = new Client(database);
  await db.connect();
  console.log("Connected to the database");

  app.context.db = db;

  https.createServer({
    key: fs.readFileSync('ssl/garuna.key'),
    cert: fs.readFileSync('ssl/garuna.crt')
  }, app.callback()).listen(13218);
};

run().catch(e => console.error(e));