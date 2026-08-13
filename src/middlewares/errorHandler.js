const ApiError = require('../utils/ApiError');

// https://www.postgresql.org/docs/current/errcodes-appendix.html
const PG_CHECK_VIOLATION = '23514';
const PG_NOT_NULL_VIOLATION = '23502';
const PG_INVALID_TEXT_REPRESENTATION = '22P02';

// Catch-all for requests that don't match any route
function notFound(_req, res) {
  res.status(404).json({ error: 'Not found' });
}

// Express error middleware (4-arg signature) — translates thrown/forwarded errors into responses
function errorHandler(err, _req, res, _next) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  if (
    err.code === PG_CHECK_VIOLATION ||
    err.code === PG_NOT_NULL_VIOLATION ||
    err.code === PG_INVALID_TEXT_REPRESENTATION
  ) {
    return res.status(400).json({ error: err.detail || err.message });
  }

  // set by express.json() when the request body isn't valid JSON
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Malformed JSON in request body' });
  }

  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
}

module.exports = { notFound, errorHandler };
