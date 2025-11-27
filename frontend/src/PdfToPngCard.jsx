import React, { useEffect, useRef, useState } from "react";

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

export default function PdfToPngCard() {
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
      setError("Please upload a PDF file.");
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
      setError("Please select a PDF to convert.");
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
          canvas.toBlob((b) => resolve(b), "image/png", 1)
        );

        if (!blob) {
          throw new Error("Could not create PNG for one of the pages.");
        }

        const url = URL.createObjectURL(blob);
        newImages.push({
          name: `page-${pageNum}.png`,
          url,
          blob,
        });
      }

      setImages(newImages);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to convert PDF to images.");
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
      a.download = "pdf-to-png.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to create ZIP file.");
    }
  };

  const totalMB = file ? file.size / 1024 / 1024 : 0;

  return (
    <section
      aria-label="PDF to PNG tool"
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
                  background: "#dbeafe",
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
                    background: "#2563eb",
                  }}
                ></span>
                Export pages as PNG
              </div>
              <h2
                style={{
                  fontSize: "18px",
                  margin: 0,
                  marginBottom: "4px",
                  color: "#0f172a",
                }}
              >
                Convert PDF pages to PNG
              </h2>
              <p
                style={{
                  color: "#6b7280",
                  margin: 0,
                  fontSize: "13px",
                }}
              >
                Pages render in your browser. Download images individually or as a ZIP.
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
                  background: "#eff6ff",
                  color: "#1d4ed8",
                  fontWeight: 500,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <span style={{ fontSize: "14px" }}>🖼️</span> Offline conversion
              </div>
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
              Choose a PDF to convert
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
              <span>Select PDF</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </label>
            {file && (
              <div
                style={{
                  fontSize: "12px",
                  color: "#4b5563",
                  marginTop: "10px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                }}
              >
                <span>Selected: {file.name}</span>
                <span>Total size: {totalMB.toFixed(2)} MB</span>
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

          <div
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "flex-end",
              marginBottom: "10px",
            }}
          >
            <button
              type="button"
              onClick={handleClear}
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
              Clear
            </button>
            <button
              type="button"
              onClick={handleConvert}
              disabled={isConverting}
              style={{
                padding: "10px 16px",
                borderRadius: "10px",
                border: "none",
                background: "linear-gradient(90deg, #111827, #2563eb)",
                color: "white",
                cursor: "pointer",
                fontWeight: 700,
                boxShadow: "0 12px 30px rgba(37, 99, 235, 0.35)",
                opacity: isConverting ? 0.7 : 1,
              }}
            >
              {isConverting ? "Converting..." : "Convert to PNG"}
            </button>
          </div>

          {images.length > 0 && (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#0f172a",
                  }}
                >
                  {images.length} images ready
                </div>
                <button
                  onClick={handleDownloadZip}
                  type="button"
                  style={{
                    padding: "8px 12px",
                    borderRadius: "10px",
                    border: "none",
                    background: "#16a34a",
                    color: "white",
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: "0 8px 18px rgba(22,163,74,0.25)",
                  }}
                >
                  Download ZIP
                </button>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                  gap: "12px",
                }}
              >
                {images.map((img) => (
                  <div
                    key={img.name}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: "12px",
                      padding: "8px",
                      background: "#f8fafc",
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                    }}
                  >
                    <img
                      src={img.url}
                      alt={img.name}
                      style={{ width: "100%", borderRadius: "8px", objectFit: "cover" }}
                    />
                    <a
                      href={img.url}
                      download={img.name}
                      style={{
                        color: "#2563eb",
                        fontSize: "12px",
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      Download {img.name}
                    </a>
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
