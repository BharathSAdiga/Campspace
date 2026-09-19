const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

async function resolveMongodPath() {
  // 1. Check if mongod is in PATH
  try {
    const whichCmd = process.platform === 'win32' ? 'where mongod' : 'which mongod';
    const output = execSync(whichCmd, { stdio: ['pipe', 'pipe', 'ignore'] }).toString().trim();
    if (output) {
      const firstPath = output.split(/\r?\n/)[0];
      if (fs.existsSync(firstPath)) return firstPath;
    }
  } catch (e) {
    // not in PATH
  }

  // 2. Check standard Windows Program Files location
  const standardPaths = [
    'C:\\Program Files\\MongoDB\\Server\\8.0\\bin\\mongod.exe',
    'C:\\Program Files\\MongoDB\\Server\\7.0\\bin\\mongod.exe',
    'C:\\Program Files\\MongoDB\\Server\\6.0\\bin\\mongod.exe',
  ];
  for (const p of standardPaths) {
    if (fs.existsSync(p)) return p;
  }

  // 3. Fallback to cached binary downloaded via mongodb-memory-server
  try {
    const { MongoBinary } = require('mongodb-memory-server-core');
    const binaryPath = await MongoBinary.getPath({ version: '6.0.14' });
    if (fs.existsSync(binaryPath)) return binaryPath;
  } catch (e) {
    // ignore
  }

  // 4. Check user home .cache
  const homeCache = path.join(
    process.env.USERPROFILE || process.env.HOME || '',
    '.cache',
    'mongodb-binaries',
    'mongod-x64-win32-6.0.14.exe'
  );
  if (fs.existsSync(homeCache)) return homeCache;

  throw new Error('Could not find mongod executable. Please install MongoDB or ensure mongod is on PATH.');
}

async function start() {
  const dbPath = path.resolve(__dirname, '../../data/db');
  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath, { recursive: true });
  }

  const mongodPath = await resolveMongodPath();
  const port = process.env.PORT_MONGO || 27017;

  console.log(`=========================================`);
  console.log(` Starting Local MongoDB Instance`);
  console.log(` Binary:   ${mongodPath}`);
  console.log(` Data Dir: ${dbPath}`);
  console.log(` Port:     ${port}`);
  console.log(` URI:      mongodb://127.0.0.1:${port}/campspace`);
  console.log(`=========================================`);

  const child = spawn(mongodPath, ['--dbpath', dbPath, '--port', String(port)], {
    stdio: 'inherit',
  });

  child.on('error', (err) => {
    console.error('[MongoDB Error]', err);
  });

  child.on('exit', (code, signal) => {
    console.log(`[MongoDB Exited] code: ${code}, signal: ${signal}`);
  });

  process.on('SIGINT', () => {
    console.log('\nStopping MongoDB...');
    child.kill('SIGINT');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    child.kill('SIGTERM');
    process.exit(0);
  });
}

start().catch((err) => {
  console.error('[Fatal Error]', err.message);
  process.exit(1);
});
