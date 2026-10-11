import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from '../data/db.js';

const schemaPath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'schema.sql');

export async function migrate({ reset = false } = {}) {
  if (reset) {
    console.log('[migrate] Dropping all RAAAH tables...');
    await pool.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
  }

  try {
    await pool.query('CREATE EXTENSION IF NOT EXISTS postgis');
    console.log('[migrate] PostGIS extension enabled.');
  } catch {
    console.log('[migrate] PostGIS is not installed on this server; location checks use the haversine formula.');
  }

  await pool.query(fs.readFileSync(schemaPath, 'utf8'));
  console.log('[migrate] Schema is up to date.');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  migrate({ reset: process.argv.includes('--reset') })
    .catch((err) => {
      console.error('[migrate] Failed:', err.message);
      process.exitCode = 1;
    })
    .finally(() => pool.end());
}
