const { Pool } = require('pg');
const { drizzle } = require('drizzle-orm/node-postgres');
const schema = require('./schema');
const { DATABASE_URL, DEBUG_LOGGING } = require('../config/env');

const pool = new Pool({
  connectionString: DATABASE_URL,
});

const db = drizzle(pool, { schema, logger: DEBUG_LOGGING });

module.exports = { db, pool };
