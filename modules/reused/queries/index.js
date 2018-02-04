const koaCompose = require('koa-compose');
const auth = require('../auth');

const buildMiddleware = query => {
  const middlewares = [];
  if (query.secure)
    middlewares.push(auth.verifyToken);
  middlewares.push(async ctx => {
    try {
      const params = Object.assign({}, ctx.params, ctx.request.query);
      ctx.response.body = await query.handler(ctx, params);
    } catch (e) {
      if (e.httpCode) {
        ctx.response.body = e.message;
        ctx.response.status = e.httpCode;
        console.error(e);
      } else {
        throw e;
      }
    }
  });
  return koaCompose(middlewares);
};

module.exports = router => {
  const register = query => router.get(`/query/${query.name}`, buildMiddleware(query));

  return {register};
};