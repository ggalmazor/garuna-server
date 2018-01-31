const fs = require('fs');
const https = require('https');
const {Client} = require('pg');
const Koa = require('koa');
const router = new require('koa-router')();
const auth = require('./modules/reused/auth');
const database = require('./database.json').dev;


// router.get('/secure-hello/:name', auth.verifyToken, ctx => {
//   ctx.body = `Hello ${ctx.params.name} ${ctx.session.email} ${ctx.session.id}`
// });

// curl -i -k -XGET --cookie "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJndWlsbGVybW8iLCJlbWFpbCI6ImdnYWxtYXpvckBnbWFpbC5jb20iLCJpYXQiOjE1MTczNTA4MjAsImV4cCI6MTUxOTk0MjgyMH0.S00Igj9nKmvx2Gm5v6Wl-E12NbL0YBJvdIs47GpoD3k" https://localhost:13218/secure-hello/amaia
// curl -k -i -XPOST https://localhost:13218/action/create-therapist -d'{"username":"guillermo","password":"trikitriki","email":"ggalmazor@gmail.com"}' -H "Content-Type: application/json"
// curl -i -k -XPOST https://localhost:13218/action/login -d'{"username":"guillermo","password":"Gu1ll3rm0"}' -H "Content-Type: application/json"

const actions = require('./modules/reused/actions')(router);
const queries = require('./modules/reused/queries')(router);

require('./modules/therapist')(actions, queries);

const run = async app => {
  const db = new Client(database);
  await db.connect();
  console.log("Connected to the database");

  app.context.db = db;
  app.context.auth = auth;

  https.createServer({
    key: fs.readFileSync('ssl/garuna.key'),
    cert: fs.readFileSync('ssl/garuna.crt')
  }, app.callback()).listen(13218);
};

run(new Koa()
    .use(router.routes())
    .use(router.allowedMethods()))
    .catch(e => console.error(e));