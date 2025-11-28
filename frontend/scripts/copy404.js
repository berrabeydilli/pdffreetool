const { copyFileSync, existsSync, mkdirSync } = require("fs");
const path = require("path");

const distDir = path.resolve(__dirname, "..", "dist");
const indexHtml = path.resolve(distDir, "index.html");
const fallbackTargets = ["404.html", "200.html"];

const LANGUAGE_CODES = ["en", "tr"];
const PAGE_SLUGS = {
  en: ["", "blog", "faq", "privacy-policy", "terms-of-service", "about", "contact"],
  tr: ["", "blog", "sss", "gizlilik-politikasi", "kullanim-kosullari", "hakkinda", "iletisim"],
};
const TOOL_SLUGS = {
  en: [
    "pdf-merge",
    "pdf-compress",
    "image-compress",
    "jpg-to-pdf",
    "pdf-to-jpg",
    "pdf-to-png",
    "pdf-split",
    "pdf-delete-pages",
    "pdf-rotate",
    "pdf-extract-pages",
    "pdf-reader",
    "pdf-to-word",
    "word-to-pdf",
  ],
  tr: [
    "pdf-birlestir",
    "pdf-sikistir",
    "gorsel-sikistir",
    "jpg-pdf",
    "pdf-jpg",
    "pdf-png",
    "pdf-bol",
    "pdf-sayfa-sil",
    "pdf-dondur",
    "pdf-sayfa-cikar",
    "pdf-okuyucu",
    "pdf-word",
    "word-pdf",
  ],
};

const copyIndexTo = (targetPath) => {
  const targetDir = path.dirname(targetPath);
  mkdirSync(targetDir, { recursive: true });
  copyFileSync(indexHtml, targetPath);
  // eslint-disable-next-line no-console
  console.log(`Created SPA fallback: ${targetPath}`);
};

if (existsSync(indexHtml)) {
  fallbackTargets.forEach((filename) => {
    const targetPath = path.resolve(distDir, filename);
    copyIndexTo(targetPath);
  });

  LANGUAGE_CODES.forEach((lang) => {
    const pageSlugs = PAGE_SLUGS[lang] || [];
    const toolSlugs = TOOL_SLUGS[lang] || [];
    const routeSlugs = Array.from(new Set([...pageSlugs, ...toolSlugs]));

    routeSlugs
      .filter(Boolean)
      .forEach((slug) => {
        const targetPath = path.resolve(distDir, lang, slug, "index.html");
        copyIndexTo(targetPath);
      });

    // Language root (/en, /tr)
    const langRootTarget = path.resolve(distDir, lang, "index.html");
    copyIndexTo(langRootTarget);
  });
} else {
  // eslint-disable-next-line no-console
  console.warn(`index.html not found in ${distDir}; skipping SPA fallback copy.`);
}
