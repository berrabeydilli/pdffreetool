import express from "express";
import cors from "cors";
import multer from "multer";
import { PDFDocument } from "pdf-lib";

const app = express();
const PORT = process.env.PORT || 4000;

// CORS ayarları – geliştirmede frontend için:
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

// Dosyaları memory'de tutacağız
const upload = multer({ storage: multer.memoryStorage() });

// Sağlık kontrolü
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// PDF merge endpoint'i
app.post("/merge", upload.array("files"), async (req, res) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "En az bir PDF yüklemelisin." });
    }

    // Yeni bir PDF dokümanı oluştur
    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
      // Her PDF'yi al
      const pdf = await PDFDocument.load(file.buffer);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());

      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedPdfBytes = await mergedPdf.save();

    // Response header
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="merged.pdf"'
    );

    return res.send(Buffer.from(mergedPdfBytes));
  } catch (err) {
    console.error("Merge error:", err);
    return res
      .status(500)
      .json({ error: "PDF birleştirme sırasında hata oluştu." });
  }
});

app.listen(PORT, () => {
  console.log(`PDF merge backend ${PORT} portunda çalışıyor`);
});
