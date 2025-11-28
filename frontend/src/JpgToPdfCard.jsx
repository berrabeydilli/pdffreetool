import React, { useRef, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
const MAX_FILES = 10;
const MAX_TOTAL_MB = 50;

const TEXT = {
  en: {
    ariaLabel: "JPG to PDF tool",
    badge: "Convert JPG to PDF",
    title: "Turn your images into a single PDF",
    description:
      "Upload JPG photos and download them as a clean, shareable PDF document.",
    uploadPrompt: "Choose JPG images to convert",
    selectCta: "Select JPGs",
    uploadAria: "Upload JPG images",
    selectedHeading: (count) => `Selected images (${count})`,
    clear: "Clear",
    remove: (name) => `Remove ${name}`,
    stats: (count, totalMb) =>
      `${count} image${count === 1 ? "" : "s"} | ${totalMb.toFixed(2)} MB total`,
    actions: {
      convert: "Convert to PDF",
      converting: "Converting...",
    },
    errors: {
      type: "Please select JPG or PNG images only.",
      maxFiles: (limit) => `You can upload up to ${limit} images.`,
      maxSize: (limit) =>
        `Total image size cannot exceed ${limit} MB. Please choose fewer or smaller files.`,
      noneSelected: "Please upload at least one image.",
      generic: "Something went wrong.",
      failed: "Failed to convert images.",
    },
  },
  tr: {
    ariaLabel: "JPG'den PDF'e araç",
    badge: "JPG'yi PDF'e dönüştür",
    title: "Görsellerinizi tek bir PDF'e çevirin",
    description:
      "JPG fotoğraflarını yükleyin, düzenli ve paylaşılabilir bir PDF olarak indirin.",
    uploadPrompt: "Dönüştürülecek JPG görselleri seçin",
    selectCta: "JPG seç",
    uploadAria: "JPG görselleri yükle",
    selectedHeading: (count) => `Seçilen görseller (${count})`,
    clear: "Temizle",
    remove: (name) => `${name} öğesini kaldır`,
    stats: (count, totalMb) => `${count} görsel | ${totalMb.toFixed(2)} MB toplam`,
    actions: {
      convert: "PDF'e dönüştür",
      converting: "Dönüştürülüyor...",
    },
    errors: {
      type: "Lütfen sadece JPG veya PNG görseller seçin.",
      maxFiles: (limit) => `En fazla ${limit} görsel yükleyebilirsiniz.`,
      maxSize: (limit) =>
        `Toplam görsel boyutu ${limit} MB'ı geçemez. Lütfen daha az veya daha küçük dosyalar seçin.`,
      noneSelected: "Lütfen en az bir görsel yükleyin.",
      generic: "Bir şeyler yanlış gitti.",
      failed: "Görseller dönüştürülemedi.",
    },
  },
};

export default function JpgToPdfCard({ language = "en" }) {
  const t = TEXT[language] || TEXT.en;
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setError("");
    const selected = Array.from(e.target.files || []);

    const supported = selected.filter(
      (file) =>
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png"
    );

    if (!supported.length) {
      setError(t.errors.type);
      setImages([]);
      return;
    }

    let combined = [...images, ...supported];

    if (combined.length > MAX_FILES) {
      setError(t.errors.maxFiles(MAX_FILES));
      combined = combined.slice(0, MAX_FILES);
    }

    const totalMB =
      combined.reduce((sum, f) => sum + f.size, 0) / 1024 / 1024 || 0;

    if (totalMB > MAX_TOTAL_MB) {
      setError(t.errors.maxSize(MAX_TOTAL_MB));
      return;
    }

    setImages(combined);
  };

  const handleClear = () => {
    setImages([]);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleConvert = async () => {
    setError("");
    if (!images.length) {
      setError(t.errors.noneSelected);
      return;
    }

    setIsConverting(true);

    try {
      const formData = new FormData();
      images.forEach((image) => {
        formData.append("images", image);
      });

      const res = await fetch(`${API_URL}/jpg-to-pdf`, {
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
      a.download = "images.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError(err.message || t.errors.failed);
    } finally {
      setIsConverting(false);
    }
  };

  const totalMB =
    images.reduce((sum, file) => sum + file.size, 0) / 1024 / 1024 || 0;

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
                  background: "#fff7ed",
                  fontSize: "11px",
                  color: "#c2410c",
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
                    background: "#f97316",
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
                "linear-gradient(135deg, #fff7ed 0%, #fff1e6 50%, #ffe2d2 100%)",
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
              {t.uploadPrompt}
            </div>
            <label
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                borderRadius: "999px",
                background: "#c2410c",
                color: "white",
                fontSize: "12px",
                cursor: "pointer",
                boxShadow: "0 8px 20px rgba(194,65,12,0.35)",
              }}
            >
              <span style={{ fontSize: "14px" }}>🖼️</span>
              <span>{t.selectCta}</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg"
                multiple
                onChange={handleFileChange}
                style={{ display: "none" }}
                aria-label={t.uploadAria}
              />
            </label>

            {images.length > 0 && (
              <div
                style={{
                  marginTop: "12px",
                  fontSize: "12px",
                  color: "#4b5563",
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "6px",
                    fontWeight: 600,
                  }}
                >
                  <span>{t.selectedHeading(images.length)}</span>
                  <button
                    onClick={handleClear}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#c2410c",
                      cursor: "pointer",
                      fontWeight: 600,
                      padding: 0,
                    }}
                  >
                    {t.clear}
                  </button>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "6px",
                    flexWrap: "wrap",
                  }}
                >
                  {images.map((img, idx) => (
                    <div
                      key={`${img.name}-${idx}`}
                      style={{
                        padding: "8px 10px",
                        borderRadius: "12px",
                        background: "#fff7ed",
                        border: "1px solid #fed7aa",
                        minWidth: "120px",
                        boxShadow: "0 6px 12px rgba(249,115,22,0.08)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: "8px",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#7c2d12",
                              fontWeight: 600,
                              wordBreak: "break-word",
                            }}
                          >
                            {img.name}
                          </div>
                          <div
                            style={{
                              fontSize: "11px",
                              color: "#9ca3af",
                            }}
                          >
                            {Math.round(img.size / 1024)} KB
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            setImages((prev) => prev.filter((_, i) => i !== idx))
                          }
                          style={{
                            background: "none",
                            border: "none",
                            color: "#c2410c",
                            cursor: "pointer",
                            fontSize: "16px",
                            lineHeight: 1,
                          }}
                          aria-label={t.remove(img.name)}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {error && (
            <div
              role="alert"
              style={{
                background: "#fef2f2",
                color: "#b91c1c",
                border: "1px solid #fecdd3",
                borderRadius: "10px",
                padding: "10px 12px",
                fontSize: "12px",
                marginBottom: "12px",
              }}
            >
              {error}
            </div>
          )}

          {/* Actions */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "8px",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={handleConvert}
              disabled={isConverting}
              style={{
                padding: "10px 16px",
                borderRadius: "999px",
                border: "none",
                background: isConverting ? "#fb923c" : "#ea580c",
                color: "white",
                fontWeight: 700,
                cursor: isConverting ? "default" : "pointer",
                boxShadow: "0 12px 30px rgba(234,88,12,0.35)",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "14px" }}>📄</span>
              {isConverting ? t.actions.converting : t.actions.convert}
            </button>

            <div
              style={{
                background: "#fff7ed",
                padding: "10px 12px",
                borderRadius: "12px",
                border: "1px solid #fed7aa",
                fontSize: "12px",
                color: "#92400e",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "7px",
                  height: "7px",
                  borderRadius: "999px",
                  background: "#f97316",
                }}
              ></span>
              <span>{t.stats(images.length, totalMB)}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
