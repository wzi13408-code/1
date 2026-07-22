import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

await mkdir('dist', { recursive: true });
await cp('public', 'dist/public', { recursive: true });
await cp('src/server.js', 'dist/server.js');
if (!existsSync('data/store.json')) {
  const { spawnSync } = await import('node:child_process');
  const result = spawnSync(process.execPath, ['scripts/seed.mjs'], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
const pkg = JSON.parse(await readFile('package.json', 'utf8'));
await writeFile('dist/package.json', `${JSON.stringify({ type: pkg.type, engines: pkg.engines }, null, 2)}\n`);
console.log('Build complete: dist/public and dist/server.js are ready.');
