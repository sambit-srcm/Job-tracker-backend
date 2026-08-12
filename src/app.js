const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { sql } = require('drizzle-orm');
const { db } = require('./db/client');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/health/db', async (req, res) => {
  try {
    await db.execute(sql`select 1`);
    res.json({ status: 'ok' });
  } catch (error) {
    res.status(503).json({ status: 'error', message: error.message });
  }
});

module.exports = app;
