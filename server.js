const Koa = require('koa');
const app = new Koa();

const {Client} = require('pg');

const client = new Client({
  user: 'garuna',
  host: 'pgsql02.dinaserver.com',
  database: 'consulta',
  password: 'F1s10G4run4',
  port: 5432,
});

client.connect();

app.use(async ctx => {
  let res = await client.query("SELECT * FROM consulta.demo");
  ctx.body = res.rows;
});

app.listen(13218);