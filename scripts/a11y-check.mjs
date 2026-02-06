import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const ORIGIN = process.env.A11Y_ORIGIN || "http://127.0.0.1:8080";
const PAGES = [
  "/",               // home
  "/services.html",
  "/work.html",
  "/resources.html",
  "/contact.html",
  "/privacy.html",
  "/accessibility.html",
  "/404.html"
];

const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21aa"]; // includes color-contrast

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  let failures = 0;

  for (const path of PAGES) {
    const url = new URL(path, ORIGIN).toString();
    await page.goto(url, { waitUntil: "networkidle" });

    // Basic “house rules” checks (fast + explicit)
    const htmlLang = await page.getAttribute("html", "lang");
    if (!htmlLang) {
      console.error(`❌ Missing <html lang> on ${url}`);
      failures++;
    }

    // Skip link should exist and target #main
    const skip = await page.locator('a.skip-link[href="#main"]').count();
    if (skip === 0) {
      console.error(`❌ Missing skip link (a.skip-link[href="#main"]) on ${url}`);
      failures++;
    }

    // #main should exist
    const mainCount = await page.locator("#main").count();
    if (mainCount === 0) {
      console.error(`❌ Missing #main landmark container on ${url}`);
      failures++;
    }

    // Axe scan
    const results = await new AxeBuilder({ page })
      .withTags(AXE_TAGS)
      .analyze();

    if (results.violations.length) {
      failures += results.violations.length;
      console.error(`\n❌ Axe violations on ${url}:`);
      for (const v of results.violations) {
        console.error(`- ${v.id}: ${v.help} (${v.impact})`);
        // Print up to 3 node targets for signal without noise
        for (const node of v.nodes.slice(0, 3)) {
          console.error(`  • ${node.target.join(", ")}`);
        }
      }
    } else {
      console.log(`✅ ${path} passed`);
    }
  }

  await browser.close();

  if (failures > 0) {
    console.error(`\nFAILED: ${failures} total issue(s) found.`);
    process.exit(1);
  } else {
    console.log("\nPASSED: no accessibility regressions detected.");
  }
})();
