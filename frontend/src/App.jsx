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

const TOOL_MENU = [
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
];

const TOOL_DETAILS = {
  merge: {
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
  compress: {
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
  compressImage: {
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
  jpgToPdf: {
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
  pdfToJpg: {
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
  pdfToPng: {
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
  split: {
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
  deletePages: {
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
  rotatePages: {
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
  extractPages: {
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
  pdfReader: {
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
  pdfToWord: {
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
  wordToPdf: {
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
};

const MAX_FILES = 10; // Max number of files
const MAX_TOTAL_MB = 50; // Max total size (MB)
const LANGUAGE_OPTIONS = [
  { value: "en", label: "English", flag: "🇺🇸", code: "US" },
  { value: "tr", label: "Türkçe", flag: "🇹🇷", code: "TR" },
];

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
};

function App() {
  const [activeTab, setActiveTab] = useState("merge");
  const [files, setFiles] = useState([]);
  const [isMerging, setIsMerging] = useState(false);
  const [error, setError] = useState("");
  const [dragIndex, setDragIndex] = useState(null);
  const [usageCount, setUsageCount] = useState(0);
  const [activePage, setActivePage] = useState("home");
  const [themeMode, setThemeMode] = useState(() => {
    if (typeof window === "undefined") return "light";
    return localStorage.getItem("pdffreetool-theme") || "light";
  });
  const [language, setLanguage] = useState(() => {
    if (typeof window === "undefined") return "en";
    return localStorage.getItem("pdffreetool-language") || "en";
  });
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const fileInputRef = useRef(null);
  const toolContentRef = useRef(null);
  const hasMountedRef = useRef(false);
  const languageMenuRef = useRef(null);

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
    const handleClickOutside = (event) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
        setLanguageMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTabChange = (id) => {
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
      setError("Please select PDF files only.");
      return;
    }

    // Append to existing files
    let combined = [...files, ...pdfs];

    if (combined.length > MAX_FILES) {
      setError(
        `You can upload up to ${MAX_FILES} PDF files. Extra files were ignored.`
      );
      combined = combined.slice(0, MAX_FILES);
    }

    const totalBytes = combined.reduce((sum, f) => sum + f.size, 0);
    const totalMB = totalBytes / 1024 / 1024;

    if (totalMB > MAX_TOTAL_MB) {
      setError(
        `Total file size cannot exceed ${MAX_TOTAL_MB} MB. Please choose fewer or smaller files.`
      );
      return;
    }

    setFiles(combined);
  };

  const handleMerge = async () => {
    setError("");
    if (!files.length) {
      setError("Please select at least one PDF file.");
      return;
    }

    setIsMerging(true);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

      const res = await fetch(`${API_URL}/merge`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong.");
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
      setError(err.message || "Failed to merge PDFs.");
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

    switch (activePage) {
      case "blog":
        return (
          <section style={cardStyle} aria-label="Guide and tips page">
            <h2 style={headingStyle}>Blog / Guide &amp; Tips</h2>
            <p style={paragraphStyle}>
              We put together a long-form guide to help you use our PDF and image tools as
              efficiently as possible. Whether you're managing a contract, a presentation,
              or a product catalog, the steps here are designed to speed up your PDFFreeTool
              experience and help you avoid mistakes. Because everything runs in your
              browser, your files stay private while you save time.
            </p>
            <h3 style={{ ...headingStyle, fontSize: "18px", marginBottom: "8px" }}>
              Golden rules to streamline your workflow
            </h3>
            <ul style={listStyle}>
              <li>
                <strong>Preview habit:</strong> Before merging, splitting, or deleting pages,
                name files with small notes and double-check the order. You'll avoid deleting
                the wrong page or repeating images.
              </li>
              <li>
                <strong>Right format choice:</strong> Prefer PNG output for presentation
                visuals and JPG output for social posts to balance quality and file size.
              </li>
              <li>
                <strong>Lightweight compression loop:</strong> Run <em>Compress PDF</em>
                before sharing a large file, then check image quality and re-optimize if
                needed.
              </li>
              <li>
                <strong>Privacy note:</strong> Browser-based processing keeps your projects
                from leaving the company, but make it a habit to store a local copy when
                handling important contracts.
              </li>
              <li>
                <strong>Internal sharing:</strong> When naming merged or split documents, add
                a version number (e.g., "Proposal-v3.pdf") so nothing gets mixed up.
              </li>
            </ul>
            <h3 style={{ ...headingStyle, fontSize: "18px", marginBottom: "8px" }}>
              Recommended tool combinations by scenario
            </h3>
            <p style={paragraphStyle}>
              We illustrated the time savings each tool provides when combined. That way,
              even if you handle multiple file types in the same day, you'll know where to
              start.
            </p>
            <ol style={{ ...listStyle, paddingLeft: "20px" }}>
              <li>
                <strong>Meeting packets:</strong> First gather all reports with
                <em> Merge PDF</em>, then straighten landscape diagrams with <em>Rotate Pages</em>
                and make them share-ready with <em>Compress PDF</em>.
              </li>
              <li>
                <strong>Training kits:</strong> Line up phone photos in <em>Images to PDF</em>,
                clear empty pages with <em>Delete Pages</em> if needed, and quickly review the
                final document in <em>PDF Reader</em> before sharing it with students.
              </li>
              <li>
                <strong>Product catalog:</strong> Export design pages as PNG, get
                transparent-background assets with <em>PDF to PNG</em>, optimize them for the
                web using <em>Compress Image</em>, and deliver them to the sales team in one
                folder.
              </li>
              <li>
                <strong>Legal and contracts:</strong> To share without splitting the document,
                first select relevant clauses with <em>Extract Pages</em>, lock in the latest
                versions with <em>Word to PDF</em>, and finally edit needed sections with
                <em>PDF to Word</em> before converting back to PDF.
              </li>
            </ol>
            <p style={paragraphStyle}>
              The recommendations in this guide are frequently updated based on user
              feedback. If you'd like to see a new tip, use the hints on the
              <strong> Contact</strong> page to leave us a message.
            </p>
          </section>
        );
      case "privacy":
        return (
          <section style={cardStyle} aria-label="Privacy policy">
            <h2 style={headingStyle}>Privacy Policy</h2>
            <p style={paragraphStyle}>
              PDFFreeTool offers an in-browser file management experience. This page explains
              how we process user data and the measures we take to protect your privacy.
              Regardless of which tool you use, your files are not stored server-side;
              processing is completed in memory whenever possible.
            </p>
            <h3 style={{ ...headingStyle, fontSize: "18px", marginBottom: "8px" }}>
              Data we collect and why we use it
            </h3>
            <ul style={listStyle}>
              <li>
                <strong>Log entries:</strong> Anonymous usage metrics are kept to measure
                traffic levels; IP addresses or file names are not recorded.
              </li>
              <li>
                <strong>Cookies:</strong> Required session cookies remember your language
                preference or the tools you reopen. Advertising cookies activate only with
                your consent.
              </li>
              <li>
                <strong>Third-party integrations:</strong> Ad providers receive only
                page-view statistics and never interact with the files you upload.
              </li>
            </ul>
            <p style={paragraphStyle}>
              We use third-party vendors, including Google, that use cookies to serve ads
              based on your prior visits to this and other websites. These partners receive
              anonymized analytics so they can show relevant messages without touching the
              documents you process here.
            </p>
            <p style={paragraphStyle}>
              Users may opt out of personalised advertising by visiting Google Ads Settings
              or updating consent preferences in the cookie notice on this site.
            </p>
            <h3 style={{ ...headingStyle, fontSize: "18px", marginBottom: "8px" }}>
              File security and retention
            </h3>
            <p style={paragraphStyle}>
              Uploaded PDFs or images are processed in temporary memory and are automatically
              cleared after the download link is created. The only data kept on the server is
              error logs that help detect abuse; these logs do not include file contents.
            </p>
            <ul style={listStyle}>
              <li>File fragments are removed from memory when processing finishes.</li>
              <li>For encrypted or confidential documents, we recommend backing up your local copies.</li>
              <li>On shared devices, clear your browser history to protect your privacy.</li>
            </ul>
            <h3 style={{ ...headingStyle, fontSize: "18px", marginBottom: "8px" }}>
              Your rights
            </h3>
            <p style={paragraphStyle}>
              You can contact us when you want to request deletion or anonymization of your
              usage data. Ad preferences can be updated through your browser settings and the
              cookie management panel.
            </p>
          </section>
        );
      case "terms":
        return (
          <section style={cardStyle} aria-label="Terms of service">
            <h2 style={headingStyle}>Terms of Service</h2>
            <p style={paragraphStyle}>
              By using PDFFreeTool, you agree to manage your files in compliance with legal
              regulations. The tools are provided for personal and business use; you are
              responsible for uploading any content that infringes intellectual property or
              violates the law.
            </p>
            <ol style={{ ...listStyle, paddingLeft: "20px" }}>
              <li>
                <strong>Limitation of liability:</strong> Back up your data to avoid loss in
                browser-processed files. Our platform cannot be held liable for direct or
                indirect damages.
              </li>
              <li>
                <strong>Fair use:</strong> Access may be limited if bots or systems sending
                excessive requests are detected.
              </li>
              <li>
                <strong>Content integrity:</strong> Uploading documents that infringe
                copyright is prohibited. Access to reported items will be blocked.
              </li>
              <li>
                <strong>Updates:</strong> These terms are updated regularly and announcements
                are shared through the links in the footer.
              </li>
            </ol>
            <p style={paragraphStyle}>
              The service may be briefly unavailable during maintenance. In these cases, your
              current files remain in the browser and your workflow stays intact; refresh the
              page to pick up where you left off.
            </p>
          </section>
        );
      case "faq":
        return (
          <section style={cardStyle} aria-label="Frequently asked questions page">
            <h2 style={headingStyle}>Frequently Asked Questions</h2>
            <p style={paragraphStyle}>
              Here is a detailed overview of the most common questions people ask about PDFFreeTool. These answers
              focus on the merge tool but also cover how we handle your data and how the experience works across
              devices. If you need more help, visit the Contact page and share your scenario so we can expand this
              guide further.
            </p>
            <h3 style={{ ...headingStyle, fontSize: "18px", marginBottom: "8px" }}>
              Merge PDF specifics
            </h3>
            <div style={{ ...paragraphStyle, marginBottom: "0" }}>
              <p style={{ marginTop: 0, marginBottom: "10px" }}>
                <strong>Is this PDF merge tool free?</strong>
                <br />
                Yes. You can merge your PDF files for free with no account or subscription required. There are no
                watermarks or hidden limits beyond the standard upload caps shown on the homepage.
              </p>
              <p style={{ marginTop: 0, marginBottom: "10px" }}>
                <strong>Is it safe to upload my documents?</strong>
                <br />
                Your files are processed in memory on the server and are not stored permanently. We do not keep a copy
                of your merged PDF, and temporary processing buffers are cleared automatically after the download is
                prepared.
              </p>
              <p style={{ marginTop: 0, marginBottom: "10px" }}>
                <strong>Does this work on mobile?</strong>
                <br />
                Yes. The tool works in any modern browser, including mobile browsers on Android and iOS. You can drag to
                reorder on touchscreens, and the interface adapts to small screens so you do not lose visibility of your
                file list.
              </p>
            </div>
            <h3 style={{ ...headingStyle, fontSize: "18px", marginBottom: "8px" }}>
              Extra tips and troubleshooting
            </h3>
            <ul style={listStyle}>
              <li>
                <strong>Upload guidance:</strong> Keep individual files under the size limit shown on the tool and avoid
                encrypted PDFs when possible; password-protected files may need to be unlocked before merging.
              </li>
              <li>
                <strong>Ordering pages:</strong> Use the drag handle on each file row to set the exact order you want
                before merging. If you upload more than once, newer files will appear at the end of the list.
              </li>
              <li>
                <strong>Slow connections:</strong> On weaker networks, try compressing large PDFs first to speed up the
                upload step. You can always merge and then compress again if needed.
              </li>
              <li>
                <strong>Sharing results:</strong> After merging, rename the downloaded file with a clear version number
                (for example, <em>Project-Proposal-v2.pdf</em>) so teammates know which file to open.
              </li>
            </ul>
            <p style={paragraphStyle}>
              We continue to expand this FAQ based on feedback. If there is a question we have not covered yet, send us a
              short note with the tool you used, your device type, and what you were trying to achieve. We will use that
              information to improve this help page for everyone.
            </p>
          </section>
        );
      case "about":
        return (
          <section style={cardStyle} aria-label="About page">
            <h2 style={headingStyle}>About</h2>
            <p style={paragraphStyle}>
              PDFFreeTool is a lightweight web app that unites PDF and image editing tools
              under one roof. Our design principle is to keep technical details in the
              background while guiding users with clear steps.
            </p>
            <p style={paragraphStyle}>
              The product is built with React, Vite, and fast caching strategies. All tools
              live on a single page, and the info boxes explain why you should choose each
              tool. The content team prepared SEO-friendly headings and AdSense-ready
              guidance copy to inform visitors before they use every tool.
            </p>
            <ul style={listStyle}>
              <li>Secure processing flows that keep your files on your device.</li>
              <li>Ready-made content structure and guide copy for multilingual support.</li>
              <li>A simple contact section to reach the support team quickly.</li>
            </ul>
            <p style={paragraphStyle}>
              Our priority is for everyone to boost productivity with free and accessible
              tools. In line with this vision, we regularly collect new tool ideas and review
              user feedback to improve the existing experience.
            </p>
          </section>
        );
      case "contact":
        return (
          <section style={cardStyle} aria-label="Contact page">
            <h2 style={headingStyle}>Contact</h2>
            <p style={paragraphStyle}>
              Feel free to reach us with your questions, feedback, or suggestions for new
              tools. The guide below explains what to mention in your message and helps us
              speed up support.
            </p>
            <ul style={listStyle}>
              <li>
                <strong>Technical support:</strong> Include which tool you used, the file
                size, and any error message you saw so we can reproduce the issue faster.
              </li>
              <li>
                <strong>Feature request:</strong> Describe new tools or shortcuts you think
                would improve your workflow. Adding a use case helps us prioritize.
              </li>
              <li>
                <strong>Collaboration:</strong> For integration or content partnership
                proposals, share your company name, contact details, and expectations.
              </li>
            </ul>
            <p style={paragraphStyle}>
              You can also email <strong>support@pdffreetool.com</strong> or reach us
              through our social media accounts. We try to respond to all messages as
              quickly as possible.
            </p>
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

  const activeTool = TOOL_MENU.find((tool) => tool.id === activeTab);

  const renderThemeToggle = () => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "6px 8px",
        borderRadius: "12px",
        border: "1px solid #e5e7eb",
        background: "#ffffff",
        boxShadow: "0 6px 16px rgba(15,23,42,0.05)",
      }}
    >
      <span style={{ fontSize: "12px", color: "#374151", fontWeight: 600 }}>
        Theme
      </span>
      <button
        type="button"
        onClick={() => setThemeMode("light")}
        style={{
          padding: "6px 10px",
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
        Light
      </button>
      <button
        type="button"
        onClick={() => setThemeMode("dark")}
        style={{
          padding: "6px 10px",
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
        Dark
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
          padding: "6px 8px",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          background: "#ffffff",
          boxShadow: "0 6px 16px rgba(15,23,42,0.05)",
          position: "relative",
        }}
      >
        <label style={{ fontSize: "12px", color: "#374151", fontWeight: 600 }}>
          Language
        </label>
        <button
          type="button"
          onClick={() => setLanguageMenuOpen((prev) => !prev)}
          aria-haspopup="listbox"
          aria-expanded={languageMenuOpen}
          style={{
            padding: "8px 10px",
            borderRadius: "10px",
            border: "1px solid #e5e7eb",
            background: "white",
            color: "#111827",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(15,23,42,0.05)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            minWidth: "150px",
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
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 700,
                color: "#6b7280",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              {selectedLanguage.code}
            </span>
            <span style={{ fontWeight: 700, color: "#111827" }}>{selectedLanguage.label}</span>
          </span>
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
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        color: "#6b7280",
                        letterSpacing: "0.5px",
                        textTransform: "uppercase",
                      }}
                    >
                      {option.code}
                    </span>
                    <span>{option.label}</span>
                  </span>
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

  const renderToolDetails = () => {
    const detail = TOOL_DETAILS[activeTab];

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
              PDFFreeTool Studio
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
              Flexible PDF & Image studio
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
              Pick any PDF or image tool from one menu—merge, split, convert, or optimize. Every tool comes
              with a clear description and practical tips so you can finish faster.
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
            {renderNavLink("home", "Home")}
            {renderNavLink("blog", "Guide & Tips")}
            {renderNavLink("faq", "FAQ")}
            {renderNavLink("privacy", "Privacy")}
            {renderNavLink("terms", "Terms")}
            {renderNavLink("about", "About")}
            {renderNavLink("contact", "Contact")}
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
                  Online PDF and image tools
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
                  Ad-friendly content
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
                Merge, compress, rotate, convert, and read PDFs all in one place. Our
                rich menu keeps every tool informative, user-friendly, and compliant
                with AdSense guidelines so visitors see helpful content.
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
                  ✅ Drag & drop reorder
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
                  ✅ Files processed in memory
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
                  ✅ No registration required
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
                Tool menu
              </h2>
              <p
                style={{
                  margin: 0,
                  marginTop: "4px",
                  color: "#6b7280",
                  fontSize: "13px",
                }}
              >
                Click any card to jump to a tool, read the overview, and start using it.
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
            {TOOL_MENU.map((tool) => {
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
              Select tool
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
              <option value="merge">Merge PDF</option>
              <option value="compress">Compress PDF</option>
              <option value="compressImage">Compress Image</option>
              <option value="jpgToPdf">Images to PDF</option>
              <option value="pdfToJpg">PDF to JPG</option>
              <option value="pdfToPng">PDF to PNG</option>
              <option value="split">Split PDF</option>
              <option value="deletePages">Delete PDF pages</option>
              <option value="rotatePages">Rotate PDF pages</option>
              <option value="extractPages">Extract PDF pages</option>
              <option value="pdfReader">PDF reader</option>
              <option value="pdfToWord">PDF to Word</option>
              <option value="wordToPdf">Word to PDF</option>
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
                      Merge PDFs in your browser
                    </div>
                    <h2
                      style={{
                        fontSize: "18px",
                        margin: 0,
                        marginBottom: "4px",
                        color: "#0f172a",
                      }}
                    >
                      Merge PDF files in seconds
                    </h2>
                    <p
                      style={{
                        color: "#6b7280",
                        margin: 0,
                        fontSize: "13px",
                      }}
                    >
                      Upload, reorder, and download a single merged PDF. Nothing
                      is stored on our servers.
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
                      Simple & secure
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
                    Choose PDF files
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
                    <span>Select PDFs</span>
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
                    Up to {MAX_FILES} files • Total size ≤ {MAX_TOTAL_MB} MB
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
                      Files selected:{" "}
                      <strong style={{ color: "#111827" }}>
                        {files.length}
                      </strong>
                    </div>
                    <div>
                      Total size:{" "}
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
                        Reorder files
                      </span>
                      <span>Drag to change merge order</span>
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
                            title="Drag to reorder"
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
                            title="Remove this file"
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
                    Merges this session:{" "}
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
                      Clear
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
                      {isMerging ? "Merging..." : "Merge PDFs"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === "compress" && <CompressCard />}
        {activeTab === "compressImage" && <CompressImageCard />}
        {activeTab === "jpgToPdf" && <JpgToPdfCard />}
        {activeTab === "pdfToJpg" && <PdfToJpgCard />}
        {activeTab === "pdfToPng" && <PdfToPngCard />}
        {activeTab === "split" && <SplitPdfCard />}
        {activeTab === "deletePages" && <DeletePdfPagesCard />}
        {activeTab === "rotatePages" && <RotatePdfPagesCard />}
        {activeTab === "extractPages" && <ExtractPdfPagesCard />}
        {activeTab === "pdfReader" && <PdfReaderCard />}
        {activeTab === "pdfToWord" && <PdfToWordCard />}
        {activeTab === "wordToPdf" && <WordToPdfCard />}

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
            Simple PDF &amp; image tools for everyday work
          </h2>

          <p
            style={{
              fontSize: "13px",
              color: "#4b5563",
              marginBottom: "10px",
            }}
          >
            PDFFreeTool keeps popular PDF and image actions in one place. Merge,
            compress, convert between JPG and PDF, and handle pages directly in
            your browser—no downloads, accounts, or limits.
          </p>

          <h3
            style={{
              fontSize: "16px",
              marginBottom: "6px",
              marginTop: "14px",
              color: "#111827",
            }}
          >
            What you can do
          </h3>
          <ul
            style={{
              paddingLeft: "20px",
              margin: 0,
              fontSize: "13px",
              color: "#4b5563",
            }}
          >
            <li>Merge and organize PDFs in the order you need.</li>
            <li>Compress files to share or upload without hassle.</li>
            <li>Convert seamlessly between JPG images and PDF documents.</li>
            <li>Split, rotate, or extract pages while keeping quality.</li>
          </ul>

          <h3
            style={{
              fontSize: "16px",
              marginBottom: "6px",
              marginTop: "14px",
              color: "#111827",
            }}
          >
            Why people choose it
          </h3>
          <ul
            style={{
              paddingLeft: "20px",
              margin: 0,
              fontSize: "13px",
              color: "#4b5563",
            }}
          >
            <li>Secure, in-browser processing keeps files private.</li>
            <li>Fast results without sign-ups or watermarks.</li>
            <li>Free tools that work on any modern device.</li>
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
            Why choose this free PDF merger?
          </h2>
          <ul
            style={{
              paddingLeft: "20px",
              margin: 0,
              fontSize: "13px",
              color: "#4b5563",
            }}
          >
            <li>
              <strong>Fast and simple:</strong> No complex settings or ads-heavy
              interface. Just upload, reorder, and merge.
            </li>
            <li>
              <strong>Secure:</strong> PDF files are processed directly in
              memory. We do not permanently store your documents.
            </li>
            <li>
              <strong>Browser-based:</strong> Works on Windows, macOS, Linux,
              and mobile devices with a modern browser.
            </li>
            <li>
              <strong>Free to use:</strong> No registration or account required
              to merge your PDF files.
            </li>
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
              Privacy Policy
            </button>
            <button
              onClick={() => handleNavigate("faq")}
              style={{ border: "none", background: "none", color: "#2563eb", cursor: "pointer" }}
            >
              FAQ
            </button>
            <button
              onClick={() => handleNavigate("terms")}
              style={{ border: "none", background: "none", color: "#2563eb", cursor: "pointer" }}
            >
              Terms of Service
            </button>
            <button
              onClick={() => handleNavigate("about")}
              style={{ border: "none", background: "none", color: "#2563eb", cursor: "pointer" }}
            >
              About
            </button>
            <button
              onClick={() => handleNavigate("contact")}
              style={{ border: "none", background: "none", color: "#2563eb", cursor: "pointer" }}
            >
              Contact
            </button>
          </div>
          <div>© 2025 PDFFreeTool. All rights reserved.</div>
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
