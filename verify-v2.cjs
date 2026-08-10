const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM_PATH });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const pageErrors = [];
  page.on('pageerror', (err) => pageErrors.push(err.message));

  await page.goto('http://127.0.0.1:4180/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2200);
  await page.locator('.enter-btn').click();
  await page.waitForTimeout(1000);

  await page.screenshot({ path: '/tmp/v2-hero.png' });

  await page.evaluate(() => document.getElementById('about')?.scrollIntoView());
  await page.waitForTimeout(400);
  await page.screenshot({ path: '/tmp/v2-about.png' });

  await page.evaluate(() => document.getElementById('skills')?.scrollIntoView());
  await page.waitForTimeout(400);
  await page.screenshot({ path: '/tmp/v2-skills.png' });

  await page.evaluate(() => document.getElementById('automation')?.scrollIntoView());
  await page.waitForTimeout(1200);
  await page.screenshot({ path: '/tmp/v2-automation.png' });

  const navHasAutomation = await page.locator('.nav-hud button:has-text("AUTOMATION")').count();
  console.log('Nav has AUTOMATION link:', navHasAutomation > 0);

  const volumeSlider = await page.locator('.music-volume').count();
  console.log('Volume slider present:', volumeSlider > 0);

  console.log('Page errors:', pageErrors.length ? pageErrors.join('\n') : '(none)');
  await browser.close();
})();
