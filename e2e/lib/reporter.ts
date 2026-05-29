import type { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import { existsSync, mkdirSync, readdirSync, rmdirSync, statSync, unlinkSync } from 'node:fs';
import { resolve, dirname, basename, join } from 'node:path';
import { execFileSync } from 'node:child_process';

interface Pending {
  sourcePath: string;
  slug: string;
  feature: string;
}

const WARMUP_PREFIX = '00-warmup';

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export default class DemoVideoReporter implements Reporter {
  private pending: Pending[] = [];
  private outDir: string;

  constructor(options: { outDir?: string } = {}) {
    this.outDir = resolve(process.cwd(), options.outDir ?? 'e2e/demo-videos');
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const video = result.attachments.find((a) => a.name === 'video');
    if (!video?.path) return;
    const featureSlug = slugify(test.parent.title || 'feature');
    const scenarioSlug = slugify(test.title);
    this.pending.push({
      sourcePath: video.path,
      slug: scenarioSlug,
      feature: featureSlug,
    });
  }

  async onEnd() {
    if (this.pending.length === 0) return;
    mkdirSync(this.outDir, { recursive: true });

    for (const item of this.pending) {
      const isWarmup = item.feature.startsWith(WARMUP_PREFIX) || item.slug.startsWith(WARMUP_PREFIX);
      if (isWarmup) {
        this.cleanupWarmup(item.sourcePath);
        continue;
      }

      if (!existsSync(item.sourcePath)) continue;
      const sourceStat = statSync(item.sourcePath);
      if (sourceStat.size === 0) {
        this.cleanupWarmup(item.sourcePath);
        continue;
      }

      const mp4Name = `${item.feature}-${item.slug}.mp4`;
      const mp4Path = join(this.outDir, mp4Name);
      try {
        execFileSync(
          'ffmpeg',
          [
            '-y',
            '-i',
            item.sourcePath,
            '-c:v',
            'libx264',
            '-preset',
            'veryfast',
            '-pix_fmt',
            'yuv420p',
            '-movflags',
            '+faststart',
            mp4Path,
          ],
          { stdio: 'ignore' },
        );
        unlinkSync(item.sourcePath);
        this.cleanupParentDir(item.sourcePath);
      } catch (err) {
        // ffmpeg missing or conversion failed — keep the webm, surface the error
        console.warn(`[demo-reporter] failed to convert ${basename(item.sourcePath)}:`, (err as Error).message);
      }
    }
  }

  private cleanupWarmup(sourcePath: string) {
    try {
      if (existsSync(sourcePath)) unlinkSync(sourcePath);
      this.cleanupParentDir(sourcePath);
    } catch {
      // best-effort cleanup
    }
  }

  private cleanupParentDir(sourcePath: string) {
    try {
      const parent = dirname(sourcePath);
      if (existsSync(parent) && readdirSync(parent).length === 0) {
        rmdirSync(parent);
      }
    } catch {
      // best-effort cleanup
    }
  }
}
