#!/usr/bin/env node
// Convert every mp4 in e2e/demo-videos/ to a small README-friendly gif.
// Usage: npm run e2e:demo:gif

import { readdirSync, existsSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, basename } from 'node:path';

const inDir = resolve(process.cwd(), 'e2e/demo-videos');
const fps = process.env.GIF_FPS ?? '10';
const width = process.env.GIF_WIDTH ?? '960';

if (!existsSync(inDir)) {
  console.error(`No directory at ${inDir}. Run npm run e2e:demo first.`);
  process.exit(1);
}

const mp4s = readdirSync(inDir).filter((f) => f.endsWith('.mp4'));
if (mp4s.length === 0) {
  console.error(`No .mp4 files in ${inDir}.`);
  process.exit(1);
}

mkdirSync(inDir, { recursive: true });

for (const mp4 of mp4s) {
  const inPath = resolve(inDir, mp4);
  const outPath = resolve(inDir, basename(mp4, '.mp4') + '.gif');
  process.stdout.write(`[gif] ${mp4} -> ${basename(outPath)} ... `);
  try {
    execFileSync(
      'ffmpeg',
      [
        '-y',
        '-i',
        inPath,
        '-vf',
        `fps=${fps},scale=${width}:-1:flags=lanczos`,
        '-loop',
        '0',
        outPath,
      ],
      { stdio: 'ignore' },
    );
    process.stdout.write('ok\n');
  } catch (err) {
    process.stdout.write('failed\n');
    console.error(`  ${(err instanceof Error ? err.message : String(err))}`);
  }
}
