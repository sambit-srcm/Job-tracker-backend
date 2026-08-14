const PORT = process.env.PORT || 8080;
const DATABASE_URL = process.env.DATABASE_URL;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Full request/SQL logging can leak PII (notes, location, etc.) into stdout,
// so it's opt-out in non-production envs and opt-in (via DEBUG_LOGGING=true) in production.
const DEBUG_LOGGING = process.env.DEBUG_LOGGING
  ? process.env.DEBUG_LOGGING === 'true'
  : NODE_ENV !== 'production';

module.exports = { PORT, DATABASE_URL, NODE_ENV, DEBUG_LOGGING };
