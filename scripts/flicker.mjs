import { chromium } from "playwright-core";
import { statSync } from "node:fs";

const URL = process.env.URL || "http://localhost:3000";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

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
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.goto(URL, { waitUntil: "networkidle", timeout: 30000 });
await page.waitForTimeout(1500);
const launch = await page.$('button:has-text("Launch experience")');
if (launch) await launch.click();
await page.waitForTimeout(2500);

const sizes = [];
for (let i = 0; i < 12; i++) {
  const path = `/tmp/flick-${i}.png`;
  await page.screenshot({ path });
  sizes.push(statSync(path).size);
  await page.waitForTimeout(70);
}
const min = Math.min(...sizes);
const max = Math.max(...sizes);
console.log("frame PNG sizes (bytes):");
console.log(sizes.map((s) => (s / 1024).toFixed(0) + "k").join("  "));
console.log(
  `min=${(min / 1024).toFixed(0)}k max=${(max / 1024).toFixed(0)}k spread=${(
    ((max - min) / max) *
    100
  ).toFixed(0)}%`
);
await browser.close();
