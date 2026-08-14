// Logs the full request (method, url, params, query, body) for debugging.
// Runs after body-parsing middleware so req.body is populated.
function requestLogger(req, res, next) {
  console.log('[request]', {
    method: req.method,
    url: req.originalUrl,
    params: req.params,
    query: req.query,
    body: req.body,
  });
  next();
}

module.exports = requestLogger;
