// Starts a local PostgreSQL server for development (no separate installation needed).
// Data is kept in Backend/.pgdata. Use DATABASE_URL instead if you already run PostgreSQL.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = 5433;
const dataDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../.pgdata');

let EmbeddedPostgres;
try {
  ({ default: EmbeddedPostgres } = await import('embedded-postgres'));
} catch {
  console.error('embedded-postgres is not installed. Run `npm install` or point DATABASE_URL to your own PostgreSQL server.');
  process.exit(1);
}

const server = new EmbeddedPostgres({
  databaseDir: dataDir,
  user: 'postgres',
  password: 'postgres',
  port: PORT,
  persistent: true,
  initdbFlags: ['--encoding=UTF8', '--locale=C'],
});

if (!fs.existsSync(path.join(dataDir, 'PG_VERSION'))) {
  console.log('[db:local] Initialising a new PostgreSQL data directory...');
  await server.initialise();
}
await server.start();
try {
  await server.createDatabase('raaah');
  console.log('[db:local] Created database "raaah".');
} catch {
  // database already exists
}
console.log(`[db:local] PostgreSQL is running on port ${PORT} (database "raaah"). Press Ctrl+C to stop.`);

const stop = async () => {
  await server.stop();
  process.exit(0);
};
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
