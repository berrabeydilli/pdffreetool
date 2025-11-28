import React, { useRef, useState } from "react";

const pdfLibPromise = import(
  "https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/+esm"
);

const TEXT = {
  en: {
    ariaLabel: "Word to PDF tool",
    badge: "Convert .docx to PDF",
    title: "Turn Word into a PDF",
    description: "Text is extracted locally and written into a fresh PDF document.",
    choosePrompt: "Choose a Word document",
    selectLabel: "Select Word file",
    selectedLabel: "Selected:",
    clear: "Clear",
    convert: "Convert to PDF",
    converting: "Converting...",
    noTextFound: "(No extractable text found)",
    errors: {
      docOnly: "Please select a .docx or .doc file.",
      noneSelected: "Please select a Word file to convert.",
      generic: "Something went wrong.",
      convertFailed: "Failed to convert Word to PDF.",
    },
  },
  tr: {
    ariaLabel: "Word'den PDF'ye aracı",
    badge: "DOCX'i PDF'e dönüştür",
    title: "Word dosyasını PDF'e çevir",
    description: "Metin cihazınızda çıkarılır ve yeni bir PDF'e yazılır.",
    choosePrompt: "Bir Word dosyası seçin",
    selectLabel: "Word dosyası seç",
    selectedLabel: "Seçilen:",
    clear: "Temizle",
    convert: "PDF'e dönüştür",
    converting: "Dönüştürülüyor...",
    noTextFound: "(Aktarılabilir metin bulunamadı)",
    errors: {
      docOnly: "Lütfen .docx veya .doc dosyası seçin.",
      noneSelected: "Lütfen PDF'e dönüştürülecek bir Word dosyası seçin.",
      generic: "Bir şeyler yanlış gitti.",
      convertFailed: "Word'den PDF'e dönüştürme başarısız oldu.",
    },
  },
  de: {
    ariaLabel: "Word-zu-PDF-Werkzeug",
    badge: ".docx in PDF umwandeln",
    title: "Word-Dokument in PDF konvertieren",
    description: "Text wird lokal extrahiert und in ein neues PDF geschrieben.",
    choosePrompt: "Ein Word-Dokument wählen",
    selectLabel: "Word-Datei auswählen",
    selectedLabel: "Ausgewählt:",
    clear: "Leeren",
    convert: "In PDF umwandeln",
    converting: "Wird konvertiert...",
    noTextFound: "(Kein extrahierbarer Text gefunden)",
    errors: {
      docOnly: "Bitte eine .docx- oder .doc-Datei auswählen.",
      noneSelected: "Bitte eine Word-Datei zur Konvertierung wählen.",
      generic: "Etwas ist schiefgelaufen.",
      convertFailed: "Word konnte nicht in PDF umgewandelt werden.",
    },
  },
};

const loadMammoth = () =>
  new Promise((resolve, reject) => {
    if (window.mammoth) return resolve(window.mammoth);
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/mammoth@1.8.0/mammoth.browser.min.js";
    script.onload = () => resolve(window.mammoth);
    script.onerror = reject;
    document.body.appendChild(script);
  });

export default function WordToPdfCard({ language = "en" }) {
  const t = TEXT[language] || TEXT.en;
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setError("");
    const selected = e.target.files?.[0];

    if (!selected) {
      setFile(null);
      return;
    }

    if (
      selected.type !==
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" &&
      selected.type !== "application/msword"
    ) {
      setError(t.errors.docOnly);
      setFile(null);
      return;
    }

    setFile(selected);
  };

  const reset = () => {
    setFile(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const wrapText = (text, maxChars) => {
    const words = text.split(/\s+/);
    const lines = [];
    let current = "";

    words.forEach((word) => {
      if ((current + " " + word).trim().length > maxChars) {
        lines.push(current.trim());
        current = word;
      } else {
        current = (current + " " + word).trim();
      }
    });

    if (current) lines.push(current.trim());
    return lines;
  };

  const handleConvert = async () => {
    setError("");
    if (!file) {
      setError(t.errors.noneSelected);
      return;
    }

    setIsProcessing(true);
    try {
      const mammoth = await loadMammoth();
      const { PDFDocument, StandardFonts } = await pdfLibPromise;

      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      const text = (result.value || "").trim() || t.noTextFound;

      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      let page = pdfDoc.addPage();
      const { width, height } = page.getSize();
      const fontSize = 12;
      const margin = 50;
      let y = height - margin;

      wrapText(text, 90).forEach((line) => {
        if (y < margin) {
          page = pdfDoc.addPage();
          y = page.getSize().height - margin;
        }
        page.drawText(line, {
          x: margin,
          y,
          size: fontSize,
          font,
          color: undefined,
        });
        y -= fontSize + 4;
      });

      const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.[^.]+$/, "") + ".pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError(err.message || t.errors.convertFailed);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section
      aria-label={t.ariaLabel}
      style={{ marginBottom: "28px", marginTop: "24px" }}
    >
      <div style={{ display: "flex", justifyContent: "center" }}>
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
          <div style={{ marginBottom: "14px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "2px 8px",
                borderRadius: "999px",
              background: "#ecfdf3",
              fontSize: "11px",
              color: "#166534",
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
            {t.badge}
          </div>
            <h2 style={{ fontSize: "18px", margin: 0, marginBottom: "4px", color: "#0f172a" }}>
              {t.title}
            </h2>
            <p style={{ color: "#6b7280", margin: 0, fontSize: "13px" }}>
              {t.description}
            </p>
          </div>

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
            <div style={{ fontSize: "13px", marginBottom: "8px", color: "#111827", fontWeight: 500 }}>
              {t.choosePrompt}
            </div>
            <label
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                borderRadius: "999px",
                background: "linear-gradient(90deg, #2563eb, #60a5fa)",
                color: "white",
                fontSize: "12px",
                cursor: "pointer",
                boxShadow: "0 8px 18px rgba(37, 99, 235, 0.28)",
              }}
            >
              <span style={{ fontSize: "14px" }}>📝</span>
              <span>{t.selectLabel}</span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleChange}
                style={{ display: "none" }}
              />
            </label>
            {file && (
              <div style={{ fontSize: "12px", color: "#4b5563", marginTop: "10px" }}>
                {t.selectedLabel} {file.name}
              </div>
            )}
          </div>

          {error && (
            <div
              role="alert"
              style={{
                marginBottom: "12px",
                padding: "10px",
                borderRadius: "10px",
                background: "#fef2f2",
                color: "#b91c1c",
                fontSize: "12px",
              }}
            >
              {error}
            </div>
          )}

          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={reset}
              style={{
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1px solid #e5e7eb",
                background: "white",
              cursor: "pointer",
              fontWeight: 600,
              color: "#111827",
            }}
          >
            {t.clear}
          </button>
          <button
            type="button"
            onClick={handleConvert}
            disabled={isProcessing}
              style={{
                padding: "10px 16px",
                borderRadius: "10px",
                border: "none",
                background: "linear-gradient(90deg, #2563eb, #60a5fa)",
                color: "white",
                cursor: "pointer",
                fontWeight: 700,
                boxShadow: "0 12px 26px rgba(37, 99, 235, 0.28)",
                opacity: isProcessing ? 0.7 : 1,
              }}
            >
              {isProcessing ? t.converting : t.convert}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
