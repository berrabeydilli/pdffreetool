import React, { useEffect, useRef, useState } from "react";

const TEXT = {
  en: {
    ariaLabel: "PDF to JPG tool",
    badge: "Convert PDF to JPG",
    title: "Export every PDF page as a crisp JPG",
    description:
      "Upload a PDF, convert it fully in your browser, and download all pages as JPG files in a single ZIP.",
    choosePrompt: "Choose a PDF to convert to JPG",
    selectLabel: "Select PDF",
    browserNote: (sizeMb) =>
      `Files stay in your browser • Max size ${(sizeMb || 0).toFixed(2)} MB`,
    selectedLabel: "Selected:",
    sizeLabel: "Size:",
    clear: "Clear",
    actions: {
      convert: "Convert PDF",
      converting: "Converting...",
      download: "Download JPGs (ZIP)",
    },
    generated: (count) =>
      `Generated ${count} JPG${count === 1 ? "" : "s"}. Preview below.`,
    errors: {
      pdfOnly: "Please upload a PDF file.",
      noneSelected: "Please select a PDF to convert.",
      convertFailed: "Failed to convert PDF to images.",
      zipFailed: "Failed to create ZIP file.",
    },
  },
  tr: {
    ariaLabel: "PDF'den JPG'e araç",
    badge: "PDF'yi JPG'e dönüştür",
    title: "PDF sayfalarını net JPG olarak dışa aktarın",
    description:
      "Bir PDF yükleyin, tamamen tarayıcıda dönüştürün ve tüm sayfaları tek bir ZIP içinde JPG olarak indirin.",
    choosePrompt: "JPG'e dönüştürülecek PDF'i seçin",
    selectLabel: "PDF seç",
    browserNote: (sizeMb) =>
      `Dosyalar tarayıcıda kalır • Maksimum boyut ${(sizeMb || 0).toFixed(2)} MB`,
    selectedLabel: "Seçilen:",
    sizeLabel: "Boyut:",
    clear: "Temizle",
    actions: {
      convert: "PDF'i dönüştür",
      converting: "Dönüştürülüyor...",
      download: "JPG'leri indir (ZIP)",
    },
    generated: (count) =>
      `${count} JPG oluşturuldu. Önizleme aşağıda.`,
    errors: {
      pdfOnly: "Lütfen bir PDF dosyası yükleyin.",
      noneSelected: "Lütfen dönüştürmek için bir PDF seçin.",
      convertFailed: "PDF, görsellere dönüştürülemedi.",
      zipFailed: "ZIP dosyası oluşturulamadı.",
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

const jszipPromise = import(
  "https://cdn.jsdelivr.net/npm/jszip@3.10.1/+esm"
);

export default function PdfToJpgCard({ language = "en" }) {
  const t = TEXT[language] || TEXT.en;
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.url));
    };
  }, [images]);

  const handleFileChange = (event) => {
    setError("");
    const selected = event.target.files?.[0];

    if (!selected) {
      setFile(null);
      setImages([]);
      return;
    }

    if (selected.type !== "application/pdf") {
      setError(t.errors.pdfOnly);
      setFile(null);
      setImages([]);
      return;
    }

    setFile(selected);
    setImages([]);
  };

  const handleClear = () => {
    images.forEach((img) => URL.revokeObjectURL(img.url));
    setImages([]);
    setFile(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleConvert = async () => {
    setError("");
    if (!file) {
      setError(t.errors.noneSelected);
      return;
    }

    setIsConverting(true);

    try {
      const pdfjsLib = await pdfjsPromise;
      const data = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data }).promise;

      const newImages = [];

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const context = canvas.getContext("2d");

        await page.render({ canvasContext: context, viewport }).promise;

        const blob = await new Promise((resolve) =>
          canvas.toBlob((b) => resolve(b), "image/jpeg", 0.92)
        );

        if (!blob) {
          throw new Error("Could not create JPG for one of the pages.");
        }

        const url = URL.createObjectURL(blob);
        newImages.push({
          name: `page-${pageNum}.jpg`,
          url,
          blob,
        });
      }

      setImages(newImages);
    } catch (err) {
      console.error(err);
      setError(err.message || t.errors.convertFailed);
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownloadZip = async () => {
    try {
      const JSZip = (await jszipPromise).default;
      const zip = new JSZip();

      images.forEach((img) => {
        zip.file(img.name, img.blob);
      });

      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = "pdf-to-jpg.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError(err.message || t.errors.zipFailed);
    }
  };

  const totalMB = file ? file.size / 1024 / 1024 : 0;

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
                  background: "#ecfeff",
                  fontSize: "11px",
                  color: "#0ea5e9",
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
                    background: "#06b6d4",
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

          <div
            style={{
              border: "1.5px dashed #d1d5db",
              borderRadius: "12px",
              padding: "16px",
              textAlign: "center",
              marginBottom: "14px",
              background:
                "linear-gradient(135deg, #e0f2fe 0%, #f1f5f9 50%, #eff6ff 100%)",
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
                background: "#0ea5e9",
                color: "white",
                fontSize: "12px",
                cursor: "pointer",
                boxShadow: "0 8px 20px rgba(14,165,233,0.35)",
              }}
            >
              <span style={{ fontSize: "14px" }}>📑</span>
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
              {t.browserNote(totalMB)}
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
                {t.selectedLabel} <strong style={{ color: "#111827" }}>{file.name}</strong>
              </div>
              <div>
                {t.sizeLabel} <strong style={{ color: "#111827" }}>{totalMB.toFixed(2)} MB</strong>
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
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={handleClear}
              disabled={isConverting && !images.length}
              style={{
                padding: "8px 12px",
                borderRadius: "999px",
                border: "1px solid #e5e7eb",
                background: "white",
                cursor:
                  isConverting && !images.length ? "not-allowed" : "pointer",
                fontSize: "12px",
                color: "#374151",
                minWidth: "80px",
              }}
            >
              {t.clear}
            </button>
            <button
              onClick={handleConvert}
              disabled={isConverting || !file}
              style={{
                padding: "8px 16px",
                borderRadius: "999px",
                border: "none",
                background: isConverting || !file ? "#9ca3af" : "#0ea5e9",
                color: "white",
                cursor: isConverting || !file ? "not-allowed" : "pointer",
                fontSize: "12px",
                fontWeight: 600,
                minWidth: "150px",
                boxShadow:
                  isConverting || !file
                    ? "none"
                    : "0 10px 25px rgba(14,165,233,0.35)",
              }}
            >
              {isConverting ? t.actions.converting : t.actions.convert}
            </button>
            <button
              onClick={handleDownloadZip}
              disabled={!images.length}
              style={{
                padding: "8px 14px",
                borderRadius: "999px",
                border: "1px solid #22c55e",
                background: !images.length ? "#f0fdf4" : "#22c55e",
                color: !images.length ? "#16a34a" : "white",
                cursor: !images.length ? "not-allowed" : "pointer",
                fontSize: "12px",
                fontWeight: 700,
                minWidth: "170px",
                boxShadow:
                  !images.length
                    ? "none"
                    : "0 10px 25px rgba(34,197,94,0.35)",
              }}
            >
              {t.actions.download}
            </button>
          </div>

          {images.length > 0 && (
            <div
              style={{
                marginTop: "14px",
                background: "#ecfeff",
                border: "1px solid #bae6fd",
                borderRadius: "12px",
                padding: "12px",
                fontSize: "12px",
                color: "#0ea5e9",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              <div>{t.generated(images.length)}</div>
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                }}
              >
                {images.map((img) => (
                  <div
                    key={img.name}
                    style={{
                      padding: "8px 10px",
                      borderRadius: "10px",
                      background: "white",
                      border: "1px solid #e0f2fe",
                      boxShadow: "0 8px 16px rgba(14,165,233,0.08)",
                      minWidth: "140px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 700,
                        color: "#0ea5e9",
                        marginBottom: "6px",
                      }}
                    >
                      {img.name}
                    </div>
                    <img
                      src={img.url}
                      alt={img.name}
                      style={{
                        width: "100%",
                        borderRadius: "8px",
                        border: "1px solid #e0f2fe",
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
