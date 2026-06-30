import { cp, mkdir, rm, stat } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const dist = join(root, 'dist');
const files = ['index.html', 'styles.css', 'script.js', 'manifest.webmanifest', '.nojekyll', 'assets'];

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

for (const file of files) {
  const source = join(root, file);
  if (!(await exists(source))) throw new Error(`Missing build input: ${file}`);
  await cp(source, join(dist, file), { recursive: true });
}

console.log('Stylo static build complete: dist/');
