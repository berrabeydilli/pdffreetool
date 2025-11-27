import React, { useRef, useState } from "react";
import ToolCardShell from "./components/ToolCardShell";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function DeletePdfPagesCard() {
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
      setError("Please upload a PDF file.");
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

  const handleDelete = async () => {
    setError("");
    if (!file) {
      setError("Please choose a PDF file.");
      return;
    }

    if (!pages.trim()) {
      setError("Enter the page numbers to delete.");
      return;
    }

    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("pages", pages);

      const res = await fetch(`${API_URL}/delete-pages`, {
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
      a.download = "pages-removed.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete pages.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolCardShell
      pillLabel="Delete PDF pages"
      title="Remove unwanted pages"
      description="Pick a PDF, choose page numbers (e.g., 2,4,6), and download a cleaner file."
      accentColor="#7c3aed"
      pillBackground="#f5f3ff"
    >
      <div
        style={{
          border: "1.5px dashed #d1d5db",
          borderRadius: "12px",
          padding: "16px",
          textAlign: "center",
          marginBottom: "14px",
          background:
            "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #e0e7ff 100%)",
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          style={{ display: "none" }}
          id="delete-pages-file"
        />
        <label
          htmlFor="delete-pages-file"
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
            color: "#4f46e5",
            fontWeight: 600,
            boxShadow: "0 10px 25px rgba(79,70,229,0.15)",
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
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <input
          type="text"
          placeholder="Pages to delete (e.g., 1,3,5)"
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
          Clear
        </button>
        <button
          onClick={handleDelete}
          disabled={isProcessing}
          style={{
            padding: "10px 16px",
            borderRadius: "12px",
            border: "none",
            background: isProcessing ? "#c4b5fd" : "#7c3aed",
            color: "white",
            cursor: isProcessing ? "not-allowed" : "pointer",
            fontWeight: 700,
            fontSize: "12px",
            minWidth: "140px",
            boxShadow: isProcessing
              ? "none"
              : "0 10px 25px rgba(124,58,237,0.35)",
          }}
        >
          {isProcessing ? "Working..." : "Delete pages"}
        </button>
      </div>
    </ToolCardShell>
  );
}
