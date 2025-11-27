import React, { useRef, useState } from "react";
import ToolCardShell from "./components/ToolCardShell";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function RotatePdfPagesCard() {
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState("");
  const [angle, setAngle] = useState("90");
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
      setError("Please upload a PDF file.");
      setFile(null);
      return;
    }

    setFile(selected);
  };

  const handleClear = () => {
    setFile(null);
    setPages("");
    setAngle("90");
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRotate = async () => {
    setError("");
    if (!file) {
      setError("Please choose a PDF file.");
      return;
    }

    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("pages", pages);
      formData.append("angle", angle);

      const res = await fetch(`${API_URL}/rotate-pages`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong.");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "rotated.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to rotate pages.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolCardShell
      pillLabel="Rotate PDF pages"
      title="Rotate specific pages or the whole file"
      description="Upload a PDF, choose the angle, and rotate selected pages (leave blank to rotate all)."
      accentColor="#0ea5e9"
      pillBackground="#e0f2fe"
    >
      <div
        style={{
          border: "1.5px dashed #d1d5db",
          borderRadius: "12px",
          padding: "16px",
          textAlign: "center",
          marginBottom: "14px",
          background:
            "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 50%, #cffafe 100%)",
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          style={{ display: "none" }}
          id="rotate-pages-file"
        />
        <label
          htmlFor="rotate-pages-file"
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
            color: "#0284c7",
            fontWeight: 600,
            boxShadow: "0 10px 25px rgba(14,165,233,0.15)",
          }}
        >
          {file ? "Change PDF" : "Upload PDF"}
        </label>
        <p
          style={{
            margin: "10px 0 0",
            fontSize: "12px",
            color: "#6b7280",
          }}
        >
          {file ? file.name : "No file chosen"}
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginBottom: "12px",
        }}
      >
        <select
          value={angle}
          onChange={(e) => setAngle(e.target.value)}
          style={{
            flex: "0 0 140px",
            padding: "12px",
            borderRadius: "12px",
            border: "1px solid #d1d5db",
            fontSize: "13px",
            background: "#f8fafc",
          }}
        >
          <option value="90">Rotate 90°</option>
          <option value="180">Rotate 180°</option>
          <option value="270">Rotate 270°</option>
        </select>
        <input
          type="text"
          placeholder="Pages to rotate (e.g., 1,2,5). Blank = all"
          value={pages}
          onChange={(e) => setPages(e.target.value)}
          style={{
            flex: 1,
            minWidth: "180px",
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
          Clear
        </button>
        <button
          onClick={handleRotate}
          disabled={isProcessing}
          style={{
            padding: "10px 16px",
            borderRadius: "12px",
            border: "none",
            background: isProcessing ? "#7dd3fc" : "#0ea5e9",
            color: "white",
            cursor: isProcessing ? "not-allowed" : "pointer",
            fontWeight: 700,
            fontSize: "12px",
            minWidth: "140px",
            boxShadow: isProcessing
              ? "none"
              : "0 10px 25px rgba(14,165,233,0.30)",
          }}
        >
          {isProcessing ? "Working..." : "Rotate pages"}
        </button>
      </div>
    </ToolCardShell>
  );
}
