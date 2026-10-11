import pg from 'pg';
import { config } from '../config.js';

const { Pool } = pg;

export const pool = new Pool({ connectionString: config.databaseUrl, max: 10 });

pool.on('error', (err) => {
  console.error('[db] Unexpected PostgreSQL client error:', err.message);
});

export function query(text, params) {
  return pool.query(text, params);
}

export async function withTransaction(work) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await work(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

let postgisEnabled = null;

// PostGIS is used for location checks when the extension is installed on the server;
// otherwise the haversine formula gives the same result in plain SQL.
export async function hasPostgis() {
  if (postgisEnabled === null) {
    const { rows } = await query("SELECT 1 FROM pg_extension WHERE extname = 'postgis'");
    postgisEnabled = rows.length > 0;
  }
  return postgisEnabled;
}
