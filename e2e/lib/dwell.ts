import type { Page } from '@playwright/test';

/**
 * Pause to let the camera linger on a beat. No-op outside demo mode.
 */
export async function dwellForDemo(page: Page, ms?: number) {
  if (process.env.DEMO !== '1') return;
  const duration = ms ?? Number(process.env.DEMO_DWELL_MS ?? 1500);
  try {
    await page.waitForTimeout(duration);
  } catch {
    // page may already be closed at end of scenario
  }
}
