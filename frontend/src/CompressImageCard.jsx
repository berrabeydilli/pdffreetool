import React, { useRef, useState } from "react";

const MAX_MB = 40;

export default function CompressImageCard() {
  const [file, setFile] = useState(null);
  const [quality, setQuality] = useState(80);
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

    if (!selected.type.startsWith("image/")) {
      setError("Please select a JPG or PNG image.");
      setFile(null);
      return;
    }

    const sizeMb = selected.size / 1024 / 1024;
    if (sizeMb > MAX_MB) {
      setError(`Images up to ${MAX_MB} MB are supported.`);
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

  const loadImage = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = reader.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleCompress = async () => {
    setError("");
    if (!file) {
      setError("Please upload an image to compress.");
      return;
    }

    setIsProcessing(true);
    try {
      const image = await loadImage(file);
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0, image.width, image.height);

      const targetType = file.type === "image/png" ? "image/png" : "image/jpeg";
      const blob = await new Promise((resolve, reject) => {
        canvas.toBlob(
          (b) => {
            if (!b) return reject(new Error("Could not compress image"));
            resolve(b);
          },
          targetType,
          quality / 100
        );
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.[^.]+$/, "") + "-compressed" + (targetType === "image/png" ? ".png" : ".jpg");
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to compress image.");
    } finally {
      setIsProcessing(false);
    }
  };

  const sizeMb = file ? (file.size / 1024 / 1024).toFixed(2) : null;

  return (
    <section
      aria-label="Compress image tool"
      style={{ marginBottom: "28px", marginTop: "24px" }}
    >
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
                background: "#fef3c7",
                fontSize: "11px",
                color: "#92400e",
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
                  background: "#f59e0b",
                }}
              ></span>
              Compress JPG or PNG
            </div>
            <h2
              style={{ fontSize: "18px", margin: 0, marginBottom: "4px", color: "#0f172a" }}
            >
              Reduce image file size
            </h2>
            <p style={{ color: "#6b7280", margin: 0, fontSize: "13px" }}>
              Images are compressed right in your browser. Nothing leaves your device.
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
              Choose an image to compress
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
              <span style={{ fontSize: "14px" }}>🖼️</span>
              <span>Select image</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleChange}
                style={{ display: "none" }}
              />
            </label>
            {file && (
              <div style={{ fontSize: "12px", color: "#4b5563", marginTop: "10px" }}>
                Selected: {file.name} ({sizeMb} MB)
              </div>
            )}
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "12px",
                color: "#374151",
              }}
            >
              <span>Quality ({quality}%)</span>
              <input
                type="range"
                min="40"
                max="95"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                style={{ flex: 1, marginLeft: "12px" }}
              />
            </label>
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
              onClick={handleCompress}
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
              {isProcessing ? "Compressing..." : "Compress & Download"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
