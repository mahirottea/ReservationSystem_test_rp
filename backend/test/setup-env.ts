import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.test if present
config({ path: resolve(__dirname, '../.env.test') });

// Fallback secret if not defined
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'test_secret';
}
