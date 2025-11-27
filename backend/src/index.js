import express from "express";
import cors from "cors";
import multer from "multer";
import { PDFDocument, degrees } from "pdf-lib";

const app = express();
const PORT = process.env.PORT || 4000;

// CORS - şimdilik herkese açık
app.use(cors());

// Multer - memory storage
const upload = multer({ storage: multer.memoryStorage() });

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Split PDF into individual pages (returned as base64 strings)
app.post("/split", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({ error: "Only PDF files are supported" });
    }

    const originalPdf = await PDFDocument.load(req.file.buffer);
    const responses = [];

    for (const pageIndex of originalPdf.getPageIndices()) {
      const singleDoc = await PDFDocument.create();
      const [copiedPage] = await singleDoc.copyPages(originalPdf, [pageIndex]);
      singleDoc.addPage(copiedPage);
      const bytes = await singleDoc.save({ useObjectStreams: true });

      responses.push({
        name: `page-${pageIndex + 1}.pdf`,
        data: Buffer.from(bytes).toString("base64"),
      });
    }

    res.json({ files: responses });
  } catch (err) {
    console.error("Split error:", err);
    res.status(500).json({ error: "Failed to split PDF" });
  }
});

// --- EXISTING: MERGE ---
app.post("/merge", upload.array("files"), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const mergedPdf = await PDFDocument.create();

    for (const file of req.files) {
      const pdf = await PDFDocument.load(file.buffer);
      const copiedPages = await mergedPdf.copyPages(
        pdf,
        pdf.getPageIndices()
      );
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedPdfBytes = await mergedPdf.save({ useObjectStreams: true });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=merged.pdf"
    );
    res.send(Buffer.from(mergedPdfBytes));
  } catch (err) {
    console.error("Merge error:", err);
    res.status(500).json({ error: "Failed to merge PDFs" });
  }
});

// --- NEW: COMPRESS ---
app.post("/compress", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // pdf-lib ile “optimize edilmiş” yeniden kaydetme
    const pdfDoc = await PDFDocument.load(req.file.buffer);

    // Bu gerçek bir "heavy" sıkıştırma değil,
    // ama çoğu durumda boyutu biraz düşürür (object stream vb.)
    const compressedPdfBytes = await pdfDoc.save({
      useObjectStreams: true,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=compressed.pdf"
    );
    res.send(Buffer.from(compressedPdfBytes));
  } catch (err) {
    console.error("Compress error:", err);
    res.status(500).json({ error: "Failed to compress PDF" });
  }
});

// --- NEW: JPG/PNG TO PDF ---
app.post("/jpg-to-pdf", upload.array("images"), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No images uploaded" });
    }

    const invalidFile = req.files.find(
      (file) =>
        file.mimetype !== "image/jpeg" &&
        file.mimetype !== "image/jpg" &&
        file.mimetype !== "image/png"
    );

    if (invalidFile) {
      return res
        .status(400)
        .json({ error: "Only JPG or PNG images are supported" });
    }

    const pdfDoc = await PDFDocument.create();

    for (const file of req.files) {
      const image =
        file.mimetype === "image/png"
          ? await pdfDoc.embedPng(file.buffer)
          : await pdfDoc.embedJpg(file.buffer);

      const { width, height } = image.scale(1);
      const page = pdfDoc.addPage([width, height]);
      page.drawImage(image, {
        x: 0,
        y: 0,
        width,
        height,
      });
    }

    const pdfBytes = await pdfDoc.save({ useObjectStreams: true });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=images.pdf");
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error("JPG to PDF error:", err);
    res.status(500).json({ error: "Failed to convert images to PDF" });
  }
});

// --- NEW: DELETE PAGES ---
app.post("/delete-pages", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const pageInput = (req.body.pages || "")
      .split(",")
      .map((p) => parseInt(p.trim(), 10))
      .filter((p) => !isNaN(p));

    if (!pageInput.length) {
      return res
        .status(400)
        .json({ error: "Please provide page numbers to delete." });
    }

    const pdfDoc = await PDFDocument.load(req.file.buffer);
    const totalPages = pdfDoc.getPageCount();
    const deleteSet = new Set(
      pageInput.filter((n) => n >= 1 && n <= totalPages).map((n) => n - 1)
    );

    if (!deleteSet.size) {
      return res.status(400).json({ error: "No valid pages to delete." });
    }

    const resultDoc = await PDFDocument.create();
    const keepPages = pdfDoc
      .getPageIndices()
      .filter((idx) => !deleteSet.has(idx));

    if (!keepPages.length) {
      return res
        .status(400)
        .json({ error: "Cannot delete all pages from the PDF." });
    }

    const copiedPages = await resultDoc.copyPages(pdfDoc, keepPages);
    copiedPages.forEach((page) => resultDoc.addPage(page));

    const bytes = await resultDoc.save({ useObjectStreams: true });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=pages-removed.pdf"
    );
    res.send(Buffer.from(bytes));
  } catch (err) {
    console.error("Delete pages error:", err);
    res.status(500).json({ error: "Failed to delete pages" });
  }
});

// --- NEW: ROTATE PAGES ---
app.post("/rotate-pages", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const angle = parseInt(req.body.angle, 10) || 90;
    const validAngles = new Set([90, 180, 270]);
    if (!validAngles.has(angle)) {
      return res
        .status(400)
        .json({ error: "Angle must be 90, 180, or 270 degrees." });
    }

    const pageInput = (req.body.pages || "")
      .split(",")
      .map((p) => parseInt(p.trim(), 10))
      .filter((p) => !isNaN(p));

    const pdfDoc = await PDFDocument.load(req.file.buffer);
    const totalPages = pdfDoc.getPageCount();
    const pageSet = new Set(
      pageInput
        .filter((n) => n >= 1 && n <= totalPages)
        .map((n) => n - 1)
    );

    pdfDoc.getPages().forEach((page, idx) => {
      if (!pageSet.size || pageSet.has(idx)) {
        page.setRotation(degrees(angle));
      }
    });

    const bytes = await pdfDoc.save({ useObjectStreams: true });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=rotated.pdf"
    );
    res.send(Buffer.from(bytes));
  } catch (err) {
    console.error("Rotate pages error:", err);
    res.status(500).json({ error: "Failed to rotate pages" });
  }
});

// --- NEW: EXTRACT PAGES ---
app.post("/extract-pages", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const pageInput = (req.body.pages || "")
      .split(",")
      .map((p) => parseInt(p.trim(), 10))
      .filter((p) => !isNaN(p));

    if (!pageInput.length) {
      return res
        .status(400)
        .json({ error: "Please provide page numbers to extract." });
    }

    const pdfDoc = await PDFDocument.load(req.file.buffer);
    const totalPages = pdfDoc.getPageCount();
    const validPages = pageInput
      .filter((n) => n >= 1 && n <= totalPages)
      .map((n) => n - 1);

    if (!validPages.length) {
      return res.status(400).json({ error: "No valid pages to extract." });
    }

    const resultDoc = await PDFDocument.create();
    const copiedPages = await resultDoc.copyPages(pdfDoc, validPages);
    copiedPages.forEach((page) => resultDoc.addPage(page));

    const bytes = await resultDoc.save({ useObjectStreams: true });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=extracted-pages.pdf"
    );
    res.send(Buffer.from(bytes));
  } catch (err) {
    console.error("Extract pages error:", err);
    res.status(500).json({ error: "Failed to extract pages" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
