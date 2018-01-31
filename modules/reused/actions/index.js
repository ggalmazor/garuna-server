const koaBody = require('koa-body');
const koaCompose = require('koa-compose');
const auth = require('../auth');

const buildMiddleware = action => {
  const middlewares = [koaBody()];
  if (action.secure)
    middlewares.push(auth.verifyToken);
  middlewares.push(async ctx => {
    await action.handler(ctx, ctx.request.body);
    ctx.response.status = 204;
  });
  return koaCompose(middlewares);
};

module.exports = router => {
  const register = action => router.post(`/action/${action.name}`, buildMiddleware(action));

  return {register};
};