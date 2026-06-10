import { chromium } from "playwright-core";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const URL = process.env.URL || "http://localhost:3000";

const browser = await chromium.launch({
  executablePath: CHROME,
  headless: true,
  args: [
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
    "--enable-webgl",
    "--ignore-gpu-blocklist",
  ],
});
const page = await browser.newPage({ viewport: { width: 1000, height: 640 } });
await page.goto(URL, { waitUntil: "networkidle", timeout: 30000 });
await page.waitForTimeout(1200);
const launch = await page.$('button:has-text("Launch experience")');
if (launch) await launch.click();
await page.waitForTimeout(2500);

await page.screenshot({ path: "/tmp/trans-0-before.png" });
await page.keyboard.press("ArrowDown");
// Capture the transition in flight.
await page.waitForTimeout(140);
await page.screenshot({ path: "/tmp/trans-1-mid.png" });
await page.waitForTimeout(160);
await page.screenshot({ path: "/tmp/trans-2-mid.png" });
await page.waitForTimeout(900);
await page.screenshot({ path: "/tmp/trans-3-after.png" });

await browser.close();
console.log("captured trans-0..3");
