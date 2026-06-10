import { chromium } from "playwright-core";

const URL = process.env.URL || "http://localhost:3001";
const CHROME =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

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
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const errors = [];
const logs = [];
page.on("console", (m) => {
  logs.push(`[${m.type()}] ${m.text()}`);
  if (m.type() === "error") errors.push(m.text());
});
page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));

await page.goto(URL, { waitUntil: "networkidle", timeout: 30000 });
await page.waitForTimeout(2500);
await page.screenshot({ path: "/tmp/portfolio-intro.png" });

// Enter the experience.
const launch = await page.$('button:has-text("Launch experience")');
if (launch) await launch.click();
await page.waitForTimeout(3500);
await page.screenshot({ path: "/tmp/portfolio-scene.png" });

// Navigate a planet and a layer, open detail + contact.
await page.keyboard.press("ArrowRight");
await page.waitForTimeout(1500);
await page.keyboard.press("ArrowDown");
await page.waitForTimeout(1800);
await page.screenshot({ path: "/tmp/portfolio-layer.png" });

const details = await page.$('button:has-text("View details")');
if (details) await details.click();
await page.waitForTimeout(1200);
await page.screenshot({ path: "/tmp/portfolio-detail.png" });

// Detect a live WebGL canvas.
const canvasInfo = await page.evaluate(() => {
  const c = document.querySelector("canvas");
  if (!c) return { present: false };
  const gl = c.getContext("webgl2") || c.getContext("webgl");
  // Sample brightness by drawing the canvas to a 2d context.
  let maxL = 0;
  let bright = 0;
  try {
    const off = document.createElement("canvas");
    off.width = 300;
    off.height = 188;
    const ctx = off.getContext("2d");
    ctx.drawImage(c, 0, 0, off.width, off.height);
    const data = ctx.getImageData(0, 0, off.width, off.height).data;
    for (let i = 0; i < data.length; i += 4) {
      const l = data[i] + data[i + 1] + data[i + 2];
      if (l > maxL) maxL = l;
      if (l > 60) bright++;
    }
  } catch (e) {
    return { present: true, hasGL: !!gl, sampleError: String(e) };
  }
  return { present: true, w: c.width, h: c.height, hasGL: !!gl, maxL, bright };
});

console.log("CANVAS:", JSON.stringify(canvasInfo));
console.log("ERRORS:", errors.length);
errors.slice(0, 20).forEach((e) => console.log("  -", e));
console.log("--- console (last 15) ---");
logs.slice(-15).forEach((l) => console.log("  " + l));

await browser.close();
process.exit(errors.length ? 1 : 0);
