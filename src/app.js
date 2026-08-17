const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { sql } = require('drizzle-orm');
const { db } = require('./db/client');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const requestLogger = require('./middlewares/requestLogger');
const { DEBUG_LOGGING, CORS_ORIGIN } = require('./config/env');

const app = express();

app.use(cors({ origin: CORS_ORIGIN }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// req.body may contain PII (notes, location) — only dumped to stdout when DEBUG_LOGGING is on
if (DEBUG_LOGGING) {
  app.use(requestLogger);
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/health/db', async (req, res) => {
  console.log('[db-check] checking database connectivity');
  try {
    await db.execute(sql`select 1`);
    console.log('[db-check] database is reachable');
    res.json({ status: 'ok' });
  } catch (error) {
    console.error('[db-check] database is unreachable:', error.message);
    res.status(503).json({ status: 'error', message: error.message });
  }
});

app.use(routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
