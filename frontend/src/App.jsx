import React, { useEffect, useRef, useState } from "react";
import AdsenseBanner from "./components/AdsenseBanner";
import CompressCard from "./CompressCard";
import CompressImageCard from "./CompressImageCard";
import JpgToPdfCard from "./JpgToPdfCard";
import PdfToJpgCard from "./PdfToJpgCard";
import PdfToPngCard from "./PdfToPngCard";
import SplitPdfCard from "./SplitPdfCard";
import PdfToWordCard from "./PdfToWordCard";
import WordToPdfCard from "./WordToPdfCard";
import DeletePdfPagesCard from "./DeletePdfPagesCard";
import RotatePdfPagesCard from "./RotatePdfPagesCard";
import PdfReaderCard from "./PdfReaderCard";
import ExtractPdfPagesCard from "./ExtractPdfPagesCard";
import { API_URL } from "./apiConfig";

const DEFAULT_LANGUAGE = "en";
const DEFAULT_TOOL = "merge";
const SUPPORTED_LANGUAGES = ["en", "tr", "de"];

const TOOL_SLUGS = {
  merge: { en: "pdf-merge", tr: "pdf-birlestir", de: "pdf-zusammenfuehren" },
  compress: { en: "pdf-compress", tr: "pdf-sikistir", de: "pdf-komprimieren" },
  compressImage: { en: "image-compress", tr: "gorsel-sikistir", de: "bild-komprimieren" },
  jpgToPdf: { en: "jpg-to-pdf", tr: "jpg-pdf", de: "jpg-zu-pdf" },
  pdfToJpg: { en: "pdf-to-jpg", tr: "pdf-jpg", de: "pdf-zu-jpg" },
  pdfToPng: { en: "pdf-to-png", tr: "pdf-png", de: "pdf-zu-png" },
  split: { en: "pdf-split", tr: "pdf-bol", de: "pdf-teilen" },
  deletePages: { en: "pdf-delete-pages", tr: "pdf-sayfa-sil", de: "pdf-seiten-loeschen" },
  rotatePages: { en: "pdf-rotate", tr: "pdf-dondur", de: "pdf-drehen" },
  extractPages: { en: "pdf-extract-pages", tr: "pdf-sayfa-cikar", de: "pdf-seiten-extrahieren" },
  pdfReader: { en: "pdf-reader", tr: "pdf-okuyucu", de: "pdf-reader" },
  pdfToWord: { en: "pdf-to-word", tr: "pdf-word", de: "pdf-zu-word" },
  wordToPdf: { en: "word-to-pdf", tr: "word-pdf", de: "word-zu-pdf" },
};

const PAGE_SLUGS = {
  home: { en: "", tr: "", de: "" },
  blog: { en: "blog", tr: "blog", de: "blog" },
  faq: { en: "faq", tr: "sss", de: "faq" },
  privacy: { en: "privacy-policy", tr: "gizlilik-politikasi", de: "datenschutzerklaerung" },
  terms: { en: "terms-of-service", tr: "kullanim-kosullari", de: "nutzungsbedingungen" },
  about: { en: "about", tr: "hakkinda", de: "ueber-uns" },
  contact: { en: "contact", tr: "iletisim", de: "kontakt" },
};

const DEFAULT_PAGE_SEO = {
  en: {
    title: "PDFFreeTool | Merge, compress, and convert PDFs online",
    description:
      "Use free browser-based tools to merge, compress, split, rotate, and convert PDF or image files without sign-ups.",
    h1: "Flexible PDF & Image studio",
  },
  tr: {
    title: "PDFFreeTool | PDF birleştir, sıkıştır ve dönüştür",
    description:
      "Kaydolmadan PDF ve görselleri tarayıcıda birleştirin, sıkıştırın, bölün, döndürün veya dönüştürün.",
    h1: "Esnek PDF ve Görsel stüdyosu",
  },
  de: {
    title: "PDFFreeTool | PDFs online zusammenführen, komprimieren und konvertieren",
    description:
      "Kostenlose Browser-Tools nutzen, um PDF- oder Bilddateien ohne Anmeldung zusammenzuführen, zu komprimieren, aufzuteilen, zu drehen oder zu konvertieren.",
    h1: "Flexibles PDF- und Bildstudio",
  },
};

const TOOL_SEO_METADATA = {
  merge: {
    en: {
      title: "Merge PDF Files Online | PDFFreeTool",
      description: "Combine multiple PDF files, reorder pages, and download a single organized document in seconds.",
      h1: "Merge PDF files in your browser",
    },
    tr: {
      title: "PDF Birleştirici | PDFFreeTool",
      description: "Birden fazla PDF'yi tarayıcıda birleştirip sayfaları yeniden sırala, tek ve düzenli bir dosya indir.",
      h1: "PDF dosyalarını tarayıcıda birleştir",
    },
    de: {
      title: "PDF-Dateien online zusammenführen | PDFFreeTool",
      description: "Mehrere PDFs hochladen, Seiten neu anordnen und in Sekunden als geordnetes Dokument herunterladen.",
      h1: "PDF-Dateien im Browser zusammenführen",
    },
  },
  compress: {
    en: {
      title: "Compress PDF to Reduce File Size | PDFFreeTool",
      description: "Shrink PDF attachments while keeping text and images clear so they are easy to email or upload.",
      h1: "Compress PDF without losing clarity",
    },
    tr: {
      title: "PDF Sıkıştırma Aracı | PDFFreeTool",
      description: "PDF boyutunu düşür, metin ve görselleri net tutarak e-posta veya yüklemeleri kolaylaştır.",
      h1: "PDF'leri kalite kaybı olmadan sıkıştır",
    },
    de: {
      title: "PDF-Dateien komprimieren | PDFFreeTool",
      description: "PDF-Anhänge verkleinern und dabei Text und Bilder klar halten, damit E-Mail und Uploads mühelos sind.",
      h1: "PDF ohne Qualitätsverlust komprimieren",
    },
  },
  compressImage: {
    en: {
      title: "Compress Images for Web and Email | PDFFreeTool",
      description: "Optimize JPG or PNG files with in-browser compression that preserves color and transparency.",
      h1: "Compress JPG or PNG images online",
    },
    tr: {
      title: "Görsel Sıkıştırma | PDFFreeTool",
      description: "JPG veya PNG dosyalarını tarayıcıda sıkıştır, renkleri ve şeffaflığı koruyarak web'e hazırla.",
      h1: "JPG ve PNG görselleri çevrimiçi sıkıştır",
    },
    de: {
      title: "Bilder für Web und E-Mail komprimieren | PDFFreeTool",
      description: "JPG- oder PNG-Dateien im Browser optimieren, Farben und Transparenz erhalten und webfertig machen.",
      h1: "JPG- oder PNG-Bilder online komprimieren",
    },
  },
  jpgToPdf: {
    en: {
      title: "Convert JPG to PDF | PDFFreeTool",
      description: "Turn multiple JPG or PNG images into a single, neat PDF with drag-and-drop ordering.",
      h1: "Convert images to a clean PDF",
    },
    tr: {
      title: "JPG'den PDF'ye Dönüştür | PDFFreeTool",
      description: "Birden fazla JPG veya PNG'yi sürükleyip sıralayarak tek ve düzenli bir PDF'e dönüştür.",
      h1: "Görselleri düzenli bir PDF'e çevir",
    },
    de: {
      title: "JPG in PDF umwandeln | PDFFreeTool",
      description: "Mehrere JPG- oder PNG-Bilder zu einem einzigen, aufgeräumten PDF zusammenstellen.",
      h1: "Bilder in ein sauberes PDF konvertieren",
    },
  },
  pdfToJpg: {
    en: {
      title: "PDF to JPG Converter | PDFFreeTool",
      description: "Export every PDF page as a crisp JPG image you can reuse in slides, docs, or chat.",
      h1: "Save PDF pages as JPG",
    },
    tr: {
      title: "PDF'den JPG'ye Çevirici | PDFFreeTool",
      description: "PDF sayfalarını sunum, doküman veya sohbetlerde kullanabileceğin net JPG görsellerine dönüştür.",
      h1: "PDF sayfalarını JPG olarak kaydet",
    },
    de: {
      title: "PDF in JPG umwandeln | PDFFreeTool",
      description: "Jede PDF-Seite als scharfes JPG exportieren und für Präsentationen oder Chats verwenden.",
      h1: "PDF-Seiten als JPG speichern",
    },
  },
  pdfToPng: {
    en: {
      title: "PDF to PNG Converter | PDFFreeTool",
      description: "Download PDF pages as high-quality PNG files that keep transparency where needed.",
      h1: "Export PDF pages to PNG",
    },
    tr: {
      title: "PDF'den PNG'ye Dönüştür | PDFFreeTool",
      description: "PDF sayfalarını gerekirse şeffaflığı koruyan yüksek kaliteli PNG dosyaları olarak indir.",
      h1: "PDF sayfalarını PNG olarak dışa aktar",
    },
    de: {
      title: "PDF in PNG umwandeln | PDFFreeTool",
      description: "PDF-Seiten als hochwertige PNG-Dateien herunterladen, bei Bedarf mit erhaltener Transparenz.",
      h1: "PDF-Seiten als PNG exportieren",
    },
  },
  split: {
    en: {
      title: "Split PDF by Pages or Ranges | PDFFreeTool",
      description: "Select specific pages or ranges to extract into their own PDF files without extra installs.",
      h1: "Split a PDF into new files",
    },
    tr: {
      title: "PDF Bölme Aracı | PDFFreeTool",
      description: "Belirli sayfa veya aralıkları seçerek ek yazılım kurmadan ayrı PDF dosyalarına çıkar.",
      h1: "PDF'yi yeni dosyalara böl",
    },
    de: {
      title: "PDF nach Seiten oder Bereichen teilen | PDFFreeTool",
      description: "Bestimmte Seiten oder Bereiche auswählen und ohne Zusatzsoftware in eigene PDFs speichern.",
      h1: "PDF in neue Dateien aufteilen",
    },
  },
  deletePages: {
    en: {
      title: "Delete Pages from PDF | PDFFreeTool",
      description: "Remove unwanted or duplicate PDF pages quickly and download a cleaner document.",
      h1: "Delete pages from any PDF",
    },
    tr: {
      title: "PDF Sayfa Silme | PDFFreeTool",
      description: "İstenmeyen veya yinelenen PDF sayfalarını hızlıca silip daha temiz bir dosya indir.",
      h1: "PDF'den sayfa sil",
    },
    de: {
      title: "Seiten aus PDF löschen | PDFFreeTool",
      description: "Unerwünschte oder doppelte PDF-Seiten schnell entfernen und ein aufgeräumtes Dokument herunterladen.",
      h1: "Seiten aus jedem PDF löschen",
    },
  },
  rotatePages: {
    en: {
      title: "Rotate PDF Pages Online | PDFFreeTool",
      description: "Fix sideways or upside-down PDF pages and save a correctly oriented copy instantly.",
      h1: "Rotate PDF pages upright",
    },
    tr: {
      title: "PDF Sayfa Döndürme | PDFFreeTool",
      description: "Yan veya ters duran PDF sayfalarını düzelt, doğru hizalanmış yeni bir kopya indir.",
      h1: "PDF sayfalarını düzelt",
    },
    de: {
      title: "PDF-Seiten online drehen | PDFFreeTool",
      description: "Quer oder auf dem Kopf stehende PDF-Seiten korrigieren und sofort richtig ausgerichtet speichern.",
      h1: "PDF-Seiten ausrichten",
    },
  },
  extractPages: {
    en: {
      title: "Extract Pages from PDF | PDFFreeTool",
      description: "Pull the pages you need from a PDF and save them into a separate, share-ready file.",
      h1: "Extract specific PDF pages",
    },
    tr: {
      title: "PDF Sayfa Çıkarma | PDFFreeTool",
      description: "PDF içinden istediğin sayfaları çekip paylaşmaya hazır ayrı bir dosya olarak kaydet.",
      h1: "Belirli PDF sayfalarını çıkar",
    },
    de: {
      title: "Seiten aus PDF extrahieren | PDFFreeTool",
      description: "Benötigte Seiten aus einem PDF herausziehen und als separate, teilbare Datei speichern.",
      h1: "Bestimmte PDF-Seiten extrahieren",
    },
  },
  pdfReader: {
    en: {
      title: "Online PDF Reader | PDFFreeTool",
      description: "Open and preview PDF files directly in your browser without extra extensions or downloads.",
      h1: "Read PDFs in the browser",
    },
    tr: {
      title: "Çevrimiçi PDF Okuyucu | PDFFreeTool",
      description: "PDF dosyalarını tarayıcıda eklenti veya indirme olmadan açıp önizle.",
      h1: "PDF'leri tarayıcıda oku",
    },
    de: {
      title: "Online-PDF-Reader | PDFFreeTool",
      description: "PDF-Dateien direkt im Browser öffnen und vorab ansehen, ganz ohne Erweiterungen oder Downloads.",
      h1: "PDFs im Browser lesen",
    },
  },
  pdfToWord: {
    en: {
      title: "Convert PDF to Word (DOCX) | PDFFreeTool",
      description: "Turn PDFs into editable Word documents so you can update text, tables, or layouts easily.",
      h1: "Convert PDF to editable Word",
    },
    tr: {
      title: "PDF'den Word'e Çevir | PDFFreeTool",
      description: "PDF'leri düzenlenebilir Word dosyalarına dönüştürerek metin, tablo veya yerleşimi kolayca güncelle.",
      h1: "PDF'yi düzenlenebilir Word'e çevir",
    },
    de: {
      title: "PDF in Word (DOCX) umwandeln | PDFFreeTool",
      description: "PDFs in bearbeitbare Word-Dokumente verwandeln, um Text, Tabellen oder Layouts schnell zu aktualisieren.",
      h1: "PDF in editierbares Word konvertieren",
    },
  },
  wordToPdf: {
    en: {
      title: "Convert Word to PDF | PDFFreeTool",
      description: "Save DOCX files as fixed PDFs that keep fonts, spacing, and layout consistent everywhere.",
      h1: "Convert Word documents to PDF",
    },
    tr: {
      title: "Word'den PDF'ye Çevir | PDFFreeTool",
      description: "Yazı tipleri ve yerleşimi koruyarak DOCX dosyalarını her yerde aynı görünen PDF'lere dönüştür.",
      h1: "Word dosyalarını PDF'e dönüştür",
    },
    de: {
      title: "Word in PDF umwandeln | PDFFreeTool",
      description: "DOCX-Dateien als feste PDFs speichern, die Schriftarten, Abstände und Layout überall beibehalten.",
      h1: "Word-Dokumente in PDF konvertieren",
    },
  },
};

const getSlugForEntry = (mapping, key, language) => {
  if (!mapping?.[key]) return "";
  return mapping[key][language] || mapping[key][DEFAULT_LANGUAGE] || "";
};

const getKeyBySlug = (mapping, language, slug) => {
  return (
    Object.entries(mapping).find(([, slugs]) => slugs[language] === slug || slugs[DEFAULT_LANGUAGE] === slug)?.[0] || null
  );
};

const getToolSeoMeta = (toolId, language) => {
  const entry = TOOL_SEO_METADATA[toolId];
  if (!entry) return null;
  return entry[language] || entry[DEFAULT_LANGUAGE];
};

const getSeoForView = (language, activePage, activeTab) => {
  if (activePage === "home") {
    const toolMeta = getToolSeoMeta(activeTab, language);
    if (toolMeta) return toolMeta;
  }

  return DEFAULT_PAGE_SEO[language] || DEFAULT_PAGE_SEO[DEFAULT_LANGUAGE];
};

const buildPathFromState = (language, activePage, activeTab) => {
  const lang = SUPPORTED_LANGUAGES.includes(language) ? language : DEFAULT_LANGUAGE;
  const slug =
    activePage !== "home"
      ? getSlugForEntry(PAGE_SLUGS, activePage, lang)
      : getSlugForEntry(TOOL_SLUGS, activeTab, lang);

  const slugPart = slug ? `/${slug}` : "";
  return `/${lang}${slugPart}`;
};

const detectPreferredLanguage = () => {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;

  const navigatorLanguages = Array.isArray(navigator.languages)
    ? navigator.languages
    : [];
  const primaryLanguage = navigator.language ? [navigator.language] : [];
  const allLanguages = [...navigatorLanguages, ...primaryLanguage]
    .filter(Boolean)
    .map((lang) => lang.toLowerCase());

  if (allLanguages.some((lang) => lang.startsWith("tr"))) return "tr";
  if (allLanguages.some((lang) => lang.startsWith("de"))) return "de";

  const timeZone =
    typeof Intl !== "undefined"
      ? Intl.DateTimeFormat().resolvedOptions().timeZone || ""
      : "";

  const normalizedTimeZone = timeZone.toLowerCase();
  if (normalizedTimeZone === "europe/istanbul") return "tr";
  if (["europe/berlin", "europe/vienna", "europe/zurich"].includes(normalizedTimeZone)) return "de";

  return DEFAULT_LANGUAGE;
};

const parsePathToState = (pathname, fallbackLanguage = DEFAULT_LANGUAGE) => {
  const segments = pathname.split("/").filter(Boolean);
  const potentialLanguage = segments[0];
  const language = SUPPORTED_LANGUAGES.includes(potentialLanguage) ? potentialLanguage : fallbackLanguage;
  const slug = SUPPORTED_LANGUAGES.includes(potentialLanguage) ? segments[1] || "" : segments[0] || "";

  const pageMatch = getKeyBySlug(PAGE_SLUGS, language, slug);
  const toolMatch = getKeyBySlug(TOOL_SLUGS, language, slug);

  const activePage = pageMatch || "home";
  const activeTab = activePage === "home" ? toolMatch || DEFAULT_TOOL : DEFAULT_TOOL;

  return {
    language,
    activePage,
    activeTab,
  };
};

const getInitialRouteState = () => {
  if (typeof window === "undefined") {
    return {
      language: DEFAULT_LANGUAGE,
      activePage: "home",
      activeTab: DEFAULT_TOOL,
    };
  }

  const storedLanguage = localStorage.getItem("pdffreetool-language");
  const detectedLanguage = detectPreferredLanguage();
  const fallbackLanguage = storedLanguage || detectedLanguage || DEFAULT_LANGUAGE;
  const parsed = parsePathToState(window.location.pathname, fallbackLanguage);

  return {
    language: parsed.language || fallbackLanguage,
    activePage: parsed.activePage || "home",
    activeTab: parsed.activeTab || DEFAULT_TOOL,
  };
};

const TOOL_MENU = {
  en: [
    {
      id: "merge",
      title: "Merge PDF",
      summary: "Combine multiple PDFs into one organized document.",
      accent: "#4f46e5",
    },
    {
      id: "compress",
      title: "Compress PDF",
      summary: "Shrink large PDFs while keeping them readable.",
      accent: "#0ea5e9",
    },
    {
      id: "compressImage",
      title: "Compress Image",
      summary: "Optimize JPG and PNG files for the web in seconds.",
      accent: "#10b981",
    },
    {
      id: "jpgToPdf",
      title: "Images to PDF",
      summary: "Arrange photos or scans into a clean PDF.",
      accent: "#f59e0b",
    },
    {
      id: "pdfToJpg",
      title: "PDF to JPG",
      summary: "Export every page as a high-quality JPG.",
      accent: "#f97316",
    },
    {
      id: "pdfToPng",
      title: "PDF to PNG",
      summary: "Save pages as sharp, transparency-friendly PNGs.",
      accent: "#7c3aed",
    },
    {
      id: "split",
      title: "Split PDF",
      summary: "Extract page ranges into separate files.",
      accent: "#ef4444",
    },
    {
      id: "deletePages",
      title: "Delete Pages",
      summary: "Remove unwanted pages to tidy your document.",
      accent: "#14b8a6",
    },
    {
      id: "rotatePages",
      title: "Rotate Pages",
      summary: "Fix sideways pages in bulk with one click.",
      accent: "#a855f7",
    },
    {
      id: "extractPages",
      title: "Extract Pages",
      summary: "Pull specific pages into a new PDF.",
      accent: "#0ea5e9",
    },
    {
      id: "pdfReader",
      title: "PDF Reader",
      summary: "Preview PDFs without leaving your browser.",
      accent: "#2563eb",
    },
    {
      id: "pdfToWord",
      title: "PDF to Word",
      summary: "Create editable DOCX files from PDFs.",
      accent: "#c026d3",
    },
    {
      id: "wordToPdf",
      title: "Word to PDF",
      summary: "Convert DOCX files into fixed, shareable PDFs.",
      accent: "#22c55e",
    },
  ],
  tr: [
    {
      id: "merge",
      title: "PDF Birleştir",
      summary: "Birden fazla PDF'yi tek ve düzenli bir dosyada toplayın.",
      accent: "#4f46e5",
    },
    {
      id: "compress",
      title: "PDF Sıkıştır",
      summary: "Büyük PDF'leri okunabilirliği koruyarak küçültün.",
      accent: "#0ea5e9",
    },
    {
      id: "compressImage",
      title: "Görsel Sıkıştır",
      summary: "JPG ve PNG dosyalarını saniyeler içinde web için optimize edin.",
      accent: "#10b981",
    },
    {
      id: "jpgToPdf",
      title: "Görsellerden PDF",
      summary: "Fotoğrafları veya taramaları düzenli bir PDF'e yerleştirin.",
      accent: "#f59e0b",
    },
    {
      id: "pdfToJpg",
      title: "PDF'den JPG",
      summary: "Her sayfayı yüksek kaliteli JPG olarak dışa aktarın.",
      accent: "#f97316",
    },
    {
      id: "pdfToPng",
      title: "PDF'den PNG",
      summary: "Sayfaları keskin, şeffaflık dostu PNG'lere kaydedin.",
      accent: "#7c3aed",
    },
    {
      id: "split",
      title: "PDF Böl",
      summary: "Sayfa aralıklarını ayrı dosyalara ayırın.",
      accent: "#ef4444",
    },
    {
      id: "deletePages",
      title: "Sayfaları Sil",
      summary: "Gereksiz sayfaları silerek belgenizi temizleyin.",
      accent: "#14b8a6",
    },
    {
      id: "rotatePages",
      title: "Sayfaları Döndür",
      summary: "Yan duran sayfaları tek seferde düzeltin.",
      accent: "#a855f7",
    },
    {
      id: "extractPages",
      title: "Sayfaları Çıkar",
      summary: "Belirli sayfaları yeni bir PDF'e çıkarın.",
      accent: "#0ea5e9",
    },
    {
      id: "pdfReader",
      title: "PDF Okuyucu",
      summary: "PDF'leri tarayıcıdan ayrılmadan önizleyin.",
      accent: "#2563eb",
    },
    {
      id: "pdfToWord",
      title: "PDF'den Word'e",
      summary: "PDF'lerden düzenlenebilir DOCX dosyaları oluşturun.",
      accent: "#c026d3",
    },
    {
      id: "wordToPdf",
      title: "Word'den PDF'ye",
      summary: "DOCX dosyalarını sabit, paylaşılabilir PDF'lere dönüştürün.",
      accent: "#22c55e",
    },
  ],
  de: [
    {
      id: "merge",
      title: "PDF zusammenführen",
      summary: "Mehrere PDFs zu einem geordneten Dokument kombinieren.",
      accent: "#4f46e5",
    },
    {
      id: "compress",
      title: "PDF komprimieren",
      summary: "Große PDFs verkleinern und lesbar halten.",
      accent: "#0ea5e9",
    },
    {
      id: "compressImage",
      title: "Bild komprimieren",
      summary: "JPG- und PNG-Dateien webfertig optimieren.",
      accent: "#10b981",
    },
    {
      id: "jpgToPdf",
      title: "Bilder zu PDF",
      summary: "Fotos oder Scans in einem sauberen PDF anordnen.",
      accent: "#f59e0b",
    },
    {
      id: "pdfToJpg",
      title: "PDF zu JPG",
      summary: "Jede Seite als hochwertiges JPG exportieren.",
      accent: "#f97316",
    },
    {
      id: "pdfToPng",
      title: "PDF zu PNG",
      summary: "Seiten als scharfe, transparenzfreundliche PNGs speichern.",
      accent: "#7c3aed",
    },
    {
      id: "split",
      title: "PDF teilen",
      summary: "Seitenbereiche in separate Dateien aufteilen.",
      accent: "#ef4444",
    },
    {
      id: "deletePages",
      title: "Seiten löschen",
      summary: "Unnötige Seiten entfernen und aufräumen.",
      accent: "#14b8a6",
    },
    {
      id: "rotatePages",
      title: "Seiten drehen",
      summary: "Querformatige Seiten mit einem Klick ausrichten.",
      accent: "#a855f7",
    },
    {
      id: "extractPages",
      title: "Seiten extrahieren",
      summary: "Bestimmte Seiten in ein neues PDF ziehen.",
      accent: "#0ea5e9",
    },
    {
      id: "pdfReader",
      title: "PDF-Reader",
      summary: "PDFs direkt im Browser ansehen.",
      accent: "#2563eb",
    },
    {
      id: "pdfToWord",
      title: "PDF zu Word",
      summary: "Aus PDFs bearbeitbare DOCX-Dateien erstellen.",
      accent: "#c026d3",
    },
    {
      id: "wordToPdf",
      title: "Word zu PDF",
      summary: "DOCX-Dateien in feste, teilbare PDFs umwandeln.",
      accent: "#22c55e",
    },
  ],
};

const TOOL_DETAILS = {
  merge: {
    en: {
      title: "Merge PDF guide",
      intro:
        "Combine scanned forms, spreadsheets, and annotated slides into a single PDF that keeps the order and metadata intact for smoother sharing.",
      paragraphs: [
        "Upload multiple documents, drag to reorder them, and merge everything directly in your browser so sensitive information never leaves your device.",
        "It is ideal when packaging onboarding paperwork, research appendices, or feedback decks before sending them for review or e-signature.",
        "After merging you can immediately run compression or rotation to finish the file without reopening another tool.",
      ],
      bulletTitle: "Great for",
      bullets: [
        "Creating one master report from slide decks, drawings, and reference PDFs that belong together.",
        "Bundling invoices or pay slips for a quarter into a single archival document.",
        "Preparing contract exhibits in the exact order required by legal or procurement teams.",
        "Sending multiple scans as one attachment so recipients do not miss anything important.",
      ],
      checklistTitle: "Before you merge",
      checklist: [
        "Rename files with clear prefixes so the sequence stays obvious while reordering.",
        "Insert a cover page or short summary slide if readers need context at a glance.",
        "Delete ads, duplicates, or blank pages to keep the final PDF lean.",
        "Skim the preview after merging and run compression if email limits are strict.",
        "Keep a backup of the originals in case you need to undo a change later.",
      ],
    },
    tr: {
      title: "PDF Birleştirme rehberi",
      intro:
        "Taranmış formları, tabloları ve notlu slaytları tek bir PDF'te toplayarak sıralamayı ve meta verileri koruyun, paylaşımı kolaylaştırın.",
      paragraphs: [
        "Birden fazla belge yükleyin, sürükleyip yeniden sıralayın ve her şeyi doğrudan tarayıcınızda birleştirerek hassas bilgiler cihazınızdan çıkmadan kalsın.",
        "İşe alım evraklarını, araştırma eklerini veya geri bildirim sunumlarını inceleme ya da e-imza öncesinde paketlemek için idealdir.",
        "Birleştirdikten sonra dosyayı kapatmadan hemen sıkıştırma veya döndürme uygulayarak işlemi tamamlayabilirsiniz.",
      ],
      bulletTitle: "Şunlar için ideal",
      bullets: [
        "Birbiriyle bağlantılı slaytlar, çizimler ve referans PDF'lerden tek bir ana rapor oluşturmak.",
        "Çeyrek dönemlik faturaları veya bordroları tek bir arşiv dokümanında toplamak.",
        "Sözleşme eklerini hukuk veya satın alma ekiplerinin istediği sırada hazırlamak.",
        "Alıcıların hiçbir önemli sayfayı kaçırmaması için birden fazla taramayı tek ek olarak göndermek.",
      ],
      checklistTitle: "Birleştirmeden önce",
      checklist: [
        "Sıra karışmasın diye dosyalara belirgin ön eklerle yeniden ad verin.",
        "Okuyucuların hızlıca bağlamı anlayabilmesi için bir kapak sayfası veya kısa özet slaytı ekleyin.",
        "Son PDF'in yalın kalması için reklam, kopya ya da boş sayfaları silin.",
        "Birleştirme sonrası ön izlemeyi gezin ve e-posta kısıtları sıkıysa sıkıştırmayı çalıştırın.",
        "Sonradan geri dönmeniz gerekirse diye orijinal dosyaların yedeğini saklayın.",
      ],
    },
    de: {
      title: "PDF-Zusammenführungsleitfaden",
      intro:
        "Scans, Tabellen und kommentierte Folien in einer einzigen PDF bündeln, die Reihenfolge beibehalten und Metadaten sichern, damit sich alles leichter teilen lässt.",
      paragraphs: [
        "Mehrere Dokumente hochladen, zum Neuordnen ziehen und direkt im Browser zusammenführen, damit sensible Informationen dein Gerät nicht verlassen.",
        "Ideal zum Paketieren von Onboarding-Unterlagen, Forschungsanhängen oder Feedback-Decks, bevor sie zur Prüfung oder E-Signatur verschickt werden.",
        "Nach dem Zusammenführen kannst du sofort komprimieren oder drehen, ohne ein anderes Tool öffnen zu müssen.",
      ],
      bulletTitle: "Perfekt für",
      bullets: [
        "Einen Master-Report aus zusammengehörigen Präsentationen, Zeichnungen und Referenz-PDFs erstellen.",
        "Rechnungen oder Gehaltsabrechnungen eines Quartals in einem einzigen Archivdokument bündeln.",
        "Vertragsanlagen genau in der Reihenfolge vorbereiten, die Rechts- oder Beschaffungsteams verlangen.",
        "Mehrere Scans als einen Anhang senden, damit keine wichtige Seite übersehen wird.",
      ],
      checklistTitle: "Vor dem Zusammenführen",
      checklist: [
        "Dateien mit klaren Präfixen umbenennen, damit die Reihenfolge beim Sortieren eindeutig bleibt.",
        "Eine Titelseite oder kurze Zusammenfassung einfügen, wenn Lesende sofort Kontext brauchen.",
        "Werbung, Duplikate oder leere Seiten entfernen, damit die finale PDF schlank bleibt.",
        "Nach dem Zusammenführen die Vorschau prüfen und komprimieren, falls E-Mail-Grenzen streng sind.",
        "Sicherheitskopien der Originale behalten, falls du eine Änderung rückgängig machen musst.",
      ],
    },
  },
  compress: {
    en: {
      title: "Compress PDF tips",
      intro:
        "Reduce PDF size without losing clarity so files stay email-friendly and fast to upload, even on slower connections.",
      paragraphs: [
        "Presentations, catalogs, and scan-heavy reports often balloon in size. Compression trims unused metadata and optimizes images while keeping text sharp.",
        "The smaller output saves cloud storage space and helps teammates on mobile avoid large downloads.",
        "You can re-run compression after edits to keep file sizes predictable across versions.",
      ],
      bulletTitle: "Use it when",
      bullets: [
        "Submitting tenders or grant applications that enforce strict attachment limits.",
        "Sharing brochures, lookbooks, or portfolios that must stay visually crisp but lightweight.",
        "Archiving batches of PDFs into limited shared drives without sacrificing readability.",
        "Uploading assignments to LMS platforms where oversized files often fail silently.",
      ],
      checklistTitle: "Quality checklist",
      checklist: [
        "Remove duplicates or blank pages before compressing to avoid wasting space.",
        "Switch to grayscale if most content is text or scans without color requirements.",
        "Note the final size so you know whether email or chat platforms will accept it.",
        "Spot-check a few pages, especially image-heavy ones, to confirm charts and photos remain clear.",
        "If the document is for print, do a small test print to confirm the quality still meets expectations.",
      ],
    },
    tr: {
      title: "PDF sıkıştırma ipuçları",
      intro:
        "PDF boyutunu netliği koruyarak küçültün; dosyalar e-postaya uygun kalsın ve yavaş bağlantılarda bile hızlı yüklensin.",
      paragraphs: [
        "Sunumlar, kataloglar ve çok taramalı raporlar hızla şişebilir. Sıkıştırma, gereksiz meta verileri temizler ve metni keskin bırakırken görselleri optimize eder.",
        "Daha küçük çıktı hem bulut depolamada yer kazandırır hem de mobildeki ekip arkadaşlarının büyük indirmelerle uğraşmasını önler.",
        "Düzenleme sonrası yeniden sıkıştırarak sürümler arasında dosya boyutunu öngörülebilir tutabilirsiniz.",
      ],
      bulletTitle: "Şu durumlarda kullanın",
      bullets: [
        "Ek limitlerinin katı olduğu ihale veya hibe başvurularını gönderirken.",
        "Görsel kalitesi yüksek ama hafif kalması gereken broşür, lookbook veya portföyleri paylaşırken.",
        "Okunabilirlikten ödün vermeden sınırlı paylaşımlı sürücülere PDF arşivleri aktarırken.",
        "Boyutu büyük dosyaların sessizce başarısız olabildiği LMS platformlarına ödev yüklerken.",
      ],
      checklistTitle: "Kalite kontrol listesi",
      checklist: [
        "Gereksiz yer kaplamamak için sıkıştırmadan önce kopya veya boş sayfaları kaldırın.",
        "İçeriğin çoğu metin veya renksiz taramaysa gri tonlamaya geçin.",
        "Son boyutu not alın ki e-posta veya sohbet araçlarının kabul edip etmeyeceğini bilin.",
        "Özellikle görsel ağırlıklı birkaç sayfayı kontrol ederek grafik ve fotoğrafların net kaldığını doğrulayın.",
        "Belge baskıya gidecekse küçük bir deneme baskısı yaparak kalitenin beklentiyi karşılayıp karşılamadığını görün.",
      ],
    },
    de: {
      title: "Tipps zum PDF-Komprimieren",
      intro:
        "PDFs verkleinern, ohne an Klarheit zu verlieren, damit Anhänge e-Mail-freundlich bleiben und auch bei langsamen Verbindungen schnell hochladen.",
      paragraphs: [
        "Präsentationen, Kataloge und scanlastige Berichte wachsen schnell. Komprimierung entfernt unnötige Metadaten und optimiert Bilder, während Text scharf bleibt.",
        "Die kleinere Ausgabe spart Cloud-Speicher und verhindert, dass Teammitglieder auf dem Handy große Downloads stemmen müssen.",
        "Nach Bearbeitungen kannst du erneut komprimieren, um die Dateigröße zwischen Versionen berechenbar zu halten.",
      ],
      bulletTitle: "Wann einsetzen",
      bullets: [
        "Bei Ausschreibungen oder Förderanträgen mit strengen Anhanglimits.",
        "Beim Teilen von Broschüren, Lookbooks oder Portfolios, die leicht, aber gestochen scharf bleiben sollen.",
        "Beim Archivieren vieler PDFs in begrenzten geteilten Laufwerken, ohne die Lesbarkeit zu verlieren.",
        "Beim Hochladen von Aufgaben in LMS-Plattformen, auf denen übergroße Dateien oft stillscheitern.",
      ],
      checklistTitle: "Qualitäts-Checkliste",
      checklist: [
        "Duplikate oder leere Seiten vor dem Komprimieren entfernen, um Platz zu sparen.",
        "Auf Graustufen umstellen, wenn der Inhalt überwiegend Text oder farblose Scans enthält.",
        "Die endgültige Größe notieren, um zu wissen, ob Mail- oder Chat-Plattformen sie akzeptieren.",
        "Einige Seiten prüfen, besonders bildlastige, damit Diagramme und Fotos klar bleiben.",
        "Für den Druck eine kleine Testseite ausgeben, um sicherzugehen, dass die Qualität passt.",
      ],
    },
  },
  compressImage: {
    en: {
      title: "Image compression overview",
      intro:
        "Resize large photos to web-friendly sizes while preserving the contrast and color balance you expect in the final image.",
      paragraphs: [
        "The tool strips bulky metadata, fine-tunes compression automatically for JPG and PNG files, and keeps transparency when needed.",
        "It is perfect for marketing teams, bloggers, or support staff who need fast, consistent assets without opening design software.",
        "Outputs are ready for the web but still high quality enough for most presentations or lightweight printouts.",
      ],
      bulletTitle: "Best suited for",
      bullets: [
        "E-commerce galleries where product thumbnails must load instantly across devices.",
        "Portfolio or blog visuals that should look crisp without draining visitors' bandwidth.",
        "Email attachments or help articles that risk hitting provider size caps.",
        "Social media graphics that need predictable dimensions and color fidelity.",
      ],
      checklistTitle: "Quick prep list",
      checklist: [
        "Keep an original copy untouched so you can return to it if you need a higher-resolution version later.",
        "Choose PNG output for assets that rely on transparency such as logos or UI elements.",
        "Rename files with descriptive slugs before uploading to keep marketing libraries organized.",
        "For hero images, a width around 1200–1600px is usually enough for modern screens without excess weight.",
        "Check the resulting file size and dimensions to make sure they match platform recommendations.",
      ],
    },
    tr: {
      title: "Görsel sıkıştırma özeti",
      intro:
        "Büyük fotoğrafları web dostu boyutlara getirirken son görüntüde beklediğiniz kontrast ve renk dengesini koruyun.",
      paragraphs: [
        "Araç, ağır meta verileri temizler, JPG ve PNG dosyaları için sıkıştırmayı otomatik ince ayarlar ve gerektiğinde şeffaflığı korur.",
        "Tasarım yazılımı açmadan hızlı ve tutarlı görsellere ihtiyaç duyan pazarlama ekipleri, blog yazarları veya destek ekipleri için idealdir.",
        "Çıktılar web için hazırdır ve çoğu sunum veya hafif baskı için yeterince yüksek kalitededir.",
      ],
      bulletTitle: "En uygun senaryolar",
      bullets: [
        "Ürün küçük görsellerinin cihazlar arasında anında yüklenmesi gereken e-ticaret galerileri.",
        "Ziyaretçilerin internetini tüketmeden net görünmesi gereken portföy veya blog görselleri.",
        "Sağlayıcı boyut sınırına takılma riski olan e-posta ekleri veya yardım makaleleri.",
        "Boyutları ve renk doğruluğu öngörülebilir olmalı sosyal medya görselleri.",
      ],
      checklistTitle: "Hızlı hazırlık listesi",
      checklist: [
        "Daha yüksek çözünürlüklü bir sürüme ihtiyaç duyabileceğiniz durumlar için orijinal kopyayı dokunmadan saklayın.",
        "Logo veya arayüz öğeleri gibi şeffaflığa ihtiyaç duyan varlıklar için PNG çıktısını seçin.",
        "Pazarlama kütüphaneleri düzenli kalsın diye yüklemeden önce dosyalara açıklayıcı isimler verin.",
        "Afiş görselleri için 1200–1600px civarı genişlik modern ekranlar için ağırlık oluşturmadan yeterlidir.",
        "Oluşan dosya boyutu ve ölçülerin platform tavsiyeleriyle uyumlu olduğundan emin olun.",
      ],
    },
    de: {
      title: "Überblick Bildkomprimierung",
      intro:
        "Große Fotos auf webfreundliche Größen bringen und dabei Kontrast und Farbbalance beibehalten, wie du sie im finalen Bild erwartest.",
      paragraphs: [
        "Das Tool entfernt schwere Metadaten, passt die Komprimierung für JPG- und PNG-Dateien automatisch an und bewahrt Transparenz, wenn nötig.",
        "Ideal für Marketingteams, Blogger oder Support, die schnelle, konsistente Assets brauchen, ohne Designsoftware zu öffnen.",
        "Ausgaben sind webbereit und dennoch hochwertig genug für die meisten Präsentationen oder leichte Ausdrucke.",
      ],
      bulletTitle: "Am besten geeignet für",
      bullets: [
        "E-Commerce-Galerien, in denen Produkt-Thumbnails sofort laden müssen.",
        "Portfolio- oder Blog-Visuals, die scharf wirken sollen, ohne die Bandbreite der Besucher zu belasten.",
        "E-Mail-Anhänge oder Hilfeartikel, die Gefahr laufen, Größenlimits zu erreichen.",
        "Social-Media-Grafiken, die vorhersehbare Maße und Farbtreue benötigen.",
      ],
      checklistTitle: "Kurze Vorbereitungsliste",
      checklist: [
        "Eine unangetastete Originalkopie aufbewahren, falls später eine höher auflösende Version benötigt wird.",
        "PNG-Ausgabe wählen für Assets mit Transparenz wie Logos oder UI-Elemente.",
        "Dateien vor dem Upload mit beschreibenden Slugs benennen, damit Bibliotheken organisiert bleiben.",
        "Für Hero-Bilder reichen meist 1200–1600px Breite, ohne unnötiges Gewicht.",
        "Dateigröße und Abmessungen prüfen, damit sie zu Plattformempfehlungen passen.",
      ],
    },
  },
  jpgToPdf: {
    en: {
      title: "Images to PDF guide",
      intro:
        "Turn photos, scans, or screenshots into a polished document that keeps pages aligned and ready to share or print.",
      paragraphs: [
        "Images are added in the order you upload them, and you can drag to rearrange before exporting.",
        "Different dimensions are centered automatically so each page looks tidy without manual resizing.",
        "Use it to bundle receipts, visual concepts, or progress photos into a format anyone can open.",
      ],
      bulletTitle: "Ideal for",
      bullets: [
        "Freelancers compiling receipts, invoices, and approvals for bookkeeping.",
        "Students organizing lecture snapshots or whiteboard photos into one study pack.",
        "Designers presenting sketches or iterations to clients with a clear sequence.",
        "Field teams reporting site conditions with annotated photos and quick notes.",
      ],
      checklistTitle: "Better PDFs, faster",
      checklist: [
        "Rotate any sideways images before uploading to keep the final PDF consistent.",
        "Adjust brightness or crop edges to remove scanning artifacts and shadows.",
        "Preview the sequence to avoid duplicate or missing images before exporting.",
        "Use consistent file names when creating multiple PDFs for the same project so you can track versions easily.",
        "If printing, leave a small margin in the source images to prevent clipping.",
      ],
    },
    tr: {
      title: "Görsellerden PDF rehberi",
      intro:
        "Fotoğraf, tarama veya ekran görüntülerini hizalı ve paylaşmaya ya da baskıya hazır şık bir PDF'e dönüştürün.",
      paragraphs: [
        "Görseller yüklediğiniz sırayla eklenir, dışa aktarmadan önce sürükleyip yeniden sıralayabilirsiniz.",
        "Farklı boyutlar otomatik ortalanır, böylece her sayfa elle ayarlamaya gerek kalmadan düzenli görünür.",
        "Fişleri, tasarım fikirlerini veya ilerleme fotoğraflarını herkesin açabileceği bir formatta toparlamak için kullanın.",
      ],
      bulletTitle: "Şunlar için ideal",
      bullets: [
        "Muhasebe için fiş, fatura ve onayları toplayan serbest çalışanlar.",
        "Ders karelerini veya beyaz tahta fotoğraflarını tek bir çalışma paketinde düzenleyen öğrenciler.",
        "Net bir sıra ile eskiz veya iterasyon sunan tasarımcılar.",
        "Açıklamalı fotoğraflar ve kısa notlarla saha durumu raporlayan ekipler.",
      ],
      checklistTitle: "Daha iyi PDF'ler, daha hızlı",
      checklist: [
        "Son PDF tutarlı olsun diye yan duran görselleri yüklemeden önce döndürün.",
        "Tarama lekelerini ve gölgeleri gidermek için parlaklığı ayarlayın veya kenarları kırpın.",
        "Dışa aktarmadan önce sıralamayı önizleyin; yinelenen veya eksik görsel kalmasın.",
        "Aynı proje için birden fazla PDF oluştururken sürümleri kolayca takip etmek adına dosya adlarını tutarlı kullanın.",
        "Baskı alacaksanız kaynak görsellerde küçük bir boşluk bırakın ki kırpılma olmasın.",
      ],
    },
    de: {
      title: "Bilder-zu-PDF-Leitfaden",
      intro:
        "Fotos, Scans oder Screenshots in ein aufgeräumtes Dokument verwandeln, das Seiten ausrichtet und bereit zum Teilen oder Drucken ist.",
      paragraphs: [
        "Bilder werden in der Reihenfolge hinzugefügt, in der du sie hochlädst, und lassen sich vor dem Export per Drag-and-drop neu sortieren.",
        "Unterschiedliche Abmessungen werden automatisch zentriert, damit jede Seite ordentlich wirkt, ohne manuelles Anpassen.",
        "Nutze es, um Belege, Designideen oder Fortschrittsfotos in ein Format zu packen, das jede*r öffnen kann.",
      ],
      bulletTitle: "Ideal für",
      bullets: [
        "Freelancer, die Belege, Rechnungen und Freigaben für die Buchhaltung sammeln.",
        "Studierende, die Vorlesungsfotos oder Whiteboard-Aufnahmen in einem Lernpaket ordnen.",
        "Designer, die Skizzen oder Iterationen in klarer Reihenfolge präsentieren wollen.",
        "Teams vor Ort, die den Zustand mit beschrifteten Fotos und kurzen Notizen dokumentieren.",
      ],
      checklistTitle: "Bessere PDFs, schneller",
      checklist: [
        "Quer liegende Bilder vor dem Upload drehen, damit die finale PDF konsistent bleibt.",
        "Helligkeit anpassen oder Ränder beschneiden, um Scan-Artefakte und Schatten zu entfernen.",
        "Die Reihenfolge vor dem Export prüfen, damit keine doppelten oder fehlenden Bilder bleiben.",
        "Bei mehreren PDFs für dasselbe Projekt einheitliche Dateinamen nutzen, um Versionen leicht zu verfolgen.",
        "Für den Druck etwas Rand im Ausgangsbild lassen, um Beschneidungen zu vermeiden.",
      ],
    },
  },
  pdfToJpg: {
    en: {
      title: "PDF to JPG details",
      intro:
        "Convert slide decks or reports into high-resolution JPGs with one click so every page becomes a shareable image.",
      paragraphs: [
        "Each page is exported as its own JPG and packaged inside a ZIP file, making it simple to distribute or schedule across platforms.",
        "Use the output for slideshows, infographics, or any workflow where you need fast-loading visuals instead of a full PDF.",
        "Images are optimized to stay sharp while keeping the file size manageable for web and mobile sharing.",
      ],
      bulletTitle: "Practical uses",
      bullets: [
        "Sharing presentation pages on LinkedIn, Medium, or company blogs without embedding PDFs.",
        "Posting charts, tables, or checklists as standalone images in knowledge bases.",
        "Sending review drafts to teammates who prefer quick previews.",
        "Embedding visuals in newsletter tools or slide builders that do not handle PDFs reliably.",
      ],
      checklistTitle: "Before exporting",
      checklist: [
        "Confirm page orientation so exported images do not appear rotated or cropped.",
        "Remove any confidential slides or hidden layers before converting.",
        "Decide whether you need the whole PDF or just a few key pages to keep the ZIP lighter.",
        "Run compression after export if you plan to attach the images to chat or ticketing tools with strict limits.",
        "Label the ZIP with a version or date so you can track which export your team is using.",
      ],
    },
    tr: {
      title: "PDF'den JPG'ye detaylar",
      intro:
        "Slayt setlerini veya raporları tek tıkla yüksek çözünürlüklü JPG'lere çevirin; her sayfa paylaşılabilir bir görsele dönüşsün.",
      paragraphs: [
        "Her sayfa kendi JPG'i olarak dışa aktarılır ve bir ZIP dosyasında paketlenir; böylece dağıtmak veya platformlara zamanlamak kolaylaşır.",
        "Tam PDF yerine hızlı yüklenen görsellere ihtiyaç duyduğunuz slayt gösterileri, infografikler veya benzer iş akışlarında çıktıyı kullanın.",
        "Görseller web ve mobil paylaşım için dosya boyutunu makul tutarken keskin kalacak şekilde optimize edilir.",
      ],
      bulletTitle: "Pratik kullanım alanları",
      bullets: [
        "PDF gömmeye gerek kalmadan LinkedIn, Medium veya şirket bloglarında sunum sayfalarını paylaşmak.",
        "Grafik, tablo veya kontrol listelerini bilgi tabanlarında bağımsız görseller olarak yayınlamak.",
        "Hızlı önizleme tercih eden ekip arkadaşlarına inceleme taslakları göndermek.",
        "PDF'leri tutarlı işlemediği bilinen bülten araçlarına veya slayt oluşturuculara görsel eklemek.",
      ],
      checklistTitle: "Dışa aktarmadan önce",
      checklist: [
        "Dışa aktarılan görsellerin dönük veya kırpık görünmemesi için sayfa yönünü doğrulayın.",
        "Dönüştürmeden önce gizli katmanları veya hassas slaytları kaldırın.",
        "ZIP'in hafif kalması için tüm PDF'e mi yoksa birkaç önemli sayfaya mı ihtiyacınız olduğuna karar verin.",
        "Görselleri sıkı limitli sohbet veya ticket araçlarına ekleyecekseniz dışa aktarma sonrası sıkıştırma çalıştırın.",
        "Ekibinizin hangi dışa aktarımı kullandığını takip etmek için ZIP'i bir sürüm veya tarih etiketiyle adlandırın.",
      ],
    },
    de: {
      title: "Details zu PDF in JPG",
      intro:
        "Präsentationsdecks oder Berichte mit einem Klick in hochauflösende JPGs verwandeln, damit jede Seite zu einem teilbaren Bild wird.",
      paragraphs: [
        "Jede Seite wird als eigenes JPG exportiert und in einer ZIP-Datei gebündelt – ideal zum Verteilen oder für geplante Posts auf verschiedenen Plattformen.",
        "Nutze die Ausgabe für Slideshows, Infografiken oder überall dort, wo du schnell ladende Visuals statt einer kompletten PDF brauchst.",
        "Die Bilder bleiben scharf, während die Dateigröße handlich für Web- und Mobile-Sharing bleibt.",
      ],
      bulletTitle: "Praktische Einsätze",
      bullets: [
        "Präsentationsseiten auf LinkedIn, Medium oder Firmenblogs teilen, ohne PDFs einzubetten.",
        "Diagramme, Tabellen oder Checklisten als einzelne Bilder in Wissensdatenbanken posten.",
        "Entwürfe an Teammitglieder senden, die schnelle Vorschauen bevorzugen.",
        "Visuals in Newsletter-Tools oder Slide-Builder einbetten, die PDFs nicht zuverlässig verarbeiten.",
      ],
      checklistTitle: "Vor dem Export",
      checklist: [
        "Seitenausrichtung prüfen, damit exportierte Bilder nicht verdreht oder beschnitten wirken.",
        "Versteckte Ebenen oder vertrauliche Folien vor der Konvertierung entfernen.",
        "Entscheiden, ob die komplette PDF oder nur Schlüssel-Seiten nötig sind, um die ZIP klein zu halten.",
        "Nach dem Export komprimieren, wenn die Bilder an Chats oder Tickets mit strengen Limits gehen.",
        "Die ZIP mit Version oder Datum benennen, um nachzuvollziehen, welche Ausgabe das Team nutzt.",
      ],
    },
  },
  pdfToPng: {
    en: {
      title: "PDF to PNG overview",
      intro:
        "Save PDF pages as clean PNGs that preserve sharp edges, icons, and transparency for design-friendly workflows.",
      paragraphs: [
        "PNG exports are ideal when you need crisp text or vector-style graphics that should not blur after conversion.",
        "Each page is bundled inside a ZIP, making it easy to attach to tickets, wikis, or design tools.",
        "Use this when JPG compression artifacts would make diagrams or UI mocks harder to read.",
      ],
      bulletTitle: "Perfect for",
      bullets: [
        "UI mockups, diagrams, or technical drawings with fine lines.",
        "Stickers, badges, or labels that rely on transparent backgrounds.",
        "Knowledge-base articles or release notes that embed precise visuals.",
        "Slide previews inside project trackers or design review documents.",
      ],
      checklistTitle: "Export checklist",
      checklist: [
        "Remove colored backgrounds you do not want preserved, since PNG will keep them intact.",
        "Check small text or dense diagrams in the preview to confirm readability.",
        "Split very large PDFs first so individual ZIP files stay manageable for sharing.",
        "Consider JPG export instead if you do not need transparency and want slightly smaller images.",
        "Name the ZIP by project or version to avoid mixing exports later.",
      ],
    },
    tr: {
      title: "PDF'den PNG'ye genel bakış",
      intro:
        "PDF sayfalarını keskin kenarları, simgeleri ve şeffaflığı koruyan temiz PNG'ler olarak kaydedin; tasarım dostu iş akışlarına uyum sağlayın.",
      paragraphs: [
        "Dönüşüm sonrası bulanıklaşmaması gereken net metinler veya vektör tarzı grafikler için PNG çıktıları idealdir.",
        "Her sayfa bir ZIP içinde toplanır; bilet, wiki veya tasarım araçlarına eklemek kolaylaşır.",
        "Diyagram veya arayüz taslaklarını JPG sıkıştırma artefaktlarının okunaklığı bozacağı durumlarda bu çıktıyı seçin.",
      ],
      bulletTitle: "Şunlar için mükemmel",
      bullets: [
        "İnce çizgili UI taslakları, diyagramlar veya teknik çizimler.",
        "Şeffaf arka plana ihtiyaç duyan çıkartmalar, rozetler veya etiketler.",
        "Keskin görseller yerleştirilmiş bilgi bankası makaleleri veya sürüm notları.",
        "Proje takipçileri veya tasarım inceleme dokümanlarındaki slayt önizlemeleri.",
      ],
      checklistTitle: "Dışa aktarma kontrolü",
      checklist: [
        "PNG korunacağı için istemediğiniz renkli arka planları önceden kaldırın.",
        "Okunabilirliği doğrulamak için önizlemede küçük metinleri veya yoğun diyagramları kontrol edin.",
        "Paylaşımı kolaylaştırmak için çok büyük PDF'leri önce bölerek her ZIP'in yönetilebilir kalmasını sağlayın.",
        "Şeffaflık gerekmiyorsa ve biraz daha küçük görseller istiyorsanız JPG dışa aktarmayı düşünün.",
        "Dışa aktarmaları karıştırmamak için ZIP'i proje veya sürüm adıyla etiketleyin.",
      ],
    },
  },
  split: {
    en: {
      title: "Split PDF guidance",
      intro:
        "Break a large PDF into smaller, focused files so each audience gets only the sections they need without downloading the whole document.",
      paragraphs: [
        "Enter page ranges or select specific segments to create new PDFs instantly, keeping all formatting intact.",
        "Splitting helps reorganize sprawling reports, trim appendices, or isolate sensitive sections before sharing externally.",
        "You can combine this with compression to deliver lightweight, topic-specific packets.",
      ],
      bulletTitle: "Helpful when",
      bullets: [
        "Sharing only certain chapters of a manual with different teams.",
        "Sending a project update without lengthy appendices or legal sections.",
        "Extracting meeting notes or decisions from a longer transcript for quick reference.",
        "Creating separate PDFs for each recipient or department to keep permissions clear.",
      ],
      checklistTitle: "Before splitting",
      checklist: [
        "Note the exact page ranges you need so you do not miss supporting figures or tables.",
        "Check for rotated or landscape pages after splitting to keep readability consistent.",
        "Remove blank or duplicate pages in the source to avoid clutter in each output.",
        "Label the output files clearly with section names or version numbers.",
        "Decide whether to recombine certain sections later, and keep a map of which ranges went where.",
      ],
    },
    tr: {
      title: "PDF bölme rehberi",
      intro:
        "Büyük bir PDF'i daha küçük ve odaklı dosyalara ayırarak her kitlenin sadece ihtiyaç duyduğu bölümleri indirmeden görmesini sağlayın.",
      paragraphs: [
        "Sayfa aralıklarını girin veya belirli bölümleri seçerek tüm formatı koruyarak anında yeni PDF'ler oluşturun.",
        "Bölme işlemi, geniş raporları yeniden düzenlemeye, ekleri azaltmaya veya dış paylaşım öncesi hassas bölümleri ayırmaya yardımcı olur.",
        "Hafif ve konuya özel paketler sunmak için bu işlemi sıkıştırmayla birleştirebilirsiniz.",
      ],
      bulletTitle: "Şunlarda işe yarar",
      bullets: [
        "Kılavuzun yalnızca ilgili bölümlerini farklı ekiplerle paylaşmak.",
        "Uzun ekler veya hukuk kısımları olmadan proje güncellemesi göndermek.",
        "Uzun bir transkriptten toplantı notlarını veya kararları hızlıca çıkarmak.",
        "Yetkileri net tutmak için her alıcıya veya departmana ayrı PDF'ler oluşturmak.",
      ],
      checklistTitle: "Bölmeden önce",
      checklist: [
        "Gerekli sayfa aralıklarını not alın ki destekleyici tablo veya görselleri atlamayın.",
        "Bölme sonrası döndürülmüş veya yatay sayfaları kontrol ederek okunabilirliği koruyun.",
        "Her çıktının düzenli olması için kaynak dosyadaki boş veya kopya sayfaları kaldırın.",
        "Çıktı dosyalarını bölüm adları veya sürüm numaralarıyla net şekilde etiketleyin.",
        "İleride bazı bölümleri yeniden birleştirip birleştirmeyeceğinize karar verin ve hangi aralıkların nereye gittiğine dair bir not tutun.",
      ],
    },
    de: {
      title: "PDF-Teilen Anleitung",
      intro:
        "Eine große PDF in kleinere, fokussierte Dateien aufteilen, damit jedes Publikum nur die benötigten Abschnitte sieht, ohne den gesamten Download abzuwarten.",
      paragraphs: [
        "Seitenbereiche eingeben oder gezielte Segmente wählen, um sofort neue PDFs zu erstellen – das Layout bleibt vollständig erhalten.",
        "Teilen hilft, umfangreiche Reports neu zu ordnen, Anhänge zu kürzen oder sensible Passagen vor der externen Weitergabe zu isolieren.",
        "In Kombination mit Komprimierung entstehen leichte, themenspezifische Pakete.",
      ],
      bulletTitle: "Praktisch wenn",
      bullets: [
        "Nur bestimmte Kapitel eines Handbuchs mit unterschiedlichen Teams geteilt werden sollen.",
        "Ein Projekt-Update ohne lange Anhänge oder Rechtspassagen versendet werden soll.",
        "Protokolle aus langen Mitschriften gezogen werden müssen, um Entscheidungen schnell griffbereit zu haben.",
        "Für jede Empfängergruppe separate PDFs nötig sind, damit Berechtigungen eindeutig bleiben.",
      ],
      checklistTitle: "Vor dem Teilen",
      checklist: [
        "Genau notieren, welche Seitenbereiche benötigt werden, damit keine Tabellen oder Abbildungen fehlen.",
        "Nach dem Aufteilen auf gedrehte oder Querformat-Seiten prüfen, um die Lesbarkeit zu sichern.",
        "Leere oder doppelte Seiten in der Quelle entfernen, damit jede Ausgabe aufgeräumt bleibt.",
        "Ausgabedateien klar mit Abschnittsnamen oder Versionsnummern beschriften.",
        "Überlegen, ob bestimmte Abschnitte später kombiniert werden sollen, und festhalten, welche Bereiche wohin verschoben wurden.",
      ],
    },
  },
  deletePages: {
    en: {
      title: "Delete pages help",
      intro:
        "Remove unwanted or blank pages to clean up your PDF quickly, keeping only the content that matters for your audience.",
      paragraphs: [
        "Select the pages to drop, preview the changes, and download an updated PDF without altering the remaining layout.",
        "It is perfect for removing cover sheets, advertisements, or personal data before sharing with clients or teammates.",
        "Lean PDFs are easier to review, print, and search—especially for long reports or compiled scans.",
      ],
      bulletTitle: "Common uses",
      bullets: [
        "Tidying scan batches that include blank separators or misfeeds.",
        "Stripping personal details from receipts or invoices before submitting them.",
        "Dropping alternate language sections that are irrelevant to a specific recipient.",
        "Clearing ads or sponsor pages from downloaded guides before archiving.",
      ],
      checklistTitle: "Quick checks",
      checklist: [
        "Double-check page numbers against the preview to avoid removing key content.",
        "Save a backup copy of the original PDF in case you need to restore a deleted page.",
        "Remove duplicates during the same pass to keep the document concise.",
        "Re-run compression after trimming pages if you plan to email the file.",
        "If the PDF is being signed, confirm signature fields still align after deletions.",
      ],
    },
    tr: {
      title: "Sayfa silme yardımı",
      intro:
        "Gereksiz veya boş sayfaları kaldırarak PDF'inizi hızlıca temizleyin, kitleniz için önemli içeriklerin kalmasını sağlayın.",
      paragraphs: [
        "Silinecek sayfaları seçin, değişiklikleri önizleyin ve kalan düzeni bozmayacak güncel PDF'i indirin.",
        "Kapak sayfalarını, reklamları veya kişisel verileri paylaşım öncesi çıkarmak için idealdir.",
        "Hafif PDF'ler özellikle uzun rapor veya tarama derlemelerinde inceleme, yazdırma ve arama için daha rahattır.",
      ],
      bulletTitle: "Yaygın kullanım",
      bullets: [
        "Boş ayraçlar veya hatalı beslemeler içeren tarama setlerini düzenlemek.",
        "Göndermeden önce fiş veya faturadan kişisel bilgileri temizlemek.",
        "Belirli alıcı için gereksiz olan farklı dil bölümlerini çıkarmak.",
        "Arşivlemeden önce indirilen kılavuzlardan reklam veya sponsor sayfalarını temizlemek.",
      ],
      checklistTitle: "Hızlı kontroller",
      checklist: [
        "Önemli içerikleri yanlışlıkla silmemek için sayfa numaralarını önizleme ile karşılaştırın.",
        "Gerekirse silinen sayfaları geri getirmek için orijinal PDF'in bir yedeğini saklayın.",
        "Belgeyi derli toplu tutmak için aynı işlemde yinelenen sayfaları da kaldırın.",
        "Dosyayı e-posta ile gönderecekseniz sayfaları kırptıktan sonra sıkıştırmayı yeniden çalıştırın.",
        "PDF imzalanacaksa, silme sonrası imza alanlarının hizasının korunduğunu doğrulayın.",
      ],
    },
    de: {
      title: "Seiten löschen Hilfe",
      intro:
        "Unerwünschte oder leere Seiten entfernen, um deine PDF schnell zu säubern und nur die Inhalte zu behalten, die für dein Publikum zählen.",
      paragraphs: [
        "Zu löschende Seiten auswählen, Änderungen in der Vorschau prüfen und ein aktualisiertes PDF herunterladen, ohne das restliche Layout zu verändern.",
        "Ideal, um Deckblätter, Werbung oder personenbezogene Daten zu entfernen, bevor du mit Kund:innen oder Teammitgliedern teilst.",
        "Schlanke PDFs lassen sich leichter prüfen, drucken und durchsuchen – besonders bei langen Reports oder gescannten Sammeldateien.",
      ],
      bulletTitle: "Typische Einsätze",
      bullets: [
        "Scan-Stapel mit leeren Trennern oder Fehleinzügen aufräumen.",
        "Persönliche Daten aus Belegen oder Rechnungen löschen, bevor sie eingereicht werden.",
        "Fremdsprachige Abschnitte entfernen, die für bestimmte Empfänger:innen irrelevant sind.",
        "Werbe- oder Sponsorenseiten aus heruntergeladenen Guides streichen, bevor sie archiviert werden.",
      ],
      checklistTitle: "Schnelle Prüfungen",
      checklist: [
        "Seitenzahlen mit der Vorschau abgleichen, damit keine wichtigen Inhalte verschwinden.",
        "Eine Sicherung der Original-PDF behalten, falls gelöschte Seiten wiederhergestellt werden müssen.",
        "Duplikate im gleichen Durchgang entfernen, um das Dokument kompakt zu halten.",
        "Nach dem Kürzen erneut komprimieren, wenn die Datei per E-Mail verschickt wird.",
        "Bei zu unterzeichnenden PDFs sicherstellen, dass Signaturfelder nach dem Löschen noch korrekt ausgerichtet sind.",
      ],
    },
  },
  rotatePages: {
    en: {
      title: "Rotate pages tips",
      intro:
        "Fix sideways or upside-down pages so the whole PDF reads smoothly without forcing readers to rotate their screens.",
      paragraphs: [
        "Rotate individual pages or apply a single rotation to all pages at once, keeping annotations and links aligned.",
        "Especially useful for scans, meeting notes, or mixed-orientation slide decks that disrupt the reading flow.",
        "Proper orientation makes reviewing, printing, and signing much faster for everyone involved.",
      ],
      bulletTitle: "Best cases",
      bullets: [
        "Scanned contracts or receipts that were captured sideways.",
        "Design proofs or spreadsheets that are intentionally landscape.",
        "Notebook pages or whiteboard photos taken at awkward angles.",
        "Mixed orientation slide decks where some pages rotate unexpectedly.",
      ],
      checklistTitle: "Rotation reminders",
      checklist: [
        "Check a quick preview before downloading to confirm every page faces the right way.",
        "Use 90° increments to keep text and form fields aligned with margins.",
        "Rotate only the pages that need it to avoid unintended layout changes.",
        "Re-run compression after rotating scans if file size is a concern.",
        "For documents that require signatures, verify signature blocks still sit in the correct orientation.",
      ],
    },
    tr: {
      title: "Sayfa döndürme ipuçları",
      intro:
        "Yan duran veya ters dönmüş sayfaları düzelterek tüm PDF'in akıcı okunmasını sağlayın; okuyucular ekranlarını çevirmek zorunda kalmasın.",
      paragraphs: [
        "Tek tek sayfaları döndürün veya tek seferde tüm sayfalara aynı açıyı uygulayın; açıklama ve bağlantılar hizalı kalsın.",
        "Okuma akışını bozan taramalar, toplantı notları veya karışık yönlendirmeli slayt desteleri için özellikle kullanışlıdır.",
        "Doğru yönlendirme, inceleme, yazdırma ve imzalama süreçlerini tüm taraflar için hızlandırır.",
      ],
      bulletTitle: "En iyi senaryolar",
      bullets: [
        "Yatay yakalanmış taranmış sözleşmeler veya fişler.",
        "Bilerek yatay tasarlanan prova tasarımları veya tablolar.",
        "Garip açılardan çekilmiş defter sayfaları veya beyaz tahta fotoğrafları.",
        "Bazı sayfaları beklenmedik şekilde dönen karışık yönlendirmeli slayt desteleri.",
      ],
      checklistTitle: "Döndürme hatırlatmaları",
      checklist: [
        "İndirmeden önce hızlıca önizleyerek tüm sayfaların doğru yönde olduğundan emin olun.",
        "Metin ve form alanlarını kenar boşluklarıyla hizalı tutmak için 90° adımlar kullanın.",
        "İstenmeyen düzen değişikliklerinden kaçınmak için sadece gerekli sayfaları döndürün.",
        "Dosya boyutu önemliyse taramaları döndürdükten sonra sıkıştırmayı tekrar çalıştırın.",
        "İmza gerektiren belgelerde, imza bloklarının doğru yönlendirmede kaldığını doğrulayın.",
      ],
    },
    de: {
      title: "Seiten drehen Tipps",
      intro:
        "Schief oder kopfüber stehende Seiten korrigieren, damit die gesamte PDF flüssig lesbar bleibt, ohne dass Lesende den Bildschirm drehen müssen.",
      paragraphs: [
        "Einzelne Seiten drehen oder eine Rotation auf alle Seiten anwenden – Anmerkungen und Links bleiben ausgerichtet.",
        "Besonders nützlich bei Scans, Meeting-Notizen oder gemischt ausgerichteten Foliensätzen, die den Lesefluss stören.",
        "Die richtige Ausrichtung beschleunigt Prüfen, Drucken und Signieren für alle Beteiligten.",
      ],
      bulletTitle: "Am besten geeignet",
      bullets: [
        "Seitlich eingescannt Verträge oder Belege.",
        "Querformatige Design-Freigaben oder Tabellen.",
        "Notizbuchseiten oder Whiteboard-Fotos, die in schrägem Winkel aufgenommen wurden.",
        "Foliensätze mit gemischter Ausrichtung, bei denen einzelne Seiten unerwartet drehen.",
      ],
      checklistTitle: "Rotation merken",
      checklist: [
        "Vor dem Download kurz in der Vorschau prüfen, ob jede Seite korrekt ausgerichtet ist.",
        "90°-Schritte nutzen, damit Text und Formularfelder an den Rändern bleiben.",
        "Nur die Seiten drehen, die es wirklich brauchen, um unbeabsichtigte Layout-Änderungen zu vermeiden.",
        "Nach dem Drehen von Scans erneut komprimieren, falls die Dateigröße kritisch ist.",
        "Bei Dokumenten mit Signaturpflicht kontrollieren, ob die Signaturblöcke noch richtig positioniert sind.",
      ],
    },
  },
  extractPages: {
    en: {
      title: "Extract pages notes",
      intro:
        "Pull specific pages into a fresh PDF without altering the original, so you can share only the sections that matter.",
      paragraphs: [
        "Select the pages you need, download instantly, and keep all formatting, links, and annotations intact.",
        "It is a fast way to provide stakeholders with a highlights-only version while the source file remains unchanged.",
        "You can combine extracts later or merge them with new content to create tailored packets.",
      ],
      bulletTitle: "Why use it",
      bullets: [
        "Sharing only the relevant slides or appendices with specific teams.",
        "Sending proof or approval pages to clients without exposing the full document.",
        "Extracting receipts or invoices from a larger scan pack for accounting.",
        "Creating a highlights-only version for quick executive summaries.",
      ],
      checklistTitle: "Things to check",
      checklist: [
        "Ensure you include any referenced charts or footnotes so context is not lost.",
        "Label the new file clearly with page ranges or topics for easy retrieval.",
        "Consider using delete pages instead if the trimmed PDF will only stay internal.",
        "Keep the original full PDF in case you need to extract different sections later.",
        "If sharing externally, review for personal data that might still appear on extracted pages.",
      ],
    },
    tr: {
      title: "Sayfa çıkarma notları",
      intro:
        "Orijinali değiştirmeden belirli sayfaları yeni bir PDF'e aktarın; böylece yalnızca önemli bölümleri paylaşabilirsiniz.",
      paragraphs: [
        "Gerekli sayfaları seçin, anında indirin ve tüm format, bağlantı ve açıklamalar korunmuş kalsın.",
        "Kaynak dosyayı dokunmadan bırakırken paydaşlara yalnızca öne çıkanlar sürümünü sunmanın hızlı bir yoludur.",
        "Çıkarılan bölümleri daha sonra birleştirerek veya yeni içerikle harmanlayarak hedefe yönelik paketler oluşturabilirsiniz.",
      ],
      bulletTitle: "Neden kullanılır",
      bullets: [
        "Yalnızca ilgili slayt veya ekleri belirli ekiplerle paylaşmak.",
        "Tüm belgeyi açığa çıkarmadan müşterilere ispat veya onay sayfaları göndermek.",
        "Daha büyük bir tarama setinden muhasebe için fiş veya faturaları çıkarmak.",
        "Hızlı yönetici özetleri için sadece öne çıkanlardan oluşan bir sürüm hazırlamak.",
      ],
      checklistTitle: "Kontrol listesi",
      checklist: [
        "Bağlam kaybolmaması için referans verilen grafik veya dipnotları da eklediğinizden emin olun.",
        "Yeni dosyayı kolay bulunması için sayfa aralıkları veya konu başlıklarıyla net biçimde etiketleyin.",
        "Kırpılmış PDF yalnızca dahili kalacaksa bunun yerine sayfa silme aracını kullanmayı değerlendirin.",
        "Farklı bölümleri daha sonra çıkarmak gerekirse diye orijinal tam PDF'i saklayın.",
        "Dışa açılacaksa, çıkarılan sayfalarda hâlâ yer alabilecek kişisel verileri gözden geçirin.",
      ],
    },
    de: {
      title: "Seiten extrahieren Hinweise",
      intro:
        "Bestimmte Seiten in eine neue PDF ziehen, ohne das Original zu verändern, damit du nur die relevanten Abschnitte teilen kannst.",
      paragraphs: [
        "Benötigte Seiten auswählen, sofort herunterladen und dabei Formatierung, Links und Anmerkungen vollständig erhalten.",
        "Eine schnelle Möglichkeit, Stakeholdern eine Version mit Highlights zu geben, während die Quelldatei unverändert bleibt.",
        "Extrakte lassen sich später kombinieren oder mit neuem Inhalt mischen, um passgenaue Pakete zu erstellen.",
      ],
      bulletTitle: "Dafür nutzen",
      bullets: [
        "Nur relevante Folien oder Anhänge mit bestimmten Teams teilen.",
        "Nachweis- oder Freigabeseiten an Kund:innen senden, ohne das komplette Dokument offenzulegen.",
        "Belege oder Rechnungen aus einem größeren Scan-Paket für die Buchhaltung herausziehen.",
        "Eine reine Highlights-Version für schnelle Management-Updates erstellen.",
      ],
      checklistTitle: "Darauf achten",
      checklist: [
        "Alle referenzierten Grafiken oder Fußnoten aufnehmen, damit der Kontext erhalten bleibt.",
        "Die neue Datei klar mit Seitenbereichen oder Themen beschriften, um sie leicht wiederzufinden.",
        "Wenn die gekürzte PDF intern bleibt, ggf. lieber das Seitenlösch-Tool verwenden.",
        "Das vollständige Original aufbewahren, falls später andere Abschnitte extrahiert werden müssen.",
        "Vor externer Weitergabe auf personenbezogene Daten achten, die auf den extrahierten Seiten noch sichtbar sein könnten.",
      ],
    },
  },
  pdfReader: {
    en: {
      title: "PDF reader guidance",
      intro:
        "Preview PDFs directly in your browser without installing extra software so you can validate content before editing or sharing.",
      paragraphs: [
        "Navigate pages quickly, zoom in on details, and download the file when you are ready to keep working elsewhere.",
        "Use it as a lightweight review step before converting, compressing, or trimming pages.",
        "Because everything runs in the browser, it is handy on shared or locked-down devices where installing viewers is difficult.",
      ],
      bulletTitle: "Use it for",
      bullets: [
        "Checking page orientation and layout before committing to edits.",
        "Confirming the contents of uploaded files without downloading them locally.",
        "Previewing received PDFs on kiosks or shared devices where viewers are limited.",
        "Glancing through contracts or reports without opening a desktop application.",
      ],
      checklistTitle: "Reader tips",
      checklist: [
        "Zoom to 100% when verifying print quality or small text.",
        "Skim all pages before deciding which conversion or cleanup tool to use next.",
        "Use the download action to keep a local copy after review if you need offline access.",
        "Switch between other tools without re-uploading to save time during multi-step tasks.",
        "If something looks off, reopen the source in another viewer to confirm the file is not corrupted.",
      ],
    },
    tr: {
      title: "PDF okuyucu rehberi",
      intro:
        "Ek yazılım kurmadan PDF'leri doğrudan tarayıcınızda önizleyin; böylece düzenleme veya paylaşım öncesi içeriği doğrulayın.",
      paragraphs: [
        "Sayfalar arasında hızlı gezin, detaylara yakınlaşın ve başka bir yerde çalışmaya hazır olduğunuzda dosyayı indirin.",
        "Dönüştürme, sıkıştırma veya sayfa kırpma öncesinde hafif bir inceleme adımı olarak kullanın.",
        "Her şey tarayıcıda çalıştığı için, görüntüleyici kurulumu zor olan paylaşımlı veya kısıtlı cihazlarda işinize yarar.",
      ],
      bulletTitle: "Şunlar için kullanın",
      bullets: [
        "Düzenlemeye başlamadan önce sayfa yönü ve düzenini kontrol etmek.",
        "Yüklenen dosyaların içeriğini yerel indirme yapmadan doğrulamak.",
        "Görüntüleyicilerin kısıtlı olduğu kiosk veya paylaşımlı cihazlarda gelen PDF'leri önizlemek.",
        "Masaüstü uygulaması açmadan sözleşme veya raporlara hızlıca göz atmak.",
      ],
      checklistTitle: "Okuyucu ipuçları",
      checklist: [
        "Baskı kalitesini veya küçük metinleri doğrularken %100 yakınlaştırmayı kullanın.",
        "Hangi dönüştürme veya düzenleme aracını kullanacağınıza karar vermeden önce tüm sayfaları gözden geçirin.",
        "Çevrimdışı erişime ihtiyaç duyarsanız inceleme sonrası indirme ile yerel kopya saklayın.",
        "Çok adımlı görevlerde zaman kazanmak için dosyayı yeniden yüklemeden diğer araçlar arasında geçiş yapın.",
        "Bir şey garip görünüyorsa, dosyanın bozuk olmadığını doğrulamak için kaynağı başka bir görüntüleyicide açın.",
      ],
    },
    de: {
      title: "PDF-Reader Leitfaden",
      intro:
        "PDFs direkt im Browser ansehen, ohne zusätzliche Software zu installieren, damit du Inhalte vor dem Bearbeiten oder Teilen prüfen kannst.",
      paragraphs: [
        "Seiten schnell durchgehen, Details heranzoomen und die Datei herunterladen, sobald du woanders weiterarbeiten möchtest.",
        "Als schlanken Prüfschritt nutzen, bevor du konvertierst, komprimierst oder Seiten entfernst.",
        "Da alles im Browser läuft, ist es praktisch auf geteilten oder gesperrten Geräten, auf denen keine Viewer installiert werden können.",
      ],
      bulletTitle: "Dafür verwenden",
      bullets: [
        "Seitenausrichtung und Layout prüfen, bevor du Änderungen vornimmst.",
        "Inhalte hochgeladener Dateien bestätigen, ohne sie lokal zu speichern.",
        "Empfangene PDFs auf Kiosks oder Shared Devices ansehen, wo Viewer eingeschränkt sind.",
        "Verträge oder Berichte überfliegen, ohne eine Desktop-App zu öffnen.",
      ],
      checklistTitle: "Reader-Tipps",
      checklist: [
        "Zum Prüfen von Druckqualität oder kleinem Text auf 100 % zoomen.",
        "Alle Seiten durchblättern, bevor du entscheidest, welches Tool du als Nächstes nutzt.",
        "Nach der Durchsicht mit dem Download eine lokale Kopie sichern, falls du offline sein musst.",
        "Zwischen anderen Tools wechseln, ohne erneut hochzuladen, um Zeit bei mehrstufigen Aufgaben zu sparen.",
        "Wenn etwas merkwürdig aussieht, die Quelle in einem anderen Viewer öffnen, um Dateifehler auszuschließen.",
      ],
    },
  },
  pdfToWord: {
    en: {
      title: "PDF to Word notes",
      intro:
        "Convert PDFs to editable DOCX files while preserving layout as much as possible, so you can revise text without rebuilding documents from scratch.",
      paragraphs: [
        "Ideal for updating reports, proposals, or manuals where you need to tweak wording or pricing while keeping the existing structure.",
        "Text becomes fully editable in Word or similar editors, and you can quickly re-export to PDF once changes are done.",
        "Scanned PDFs may require light cleanup afterward, but this tool accelerates the heavy lifting of extraction.",
      ],
      bulletTitle: "Ideal uses",
      bullets: [
        "Refreshing proposals with new pricing or deliverables while keeping the same layout.",
        "Editing contracts or agreements before sending for signature.",
        "Updating academic papers, manuals, or course materials without reformatting chapters.",
        "Recovering text from scanned PDFs to avoid retyping large sections.",
      ],
      checklistTitle: "Before converting",
      checklist: [
        "Check whether the PDF has selectable text; scans may require additional OCR cleanup.",
        "Have custom fonts installed if the document relies on them for consistent layout.",
        "Review the resulting DOCX for small alignment or spacing tweaks before sharing.",
        "Keep the original PDF nearby as a reference for images, charts, or branding.",
        "If you plan to share externally, remove hidden comments or tracked changes after editing.",
      ],
    },
    tr: {
      title: "PDF'den Word'e notları",
      intro:
        "PDF'leri düzenlenebilir DOCX dosyalarına dönüştürürken yerleşimi olabildiğince koruyun; belgeleri baştan kurmadan metni revize edin.",
      paragraphs: [
        "Mevcut yapıyı bozmayarak kelimeleri veya fiyatlandırmayı güncellemeniz gereken rapor, teklif veya kılavuzlar için idealdir.",
        "Metin Word veya benzeri editörlerde tamamen düzenlenebilir hale gelir; değişiklikler bittiğinde hızla yeniden PDF'e aktarabilirsiniz.",
        "Taranmış PDF'ler sonrasında küçük bir temizlik gerektirebilir, ancak bu araç çıkarma işleminin büyük kısmını hızlandırır.",
      ],
      bulletTitle: "İdeal kullanımlar",
      bullets: [
        "Aynı yerleşimi korurken yeni fiyatlandırma veya teslimatlar ile teklifleri yenilemek.",
        "İmzaya göndermeden önce sözleşme veya anlaşmaları düzenlemek.",
        "Akademik makale, kılavuz veya eğitim materyallerini bölümleri yeniden biçimlendirmeden güncellemek.",
        "Geniş bölümleri yeniden yazmaktan kaçınmak için taranmış PDF'lerden metni geri kazanmak.",
      ],
      checklistTitle: "Dönüştürmeden önce",
      checklist: [
        "PDF'de seçilebilir metin olup olmadığını kontrol edin; taramalar ek OCR temizliği isteyebilir.",
        "Belge düzeni özel yazı tiplerine bağlıysa bunların yüklü olduğundan emin olun.",
        "Paylaşmadan önce ortaya çıkan DOCX'i küçük hizalama veya boşluk ayarları için gözden geçirin.",
        "Görseller, grafikler veya marka ögeleri için referans olarak orijinal PDF'i elinizde bulundurun.",
        "Dışa açmayı planlıyorsanız, düzenleme sonrası gizli yorumları veya izlenen değişiklikleri temizleyin.",
      ],
    },
    de: {
      title: "PDF zu Word Hinweise",
      intro:
        "PDFs in bearbeitbare DOCX-Dateien konvertieren und das Layout so weit wie möglich bewahren, damit du Texte anpassen kannst, ohne Dokumente neu aufzubauen.",
      paragraphs: [
        "Ideal, um Berichte, Angebote oder Handbücher mit neuen Formulierungen oder Preisen zu aktualisieren, während die Struktur bestehen bleibt.",
        "Text wird in Word oder ähnlichen Editoren vollständig editierbar und kann nach den Änderungen schnell wieder als PDF exportiert werden.",
        "Gescannten PDFs kann danach etwas Feinschliff guttun, doch das Tool übernimmt den Großteil der Extraktion.",
      ],
      bulletTitle: "Einsatzgebiete",
      bullets: [
        "Angebote mit neuen Preisen oder Leistungen auffrischen und das gleiche Layout behalten.",
        "Verträge oder Vereinbarungen vor der Unterschrift bearbeiten.",
        "Facharbeiten, Handbücher oder Kursunterlagen aktualisieren, ohne Kapitel neu zu formatieren.",
        "Text aus gescannten PDFs zurückholen, um langes Abtippen zu vermeiden.",
      ],
      checklistTitle: "Vor dem Konvertieren",
      checklist: [
        "Prüfen, ob die PDF auswählbaren Text hat; Scans brauchen eventuell zusätzliche OCR-Nacharbeit.",
        "Spezielle Schriftarten bereit halten, wenn das Layout davon abhängt.",
        "Die resultierende DOCX auf kleine Ausrichtungs- oder Abstands-Korrekturen prüfen, bevor du sie teilst.",
        "Das Original als Referenz behalten – etwa für Bilder, Diagramme oder Branding.",
        "Vor externer Weitergabe versteckte Kommentare oder Änderungsverfolgung entfernen.",
      ],
    },
  },
  wordToPdf: {
    en: {
      title: "Word to PDF help",
      intro:
        "Turn DOCX files into shareable PDFs that look consistent everywhere, whether they are opened on desktop, mobile, or in the browser.",
      paragraphs: [
        "Preserves fonts, spacing, and layout so proposals, resumes, and reports appear polished and uneditable by default.",
        "It is the quickest way to finalize documents for clients or recruiters without worrying about version mismatches.",
        "Converted PDFs are lightweight and ready to archive, email, or upload to applicant tracking systems.",
      ],
      bulletTitle: "Best for",
      bullets: [
        "Job applications where formatting must remain identical for every reviewer.",
        "Client-ready proposals, statements of work, or agreements.",
        "Reports with charts, tables, or custom fonts that should not shift in transit.",
        "Certificates, letters, or policies that should be view-only for recipients.",
      ],
      checklistTitle: "Before you convert",
      checklist: [
        "Review the DOCX for tracked changes or comments you do not want to share.",
        "Check image resolutions if the PDF will be printed to avoid blurry results.",
        "Verify margins and page size so the exported PDF aligns with your branding.",
        "Save a copy of the original DOCX in case you need to make edits later.",
        "If using custom fonts, embed them or outline critical text to keep the look consistent.",
      ],
    },
    tr: {
      title: "Word'den PDF'ye yardım",
      intro:
        "DOCX dosyalarını masaüstü, mobil veya tarayıcıda açıldığında aynı görünen, paylaşılabilir PDF'lere dönüştürün.",
      paragraphs: [
        "Yazı tipleri, boşluklar ve yerleşim korunur; böylece teklifler, özgeçmişler ve raporlar varsayılan olarak düzenlenemez ve şık görünür.",
        "Sürüm uyumsuzluklarını düşünmeden belgeleri müşteriler veya işe alımcılar için en hızlı şekilde sonlandırmanın yoludur.",
        "Dönüştürülen PDF'ler hafiftir ve arşivlemeye, e-postalamaya veya aday takip sistemlerine yüklemeye hazırdır.",
      ],
      bulletTitle: "Şunlar için en uygunu",
      bullets: [
        "Her inceleyici için biçimin aynı kalmasının gerektiği iş başvuruları.",
        "Müşteri onayına hazır teklifler, kapsam dokümanları veya anlaşmalar.",
        "Taşıma sırasında kaymaması gereken grafik, tablo veya özel yazı tiplerine sahip raporlar.",
        "Alıcıların yalnızca görüntülemesi gereken sertifikalar, mektuplar veya politikalar.",
      ],
      checklistTitle: "Dönüştürmeden önce",
      checklist: [
        "Paylaşmak istemediğiniz izlenen değişiklik veya yorumlar için DOCX'i gözden geçirin.",
        "PDF yazdırılacaksa bulanık sonuçlardan kaçınmak için görsel çözünürlüklerini kontrol edin.",
        "İhracatın markanıza uyumlu olması için kenar boşluklarını ve sayfa boyutunu doğrulayın.",
        "Sonradan düzenleme gerekirse diye orijinal DOCX'in bir kopyasını saklayın.",
        "Özel yazı tipleri kullanıyorsanız görünümü tutarlı tutmak için bunları yerleştirin veya kritik metni dış hatlara çevirin.",
      ],
    },
    de: {
      title: "Word zu PDF Hilfe",
      intro:
        "DOCX-Dateien in teilbare PDFs verwandeln, die überall gleich aussehen – egal ob auf Desktop, Mobilgerät oder im Browser geöffnet.",
      paragraphs: [
        "Bewahrt Schriftarten, Abstände und Layout, damit Angebote, Lebensläufe und Reports standardmäßig schick und nicht bearbeitbar sind.",
        "Der schnellste Weg, Dokumente für Kund:innen oder Recruiter fertigzustellen, ohne Versionskonflikte zu riskieren.",
        "Konvertierte PDFs sind leichtgewichtig und bereit zum Archivieren, Mailen oder Hochladen in Bewerber-Tracking-Systeme.",
      ],
      bulletTitle: "Am besten geeignet für",
      bullets: [
        "Bewerbungen, bei denen das Layout für alle Prüfer identisch bleiben muss.",
        "Kundenfertige Angebote, Leistungsbeschreibungen oder Vereinbarungen.",
        "Berichte mit Grafiken, Tabellen oder speziellen Fonts, die unterwegs nicht verrutschen dürfen.",
        "Zertifikate, Schreiben oder Richtlinien, die für Empfänger nur lesbar sein sollen.",
      ],
      checklistTitle: "Vor dem Konvertieren",
      checklist: [
        "DOCX auf Änderungsverfolgung oder Kommentare prüfen, die du nicht teilen möchtest.",
        "Bildauflösungen kontrollieren, wenn die PDF gedruckt wird, um Unschärfe zu vermeiden.",
        "Ränder und Seitengröße prüfen, damit die exportierte PDF zu deinem Branding passt.",
        "Eine Kopie der ursprünglichen DOCX aufbewahren, falls später Anpassungen nötig sind.",
        "Bei Nutzung spezieller Schriftarten diese einbetten oder kritische Texte vektorisieren, um ein einheitliches Erscheinungsbild zu sichern.",
      ],
    },
  },
};

const MAX_FILES = 10; // Max number of files
const MAX_TOTAL_MB = 50; // Max total size (MB)
const LANGUAGE_OPTIONS = [
  { value: "en", label: "English", flag: "🇺🇸" },
  { value: "tr", label: "Türkçe", flag: "🇹🇷" },
  { value: "de", label: "Deutsch", flag: "🇩🇪" },
];

const TRANSLATIONS = {
  en: {
    studioLabel: "PDFFreeTool Studio",
    heroTitle: "Flexible PDF & Image studio",
    heroSubtitle:
      "Pick any PDF or image tool from one menu—merge, split, convert, or optimize. Every tool comes with a clear description and practical tips so you can finish faster.",
    nav: {
      home: "Home",
      blog: "Guide & Tips",
      faq: "FAQ",
      privacy: "Privacy",
      terms: "Terms",
      about: "About",
      contact: "Contact",
    },
    footerCopyright: "© 2025 PDFFreeTool. All rights reserved.",
    onlineToolsHeading: "Online PDF and image tools",
    adFriendly: "Ad-friendly content",
    onlineToolsDescription:
      "Merge, compress, rotate, convert, and read PDFs all in one place. Our rich menu keeps every tool informative, user-friendly, and compliant with AdSense guidelines so visitors see helpful content.",
    featureTags: {
      dragDrop: "✅ Drag & drop reorder",
      memoryProcessing: "✅ Files processed in memory",
      noRegistration: "✅ No registration required",
    },
    seoSection: {
      title: "Simple PDF & image tools for everyday work",
      intro:
        "PDFFreeTool keeps popular PDF and image actions in one place. Merge, compress, convert between JPG and PDF, and handle pages directly in your browser—no downloads, accounts, or limits.",
      whatTitle: "What you can do",
      whatList: [
        "Merge and organize PDFs in the order you need.",
        "Compress files to share or upload without hassle.",
        "Convert seamlessly between JPG images and PDF documents.",
        "Split, rotate, or extract pages while keeping quality.",
      ],
      whyTitle: "Why people choose it",
      whyList: [
        "Secure, in-browser processing keeps files private.",
        "Fast results without sign-ups or watermarks.",
        "Free tools that work on any modern device.",
      ],
      mergerTitle: "Why choose this free PDF merger?",
      mergerList: [
        {
          title: "Fast and simple",
          text: "No complex settings or ads-heavy interface. Just upload, reorder, and merge.",
        },
        {
          title: "Secure",
          text: "PDF files are processed directly in memory. We do not permanently store your documents.",
        },
        {
          title: "Browser-based",
          text: "Works on Windows, macOS, Linux, and mobile devices with a modern browser.",
        },
        {
          title: "Free to use",
          text: "No registration or account required to merge your PDF files.",
        },
      ],
    },
    toolMenuTitle: "Tool menu",
    toolMenuDescription: "Click any card to jump to a tool, read the overview, and start using it.",
    languageLabel: "Language",
    themeLabel: "Theme",
    themeLight: "Light",
    themeDark: "Dark",
    selectToolLabel: "Select tool",
    merge: {
      pill: "Merge PDFs in your browser",
      title: "Merge PDF files in seconds",
      description: "Upload, reorder, and download a single merged PDF. Nothing is stored on our servers.",
      badge: "Simple & secure",
      chooseFiles: "Choose PDF files",
      selectPdfs: "Select PDFs",
      fileLimit: (maxFiles, maxTotalMb) => `Up to ${maxFiles} files • Total size ≤ ${maxTotalMb} MB`,
      filesSelected: "Files selected:",
      totalSize: "Total size:",
      reorderTitle: "Reorder files",
      reorderHint: "Drag to change merge order",
      dragHandle: "Drag to reorder",
      usageLabel: "Merges this session:",
      clear: "Clear",
      merge: "Merge PDFs",
      merging: "Merging...",
      removeFile: "Remove this file",
    },
    errors: {
      pdfOnly: "Please select PDF files only.",
      maxFiles: (limit) => `You can upload up to ${limit} PDF files. Extra files were ignored.`,
      maxSize: (limit) => `Total file size cannot exceed ${limit} MB. Please choose fewer or smaller files.`,
      noneSelected: "Please select at least one PDF file.",
      generic: "Something went wrong.",
      mergeFailed: "Failed to merge PDFs.",
    },
  },
  tr: {
    studioLabel: "PDFFreeTool Stüdyosu",
    heroTitle: "Esnek PDF ve Görsel stüdyosu",
    heroSubtitle:
      "Tek menüden istediğiniz PDF veya görsel aracını seçin—birleştirin, bölün, dönüştürün ya da optimize edin. Her araç işi daha hızlı bitirmeniz için net bir açıklama ve pratik ipuçlarıyla gelir.",
    nav: {
      home: "Ana Sayfa",
      blog: "Rehber ve İpuçları",
      faq: "SSS",
      privacy: "Gizlilik",
      terms: "Şartlar",
      about: "Hakkında",
      contact: "İletişim",
    },
    footerCopyright: "© 2025 PDFFreeTool. Tüm hakları saklıdır.",
    onlineToolsHeading: "Çevrimiçi PDF ve görsel araçları",
    adFriendly: "Reklam dostu içerik",
    onlineToolsDescription:
      "PDF'leri tek bir yerde birleştirin, sıkıştırın, döndürün, dönüştürün ve okuyun. Zengin menümüz her aracı bilgilendirici, kullanıcı dostu ve AdSense yönergeleriyle uyumlu tutarak ziyaretçilere faydalı içerik sunar.",
    featureTags: {
      dragDrop: "✅ Sürükle-bırak ile yeniden sıralama",
      memoryProcessing: "✅ Dosyalar bellekte işlenir",
      noRegistration: "✅ Kayıt gerekmez",
    },
    seoSection: {
      title: "Gündelik işler için basit PDF ve görsel araçları",
      intro:
        "PDFFreeTool popüler PDF ve görsel işlemlerini tek yerde toplar. PDF ve JPG arasında dönüştürün, dosyaları birleştirin, sıkıştırın ve sayfaları doğrudan tarayıcınızda yönetin—indirme, hesap, limit yok.",
      whatTitle: "Neler yapabilirsiniz",
      whatList: [
        "PDF'leri ihtiyaç duyduğunuz sırayla birleştirip düzenleyin.",
        "Paylaşırken veya yüklerken zahmetsizce sıkıştırın.",
        "JPG görsellerle PDF belgeleri arasında sorunsuzca dönüştürün.",
        "Kaliteyi koruyarak sayfaları bölün, döndürün veya çıkarın.",
      ],
      whyTitle: "Neden tercih ediliyor",
      whyList: [
        "İşleme doğrudan tarayıcıda yapıldığı için dosyalarınız gizli kalır.",
        "Üyelik veya filigran olmadan hızlı sonuç.",
        "Her modern cihazda çalışan ücretsiz araçlar.",
      ],
      mergerTitle: "Bu ücretsiz PDF birleştiricisini neden seçmelisiniz?",
      mergerList: [
        {
          title: "Hızlı ve basit",
          text: "Karmaşık ayarlar veya reklam dolu arayüz yok. Sadece yükleyin, sıralayın ve birleştirin.",
        },
        {
          title: "Güvenli",
          text: "PDF dosyaları doğrudan bellekte işlenir. Belgelerinizi kalıcı olarak saklamıyoruz.",
        },
        {
          title: "Tarayıcı tabanlı",
          text: "Windows, macOS, Linux ve modern mobil tarayıcılarda çalışır.",
        },
        {
          title: "Ücretsiz",
          text: "PDF dosyalarınızı birleştirmek için kayıt veya hesap gerekmez.",
        },
      ],
    },
    toolMenuTitle: "Araç menüsü",
    toolMenuDescription:
      "Bir araca gitmek, özetini okumak ve kullanmaya başlamak için herhangi bir karta tıklayın.",
    languageLabel: "Dil",
    themeLabel: "Tema",
    themeLight: "Açık",
    themeDark: "Koyu",
    selectToolLabel: "Aracı seç",
    merge: {
      pill: "PDF'leri tarayıcıda birleştir",
      title: "Saniyeler içinde PDF birleştirme",
      description:
        "Yükleyin, sıralayın ve tek birleştirilmiş PDF'i indirin. Dosyalar sunucularımızda tutulmaz.",
      badge: "Basit ve güvenli",
      chooseFiles: "PDF dosyalarını seç",
      selectPdfs: "PDF seç",
      fileLimit: (maxFiles, maxTotalMb) => `En fazla ${maxFiles} dosya • Toplam boyut ≤ ${maxTotalMb} MB`,
      filesSelected: "Seçilen dosya sayısı:",
      totalSize: "Toplam boyut:",
      reorderTitle: "Dosyaları yeniden sırala",
      reorderHint: "Birleştirme sırasını değiştirmek için sürükleyin",
      dragHandle: "Sürükleyerek yeniden sırala",
      usageLabel: "Bu oturumdaki birleştirmeler:",
      clear: "Temizle",
      merge: "PDF'leri birleştir",
      merging: "Birleştiriliyor...",
      removeFile: "Bu dosyayı kaldır",
    },
    errors: {
      pdfOnly: "Lütfen sadece PDF dosyaları seçin.",
      maxFiles: (limit) => `En fazla ${limit} PDF yükleyebilirsiniz. Fazla dosyalar yok sayıldı.`,
      maxSize: (limit) => `Toplam dosya boyutu ${limit} MB'ı geçemez. Lütfen daha az veya daha küçük dosya seçin.`,
      noneSelected: "Lütfen en az bir PDF dosyası seçin.",
      generic: "Bir şeyler yanlış gitti.",
      mergeFailed: "PDF birleştirme başarısız oldu.",
    },
  },
};

const PAGE_CONTENT = {
  blog: {
    en: {
      title: "Blog / Guide & Tips",
      intro:
        "We put together a long-form guide to help you use our PDF and image tools as efficiently as possible. Whether you're managing a contract, a presentation, or a product catalog, the steps here are designed to speed up your PDFFreeTool experience and help you avoid mistakes. Because everything runs in your browser, your files stay private while you save time.",
      goldenRulesTitle: "Golden rules to streamline your workflow",
      goldenRules: [
        {
          label: "Preview habit",
          text:
            "Before merging, splitting, or deleting pages, name files with small notes and double-check the order. You'll avoid deleting the wrong page or repeating images.",
        },
        {
          label: "Right format choice",
          text:
            "Prefer PNG output for presentation visuals and JPG output for social posts to balance quality and file size.",
        },
        {
          label: "Lightweight compression loop",
          text:
            "Run Compress PDF before sharing a large file, then check image quality and re-optimize if needed.",
        },
        {
          label: "Privacy note",
          text:
            "Browser-based processing keeps your projects from leaving the company, but make it a habit to store a local copy when handling important contracts.",
        },
        {
          label: "Internal sharing",
          text:
            "When naming merged or split documents, add a version number (e.g., \"Proposal-v3.pdf\") so nothing gets mixed up.",
        },
      ],
      recommendedTitle: "Recommended tool combinations by scenario",
      recommendedIntro:
        "We illustrated the time savings each tool provides when combined. That way, even if you handle multiple file types in the same day, you'll know where to start.",
      recommended: [
        {
          label: "Meeting packets",
          body: (
            <>
              First gather all reports with <em>Merge PDF</em>, then straighten landscape diagrams with <em>Rotate Pages</em> and make them share-ready with <em>Compress PDF</em>.
            </>
          ),
        },
        {
          label: "Training kits",
          body: (
            <>
              Line up phone photos in <em>Images to PDF</em>, clear empty pages with <em>Delete Pages</em> if needed, and quickly review the final document in <em>PDF Reader</em> before sharing it with students.
            </>
          ),
        },
        {
          label: "Product catalog",
          body: (
            <>
              Export design pages as PNG, get transparent-background assets with <em>PDF to PNG</em>, optimize them for the web using <em>Compress Image</em>, and deliver them to the sales team in one folder.
            </>
          ),
        },
        {
          label: "Legal and contracts",
          body: (
            <>
              To share without splitting the document, first select relevant clauses with <em>Extract Pages</em>, lock in the latest versions with <em>Word to PDF</em>, and finally edit needed sections with <em>PDF to Word</em> before converting back to PDF.
            </>
          ),
        },
      ],
      closing:
        "The recommendations in this guide are frequently updated based on user feedback. If you'd like to see a new tip, use the hints on the Contact page to leave us a message.",
    },
    tr: {
      title: "Blog / Rehber ve İpuçları",
      intro:
        "PDF ve görsel araçlarımızı olabildiğince verimli kullanmanız için ayrıntılı bir rehber hazırladık. İster sözleşme, ister sunum, ister ürün kataloğu yönetin; buradaki adımlar PDFFreeTool deneyiminizi hızlandırmak ve hataları önlemek için tasarlandı. Tüm işlemler tarayıcınızda çalıştığı için dosyalarınız gizli kalırken zaman kazanırsınız.",
      goldenRulesTitle: "İş akışınızı hızlandıran altın kurallar",
      goldenRules: [
        {
          label: "Ön izleme alışkanlığı",
          text:
            "Birleştirme, bölme veya sayfa silme öncesinde dosyaları kısa notlarla adlandırın ve sıralamayı kontrol edin. Böylece yanlış sayfayı silmez veya görselleri tekrar etmezsiniz.",
        },
        {
          label: "Doğru format seçimi",
          text:
            "Sunum görselleri için PNG, sosyal medya paylaşımları için JPG çıktıyı tercih ederek kalite ve boyut dengesini koruyun.",
        },
        {
          label: "Hafif sıkıştırma döngüsü",
          text:
            "Büyük bir dosyayı paylaşmadan önce PDF Sıkıştır'ı çalıştırın, ardından görsel kalitesini kontrol edip gerekirse yeniden optimize edin.",
        },
        {
          label: "Gizlilik notu",
          text:
            "Tarayıcı tabanlı işlem projelerinizin şirket dışına çıkmasını önler, ancak önemli sözleşmeleri işlerken yerel kopya saklamayı alışkanlık haline getirin.",
        },
        {
          label: "İç paylaşım",
          text:
            "Birleştirilmiş veya bölünmüş dosyaları adlandırırken sürüm numarası ekleyin (örn. \"Teklif-v3.pdf\") ki hiçbir şey karışmasın.",
        },
      ],
      recommendedTitle: "Senaryolara göre önerilen araç kombinasyonları",
      recommendedIntro:
        "Birlikte kullanıldığında her aracın sağladığı zaman kazancını örneklerle gösterdik. Böylece aynı gün birden fazla dosya türüyle çalışsanız bile nereden başlayacağınızı bilirsiniz.",
      recommended: [
        {
          label: "Toplantı paketleri",
          body: (
            <>
              Önce tüm raporları <em>PDF Birleştir</em> ile toplayın, yatay diyagramları <em>Sayfaları Döndür</em> ile düzeltin ve <em>PDF Sıkıştır</em> ile paylaşmaya hazır hale getirin.
            </>
          ),
        },
        {
          label: "Eğitim setleri",
          body: (
            <>
              Telefon fotoğraflarını <em>Görsellerden PDF</em> aracında sıralayın, gerekirse <em>Sayfa Sil</em> ile boş sayfaları temizleyin ve paylaşmadan önce son hali <em>PDF Okuyucu</em> içinde hızla kontrol edin.
            </>
          ),
        },
        {
          label: "Ürün kataloğu",
          body: (
            <>
              Tasarım sayfalarını PNG olarak dışa aktarın, şeffaf arka planlı görselleri <em>PDF'den PNG'ye</em> ile alın, <em>Görsel Sıkıştır</em> ile web'e uygun hale getirin ve satış ekibine tek klasörde iletin.
            </>
          ),
        },
        {
          label: "Hukuk ve sözleşmeler",
          body: (
            <>
              Belgeyi bölmeden paylaşmak için önce ilgili maddeleri <em>Sayfa Çıkar</em> ile seçin, son sürümleri <em>Word'den PDF'ye</em> ile sabitleyin, ihtiyaç olan bölümleri <em>PDF'den Word'e</em> ile düzenleyip tekrar PDF'e dönüştürün.
            </>
          ),
        },
      ],
      closing:
        "Bu rehberdeki öneriler kullanıcı geri bildirimlerine göre sık sık güncellenir. Yeni bir ipucu görmek isterseniz, İletişim sayfasındaki yönergeleri kullanarak bize mesaj bırakabilirsiniz.",
    },
  },
  privacy: {
    en: {
      title: "Privacy Policy",
      intro:
        "PDFFreeTool offers an in-browser file management experience. This page explains how we process user data and the measures we take to protect your privacy. Regardless of which tool you use, your files are not stored server-side; processing is completed in memory whenever possible.",
      dataTitle: "Data we collect and why we use it",
      dataPoints: [
        "Log entries: Anonymous usage metrics are kept to measure traffic levels; IP addresses or file names are not recorded.",
        "Cookies: Required session cookies remember your language preference or the tools you reopen. Advertising cookies activate only with your consent.",
        "Third-party integrations: Ad providers receive only page-view statistics and never interact with the files you upload.",
      ],
      analytics:
        "We use third-party vendors, including Google, that use cookies to serve ads based on your prior visits to this and other websites. These partners receive anonymized analytics so they can show relevant messages without touching the documents you process here.",
      optOut:
        "Users may opt out of personalised advertising by visiting Google Ads Settings or updating consent preferences in the cookie notice on this site.",
      securityTitle: "File security and retention",
      securityBody:
        "Uploaded PDFs or images are processed in temporary memory and are automatically cleared after the download link is created. The only data kept on the server is error logs that help detect abuse; these logs do not include file contents.",
      securityList: [
        "File fragments are removed from memory when processing finishes.",
        "For encrypted or confidential documents, we recommend backing up your local copies.",
        "On shared devices, clear your browser history to protect your privacy.",
      ],
      rightsTitle: "Your rights",
      rightsBody:
        "You can contact us when you want to request deletion or anonymization of your usage data. Ad preferences can be updated through your browser settings and the cookie management panel.",
    },
    tr: {
      title: "Gizlilik Politikası",
      intro:
        "PDFFreeTool tarayıcı içinde dosya yönetim deneyimi sunar. Bu sayfa kullanıcı verilerini nasıl işlediğimizi ve gizliliğinizi korumak için aldığımız önlemleri açıklar. Hangi aracı kullanırsanız kullanın, dosyalarınız sunucuda saklanmaz; işlemler mümkün olduğunca bellekte tamamlanır.",
      dataTitle: "Topladığımız veriler ve kullanım amaçları",
      dataPoints: [
        "Günlük kayıtları: Trafik seviyesini ölçmek için anonim kullanım metrikleri tutulur; IP adresleri veya dosya adları kaydedilmez.",
        "Çerezler: Zorunlu oturum çerezleri dil tercihinizi veya yeniden açtığınız araçları hatırlar. Reklam çerezleri yalnızca onayınızla etkinleşir.",
        "Üçüncü taraf entegrasyonları: Reklam sağlayıcıları yalnızca sayfa görüntüleme istatistikleri alır ve yüklediğiniz dosyalarla etkileşime geçmez.",
      ],
      analytics:
        "Google dahil üçüncü taraf sağlayıcılar, bu ve diğer sitelere önceki ziyaretlerinize göre reklam sunmak için çerez kullanır. Bu ortaklar, burada işlediğiniz belgelere dokunmadan ilgili mesajlar gösterebilmek için anonimleştirilmiş analizler alır.",
      optOut:
        "Kişiselleştirilmiş reklamları Google Ads Ayarları üzerinden veya sitedeki çerez bildiriminde tercihlerinizi güncelleyerek devre dışı bırakabilirsiniz.",
      securityTitle: "Dosya güvenliği ve saklama",
      securityBody:
        "Yüklenen PDF veya görseller geçici bellekte işlenir ve indirme bağlantısı oluşturulduktan sonra otomatik olarak temizlenir. Sunucuda yalnızca kötüye kullanımı tespit etmeye yarayan hata kayıtları tutulur; bu kayıtlar dosya içeriği içermez.",
      securityList: [
        "İşlem tamamlandığında dosya parçaları bellekten kaldırılır.",
        "Şifreli veya gizli belgeler için yerel kopyalarınızı yedeklemenizi öneririz.",
        "Paylaşılan cihazlarda gizliliğinizi korumak için tarayıcı geçmişini temizleyin.",
      ],
      rightsTitle: "Haklarınız",
      rightsBody:
        "Kullanım verilerinizin silinmesini veya anonimleştirilmesini talep etmek istediğinizde bizimle iletişime geçebilirsiniz. Reklam tercihlerinizi tarayıcı ayarları ve çerez yönetim paneli üzerinden güncelleyebilirsiniz.",
    },
    de: {
      title: "Datenschutzerklärung",
      intro:
        "PDFFreeTool bietet ein Dateimanagement direkt im Browser. Diese Seite erklärt, wie wir Nutzerdaten verarbeiten und welche Maßnahmen wir zum Schutz deiner Privatsphäre ergreifen. Unabhängig vom verwendeten Tool werden deine Dateien nicht serverseitig gespeichert; die Verarbeitung erfolgt, wenn möglich, ausschließlich im Arbeitsspeicher.",
      dataTitle: "Welche Daten wir sammeln und wofür wir sie nutzen",
      dataPoints: [
        "Protokolleinträge: Anonyme Nutzungsmetriken messen das Traffic-Niveau; IP-Adressen oder Dateinamen werden nicht aufgezeichnet.",
        "Cookies: Erforderliche Sitzungscookies merken sich deine Spracheinstellung oder zuletzt genutzte Tools. Werbecookies werden nur mit deiner Zustimmung aktiviert.",
        "Drittintegrationen: Werbeanbieter erhalten nur Seitenaufruf-Statistiken und haben keinen Zugriff auf die hochgeladenen Dateien.",
      ],
      analytics:
        "Wir arbeiten mit Drittanbietern wie Google zusammen, die Cookies einsetzen, um Werbung basierend auf deinen vorherigen Besuchen auf dieser und anderen Websites auszuliefern. Diese Partner erhalten anonymisierte Analysen, damit sie relevante Botschaften zeigen können, ohne die hier verarbeiteten Dokumente zu berühren.",
      optOut:
        "Du kannst personalisierte Werbung über die Google-Anzeigeneinstellungen oder durch Anpassen deiner Zustimmung im Cookie-Hinweis auf dieser Seite deaktivieren.",
      securityTitle: "Dateisicherheit und Aufbewahrung",
      securityBody:
        "Hochgeladene PDFs oder Bilder werden temporär im Speicher verarbeitet und nach Erstellung des Download-Links automatisch gelöscht. Auf dem Server verbleiben nur Fehlermeldungen zur Missbrauchserkennung; diese enthalten keine Dateiinhalte.",
      securityList: [
        "Dateifragmenten werden nach Abschluss der Verarbeitung aus dem Speicher entfernt.",
        "Für verschlüsselte oder vertrauliche Dokumente empfehlen wir lokale Sicherungskopien.",
        "Auf gemeinsam genutzten Geräten den Browserverlauf löschen, um die Privatsphäre zu schützen.",
      ],
      rightsTitle: "Deine Rechte",
      rightsBody:
        "Du kannst uns kontaktieren, wenn du die Löschung oder Anonymisierung deiner Nutzungsdaten wünschst. Werbeeinstellungen lassen sich über die Browser-Optionen und das Cookie-Management anpassen.",
    },
  },
  terms: {
    en: {
      title: "Terms of Service",
      intro:
        "By using PDFFreeTool, you agree to manage your files in compliance with legal regulations. The tools are provided for personal and business use; you are responsible for uploading any content that infringes intellectual property or violates the law.",
      points: [
        "Limitation of liability: Back up your data to avoid loss in browser-processed files. Our platform cannot be held liable for direct or indirect damages.",
        "Fair use: Access may be limited if bots or systems sending excessive requests are detected.",
        "Content integrity: Uploading documents that infringe copyright is prohibited. Access to reported items will be blocked.",
        "Updates: These terms are updated regularly and announcements are shared through the links in the footer.",
      ],
      maintenance:
        "The service may be briefly unavailable during maintenance. In these cases, your current files remain in the browser and your workflow stays intact; refresh the page to pick up where you left off.",
    },
    tr: {
      title: "Hizmet Şartları",
      intro:
        "PDFFreeTool'u kullanarak dosyalarınızı yasal düzenlemelere uygun şekilde yönetmeyi kabul edersiniz. Araçlar kişisel ve ticari kullanım için sunulur; telif hakkını ihlal eden veya yasaları çiğneyen içerikleri yüklemek sizin sorumluluğunuzdadır.",
      points: [
        "Sorumluluk sınırlaması: Tarayıcıda işlenen dosyalarda veri kaybı yaşamamak için yedek alın. Platformumuz doğrudan veya dolaylı zararlardan sorumlu tutulamaz.",
        "Adil kullanım: Aşırı istek gönderen botlar veya sistemler tespit edilirse erişim sınırlandırılabilir.",
        "İçerik bütünlüğü: Telif hakkını ihlal eden belgeleri yüklemek yasaktır. Bildirilen öğelere erişim engellenecektir.",
        "Güncellemeler: Bu şartlar düzenli olarak güncellenir ve duyurular alt kısımdaki bağlantılar aracılığıyla paylaşılır.",
      ],
      maintenance:
        "Hizmet bakım sırasında kısa süreliğine kullanılamayabilir. Bu durumlarda mevcut dosyalarınız tarayıcıda kalır ve iş akışınız bozulmaz; kaldığınız yerden devam etmek için sayfayı yenileyin.",
    },
    de: {
      title: "Nutzungsbedingungen",
      intro:
        "Mit der Nutzung von PDFFreeTool erklärst du dich einverstanden, deine Dateien im Einklang mit geltenden Gesetzen zu verwalten. Die Tools stehen für private und geschäftliche Zwecke bereit; du trägst die Verantwortung, keine Inhalte hochzuladen, die Urheberrechte verletzen oder gegen Gesetze verstoßen.",
      points: [
        "Haftungsbeschränkung: Sichere deine Daten, um Verlust bei browserbasierter Verarbeitung zu vermeiden. Unsere Plattform haftet nicht für direkte oder indirekte Schäden.",
        "Fair Use: Der Zugriff kann eingeschränkt werden, wenn Bots oder Systeme mit übermäßigen Anfragen erkannt werden.",
        "Integrität der Inhalte: Das Hochladen urheberrechtsverletzender Dokumente ist verboten. Der Zugang zu gemeldeten Inhalten wird blockiert.",
        "Updates: Diese Bedingungen werden regelmäßig aktualisiert und über die Links im Footer bekanntgegeben.",
      ],
      maintenance:
        "Während Wartungsarbeiten kann der Dienst kurzzeitig nicht verfügbar sein. In diesen Phasen bleiben deine aktuellen Dateien im Browser, dein Workflow bleibt bestehen; lade die Seite neu, um weiterzumachen.",
    },
  },
  faq: {
    en: {
      title: "Frequently Asked Questions",
      intro:
        "Here is a detailed overview of the most common questions people ask about PDFFreeTool. These answers focus on the merge tool but also cover how we handle your data and how the experience works across devices. If you need more help, visit the Contact page and share your scenario so we can expand this guide further.",
      mergeTitle: "Merge PDF specifics",
      mergeItems: [
        {
          question: "Is this PDF merge tool free?",
          answer:
            "Yes. You can merge your PDF files for free with no account or subscription required. There are no watermarks or hidden limits beyond the standard upload caps shown on the homepage.",
        },
        {
          question: "Is it safe to upload my documents?",
          answer:
            "Your files are processed in memory on the server and are not stored permanently. We do not keep a copy of your merged PDF, and temporary processing buffers are cleared automatically after the download is prepared.",
        },
        {
          question: "Does this work on mobile?",
          answer:
            "Yes. The tool works in any modern browser, including mobile browsers on Android and iOS. You can drag to reorder on touchscreens, and the interface adapts to small screens so you do not lose visibility of your file list.",
        },
      ],
      tipsTitle: "Extra tips and troubleshooting",
      tips: [
        "Upload guidance: Keep individual files under the size limit shown on the tool and avoid encrypted PDFs when possible; password-protected files may need to be unlocked before merging.",
        "Ordering pages: Use the drag handle on each file row to set the exact order you want before merging. If you upload more than once, newer files will appear at the end of the list.",
        "Slow connections: On weaker networks, try compressing large PDFs first to speed up the upload step. You can always merge and then compress again if needed.",
        "Sharing results: After merging, rename the downloaded file with a clear version number (for example, Project-Proposal-v2.pdf) so teammates know which file to open.",
      ],
      closing:
        "We continue to expand this FAQ based on feedback. If there is a question we have not covered yet, send us a short note with the tool you used, your device type, and what you were trying to achieve. We will use that information to improve this help page for everyone.",
    },
    tr: {
      title: "Sık Sorulan Sorular",
      intro:
        "PDFFreeTool hakkında en sık sorulan soruların ayrıntılı özetini burada bulabilirsiniz. Yanıtlar ağırlıklı olarak birleştirme aracına odaklanır ancak verilerinizi nasıl işlediğimizi ve deneyimin cihazlar arasında nasıl çalıştığını da açıklar. Daha fazla yardıma ihtiyacınız olursa İletişim sayfasına gidip senaryonuzu paylaşın, bu rehberi genişletelim.",
      mergeTitle: "PDF Birleştirme ayrıntıları",
      mergeItems: [
        {
          question: "Bu PDF birleştirme aracı ücretsiz mi?",
          answer:
            "Evet. PDF dosyalarınızı hesap veya abonelik gerekmeden ücretsiz birleştirebilirsiniz. Ana sayfada gösterilen standart yükleme sınırları dışında filigran veya gizli kısıtlama yoktur.",
        },
        {
          question: "Belgelerimi yüklemek güvenli mi?",
          answer:
            "Dosyalarınız sunucuda bellekte işlenir ve kalıcı olarak saklanmaz. Birleştirilmiş PDF'inizin kopyasını tutmayız, indirme hazırlanırken geçici işleme tamponları otomatik olarak temizlenir.",
        },
        {
          question: "Mobilde çalışıyor mu?",
          answer:
            "Evet. Araç Android ve iOS'taki mobil tarayıcılar dahil modern tüm tarayıcılarda çalışır. Dokunmatik ekranlarda sürükleyerek sıralayabilir, arayüz küçük ekranlara uyum sağlayarak dosya listenizi görünür tutar.",
        },
      ],
      tipsTitle: "Ek ipuçları ve sorun giderme",
      tips: [
        "Yükleme rehberi: Tekil dosyaları araçta gösterilen boyut sınırının altında tutun ve mümkünse şifreli PDF'lerden kaçının; şifre korumalı dosyalar birleştirme öncesi kilitlerinin kaldırılmasını gerektirebilir.",
        "Sayfa sıralaması: Birleştirme öncesi istediğiniz tam sırayı vermek için her dosya satırındaki sürükleme tutamacını kullanın. Birden fazla kez yüklerseniz yeni dosyalar listenin sonunda görünür.",
        "Yavaş bağlantılar: Zayıf ağlarda yüklemeyi hızlandırmak için önce büyük PDF'leri sıkıştırmayı deneyin. Gerekirse tekrar birleştirip yeniden sıkıştırabilirsiniz.",
        "Sonuçları paylaşma: Birleştirdikten sonra indirilen dosyayı net bir sürüm numarasıyla yeniden adlandırın (örneğin, Proje-Teklifi-v2.pdf) ki ekip arkadaşlarınız hangi dosyayı açacağını bilsin.",
      ],
      closing:
        "Bu SSS'yi geri bildirimlere göre genişletmeye devam ediyoruz. Henüz yanıtlamadığımız bir soru varsa, kullandığınız aracı, cihaz tipinizi ve ne yapmaya çalıştığınızı belirten kısa bir not gönderin. Bu bilgiyi herkes için yardım sayfasını geliştirmek amacıyla kullanacağız.",
    },
    de: {
      title: "Häufig gestellte Fragen",
      intro:
        "Hier findest du einen ausführlichen Überblick über die gängigsten Fragen zu PDFFreeTool. Die Antworten konzentrieren sich auf das Zusammenführungs-Tool, erklären aber auch, wie wir deine Daten verarbeiten und wie die Nutzung geräteübergreifend funktioniert. Für weitere Hilfe besuche die Kontakt-Seite und beschreibe dein Szenario, damit wir diesen Leitfaden erweitern können.",
      mergeTitle: "Details zum PDF-Zusammenführen",
      mergeItems: [
        {
          question: "Ist dieses PDF-Merge-Tool kostenlos?",
          answer:
            "Ja. Du kannst deine PDF-Dateien kostenlos zusammenführen – ganz ohne Konto oder Abo. Es gibt keine Wasserzeichen oder versteckten Limits außer den auf der Startseite gezeigten Upload-Grenzen.",
        },
        {
          question: "Ist es sicher, meine Dokumente hochzuladen?",
          answer:
            "Deine Dateien werden im Arbeitsspeicher des Servers verarbeitet und nicht dauerhaft gespeichert. Wir behalten keine Kopie deiner zusammengeführten PDF, temporäre Puffer werden nach Vorbereitung des Downloads automatisch gelöscht.",
        },
        {
          question: "Funktioniert das auf dem Handy?",
          answer:
            "Ja. Das Tool läuft in jedem modernen Browser, einschließlich mobiler Browser auf Android und iOS. Auf Touchscreens kannst du per Drag & Drop sortieren, und die Oberfläche passt sich kleinen Displays an, damit du die Dateiliste im Blick behältst.",
        },
      ],
      tipsTitle: "Weitere Tipps und Fehlerbehebung",
      tips: [
        "Upload-Hinweise: Halte einzelne Dateien unter dem auf dem Tool angegebenen Limit und vermeide nach Möglichkeit verschlüsselte PDFs; passwortgeschützte Dateien müssen eventuell vor dem Zusammenführen entsperrt werden.",
        "Seitenreihenfolge: Nutze den Ziehpunkt in jeder Dateizeile, um die gewünschte Reihenfolge vor dem Zusammenführen festzulegen. Bei mehreren Uploads erscheinen neuere Dateien am Ende der Liste.",
        "Langsame Verbindungen: Auf schwachen Netzen zuerst große PDFs komprimieren, um den Upload zu beschleunigen. Bei Bedarf kannst du danach erneut zusammenführen und komprimieren.",
        "Ergebnisse teilen: Benenne die heruntergeladene Datei nach dem Zusammenführen mit einer klaren Versionsnummer (z. B. Projekt-Angebot-v2.pdf), damit Teammitglieder wissen, welche Datei sie öffnen sollen.",
      ],
      closing:
        "Wir erweitern diese FAQ kontinuierlich anhand von Feedback. Wenn eine Frage fehlt, schick uns eine kurze Nachricht mit dem genutzten Tool, deinem Gerätetyp und deinem Ziel. Diese Informationen helfen uns, die Hilfeseite für alle zu verbessern.",
    },
  },
  about: {
    en: {
      title: "About",
      intro:
        "PDFFreeTool is a lightweight web app that unites PDF and image editing tools under one roof. Our design principle is to keep technical details in the background while guiding users with clear steps.",
      build:
        "The product is built with React, Vite, and fast caching strategies. All tools live on a single page, and the info boxes explain why you should choose each tool. The content team prepared SEO-friendly headings and AdSense-ready guidance copy to inform visitors before they use every tool.",
      highlights: [
        "Secure processing flows that keep your files on your device.",
        "Ready-made content structure and guide copy for multilingual support.",
        "A simple contact section to reach the support team quickly.",
      ],
      closing:
        "Our priority is for everyone to boost productivity with free and accessible tools. In line with this vision, we regularly collect new tool ideas and review user feedback to improve the existing experience.",
    },
    tr: {
      title: "Hakkında",
      intro:
        "PDFFreeTool, PDF ve görsel düzenleme araçlarını tek çatı altında toplayan hafif bir web uygulamasıdır. Tasarım prensibimiz, teknik ayrıntıları arka planda tutarken kullanıcılara net adımlarla rehberlik etmektir.",
      build:
        "Ürün React, Vite ve hızlı önbellekleme stratejileriyle geliştirilmiştir. Tüm araçlar tek sayfada bulunur, bilgi kutuları her aracı neden seçmeniz gerektiğini açıklar. İçerik ekibi SEO dostu başlıklar ve AdSense'e hazır rehber metinleri hazırlayarak ziyaretçileri her araç öncesinde bilgilendirir.",
      highlights: [
        "Dosyalarınızı cihazınızda tutan güvenli işlem akışları.",
        "Çok dilliliğe hazır içerik yapısı ve rehber metinleri.",
        "Destek ekibine hızlıca ulaşmak için sade bir iletişim bölümü.",
      ],
      closing:
        "Önceliğimiz herkesin ücretsiz ve erişilebilir araçlarla verimliliğini artırmasıdır. Bu vizyon doğrultusunda düzenli olarak yeni araç fikirleri toplar, mevcut deneyimi iyileştirmek için kullanıcı geri bildirimlerini inceleriz.",
    },
    de: {
      title: "Über uns",
      intro:
        "PDFFreeTool ist eine schlanke Web-App, die PDF- und Bildbearbeitung unter einem Dach vereint. Unser Prinzip: Technik im Hintergrund halten und Nutzende mit klaren Schritten führen.",
      build:
        "Das Produkt basiert auf React, Vite und schnellen Caching-Strategien. Alle Tools leben auf einer Seite, Info-Boxen erklären, warum du welches Werkzeug wählen solltest. Das Content-Team liefert SEO-freundliche Überschriften und AdSense-taugliche Hinweise, damit Besucher vor jeder Nutzung informiert sind.",
      highlights: [
        "Sichere Abläufe, die deine Dateien auf deinem Gerät halten.",
        "Inhaltsstruktur und Leittexte, die für Mehrsprachigkeit vorbereitet sind.",
        "Ein schlanker Kontaktbereich, um den Support schnell zu erreichen.",
      ],
      closing:
        "Unser Ziel ist, dass alle mit kostenlosen, zugänglichen Tools produktiver werden. Entsprechend sammeln wir regelmäßig neue Tool-Ideen und prüfen Feedback, um das Erlebnis stetig zu verbessern.",
    },
  },
  contact: {
    en: {
      title: "Contact",
      intro:
        "Feel free to reach us with your questions, feedback, or suggestions for new tools. The guide below explains what to mention in your message and helps us speed up support.",
      list: [
        "Technical support: Include which tool you used, the file size, and any error message you saw so we can reproduce the issue faster.",
        "Feature request: Describe new tools or shortcuts you think would improve your workflow. Adding a use case helps us prioritize.",
        "Collaboration: For integration or content partnership proposals, share your company name, contact details, and expectations.",
      ],
      closing:
        "You can also email support@pdffreetool.com or reach us through our social media accounts. We try to respond to all messages as quickly as possible.",
    },
    tr: {
      title: "İletişim",
      intro:
        "Sorularınız, geri bildirimleriniz veya yeni araç önerileriniz için bize her zaman ulaşabilirsiniz. Aşağıdaki rehber, mesajınızda nelerden bahsetmeniz gerektiğini açıklayarak desteği hızlandırır.",
      list: [
        "Teknik destek: Kullandığınız aracı, dosya boyutunu ve gördüğünüz hata mesajını ekleyin ki sorunu hızlıca yeniden oluşturabilelim.",
        "Özellik talebi: İş akışınızı geliştireceğini düşündüğünüz yeni araçları veya kısayolları anlatın. Bir kullanım senaryosu eklemek önceliklendirmemize yardımcı olur.",
        "İş birliği: Entegrasyon veya içerik ortaklığı teklifleri için şirket adınızı, iletişim bilgilerinizi ve beklentilerinizi paylaşın.",
      ],
      closing:
        "Bize support@pdffreetool.com adresinden e-posta gönderebilir veya sosyal medya hesaplarımız üzerinden ulaşabilirsiniz. Tüm mesajlara mümkün olan en kısa sürede yanıt vermeye çalışıyoruz.",
    },
    de: {
      title: "Kontakt",
      intro:
        "Melde dich gern mit Fragen, Feedback oder Vorschlägen für neue Tools. Die Hinweise unten zeigen, was du in deiner Nachricht erwähnen solltest und beschleunigen den Support.",
      list: [
        "Technischer Support: Nenne das genutzte Tool, die Dateigröße und eventuelle Fehlermeldungen, damit wir das Problem schneller nachstellen können.",
        "Feature-Wunsch: Beschreibe neue Werkzeuge oder Abkürzungen, die deinen Ablauf verbessern würden. Ein Anwendungsfall hilft uns bei der Priorisierung.",
        "Zusammenarbeit: Für Integrations- oder Content-Partnerschaften teile deinen Firmennamen, Kontaktdaten und Erwartungen.",
      ],
      closing:
        "Du kannst auch an support@pdffreetool.com mailen oder uns über unsere Social-Media-Konten erreichen. Wir bemühen uns, alle Nachrichten so schnell wie möglich zu beantworten.",
    },
  },
};

const TRANSLATIONS_DE = {
  ...TRANSLATIONS.en,
  studioLabel: "PDFFreeTool Studio",
  heroTitle: "Flexibles PDF- und Bildstudio",
  heroSubtitle:
    "Wähle jedes PDF- oder Bild-Tool aus einem Menü – zusammenführen, teilen, konvertieren oder optimieren. Jedes Tool hat eine klare Beschreibung und praktische Tipps, damit du schneller fertig wirst.",
  nav: {
    home: "Startseite",
    blog: "Anleitungen & Tipps",
    faq: "FAQ",
    privacy: "Datenschutz",
    terms: "Nutzungsbedingungen",
    about: "Über uns",
    contact: "Kontakt",
  },
  footerCopyright: "© 2025 PDFFreeTool. Alle Rechte vorbehalten.",
  onlineToolsHeading: "Online-PDF- und Bild-Tools",
  adFriendly: "Anzeigenfreundliche Inhalte",
  onlineToolsDescription:
    "PDFs an einem Ort zusammenführen, komprimieren, drehen, konvertieren und lesen. Unser Menü hält jedes Tool informativ, nutzerfreundlich und AdSense-konform, damit Besucher hilfreiche Inhalte sehen.",
  featureTags: {
    dragDrop: "✅ Neu anordnen per Drag & Drop",
    memoryProcessing: "✅ Dateien werden im Speicher verarbeitet",
    noRegistration: "✅ Keine Registrierung erforderlich",
  },
  seoSection: {
    title: "Einfache PDF- und Bild-Tools für den Alltag",
    intro:
      "PDFFreeTool bündelt beliebte PDF- und Bildaktionen an einem Ort. PDFs zusammenführen oder komprimieren, zwischen JPG und PDF konvertieren und Seiten direkt im Browser verwalten – ohne Downloads, Konten oder Limits.",
    whatTitle: "Was du tun kannst",
    whatList: [
      "PDFs in der gewünschten Reihenfolge zusammenführen und ordnen.",
      "Dateien verkleinern, damit Teilen oder Hochladen leichter fällt.",
      "Nahtlos zwischen JPG-Bildern und PDF-Dokumenten wechseln.",
      "Seiten teilen, drehen oder extrahieren und die Qualität bewahren.",
    ],
    whyTitle: "Warum es gewählt wird",
    whyList: [
      "Sichere, browserbasierte Verarbeitung hält Dateien privat.",
      "Schnelle Ergebnisse ohne Anmeldung oder Wasserzeichen.",
      "Kostenlose Tools, die auf jedem modernen Gerät funktionieren.",
    ],
    mergerTitle: "Warum diesen kostenlosen PDF-Merger wählen?",
    mergerList: [
      {
        title: "Schnell und einfach",
        text: "Keine komplexen Einstellungen oder überladene Werbung. Einfach hochladen, neu anordnen und zusammenführen.",
      },
      {
        title: "Sicher",
        text: "PDF-Dateien werden direkt im Speicher verarbeitet. Wir speichern deine Dokumente nicht dauerhaft.",
      },
      {
        title: "Browserbasiert",
        text: "Funktioniert auf Windows, macOS, Linux und mobilen Geräten mit modernem Browser.",
      },
      {
        title: "Kostenlos",
        text: "Keine Registrierung nötig, um deine PDFs zusammenzuführen.",
      },
    ],
  },
  toolMenuTitle: "Werkzeugmenü",
  toolMenuDescription:
    "Klicke auf eine Karte, um zum Tool zu springen, die Übersicht zu lesen und es direkt zu nutzen.",
  languageLabel: "Sprache",
  themeLabel: "Thema",
  themeLight: "Hell",
  themeDark: "Dunkel",
  selectToolLabel: "Werkzeug wählen",
  merge: {
    ...TRANSLATIONS.en.merge,
    pill: "PDFs im Browser zusammenführen",
    title: "PDF-Dateien in Sekunden zusammenführen",
    description:
      "Hochladen, neu anordnen und eine einzige zusammengeführte PDF herunterladen. Nichts wird auf unseren Servern gespeichert.",
    badge: "Einfach & sicher",
    chooseFiles: "PDF-Dateien auswählen",
    selectPdfs: "PDFs wählen",
    fileLimit: (maxFiles, maxTotalMb) => `Bis zu ${maxFiles} Dateien • Gesamtgröße ≤ ${maxTotalMb} MB`,
    filesSelected: "Ausgewählte Dateien:",
    totalSize: "Gesamtgröße:",
    reorderTitle: "Dateien neu anordnen",
    reorderHint: "Zum Ändern der Reihenfolge ziehen",
    dragHandle: "Zum Neuordnen ziehen",
    usageLabel: "Zusammenführungen in dieser Sitzung:",
    clear: "Leeren",
    merge: "PDFs zusammenführen",
    merging: "Wird zusammengeführt...",
    removeFile: "Diese Datei entfernen",
  },
  errors: {
    ...TRANSLATIONS.en.errors,
    pdfOnly: "Bitte nur PDF-Dateien auswählen.",
    maxFiles: (limit) => `Sie können bis zu ${limit} PDF-Dateien hochladen. Zusätzliche Dateien wurden ignoriert.`,
    maxSize: (limit) => "Die Gesamtgröße darf " + limit + " MB nicht überschreiten. Bitte weniger oder kleinere Dateien wählen.",
    noneSelected: "Bitte mindestens eine PDF-Datei auswählen.",
    generic: "Etwas ist schiefgelaufen.",
    mergeFailed: "PDFs konnten nicht zusammengeführt werden.",
  },
};

TRANSLATIONS.de = TRANSLATIONS_DE;

const PAGE_LABELS = {
  en: {
    blog: "Guide and tips page",
    faq: "Frequently asked questions page",
    privacy: "Privacy policy page",
    terms: "Terms of service page",
    about: "About page",
    contact: "Contact page",
  },
  tr: {
    blog: "Rehber ve ipuçları sayfası",
    faq: "Sık sorulan sorular sayfası",
    privacy: "Gizlilik politikası sayfası",
    terms: "Hizmet şartları sayfası",
    about: "Hakkında sayfası",
    contact: "İletişim sayfası",
  },
  de: {
    blog: "Ratgeber- und Tippseite",
    faq: "Häufig gestellte Fragen Seite",
    privacy: "Datenschutzerklärung Seite",
    terms: "Nutzungsbedingungen Seite",
    about: "Über uns Seite",
    contact: "Kontaktseite",
  },
};

const FLAG_ICONS = {
  en: (
    <svg
      aria-hidden
      width="18"
      height="12"
      viewBox="0 0 64 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="64" height="48" fill="#B22234" rx="2" />
      <g fill="#fff">
        <rect y="4" width="64" height="4" />
        <rect y="12" width="64" height="4" />
        <rect y="20" width="64" height="4" />
        <rect y="28" width="64" height="4" />
        <rect y="36" width="64" height="4" />
        <rect y="44" width="64" height="2" />
      </g>
      <rect width="28" height="20" fill="#3C3B6E" rx="1" />
      <g fill="#fff" transform="translate(3 3)">
        {[...Array(4)].map((_, row) => (
          <g key={row} transform={`translate(0 ${row * 4})`}>
            {[...Array(5)].map((_, col) => (
              <circle key={`${row}-${col}`} cx={col * 5} cy={0} r="0.8" />
            ))}
          </g>
        ))}
      </g>
    </svg>
  ),
  tr: (
    <svg
      aria-hidden
      width="18"
      height="12"
      viewBox="0 0 64 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="64" height="48" fill="#E30A17" rx="2" />
      <circle cx="27" cy="24" r="9" fill="#fff" />
      <circle cx="29" cy="24" r="7" fill="#E30A17" />
      <path
        d="M39.5 24.0002L33.5 28.9384L35.8 21.1763L29.5 16.9993H37.2L39.5 9.23706L41.8 16.9993H49.5L43.2 21.1763L45.5 28.9384L39.5 24.0002Z"
        fill="#fff"
      />
    </svg>
  ),
  de: (
    <svg
      aria-hidden
      width="18"
      height="12"
      viewBox="0 0 3 2"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <rect width="3" height="2" fill="#DD0000" rx="0.3" />
      <rect width="3" height="0.666" y="0" fill="#000" rx="0.2" />
      <rect width="3" height="0.666" y="1.334" fill="#FFCE00" rx="0.2" />
    </svg>
  ),
};

function App() {
  const initialRouteRef = useRef(getInitialRouteState());
  const [activeTab, setActiveTab] = useState(initialRouteRef.current.activeTab);
  const [files, setFiles] = useState([]);
  const [isMerging, setIsMerging] = useState(false);
  const [error, setError] = useState("");
  const [dragIndex, setDragIndex] = useState(null);
  const [usageCount, setUsageCount] = useState(0);
  const [activePage, setActivePage] = useState(initialRouteRef.current.activePage);
  const [themeMode, setThemeMode] = useState(() => {
    if (typeof window === "undefined") return "light";
    return localStorage.getItem("pdffreetool-theme") || "light";
  });
  const [language, setLanguage] = useState(initialRouteRef.current.language);
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const fileInputRef = useRef(null);
  const toolContentRef = useRef(null);
  const hasMountedRef = useRef(false);
  const languageMenuRef = useRef(null);
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const mergeText = t.merge || TRANSLATIONS.en.merge;
  const errors = t.errors || TRANSLATIONS.en.errors;
  const seoText = t.seoSection || TRANSLATIONS.en.seoSection;
  const pageLabels = PAGE_LABELS[language] || PAGE_LABELS.en;
  const viewSeo = getSeoForView(language, activePage, activeTab);
  const heroHeading = viewSeo.h1 || t.heroTitle;

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    if (toolContentRef.current) {
      toolContentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [activeTab]);

  useEffect(() => {
    const consent = localStorage.getItem("pdffreetool-cookie-consent");

    if (!consent) {
      setShowCookieBanner(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("pdffreetool-theme", themeMode);
  }, [themeMode]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("pdffreetool-language", language);
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const seo = getSeoForView(language, activePage, activeTab);

    document.title = seo.title;

    const ensureMetaTag = (name, content) => {
      let tag = document.querySelector(`meta[name="${name}"]`);

      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }

      tag.setAttribute("content", content);
    };

    ensureMetaTag("description", seo.description);

    const newPath = buildPathFromState(language, activePage, activeTab);
    if (window.location.pathname !== newPath) {
      window.history.replaceState({}, "", newPath);
    }

    const head = document.head;
    head.querySelectorAll('link[data-generated="alternate-lang"]').forEach((link) => link.remove());

    const origin = window.location.origin || "https://pdffreetool.com";

    SUPPORTED_LANGUAGES.forEach((langCode) => {
      const linkEl = document.createElement("link");
      linkEl.rel = "alternate";
      linkEl.hreflang = langCode;
      linkEl.href = `${origin}${buildPathFromState(langCode, activePage, activeTab)}`;
      linkEl.dataset.generated = "alternate-lang";
      head.appendChild(linkEl);
    });

    const xDefault = document.createElement("link");
    xDefault.rel = "alternate";
    xDefault.hreflang = "x-default";
    xDefault.href = `${origin}${buildPathFromState(DEFAULT_LANGUAGE, activePage, activeTab)}`;
    xDefault.dataset.generated = "alternate-lang";
    head.appendChild(xDefault);
  }, [language, activePage, activeTab]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
        setLanguageMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handlePopState = () => {
      const storedLanguage = localStorage.getItem("pdffreetool-language") || DEFAULT_LANGUAGE;
      const parsedState = parsePathToState(window.location.pathname, storedLanguage);
      setLanguage(parsedState.language);
      setActivePage(parsedState.activePage);
      setActiveTab(parsedState.activeTab);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleTabChange = (id) => {
    setActivePage("home");
    setActiveTab(id);
  };

  const handleNavigate = (page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAcceptCookies = () => {
    localStorage.setItem("pdffreetool-cookie-consent", "accepted");
    setShowCookieBanner(false);
  };

  const handleFileChange = (e) => {
    setError("");
    const selected = Array.from(e.target.files || []);
    const pdfs = selected.filter((f) => f.type === "application/pdf");

    if (pdfs.length === 0) {
      setError(errors.pdfOnly);
      return;
    }

    // Append to existing files
    let combined = [...files, ...pdfs];

    if (combined.length > MAX_FILES) {
      setError(errors.maxFiles(MAX_FILES));
      combined = combined.slice(0, MAX_FILES);
    }

    const totalBytes = combined.reduce((sum, f) => sum + f.size, 0);
    const totalMB = totalBytes / 1024 / 1024;

    if (totalMB > MAX_TOTAL_MB) {
      setError(errors.maxSize(MAX_TOTAL_MB));
      return;
    }

    setFiles(combined);
  };

  const handleMerge = async () => {
    setError("");
    if (!files.length) {
      setError(errors.noneSelected);
      return;
    }

    setIsMerging(true);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      const res = await fetch(`${API_URL}/merge`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || errors.generic);
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "merged.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setUsageCount((prev) => prev + 1);
    } catch (err) {
      console.error(err);
      setError(err.message || errors.mergeFailed);
    } finally {
      setIsMerging(false);
    }
  };

  const handleClear = () => {
    setFiles([]);
    setError("");
    setDragIndex(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = (indexToRemove) => {
    setFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const renderNavLink = (page, label) => {
    const isActive = activePage === page;

    return (
      <button
        key={page}
        aria-label={pageLabels?.[page] || label}
        onClick={() => handleNavigate(page)}
        style={{
          padding: "8px 12px",
          borderRadius: "10px",
          border: "1px solid" + (isActive ? " #4f46e5" : " #e5e7eb"),
          background: isActive ? "#eef2ff" : "#ffffff",
          color: isActive ? "#312e81" : "#374151",
          fontWeight: 600,
          fontSize: "13px",
          cursor: "pointer",
          boxShadow: isActive
            ? "0 10px 24px rgba(79,70,229,0.18)"
            : "0 4px 12px rgba(15,23,42,0.06)",
          transition: "all 0.15s ease",
        }}
      >
        {label}
      </button>
    );
  };

  const renderStaticPage = () => {
    const cardStyle = {
      background: "white",
      borderRadius: "16px",
      border: "1px solid #e5e7eb",
      padding: "22px",
      boxShadow: "0 18px 36px rgba(15,23,42,0.08)",
      marginBottom: "14px",
    };

    const headingStyle = {
      marginTop: 0,
      marginBottom: "12px",
      fontSize: "22px",
      color: "#0f172a",
    };

    const paragraphStyle = {
      marginTop: 0,
      marginBottom: "12px",
      color: "#4b5563",
      lineHeight: 1.7,
      fontSize: "14px",
    };

    const listStyle = {
      paddingLeft: "18px",
      marginTop: 0,
      marginBottom: "12px",
      color: "#4b5563",
      fontSize: "14px",
      lineHeight: 1.7,
    };

    const pageContent = PAGE_CONTENT[activePage]?.[language] || PAGE_CONTENT[activePage]?.en;

    switch (activePage) {
      case "blog":
        return (
          <section
            style={cardStyle}
            aria-label={pageLabels?.blog || "Guide and tips page"}
          >
            <h2 style={headingStyle}>{pageContent?.title}</h2>
            <p style={paragraphStyle}>{pageContent?.intro}</p>
            <h3 style={{ ...headingStyle, fontSize: "18px", marginBottom: "8px" }}>
              {pageContent?.goldenRulesTitle}
            </h3>
            <ul style={listStyle}>
              {pageContent?.goldenRules?.map((rule) => (
                <li key={rule.label}>
                  <strong>{rule.label}:</strong> {rule.text}
                </li>
              ))}
            </ul>
            <h3 style={{ ...headingStyle, fontSize: "18px", marginBottom: "8px" }}>
              {pageContent?.recommendedTitle}
            </h3>
            <p style={paragraphStyle}>{pageContent?.recommendedIntro}</p>
            <ol style={{ ...listStyle, paddingLeft: "20px" }}>
              {pageContent?.recommended?.map((item) => (
                <li key={item.label}>
                  <strong>{item.label}:</strong> {item.body}
                </li>
              ))}
            </ol>
            <p style={paragraphStyle}>{pageContent?.closing}</p>
          </section>
        );
      case "privacy":
        return (
          <section
            style={cardStyle}
            aria-label={pageLabels?.privacy || "Privacy policy"}
          >
            <h2 style={headingStyle}>{pageContent?.title}</h2>
            <p style={paragraphStyle}>{pageContent?.intro}</p>
            <h3 style={{ ...headingStyle, fontSize: "18px", marginBottom: "8px" }}>
              {pageContent?.dataTitle}
            </h3>
            <ul style={listStyle}>
              {pageContent?.dataPoints?.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <p style={paragraphStyle}>{pageContent?.analytics}</p>
            <p style={paragraphStyle}>{pageContent?.optOut}</p>
            <h3 style={{ ...headingStyle, fontSize: "18px", marginBottom: "8px" }}>
              {pageContent?.securityTitle}
            </h3>
            <p style={paragraphStyle}>{pageContent?.securityBody}</p>
            <ul style={listStyle}>
              {pageContent?.securityList?.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <h3 style={{ ...headingStyle, fontSize: "18px", marginBottom: "8px" }}>
              {pageContent?.rightsTitle}
            </h3>
            <p style={paragraphStyle}>{pageContent?.rightsBody}</p>
          </section>
        );
      case "terms":
        return (
          <section
            style={cardStyle}
            aria-label={pageLabels?.terms || "Terms of service"}
          >
            <h2 style={headingStyle}>{pageContent?.title}</h2>
            <p style={paragraphStyle}>{pageContent?.intro}</p>
            <ol style={{ ...listStyle, paddingLeft: "20px" }}>
              {pageContent?.points?.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ol>
            <p style={paragraphStyle}>{pageContent?.maintenance}</p>
          </section>
        );
      case "faq":
        return (
          <section
            style={cardStyle}
            aria-label={pageLabels?.faq || "Frequently asked questions page"}
          >
            <h2 style={headingStyle}>{pageContent?.title}</h2>
            <p style={paragraphStyle}>{pageContent?.intro}</p>
            <h3 style={{ ...headingStyle, fontSize: "18px", marginBottom: "8px" }}>
              {pageContent?.mergeTitle}
            </h3>
            <div style={{ ...paragraphStyle, marginBottom: "0" }}>
              {pageContent?.mergeItems?.map((item) => (
                <p key={item.question} style={{ marginTop: 0, marginBottom: "10px" }}>
                  <strong>{item.question}</strong>
                  <br />
                  {item.answer}
                </p>
              ))}
            </div>
            <h3 style={{ ...headingStyle, fontSize: "18px", marginBottom: "8px" }}>
              {pageContent?.tipsTitle}
            </h3>
            <ul style={listStyle}>
              {pageContent?.tips?.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
            <p style={paragraphStyle}>{pageContent?.closing}</p>
          </section>
        );
      case "about":
        return (
          <section
            style={cardStyle}
            aria-label={pageLabels?.about || "About page"}
          >
            <h2 style={headingStyle}>{pageContent?.title}</h2>
            <p style={paragraphStyle}>{pageContent?.intro}</p>
            <p style={paragraphStyle}>{pageContent?.build}</p>
            <ul style={listStyle}>
              {pageContent?.highlights?.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p style={paragraphStyle}>{pageContent?.closing}</p>
          </section>
        );
      case "contact":
        return (
          <section
            style={cardStyle}
            aria-label={pageLabels?.contact || "Contact page"}
          >
            <h2 style={headingStyle}>{pageContent?.title}</h2>
            <p style={paragraphStyle}>{pageContent?.intro}</p>
            <ul style={listStyle}>
              {pageContent?.list?.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p style={paragraphStyle}>{pageContent?.closing}</p>
          </section>
        );
      default:
        return null;
    }
  };

  const handleDragStart = (index) => {
    setDragIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;

    setFiles((prevFiles) => {
      const updated = [...prevFiles];
      const draggedItem = updated[dragIndex];
      updated.splice(dragIndex, 1);
      updated.splice(index, 0, draggedItem);
      return updated;
    });

    setDragIndex(index);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragIndex(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
  };

  const totalMB =
    files.reduce((sum, f) => sum + f.size, 0) / 1024 / 1024 || 0;

  const toolMenu = TOOL_MENU[language] || TOOL_MENU.en;

  const activeTool = toolMenu.find((tool) => tool.id === activeTab);

  const renderThemeToggle = () => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "4px",
        padding: "6px 6px",
        borderRadius: "12px",
        border: "1px solid #e5e7eb",
        background: "#ffffff",
        boxShadow: "0 6px 16px rgba(15,23,42,0.05)",
      }}
    >
      <button
        type="button"
        onClick={() => setThemeMode("light")}
        style={{
          padding: "6px 9px",
          borderRadius: "10px",
          border: themeMode === "light" ? "1px solid #4f46e5" : "1px solid #e5e7eb",
          background:
            themeMode === "light" ? "linear-gradient(180deg, #eef2ff, #e0e7ff)" : "white",
          color: "#111827",
          fontWeight: 700,
          cursor: "pointer",
          boxShadow:
            themeMode === "light"
              ? "0 8px 18px rgba(79,70,229,0.18)"
              : "0 4px 10px rgba(15,23,42,0.05)",
          transition: "all 0.15s ease",
        }}
      >
        {t.themeLight}
      </button>
      <button
        type="button"
        onClick={() => setThemeMode("dark")}
        style={{
          padding: "6px 9px",
          borderRadius: "10px",
          border: themeMode === "dark" ? "1px solid #0f172a" : "1px solid #e5e7eb",
          background:
            themeMode === "dark" ? "linear-gradient(180deg, #0f172a, #111827)" : "white",
          color: themeMode === "dark" ? "#e5e7eb" : "#111827",
          fontWeight: 700,
          cursor: "pointer",
          boxShadow:
            themeMode === "dark"
              ? "0 10px 20px rgba(15,23,42,0.4)"
              : "0 4px 10px rgba(15,23,42,0.05)",
          transition: "all 0.15s ease",
        }}
      >
        {t.themeDark}
      </button>
    </div>
  );

  const renderLanguageSelector = () => {
    const selectedLanguage =
      LANGUAGE_OPTIONS.find((option) => option.value === language) || LANGUAGE_OPTIONS[0];

    return (
      <div
        ref={languageMenuRef}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "6px 6px",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          background: "#ffffff",
          boxShadow: "0 6px 16px rgba(15,23,42,0.05)",
          position: "relative",
        }}
      >
        <button
          type="button"
          onClick={() => setLanguageMenuOpen((prev) => !prev)}
          aria-haspopup="listbox"
          aria-expanded={languageMenuOpen}
          style={{
            padding: "7px 9px",
            borderRadius: "10px",
            border: "1px solid #e5e7eb",
            background: "white",
            color: "#111827",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(15,23,42,0.05)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            minWidth: "110px",
          }}
        >
          <span
            aria-hidden
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "22px",
              height: "16px",
              borderRadius: "4px",
              overflow: "hidden",
              boxShadow: "inset 0 0 0 1px rgba(15,23,42,0.08)",
            }}
          >
            {FLAG_ICONS[selectedLanguage.value]}
          </span>
          <span style={{ fontWeight: 700, color: "#111827" }}>{selectedLanguage.label}</span>
          <svg
            aria-hidden
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ marginLeft: "auto", transform: languageMenuOpen ? "rotate(180deg)" : "none" }}
          >
            <path d="M6 9l6 6 6-6" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {languageMenuOpen && (
          <div
            role="listbox"
            style={{
              position: "absolute",
              top: "100%",
              right: "0",
              marginTop: "6px",
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              boxShadow: "0 12px 30px rgba(15,23,42,0.12)",
              overflow: "hidden",
              minWidth: "220px",
              zIndex: 5,
            }}
          >
            {LANGUAGE_OPTIONS.map((option) => {
              const isActive = option.value === language;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => {
                    setLanguage(option.value);
                    setLanguageMenuOpen(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    width: "100%",
                    padding: "10px 12px",
                    background: isActive ? "#eef2ff" : "white",
                    color: "#111827",
                    border: "none",
                    textAlign: "left",
                    cursor: "pointer",
                    fontWeight: isActive ? 700 : 600,
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "22px",
                      height: "16px",
                      borderRadius: "4px",
                      overflow: "hidden",
                      boxShadow: "inset 0 0 0 1px rgba(15,23,42,0.08)",
                    }}
                  >
                    {FLAG_ICONS[option.value]}
                  </span>
                  <span>{option.label}</span>
                  {isActive && (
                    <svg
                      aria-hidden
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ marginLeft: "auto" }}
                    >
                      <path
                        d="M20 6L9 17l-5-5"
                        stroke="#4f46e5"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const getToolDetail = (toolId) => {
    const detail = TOOL_DETAILS[toolId];

    if (!detail) return null;

    if (detail.title && typeof detail.title === "string") {
      return detail;
    }

    if (detail[language]) return detail[language];
    if (detail.en) return detail.en;

    return Object.values(detail).find((entry) => entry && entry.title) || null;
  };

  const renderToolDetails = () => {
    const detail = getToolDetail(activeTab);

    if (!detail) return null;

    return (
      <section
        aria-label={`${detail.title} details`}
        style={{
          marginTop: "24px",
          marginBottom: "16px",
          background: "white",
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
          padding: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "6px",
          }}
        >
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "999px",
              background: activeTool?.accent || "#4f46e5",
            }}
          ></div>
          <h2
            style={{
              margin: 0,
              color: "#0f172a",
              fontSize: "18px",
            }}
          >
            {detail.title}
          </h2>
        </div>

        <p
          style={{
            margin: 0,
            marginBottom: "8px",
            color: "#4b5563",
            fontSize: "14px",
            lineHeight: 1.6,
          }}
        >
          {detail.intro}
        </p>

        {detail.paragraphs?.map((text, idx) => (
          <p
            key={idx}
            style={{
              margin: 0,
              marginBottom: "10px",
              color: "#4b5563",
              fontSize: "13px",
              lineHeight: 1.6,
            }}
          >
            {text}
          </p>
        ))}

        <div
          style={{
            display: "grid",
            gap: "16px",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            marginTop: "10px",
          }}
        >
          <div>
            <h3
              style={{
                margin: 0,
                marginBottom: "6px",
                color: "#111827",
                fontSize: "15px",
              }}
            >
              {detail.bulletTitle}
            </h3>
            <ul
              style={{
                margin: 0,
                paddingLeft: "18px",
                color: "#4b5563",
                fontSize: "13px",
                lineHeight: 1.6,
              }}
            >
              {detail.bullets?.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3
              style={{
                margin: 0,
                marginBottom: "6px",
                color: "#111827",
                fontSize: "15px",
              }}
            >
              {detail.checklistTitle}
            </h3>
            <ol
              style={{
                margin: 0,
                paddingLeft: "18px",
                color: "#4b5563",
                fontSize: "13px",
                lineHeight: 1.6,
              }}
            >
              {detail.checklist?.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #e0f2fe 0, #f9fafb 45%, #e5e7eb 100%)",
        padding: "32px 16px 40px",
        boxSizing: "border-box",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
        filter: themeMode === "dark" ? "invert(1) hue-rotate(180deg)" : "none",
        transition: "filter 180ms ease",
      }}
    >
      <main
        style={{
          maxWidth: "960px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "8px",
            marginBottom: "10px",
            flexWrap: "wrap",
          }}
        >
          {renderThemeToggle()}
          {renderLanguageSelector()}
        </div>
        <header
          style={{
            marginBottom: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "14px",
              background:
                "linear-gradient(135deg, rgba(79,70,229,0.14), rgba(14,165,233,0.24))",
              display: "grid",
              placeItems: "center",
              boxShadow: "0 10px 30px rgba(15,23,42,0.12)",
              border: "1px solid rgba(79,70,229,0.2)",
            }}
            aria-hidden="true"
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "12px",
                background:
                  "conic-gradient(from 90deg, #4f46e5, #0ea5e9, #22c55e, #4f46e5)",
                display: "grid",
                placeItems: "center",
                color: "white",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                fontSize: "14px",
              }}
            >
              PDF
            </div>
          </div>
          <div style={{ flex: 1, minWidth: "240px" }}>
            <p
              style={{
                margin: 0,
                color: "#6b7280",
                fontSize: "12px",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              {t.studioLabel}
            </p>
            <h1
              style={{
                margin: 0,
                marginTop: "2px",
                fontSize: "26px",
                lineHeight: 1.2,
                color: "#0f172a",
              }}
            >
              {heroHeading}
            </h1>
            <p
              style={{
                margin: 0,
                marginTop: "6px",
                color: "#4b5563",
                fontSize: "14px",
                maxWidth: "700px",
                lineHeight: 1.6,
              }}
            >
              {t.heroSubtitle}
            </p>
          </div>
          <nav
            aria-label="Site navigation"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexWrap: "wrap",
              justifyContent: "flex-end",
              minWidth: "240px",
            }}
          >
            {renderNavLink("home", t.nav.home)}
            {renderNavLink("blog", t.nav.blog)}
            {renderNavLink("faq", t.nav.faq)}
            {renderNavLink("privacy", t.nav.privacy)}
            {renderNavLink("terms", t.nav.terms)}
            {renderNavLink("about", t.nav.about)}
            {renderNavLink("contact", t.nav.contact)}
          </nav>
        </header>
        {activePage === "home" ? (
          <>
            {/* Hero / Landing Text (SEO-friendly) */}
            <section
              style={{
                marginBottom: "20px",
                textAlign: "left",
                background: "white",
                borderRadius: "16px",
                padding: "18px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 12px 30px rgba(15,23,42,0.06)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                <h2
                  style={{
                    fontSize: "20px",
                    lineHeight: 1.25,
                    margin: 0,
                    color: "#0f172a",
                }}
              >
                {t.onlineToolsHeading}
              </h2>
              <span
                style={{
                  padding: "6px 10px",
                  background: "#ecfdf3",
                  color: "#15803d",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.02em",
                }}
              >
                {t.adFriendly}
              </span>
            </div>

              <p
                style={{
                  fontSize: "14px",
                  color: "#4b5563",
                  maxWidth: "780px",
                  margin: 0,
                  marginTop: "8px",
                  marginBottom: "10px",
                  lineHeight: 1.6,
                }}
              >
                {t.onlineToolsDescription}
              </p>
              <ul
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  padding: 0,
                  margin: 0,
                  marginTop: "6px",
                  listStyle: "none",
                  fontSize: "12px",
                  color: "#374151",
                }}
              >
                <li
                  style={{
                    padding: "4px 10px",
                    borderRadius: "999px",
                    background: "#eef2ff",
                    color: "#4f46e5",
                    fontWeight: 500,
                  }}
                >
                  {t.featureTags.dragDrop}
                </li>
                <li
                  style={{
                    padding: "4px 10px",
                    borderRadius: "999px",
                    background: "#ecfdf5",
                    color: "#15803d",
                    fontWeight: 500,
                  }}
                >
                  {t.featureTags.memoryProcessing}
                </li>
                <li
                  style={{
                    padding: "4px 10px",
                    borderRadius: "999px",
                    background: "#fefce8",
                    color: "#92400e",
                    fontWeight: 500,
                  }}
                >
                  {t.featureTags.noRegistration}
                </li>
              </ul>
            </section>

            {/* Tool navigation menu */}
        <section
          aria-label="PDF tool menu"
          style={{
            marginBottom: "16px",
            background: "white",
            borderRadius: "16px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 10px 28px rgba(15,23,42,0.07)",
            padding: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
              marginBottom: "10px",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  color: "#0f172a",
                  fontSize: "18px",
                }}
              >
                {t.toolMenuTitle}
              </h2>
              <p
                style={{
                  margin: 0,
                  marginTop: "4px",
                  color: "#6b7280",
                  fontSize: "13px",
                }}
              >
                {t.toolMenuDescription}
              </p>
            </div>
            <span
              style={{
                padding: "6px 10px",
                borderRadius: "999px",
                background: "#eef2ff",
                color: "#4338ca",
                fontSize: "12px",
                fontWeight: 700,
              }}
            >
              {activeTool?.title}
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "12px",
            }}
          >
            {toolMenu.map((tool) => {
              const isActive = tool.id === activeTab;
              return (
                <button
                  key={tool.id}
                  onClick={() => handleTabChange(tool.id)}
                  style={{
                    textAlign: "left",
                    padding: "12px",
                    borderRadius: "14px",
                    border: isActive
                      ? `2px solid ${tool.accent}`
                      : "1px solid #e5e7eb",
                    background: isActive
                      ? "linear-gradient(180deg, #f8fafc, #eef2ff)"
                      : "white",
                    boxShadow: isActive
                      ? "0 12px 24px rgba(79,70,229,0.14)"
                      : "0 8px 18px rgba(15,23,42,0.06)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "6px",
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        display: "inline-block",
                        width: "32px",
                        height: "32px",
                        borderRadius: "10px",
                        background: tool.accent,
                        color: "white",
                        fontWeight: 800,
                        fontSize: "13px",
                        letterSpacing: "-0.01em",
                        textAlign: "center",
                        lineHeight: "32px",
                      }}
                    >
                      {tool.title.substring(0, 2).toUpperCase()}
                    </span>
                    <strong
                      style={{
                        color: "#111827",
                        fontSize: "14px",
                      }}
                    >
                      {tool.title}
                    </strong>
                  </div>
                  <p
                    style={{
                      margin: 0,
                      color: "#4b5563",
                      fontSize: "12.5px",
                      lineHeight: 1.5,
                    }}
                  >
                    {tool.summary}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* TAB NAVIGATION */}
        <div
          ref={toolContentRef}
          style={{
            marginBottom: "20px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "white",
              padding: "10px 14px",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 6px 16px rgba(15,23,42,0.08)",
              width: "100%",
              maxWidth: "340px",
            }}
            >
            <span
              style={{
                fontSize: "14px",
                color: "#374151",
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              {t.selectToolLabel}
            </span>
            <select
              value={activeTab}
              onChange={(e) => handleTabChange(e.target.value)}
              style={{
                flex: 1,
                padding: "10px 12px",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                fontSize: "14px",
                fontWeight: 600,
                color: "#111827",
                background: "linear-gradient(180deg, #f8fafc, #f1f5f9)",
                boxShadow: "inset 0 1px 2px rgba(15,23,42,0.06)",
                outline: "none",
              }}
            >
              {toolMenu.map((tool) => (
                <option key={tool.id} value={tool.id}>
                  {tool.title}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* ACTIVE TOOL CONTENT */}
        {activeTab === "merge" && (
          <section
            aria-label="PDF merge tool"
            style={{
              marginBottom: "28px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  maxWidth: "540px",
                  width: "100%",
                  background: "white",
                  padding: "24px 24px 20px",
                  borderRadius: "18px",
                  boxShadow:
                    "0 24px 60px rgba(15,23,42,0.16), 0 0 0 1px rgba(148,163,184,0.18)",
                  border: "1px solid rgba(226,232,240,0.9)",
                }}
              >
                {/* Card Header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "12px",
                    alignItems: "center",
                    marginBottom: "14px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "2px 8px",
                        borderRadius: "999px",
                        background: "#eff6ff",
                        fontSize: "11px",
                        color: "#1d4ed8",
                        marginBottom: "6px",
                        fontWeight: 500,
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          width: "6px",
                          height: "6px",
                          borderRadius: "999px",
                          background: "#22c55e",
                        }}
                      ></span>
                      {mergeText.pill}
                    </div>
                    <h2
                      style={{
                        fontSize: "18px",
                        margin: 0,
                        marginBottom: "4px",
                        color: "#0f172a",
                      }}
                    >
                      {mergeText.title}
                    </h2>
                    <p
                      style={{
                        color: "#6b7280",
                        margin: 0,
                        fontSize: "13px",
                      }}
                    >
                      {mergeText.description}
                    </p>
                  </div>
                  <div
                    style={{
                      textAlign: "right",
                      fontSize: "11px",
                      color: "#6b7280",
                    }}
                  >
                    <div
                      style={{
                        padding: "4px 8px",
                        borderRadius: "999px",
                        background: "#f4f4ff",
                        color: "#4f46e5",
                        fontWeight: 500,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          width: "7px",
                          height: "7px",
                          borderRadius: "999px",
                          background: "#4ade80",
                        }}
                      ></span>
                      {mergeText.badge}
                    </div>
                  </div>
                </div>

                {/* Upload area */}
                <div
                  style={{
                    border: "1.5px dashed #d1d5db",
                    borderRadius: "12px",
                    padding: "16px",
                    textAlign: "center",
                    marginBottom: "14px",
                    background:
                      "linear-gradient(135deg, #f9fafb 0%, #f1f5f9 50%, #e5f0ff 100%)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "13px",
                      marginBottom: "8px",
                      color: "#111827",
                      fontWeight: 500,
                    }}
                  >
                    {mergeText.chooseFiles}
                  </div>
                  <label
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 14px",
                      borderRadius: "999px",
                      background: "#111827",
                      color: "white",
                      fontSize: "12px",
                      cursor: "pointer",
                      boxShadow: "0 8px 20px rgba(15,23,42,0.35)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "14px",
                      }}
                    >
                      📄
                    </span>
                    <span>{mergeText.selectPdfs}</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="application/pdf"
                      multiple
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                  </label>
                  <p
                    style={{
                      fontSize: "11px",
                      color: "#6b7280",
                      marginTop: "8px",
                      marginBottom: 0,
                    }}
                  >
                    {mergeText.fileLimit(MAX_FILES, MAX_TOTAL_MB)}
                  </p>
                </div>

                {/* File stats */}
                {files.length > 0 && (
                  <div
                    style={{
                      marginBottom: "8px",
                      fontSize: "11px",
                      color: "#4b5563",
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "8px",
                    }}
                  >
                    <div>
                      {mergeText.filesSelected}{" "}
                      <strong style={{ color: "#111827" }}>
                        {files.length}
                      </strong>
                    </div>
                    <div>
                      {mergeText.totalSize}{" "}
                      <strong style={{ color: "#111827" }}>
                        {totalMB.toFixed(2)} MB
                      </strong>
                    </div>
                  </div>
                )}

                {/* File list with drag & drop */}
                {files.length > 0 && (
                  <div
                    style={{
                      marginBottom: "14px",
                      maxHeight: "220px",
                      overflowY: "auto",
                      border: "1px solid #e5e7eb",
                      borderRadius: "10px",
                      padding: "8px",
                      background: "#f9fafb",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#6b7280",
                        marginBottom: "6px",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ fontWeight: 500, color: "#111827" }}>
                        {mergeText.reorderTitle}
                      </span>
                      <span>{mergeText.reorderHint}</span>
                    </div>
                    <ul
                      style={{
                        paddingLeft: 0,
                        margin: 0,
                        listStyleType: "none",
                        fontSize: "13px",
                      }}
                    >
                      {files.map((file, idx) => (
                        <li
                          key={idx}
                          draggable
                          onDragStart={() => handleDragStart(idx)}
                          onDragOver={(e) => handleDragOver(e, idx)}
                          onDrop={handleDrop}
                          onDragEnd={handleDragEnd}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "8px 10px",
                            marginBottom: "6px",
                            borderRadius: "8px",
                            border:
                              dragIndex === idx
                                ? "1px dashed #4f46e5"
                                : "1px solid #e5e7eb",
                            background:
                              dragIndex === idx
                                ? "#eef2ff"
                                : "rgba(255,255,255,0.9)",
                            cursor: "grab",
                            gap: "8px",
                            boxShadow:
                              dragIndex === idx
                                ? "0 6px 16px rgba(79,70,229,0.25)"
                                : "0 1px 3px rgba(15,23,42,0.06)",
                            transition:
                              "background 0.15s ease, box-shadow 0.15s ease",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "16px",
                              width: "22px",
                              textAlign: "center",
                              color: "#9ca3af",
                            }}
                            title={mergeText.dragHandle}
                          >
                            ☰
                          </span>
                          <span
                            style={{
                              fontSize: "11px",
                              color: "#6b7280",
                              width: "30px",
                              textAlign: "center",
                            }}
                          >
                            #{idx + 1}
                          </span>
                          <div
                            style={{
                              flex: 1,
                              wordBreak: "break-all",
                            }}
                          >
                            <span
                              style={{
                                fontWeight: 500,
                                color: "#111827",
                              }}
                            >
                              {file.name}
                            </span>
                            <span
                              style={{
                                color: "#9ca3af",
                                fontSize: "12px",
                              }}
                            >
                              {" "}
                              ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFile(idx);
                            }}
                            style={{
                              border: "none",
                              background: "transparent",
                              color: "#b91c1c",
                              fontWeight: "bold",
                              fontSize: "16px",
                              cursor: "pointer",
                              padding: "0 6px",
                            }}
                            title={mergeText.removeFile}
                          >
                            ✕
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Error box */}
                {error && (
                  <div
                    style={{
                      marginBottom: "10px",
                      padding: "8px 10px",
                      background: "#fef2f2",
                      color: "#b91c1c",
                      borderRadius: "8px",
                      fontSize: "12px",
                      border: "1px solid #fecaca",
                    }}
                  >
                    {error}
                  </div>
                )}

                {/* Bottom actions + usage info */}
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "8px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#6b7280",
                    }}
                  >
                    {mergeText.usageLabel}{" "}
                    <strong style={{ color: "#111827" }}>
                      {usageCount}
                    </strong>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                    }}
                  >
                    <button
                      onClick={handleClear}
                      disabled={isMerging || files.length === 0}
                      style={{
                        padding: "8px 12px",
                        borderRadius: "999px",
                        border: "1px solid #e5e7eb",
                        background: "white",
                        cursor:
                          isMerging || files.length === 0
                            ? "not-allowed"
                            : "pointer",
                        fontSize: "12px",
                        color: "#374151",
                        minWidth: "80px",
                      }}
                    >
                      {mergeText.clear}
                    </button>
                    <button
                      onClick={handleMerge}
                      disabled={isMerging || files.length === 0}
                      style={{
                        padding: "8px 16px",
                        borderRadius: "999px",
                        border: "none",
                        background:
                          isMerging || files.length === 0
                            ? "#9ca3af"
                            : "#4f46e5",
                        color: "white",
                        cursor:
                          isMerging || files.length === 0
                            ? "not-allowed"
                            : "pointer",
                        fontSize: "12px",
                        fontWeight: 500,
                        minWidth: "120px",
                        boxShadow:
                          isMerging || files.length === 0
                            ? "none"
                            : "0 10px 25px rgba(79,70,229,0.4)",
                      }}
                    >
                      {isMerging ? mergeText.merging : mergeText.merge}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === "compress" && <CompressCard language={language} />}
        {activeTab === "compressImage" && (
          <CompressImageCard language={language} />
        )}
        {activeTab === "jpgToPdf" && <JpgToPdfCard language={language} />}
        {activeTab === "pdfToJpg" && <PdfToJpgCard language={language} />}
        {activeTab === "pdfToPng" && <PdfToPngCard language={language} />}
        {activeTab === "split" && <SplitPdfCard language={language} />}
        {activeTab === "deletePages" && (
          <DeletePdfPagesCard language={language} />
        )}
        {activeTab === "rotatePages" && (
          <RotatePdfPagesCard language={language} />
        )}
        {activeTab === "extractPages" && (
          <ExtractPdfPagesCard language={language} />
        )}
        {activeTab === "pdfReader" && <PdfReaderCard language={language} />}
        {activeTab === "pdfToWord" && <PdfToWordCard language={language} />}
        {activeTab === "wordToPdf" && <WordToPdfCard language={language} />}

        {renderToolDetails()}

        {/* Ads under tools */}
        <AdsenseBanner slot="3737459241" />

        {/* SEO text sections */}
        <section
          aria-label="Free PDF tools – merge, compress, and convert images"
          style={{
            marginTop: "24px",
            marginBottom: "24px",
          }}
        >
          <h2
            style={{
              fontSize: "18px",
              marginBottom: "6px",
              color: "#111827",
            }}
          >
            {seoText.title}
          </h2>

          <p
            style={{
              fontSize: "13px",
              color: "#4b5563",
              marginBottom: "10px",
            }}
          >
            {seoText.intro}
          </p>

          <h3
            style={{
              fontSize: "16px",
              marginBottom: "6px",
              marginTop: "14px",
              color: "#111827",
            }}
          >
            {seoText.whatTitle}
          </h3>
          <ul
            style={{
              paddingLeft: "20px",
              margin: 0,
              fontSize: "13px",
              color: "#4b5563",
            }}
          >
            {seoText.whatList?.map((item, index) => (
              <li key={`seo-what-${index}`}>{item}</li>
            ))}
          </ul>

          <h3
            style={{
              fontSize: "16px",
              marginBottom: "6px",
              marginTop: "14px",
              color: "#111827",
            }}
          >
            {seoText.whyTitle}
          </h3>
          <ul
            style={{
              paddingLeft: "20px",
              margin: 0,
              fontSize: "13px",
              color: "#4b5563",
            }}
          >
            {seoText.whyList?.map((item, index) => (
              <li key={`seo-why-${index}`}>{item}</li>
            ))}
          </ul>
        </section>


        <section
          aria-label="Why choose this free PDF merger"
          style={{
            marginBottom: "16px",
          }}
        >
          <h2
            style={{
              fontSize: "18px",
              marginBottom: "6px",
              color: "#111827",
            }}
          >
            {seoText.mergerTitle}
          </h2>
          <ul
            style={{
              paddingLeft: "20px",
              margin: 0,
              fontSize: "13px",
              color: "#4b5563",
            }}
          >
            {seoText.mergerList?.map((item, index) => (
              <li key={`seo-merger-${index}`}>
                <strong>{item.title}:</strong> {item.text}
              </li>
            ))}
          </ul>
        </section>

          </>
        ) : (
          renderStaticPage()
        )}

        <footer
          style={{
            marginTop: "12px",
            fontSize: "12px",
            color: "#6b7280",
            textAlign: "center",
            background: "white",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            padding: "12px 10px",
            boxShadow: "0 8px 20px rgba(15,23,42,0.06)",
            display: "grid",
            gap: "6px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "12px",
              flexWrap: "wrap",
              fontWeight: 600,
              fontSize: "12px",
            }}
          >
            <button
              onClick={() => handleNavigate("privacy")}
              style={{ border: "none", background: "none", color: "#2563eb", cursor: "pointer" }}
            >
              {t.nav.privacy}
            </button>
            <button
              onClick={() => handleNavigate("faq")}
              style={{ border: "none", background: "none", color: "#2563eb", cursor: "pointer" }}
            >
              {t.nav.faq}
            </button>
            <button
              onClick={() => handleNavigate("terms")}
              style={{ border: "none", background: "none", color: "#2563eb", cursor: "pointer" }}
            >
              {t.nav.terms}
            </button>
            <button
              onClick={() => handleNavigate("about")}
              style={{ border: "none", background: "none", color: "#2563eb", cursor: "pointer" }}
            >
              {t.nav.about}
            </button>
            <button
              onClick={() => handleNavigate("contact")}
              style={{ border: "none", background: "none", color: "#2563eb", cursor: "pointer" }}
            >
              {t.nav.contact}
            </button>
          </div>
          <div>{t.footerCopyright || TRANSLATIONS.en.footerCopyright}</div>
        </footer>

        {showCookieBanner && (
          <div
            role="alertdialog"
            aria-live="polite"
            aria-label="Cookie and consent notice"
            style={{
              position: "fixed",
              bottom: "16px",
              left: "50%",
              transform: "translateX(-50%)",
              background: "#0f172a",
              color: "#e5e7eb",
              padding: "14px",
              borderRadius: "14px",
              boxShadow: "0 18px 40px rgba(0,0,0,0.24)",
              width: "calc(100% - 24px)",
              maxWidth: "960px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
              zIndex: 1000,
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "13px",
                lineHeight: 1.4,
                flex: 1,
              }}
            >
              We use cookies for analytics and ads. By continuing you accept essential
              cookies and limited personalised ads. Review details in our Privacy Policy.
            </p>
            <div
              style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => handleNavigate("privacy")}
                style={{
                  border: "1px solid #334155",
                  background: "#1f2937",
                  color: "#e5e7eb",
                  padding: "8px 12px",
                  borderRadius: "10px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Privacy details
              </button>
              <button
                onClick={handleAcceptCookies}
                style={{
                  border: "none",
                  background: "linear-gradient(135deg, #22c55e, #16a34a)",
                  color: "white",
                  padding: "8px 14px",
                  borderRadius: "10px",
                  fontWeight: 800,
                  cursor: "pointer",
                  boxShadow: "0 10px 24px rgba(34,197,94,0.35)",
                }}
              >
                Accept
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
