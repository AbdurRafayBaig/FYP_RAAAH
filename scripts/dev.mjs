// Starts the whole system for development with one command:  npm run dev
//   database (local PostgreSQL, port 5433) -> tables and demo data -> API (5000), AI engine (8000), web (3000)
// Press Ctrl+C to stop everything.
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = (name) => path.join(root, name);
const DB_PORT = 5433;
const children = [];

function start(label, command, args, cwd) {
  const child = spawn(command, args, { cwd, stdio: ['ignore', 'pipe', 'pipe'] });
  const print = (chunk) => {
    for (const line of chunk.toString().split(/\r?\n/)) if (line.trim()) console.log(`[${label}] ${line}`);
  };
  child.stdout.on('data', print);
  child.stderr.on('data', print);
  child.on('exit', (code) => console.log(`[${label}] stopped${code ? ` (exit code ${code})` : ''}`));
  children.push(child);
  return child;
}

const portOpen = (port) =>
  new Promise((resolve) => {
    const socket = net.connect(port, '127.0.0.1');
    socket.once('connect', () => { socket.destroy(); resolve(true); });
    socket.once('error', () => resolve(false));
  });

async function waitForPort(port, seconds) {
  for (let i = 0; i < seconds * 2; i += 1) {
    if (await portOpen(port)) return true;
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
}

for (const [folder, hint] of [['frontend', 'npm run setup'], ['backend', 'npm run setup']]) {
  if (!fs.existsSync(path.join(dir(folder), 'node_modules'))) {
    console.error(`Dependencies of ${folder}/ are not installed. Run \`${hint}\` first.`);
    process.exit(1);
  }
}
if (!fs.existsSync(path.join(dir('backend'), '.env'))) {
  fs.copyFileSync(path.join(dir('backend'), '.env.example'), path.join(dir('backend'), '.env'));
  console.log('[setup] Created backend/.env from .env.example');
}

if (await portOpen(DB_PORT)) {
  console.log(`[db] PostgreSQL is already running on port ${DB_PORT}`);
} else {
  start('db', process.execPath, ['src/db/localPostgres.js'], dir('backend'));
  if (!(await waitForPort(DB_PORT, 90))) {
    console.error(`[db] PostgreSQL did not start on port ${DB_PORT}.`);
    process.exit(1);
  }
}

// Both steps are safe to repeat: tables are only created when missing, demo data only loaded once
for (const script of ['src/db/migrate.js', 'src/db/seed.js']) {
  const result = spawnSync(process.execPath, [script], { cwd: dir('backend'), stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

start('api', process.execPath, ['--watch', 'src/server.js'], dir('backend'));
start('ai', 'python', ['-m', 'uvicorn', 'app.main:app', '--port', '8000', '--reload'], dir('ai-engine'));
start('web', process.execPath, ['node_modules/next/dist/bin/next', 'dev', '--webpack'], dir('frontend'));

console.log('\n  Web   http://localhost:3000\n  API   http://localhost:5000/api/health\n  AI    http://localhost:8000/health\n');

// Ctrl+C reaches every child as well; wait for them (the database shuts down cleanly), then exit.
let stopping = false;
function stop() {
  if (stopping) return;
  stopping = true;
  console.log('\nStopping RAAAH...');
  for (const child of children) if (child.exitCode === null) child.kill('SIGINT');
  setTimeout(() => process.exit(0), 8000).unref();
}
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
