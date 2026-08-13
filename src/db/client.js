const { Pool } = require('pg');
const { drizzle } = require('drizzle-orm/node-postgres');
const schema = require('./schema');
const { DATABASE_URL } = require('../config/env');

const pool = new Pool({
  connectionString: DATABASE_URL,
});

const db = drizzle(pool, { schema });

module.exports = { db, pool };
