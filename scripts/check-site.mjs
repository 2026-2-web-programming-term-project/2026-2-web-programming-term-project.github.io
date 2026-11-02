import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { Script } from 'node:vm';

const root = fileURLToPath(new URL('../', import.meta.url));
const html = await readFile(resolve(root, 'index.html'), 'utf8');
const app = await readFile(resolve(root, 'app.js'), 'utf8');
new Script(app, { filename: 'app.js' });
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
assert.equal(ids.length, new Set(ids).size, 'HTML IDs must be unique');
for (const [, value] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
  if (/^(?:[a-z]+:)?\/\//i.test(value)) continue;
  const [path, hash] = value.split('#');
  if (path) await access(resolve(root, decodeURIComponent(path)));
  if (hash) assert.ok(ids.includes(hash), `Missing anchor: ${hash}`);
}
const screenIds = ['C01', 'C02', 'C03', ...Array.from({length: 8}, (_, i) => `U0${i + 1}`), 'O01', 'O02', 'A01', 'A02', 'A03', 'M01', 'M02'];
for (const id of screenIds) {
  const image = await readFile(resolve(root, `assets/ui/${id}.png`));
  assert.equal(image.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', `Invalid PNG: ${id}`);
  assert.ok(app.includes(`id: "${id}"`), `Missing screen: ${id}`);
}
const deadlines = [...html.matchAll(/<time datetime="([^"]+)"/g)].map(match => match[1]);
assert.deepEqual(deadlines, ['2026-11-06T23:59:00+09:00', '2026-11-20T23:59:00+09:00', '2026-12-04T23:59:00+09:00']);
await access(resolve(root, '.nojekyll'));
console.log('Verified JavaScript syntax, HTML anchors and assets, 18 design screens, and three KST deadlines.');
