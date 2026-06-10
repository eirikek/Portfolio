import { chromium } from "playwright-core";
import { statSync } from "node:fs";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const base = process.env.URL || "http://localhost:3000";

async function probe(label, url) {
  const browser = await chromium.launch({
    executablePath: CHROME,
    headless: true,
    args: [
      "--use-gl=angle",
      "--use-angle=metal",
      "--enable-webgl",
      "--ignore-gpu-blocklist",
    ],
  });
  const page = await browser.newPage({ viewport: { width: 1000, height: 640 } });
  await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(1200);
  const launch = await page.$('button:has-text("Launch experience")');
  if (launch) await launch.click();
  await page.waitForTimeout(2200);

  const sizes = [];
  for (let i = 0; i < 14; i++) {
    const p = `/tmp/metal-${label}-${i}.png`;
    await page.screenshot({ path: p });
    sizes.push(Math.round(statSync(p).size / 1024));
    await page.waitForTimeout(45);
  }
  await browser.close();
  const min = Math.min(...sizes);
  const max = Math.max(...sizes);
  console.log(`\n[${label}] frame sizes (k): ${sizes.join(" ")}`);
  console.log(
    `[${label}] min=${min}k max=${max}k spread=${(((max - min) / max) * 100).toFixed(0)}%`
  );
}

await probe("fx-on", base);
await probe("fx-off", base + "/?nofx");
