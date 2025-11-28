import React, { useRef, useState } from "react";

const TEXT = {
  en: {
    ariaLabel: "PDF to Word tool",
    badge: "Convert PDF to DOCX",
    title: "Turn PDFs into editable Word files",
    description:
      "Upload a PDF and download a DOCX you can update in Word or Google Docs.",
    choosePrompt: "Select a PDF to convert",
    selectLabel: "Choose PDF",
    selectedLabel: "Selected:",
    clear: "Clear",
    actions: {
      convert: "Convert to DOCX",
      converting: "Converting...",
    },
    errors: {
      pdfOnly: "Please choose a PDF file.",
      noneSelected: "Please select a PDF to convert.",
      failed: "Failed to convert PDF to Word.",
    },
  },
  tr: {
    ariaLabel: "PDF'den Word'e araç",
    badge: "PDF'yi DOCX'e dönüştür",
    title: "PDF'leri düzenlenebilir Word dosyalarına çevirin",
    description:
      "Bir PDF yükleyin ve Word veya Google Docs'ta güncelleyebileceğiniz DOCX olarak indirin.",
    choosePrompt: "Dönüştürülecek PDF'i seçin",
    selectLabel: "PDF seç",
    selectedLabel: "Seçilen:",
    clear: "Temizle",
    actions: {
      convert: "DOCX'e dönüştür",
      converting: "Dönüştürülüyor...",
    },
    errors: {
      pdfOnly: "Lütfen bir PDF dosyası seçin.",
      noneSelected: "Lütfen dönüştürmek için bir PDF seçin.",
      failed: "PDF, Word'e dönüştürülemedi.",
    },
  },
};

const pdfjsPromise = import(
  "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.7.76/+esm"
).then((mod) => {
  mod.GlobalWorkerOptions.workerSrc =
    "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.7.76/build/pdf.worker.min.mjs";
  return mod;
});

const docxPromise = import(
  "https://cdn.jsdelivr.net/npm/docx@8.5.0/+esm"
);

export default function PdfToWordCard({ language = "en" }) {
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

    if (selected.type !== "application/pdf") {
      setError(t.errors.pdfOnly);
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

  const extractText = async (pdfjsLib, pdfFile) => {
    const data = await pdfFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data }).promise;
    let text = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      const pageText = content.items.map((item) => item.str).join(" ");
      text += pageText + "\n\n";
    }

    return text.trim() || "(No extractable text found)";
  };

  const handleConvert = async () => {
    setError("");
    if (!file) {
      setError(t.errors.noneSelected);
      return;
    }

    setIsProcessing(true);
    try {
      const pdfjsLib = await pdfjsPromise;
      const { Document, Packer, Paragraph } = await docxPromise;

      const text = await extractText(pdfjsLib, file);
      const paragraphs = text.split(/\n+/).map((line) => new Paragraph(line));
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: paragraphs,
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.[^.]+$/, "") + ".docx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError(err.message || t.errors.failed);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section aria-label={t.ariaLabel} style={{ marginBottom: "28px", marginTop: "24px" }}>
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
                background: "#e0f2fe",
                fontSize: "11px",
                color: "#075985",
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
                  background: "#0ea5e9",
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
              <span style={{ fontSize: "14px" }}>📄</span>
              <span>{t.selectLabel}</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
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
              {isProcessing ? t.actions.converting : t.actions.convert}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
