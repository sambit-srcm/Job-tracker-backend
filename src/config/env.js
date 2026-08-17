const PORT = process.env.PORT || 8080;
const DATABASE_URL = process.env.DATABASE_URL;

// Comma-separated list of allowed origins; defaults to the frontend's local Vite dev server.
const CORS_ORIGIN = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
  : ['http://localhost:5173'];

module.exports = { PORT, DATABASE_URL, CORS_ORIGIN };
