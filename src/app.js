const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { sql } = require('drizzle-orm');
const { db } = require('./db/client');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const requestLogger = require('./middlewares/requestLogger');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

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
