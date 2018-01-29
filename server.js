const {Client} = require('pg');
const squel = require('squel').useFlavour('postgres');

const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const router = new Router();

router.get('/hello/:name', ctx => ctx.body = `Hello ${ctx.params.name}`);

router.post('/login', (ctx, next) => {

});

app.use(router.routes())
    .use(router.allowedMethods());

// use(async ctx => {
//   console.log(ctx);
//   console.log("Serving request");
//   const res = await ctx.db.query(squel.select().from("consulta.demo").toString());
//   console.log("Fetch database rows");
//   ctx.body = res.rows;
//   console.log("Write response body");
// });

const run = async () => {
  const db = new Client({
    user: 'garuna',
    host: 'pgsql02.dinaserver.com',
    database: 'consulta',
    password: 'F1s10G4run4',
    port: 5432,
  });
  await db.connect();
  console.log("Connected to the database");

  app.context.squel = squel;
  app.context.db = db;

  app.listen(13218);
};

run().catch(e => console.error(e));



