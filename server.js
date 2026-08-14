require('dotenv').config();
const app = require('./src/app');
const { PORT, DATABASE_URL } = require('./src/config/env');

if (!DATABASE_URL) {
  console.error(
    'Missing required DATABASE_URL environment variable. Set it in .env (see .env.example) before starting the server.'
  );
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
