const badRequest = cause => {
  const error = cause instanceof Error ? cause : new Error(cause);
  error.httpCode = 400;
  return error;
};

module.exports = {badRequest};