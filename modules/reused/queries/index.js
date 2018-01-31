const koaCompose = require('koa-compose');
const auth = require('../auth');

const buildMiddleware = query => {
  const middlewares = [];
  if (query.secure)
    middlewares.push(auth.verifyToken);
  middlewares.push(async ctx => {
    const params = Object.assign({}, ctx.params, ctx.request.query);
    ctx.response.body = await query.handler(ctx, params);
  });
  return koaCompose(middlewares);
};

module.exports = router => {
  const register = query => router.get(`/query/${query.name}`, buildMiddleware(query));

  return {register};
};