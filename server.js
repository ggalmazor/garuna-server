const Koa = require('koa');
const app = new Koa();

const {Client} = require('pg');
const squel = require('squel').useFlavour('postgres');

const client = new Client({
  user: 'garuna',
  host: 'pgsql02.dinaserver.com',
  database: 'consulta',
  password: 'F1s10G4run4',
  port: 5432,
});

client.connect();

app.use(async ctx => {
  let res = await client.query(squel.select().from("consulta.demo").toString());
  ctx.body = res.rows;
});

app.listen(13218);