const { copyFileSync, existsSync } = require("fs");
const path = require("path");

const distDir = path.resolve(__dirname, "..", "dist");
const indexHtml = path.resolve(distDir, "index.html");
const fallbackTargets = ["404.html", "200.html"];

if (existsSync(indexHtml)) {
  fallbackTargets.forEach((filename) => {
    const targetPath = path.resolve(distDir, filename);
    copyFileSync(indexHtml, targetPath);
    // eslint-disable-next-line no-console
    console.log(`Created SPA fallback: ${targetPath}`);
  });
} else {
  // eslint-disable-next-line no-console
  console.warn(`index.html not found in ${distDir}; skipping SPA fallback copy.`);
}
