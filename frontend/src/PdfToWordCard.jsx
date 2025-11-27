import React, { useRef, useState } from "react";

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

export default function PdfToWordCard() {
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
      setError("Please choose a PDF file.");
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
      setError("Please select a PDF to convert.");
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
      setError(err.message || "Failed to convert PDF to Word.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section aria-label="PDF to Word tool" style={{ marginBottom: "28px", marginTop: "24px" }}>
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
              Extract text to Word
            </div>
            <h2 style={{ fontSize: "18px", margin: 0, marginBottom: "4px", color: "#0f172a" }}>
              Convert PDF to Word (.docx)
            </h2>
            <p style={{ color: "#6b7280", margin: 0, fontSize: "13px" }}>
              Uses PDF text to build a clean Word document right in your browser.
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
              Choose a PDF file
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
              Clear
            </button>
            <button
              type="button"
              onClick={handleConvert}
              disabled={isProcessing}
              style={{
                padding: "10px 16px",
                borderRadius: "10px",
                border: "none",
                background: "linear-gradient(90deg, #111827, #2563eb)",
                color: "white",
                cursor: "pointer",
                fontWeight: 700,
                boxShadow: "0 12px 30px rgba(37, 99, 235, 0.35)",
                opacity: isProcessing ? 0.7 : 1,
              }}
            >
              {isProcessing ? "Converting..." : "Convert to Word"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
