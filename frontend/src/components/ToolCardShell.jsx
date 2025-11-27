import React from "react";

export default function ToolCardShell({
  pillLabel,
  title,
  description,
  accentColor = "#f97316",
  pillBackground = "#fff7ed",
  children,
}) {
  return (
    <section
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
                  background: pillBackground,
                  fontSize: "11px",
                  color: accentColor,
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
                    background: accentColor,
                  }}
                ></span>
                {pillLabel}
              </div>
              <h2
                style={{
                  fontSize: "18px",
                  margin: 0,
                  marginBottom: "4px",
                  color: "#0f172a",
                }}
              >
                {title}
              </h2>
              <p
                style={{
                  color: "#6b7280",
                  margin: 0,
                  fontSize: "13px",
                }}
              >
                {description}
              </p>
            </div>
          </div>

          {children}
        </div>
      </div>
    </section>
  );
}
