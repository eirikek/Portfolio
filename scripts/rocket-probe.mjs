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
await page.waitForTimeout(2000);

// Sample the rocket over ~16s to see the path.
for (let i = 0; i < 8; i++) {
  await page.screenshot({ path: `/tmp/rocket-${i}.png` });
  await page.waitForTimeout(2000);
}
await browser.close();
console.log("captured rocket-0..7");
