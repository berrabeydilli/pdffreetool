import React, { useRef, useState } from "react";
import ToolCardShell from "./components/ToolCardShell";
import { API_URL } from "./apiConfig";

const TEXT = {
  en: {
    pillLabel: "Extract pages",
    title: "Save specific pages as a new PDF",
    description:
      "Type the pages you need (e.g., 1,2,7) to carve out a smaller, focused PDF. Ideal for sharing only the important chapters or receipts, it keeps everything local to your browser and returns a fresh download in seconds.",
    upload: {
      change: "Change PDF",
      upload: "Upload PDF",
      none: "No file chosen",
    },
    inputs: {
      placeholder: "Pages to extract (e.g., 1-3,5)",
    },
    errors: {
      pdfOnly: "Please upload a PDF file.",
      missingFile: "Please choose a PDF file.",
      missingPages: "Enter the page numbers to extract.",
      generic: "Something went wrong.",
      failed: "Failed to extract pages.",
    },
    buttons: {
      clear: "Clear",
      extract: "Extract pages",
      extracting: "Working...",
    },
  },
  tr: {
    pillLabel: "Sayfaları çıkar",
    title: "Belirli sayfaları yeni bir PDF olarak kaydedin",
    description:
      "Gereken sayfaları yazın (örn. 1,2,7) ve daha küçük, odaklı bir PDF oluşturun. Önemli bölümleri veya fişleri paylaşmak için idealdir; her şey tarayıcınızda kalır ve saniyeler içinde yeni indirme hazır olur.",
    upload: {
      change: "PDF değiştir",
      upload: "PDF yükle",
      none: "Dosya seçilmedi",
    },
    inputs: {
      placeholder: "Çıkarılacak sayfalar (örn. 1-3,5)",
    },
    errors: {
      pdfOnly: "Lütfen bir PDF dosyası yükleyin.",
      missingFile: "Lütfen bir PDF dosyası seçin.",
      missingPages: "Çıkarılacak sayfa numaralarını girin.",
      generic: "Bir şeyler yanlış gitti.",
      failed: "Sayfalar çıkarılamadı.",
    },
    buttons: {
      clear: "Temizle",
      extract: "Sayfaları çıkar",
      extracting: "Çalışıyor...",
    },
  },
};

export default function ExtractPdfPagesCard({ language = "en" }) {
  const t = TEXT[language] || TEXT.en;
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
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

  const handleClear = () => {
    setFile(null);
    setPages("");
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleExtract = async () => {
    setError("");
    if (!file) {
      setError(t.errors.missingFile);
      return;
    }

    if (!pages.trim()) {
      setError(t.errors.missingPages);
      return;
    }

    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("pages", pages);

      const res = await fetch(`${API_URL}/extract-pages`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || t.errors.generic);
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "extracted-pages.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError(err.message || t.errors.failed);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolCardShell
      pillLabel={t.pillLabel}
      title={t.title}
      description={t.description}
      accentColor="#f59e0b"
      pillBackground="#fffbeb"
    >
      <div
        style={{
          border: "1.5px dashed #d1d5db",
          borderRadius: "12px",
          padding: "16px",
          textAlign: "center",
          marginBottom: "14px",
          background:
            "linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #fde68a 100%)",
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          style={{ display: "none" }}
          id="extract-pages-file"
        />
        <label
          htmlFor="extract-pages-file"
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
            color: "#d97706",
            fontWeight: 600,
            boxShadow: "0 10px 25px rgba(245,158,11,0.15)",
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
          {file ? file.name : t.upload.none}
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <input
          type="text"
          placeholder={t.inputs.placeholder}
          value={pages}
          onChange={(e) => setPages(e.target.value)}
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "12px",
            border: "1px solid #d1d5db",
            fontSize: "13px",
            outline: "none",
            background: "#f8fafc",
          }}
        />
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

      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
        <button
          onClick={handleClear}
          disabled={isProcessing && !error}
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
          {t.buttons.clear}
        </button>
        <button
          onClick={handleExtract}
          disabled={isProcessing}
          style={{
            padding: "10px 16px",
            borderRadius: "12px",
            border: "none",
            background: isProcessing ? "#fcd34d" : "#f59e0b",
            color: "white",
            cursor: isProcessing ? "not-allowed" : "pointer",
            fontWeight: 700,
            fontSize: "12px",
            minWidth: "140px",
            boxShadow: isProcessing
              ? "none"
              : "0 10px 25px rgba(245,158,11,0.30)",
          }}
        >
          {isProcessing ? t.buttons.extracting : t.buttons.extract}
        </button>
      </div>
    </ToolCardShell>
  );
}
