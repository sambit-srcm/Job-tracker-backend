require('dotenv').config();
const app = require('./src/app');
const { PORT } = require('./src/config/env');
const { pool } = require('./src/db/client');

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Stops accepting new connections, then closes the DB pool before exiting,
// so in-flight requests and queries finish instead of being cut off.
async function shutdown(signal) {
  console.log(`${signal} received, shutting down gracefully`);
  server.close(async () => {
    try {
      await pool.end();
      console.log('Database pool closed');
      process.exit(0);
    } catch (error) {
      console.error('Error closing database pool:', error);
      process.exit(1);
    }
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
