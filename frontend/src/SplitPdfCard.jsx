import React, { useEffect, useRef, useState } from "react";

const pdfLibPromise = import(
  "https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/+esm"
);
const jszipPromise = import(
  "https://cdn.jsdelivr.net/npm/jszip@3.10.1/+esm"
);

export default function SplitPdfCard() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [pages, setPages] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      pages.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [pages]);

  const handleChange = (e) => {
    setError("");
    const selected = e.target.files?.[0];

    if (!selected) {
      setFile(null);
      setPages([]);
      return;
    }

    if (selected.type !== "application/pdf") {
      setError("Please select a PDF file.");
      setFile(null);
      setPages([]);
      return;
    }

    setFile(selected);
    setPages([]);
  };

  const reset = () => {
    pages.forEach((p) => URL.revokeObjectURL(p.url));
    setPages([]);
    setFile(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSplit = async () => {
    setError("");
    if (!file) {
      setError("Please choose a PDF to split.");
      return;
    }

    setIsProcessing(true);
    try {
      const { PDFDocument } = await pdfLibPromise;
      const sourceBytes = await file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(sourceBytes);
      const newPages = [];

      for (const idx of sourcePdf.getPageIndices()) {
        const newPdf = await PDFDocument.create();
        const [page] = await newPdf.copyPages(sourcePdf, [idx]);
        newPdf.addPage(page);
        const bytes = await newPdf.save({ useObjectStreams: true });
        const blob = new Blob([bytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        newPages.push({ name: `page-${idx + 1}.pdf`, url, blob });
      }

      setPages(newPages);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to split PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadAll = async () => {
    try {
      const JSZip = (await jszipPromise).default;
      const zip = new JSZip();
      pages.forEach((page) => zip.file(page.name, page.blob));
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = "split-pages.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to create ZIP.");
    }
  };

  return (
    <section aria-label="Split PDF tool" style={{ marginBottom: "28px", marginTop: "24px" }}>
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
              Split into single-page PDFs
            </div>
            <h2 style={{ fontSize: "18px", margin: 0, marginBottom: "4px", color: "#0f172a" }}>
              Split PDF pages instantly
            </h2>
            <p style={{ color: "#6b7280", margin: 0, fontSize: "13px" }}>
              Split happens in your browser and never leaves your device.
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
              Choose a PDF to split
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
              <span>Select PDF</span>
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
                Selected: {file.name}
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

          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginBottom: "10px" }}>
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
              Clear
            </button>
            <button
              type="button"
              onClick={handleSplit}
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
              {isProcessing ? "Splitting..." : "Split PDF"}
            </button>
          </div>

          {pages.length > 0 && (
            <div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a", marginBottom: "6px" }}>
                {pages.length} pages ready
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "10px" }}>
                {pages.map((p) => (
                  <div
                    key={p.name}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 10px",
                      borderRadius: "10px",
                      background: "#f8fafc",
                      border: "1px solid #e5e7eb",
                      fontSize: "12px",
                      color: "#111827",
                    }}
                  >
                    <span>{p.name}</span>
                    <a
                      href={p.url}
                      download={p.name}
                      style={{ color: "#2563eb", fontWeight: 600, textDecoration: "none" }}
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={handleDownloadAll}
                style={{
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "none",
                  background: "#16a34a",
                  color: "white",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 10px 22px rgba(22,163,74,0.25)",
                }}
              >
                Download as ZIP
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
