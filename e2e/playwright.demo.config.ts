import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import { resolve } from 'node:path';

const testDir = defineBddConfig({
  features: 'demo/features/**/*.feature',
  steps: ['lib/hooks.ts', 'steps/**/*.steps.ts'],
  outputDir: '.features-gen/demo',
});

const VIEWPORT = { width: 2560, height: 1600 };
const SLOWMO = Number(process.env.DEMO_SLOWMO ?? 1200);

export default defineConfig({
  testDir,
  timeout: 180_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [
    ['list'],
    [resolve(process.cwd(), 'e2e/lib/reporter.ts'), { outDir: resolve(process.cwd(), 'e2e/demo-videos') }],
  ],
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:5173',
    headless: true,
    viewport: VIEWPORT,
    video: { mode: 'on', size: VIEWPORT },
    launchOptions: { slowMo: SLOWMO },
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: VIEWPORT,
        video: { mode: 'on', size: VIEWPORT },
      },
    },
  ],
});
