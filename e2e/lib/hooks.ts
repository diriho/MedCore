import { createBdd } from 'playwright-bdd';
import { installDemoChrome, patchLocatorFillForDemo } from './demo-init.js';
import { dwellForDemo } from './dwell.js';

export const { Given, When, Then, Step, Before, After } = createBdd();

Before(async ({ page }) => {
  patchLocatorFillForDemo();
  await installDemoChrome(page);
});

After(async ({ page }) => {
  if (process.env.DEMO !== '1') return;
  const tailMs = Number(process.env.DEMO_TAIL_MS ?? 1500);
  await dwellForDemo(page, tailMs);
});
