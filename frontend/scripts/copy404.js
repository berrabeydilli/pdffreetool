const { copyFileSync, existsSync } = require("fs");
const path = require("path");

const distDir = path.resolve(__dirname, "..", "dist");
const indexHtml = path.resolve(distDir, "index.html");
const notFoundHtml = path.resolve(distDir, "404.html");

if (existsSync(indexHtml)) {
  copyFileSync(indexHtml, notFoundHtml);
  // eslint-disable-next-line no-console
  console.log(`Created SPA fallback: ${notFoundHtml}`);
} else {
  // eslint-disable-next-line no-console
  console.warn(`index.html not found in ${distDir}; skipping 404 copy.`);
}
