import React, { useEffect, useRef, useState } from "react";
import ToolCardShell from "./components/ToolCardShell";

const TEXT = {
  en: {
    pillLabel: "PDF reader",
    title: "Read and preview PDFs in your browser",
    description:
      "Open a PDF instantly without downloading extra apps or sending files to a server. Flip through pages, zoom from your browser, and keep everything safely on your device for offline-friendly reading.",
    upload: {
      upload: "Upload PDF",
      change: "Change PDF",
      noFile: "No file chosen",
    },
    errors: {
      pdfOnly: "Please upload a PDF file.",
    },
    previewPlaceholder: "Upload a PDF to start reading instantly.",
    clear: "Clear",
  },
  tr: {
    pillLabel: "PDF okuyucu",
    title: "PDF'leri tarayıcıda okuyun ve ön izleyin",
    description:
      "Ek uygulama indirmeden veya dosyaları sunucuya göndermeden PDF açın. Sayfalar arasında gezin, yakınlaştırın ve her şeyi cihazınızda tutarak çevrimdışı kullanım için güvenceye alın.",
    upload: {
      upload: "PDF yükle",
      change: "PDF değiştir",
      noFile: "Dosya seçilmedi",
    },
    errors: {
      pdfOnly: "Lütfen bir PDF dosyası yükleyin.",
    },
    previewPlaceholder: "Hemen okumaya başlamak için bir PDF yükleyin.",
    clear: "Temizle",
  },
};

export default function PdfReaderCard({ language = "en" }) {
  const t = TEXT[language] || TEXT.en;
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e) => {
    setError("");
    const selected = e.target.files?.[0];
    if (!selected) {
      setFile(null);
      setPreviewUrl("");
      return;
    }

    if (selected.type !== "application/pdf") {
      setError(t.errors.pdfOnly);
      setFile(null);
      setPreviewUrl("");
      return;
    }

    const url = URL.createObjectURL(selected);
    setFile(selected);
    setPreviewUrl(url);
  };

  const handleClear = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(null);
    setPreviewUrl("");
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <ToolCardShell
      pillLabel={t.pillLabel}
      title={t.title}
      description={t.description}
      accentColor="#10b981"
      pillBackground="#ecfdf3"
    >
      <div
        style={{
          border: "1.5px dashed #d1d5db",
          borderRadius: "12px",
          padding: "16px",
          textAlign: "center",
          marginBottom: "14px",
          background:
            "linear-gradient(135deg, #ecfdf3 0%, #d1fae5 50%, #bbf7d0 100%)",
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          style={{ display: "none" }}
          id="pdf-reader-file"
        />
        <label
          htmlFor="pdf-reader-file"
          style={{
            display: "inline-flex",
            gap: "8px",
            alignItems: "center",
            justifyContent: "center",
            padding: "12px 16px",
            borderRadius: "12px",
            background: "white",
            border: "1px solid #d1d5db",
            cursor: "pointer",
            color: "#059669",
            fontWeight: 600,
            boxShadow: "0 10px 25px rgba(16,185,129,0.15)",
          }}
        >
          {file ? t.upload.change : t.upload.upload}
        </label>
        <p
          style={{
            margin: "10px 0 0",
            fontSize: "12px",
            color: "#6b7280",
          }}
        >
          {file ? file.name : t.upload.noFile}
        </p>
      </div>

      {error && (
        <div
          role="alert"
          style={{
            background: "#fef2f2",
            color: "#b91c1c",
            padding: "10px 12px",
            borderRadius: "10px",
            fontSize: "12px",
            marginBottom: "12px",
          }}
        >
          {error}
        </div>
      )}

      {previewUrl ? (
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            overflow: "hidden",
            background: "#f8fafc",
            maxHeight: "480px",
          }}
        >
          <iframe
            title="PDF preview"
            src={previewUrl}
            style={{ width: "100%", height: "480px", border: "none" }}
          />
        </div>
      ) : (
        <div
          style={{
            border: "1px dashed #e5e7eb",
            borderRadius: "12px",
            padding: "16px",
            background: "#f8fafc",
            color: "#6b7280",
            fontSize: "13px",
            textAlign: "center",
          }}
        >
          {t.previewPlaceholder}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "12px" }}>
        <button
          onClick={handleClear}
          style={{
            padding: "10px 14px",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            background: "white",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "12px",
            color: "#374151",
            minWidth: "90px",
          }}
        >
          {t.clear}
        </button>
      </div>
    </ToolCardShell>
  );
}
