const koaBody = require('koa-body');
const koaCompose = require('koa-compose');
const auth = require('../auth');

const buildMiddleware = action => {
  const middlewares = [koaBody()];
  if (action.secure)
    middlewares.push(auth.verifyToken);
  middlewares.push(async ctx => {
    try {
      await action.handler(ctx, ctx.request.body);
      ctx.response.status = 204;
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
  const register = action => router.post(`/action/${action.name}`, buildMiddleware(action));

  return {register};
};