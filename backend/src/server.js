import { config } from './config.js';
import { createApp } from './app.js';
import { initCache } from './data/cache.js';
import { pool } from './data/db.js';
import { startRefreshJob } from './modules/crowd/crowdService.js';

async function main() {
  try {
    await pool.query('SELECT 1');
  } catch (err) {
    console.error(`[db] Cannot connect to PostgreSQL at ${config.databaseUrl.replace(/:[^:@/]+@/, ':****@')}`);
    console.error('     Start the local database with `npm run db:local` or set DATABASE_URL in .env.');
    console.error(`     (${err.message})`);
    process.exit(1);
  }

  await initCache();
  const refreshJob = startRefreshJob();

  const server = createApp().listen(config.port, () => {
    console.log(`[api] RAAAH API listening on http://localhost:${config.port}`);
  });

  // Finish in-flight requests before the container or process manager stops the server
  const shutdown = (signal) => {
    console.log(`[api] ${signal} received; shutting down.`);
    clearInterval(refreshJob);
    server.close(async () => {
      await pool.end().catch(() => {});
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10000).unref();
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

main();
