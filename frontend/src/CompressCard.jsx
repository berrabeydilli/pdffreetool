import React, { useState, useRef } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const TEXT = {
  en: {
    ariaLabel: "Compress PDF tool",
    badge: "Compress PDF file size",
    title: "Compress PDF files online",
    description:
      "Upload a PDF and download a smaller, optimized version. Great for email attachments and uploads.",
    choosePrompt: "Choose a PDF to compress",
    selectLabel: "Select PDF",
    selectedFileLabel: "Selected",
    selectedFileNote: "Selected file:",
    noFile: "No PDF selected",
    selectedLabel: "Files selected:",
    totalSizeLabel: "Total size:",
    sizeLabel: "Size:",
    singleFileNote: "Only one PDF file at a time.",
    clear: "Clear",
    compress: "Compress PDF",
    compressing: "Compressing...",
    errors: {
      pdfOnly: "Please select PDF files only.",
      noneSelected: "Please select a PDF file to compress.",
      generic: "Something went wrong.",
      failed: "Failed to compress PDF.",
    },
  },
  tr: {
    ariaLabel: "PDF sıkıştırma aracı",
    badge: "PDF dosya boyutunu küçült",
    title: "PDF'leri çevrimiçi sıkıştır",
    description:
      "Bir PDF yükleyin ve daha küçük, optimize edilmiş halini indirin. E-posta ekleri ve yüklemeler için idealdir.",
    choosePrompt: "Sıkıştırmak için bir PDF seçin",
    selectLabel: "PDF seç",
    selectedFileLabel: "Seçilen",
    selectedFileNote: "Seçilen dosya:",
    noFile: "PDF seçilmedi",
    selectedLabel: "Seçilen dosya sayısı:",
    totalSizeLabel: "Toplam boyut:",
    sizeLabel: "Boyut:",
    singleFileNote: "Tek seferde yalnızca bir PDF seçebilirsiniz.",
    clear: "Temizle",
    compress: "PDF'yi sıkıştır",
    compressing: "Sıkıştırılıyor...",
    errors: {
      pdfOnly: "Lütfen sadece PDF dosyaları seçin.",
      noneSelected: "Lütfen sıkıştırmak için bir PDF dosyası seçin.",
      generic: "Bir şeyler yanlış gitti.",
      failed: "PDF sıkıştırma başarısız oldu.",
    },
  },
};

export default function CompressCard({ language = "en" }) {
  const t = TEXT[language] || TEXT.en;
  const [file, setFile] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);
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
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCompress = async () => {
    setError("");
    if (!file) {
      setError(t.errors.noneSelected);
      return;
    }

    setIsCompressing(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API_URL}/compress`, {
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
      a.download = "compressed.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError(err.message || t.errors.failed);
    } finally {
      setIsCompressing(false);
    }
  };

  return (
    <section
      aria-label={t.ariaLabel}
      style={{
        marginBottom: "28px",
        marginTop: "24px",
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
          {/* Header */}
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
                  background: "#ecfdf5",
                  fontSize: "11px",
                  color: "#15803d",
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
              <h2
                style={{
                  fontSize: "18px",
                  margin: 0,
                  marginBottom: "4px",
                  color: "#0f172a",
                }}
              >
                {t.title}
              </h2>
              <p
                style={{
                  color: "#6b7280",
                  margin: 0,
                  fontSize: "13px",
                }}
              >
                {t.description}
              </p>
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
              {t.choosePrompt}
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
              <span style={{ fontSize: "14px" }}>📄</span>
              <span>{t.selectLabel}</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
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
              {t.singleFileNote}
            </p>
          </div>

          {file && (
            <div
              style={{
                marginBottom: "10px",
                fontSize: "12px",
                color: "#4b5563",
                display: "flex",
                justifyContent: "space-between",
                gap: "8px",
              }}
            >
              <div>
                {t.selectedFileNote}{" "}
                <strong style={{ color: "#111827" }}>{file.name}</strong>
              </div>
              <div>
                {t.sizeLabel}{" "}
                <strong style={{ color: "#111827" }}>
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </strong>
              </div>
            </div>
          )}

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

          <div
            style={{
              display: "flex",
              gap: "8px",
              justifyContent: "flex-end",
              marginTop: "8px",
            }}
          >
            <button
              onClick={handleClear}
              disabled={isCompressing || !file}
              style={{
                padding: "8px 12px",
                borderRadius: "999px",
                border: "1px solid #e5e7eb",
                background: "white",
                cursor: isCompressing || !file ? "not-allowed" : "pointer",
                fontSize: "12px",
                color: "#374151",
                minWidth: "80px",
              }}
            >
              {t.clear}
            </button>
            <button
              onClick={handleCompress}
              disabled={isCompressing || !file}
              style={{
                padding: "8px 16px",
                borderRadius: "999px",
                border: "none",
                background: isCompressing || !file ? "#9ca3af" : "#16a34a",
                color: "white",
                cursor: isCompressing || !file ? "not-allowed" : "pointer",
                fontSize: "12px",
                fontWeight: 500,
                minWidth: "140px",
                boxShadow:
                  isCompressing || !file
                    ? "none"
                    : "0 10px 25px rgba(22,163,74,0.4)",
              }}
            >
              {isCompressing ? t.compressing : t.compress}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
