"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="zh">
      <body
        style={{
          margin: 0,
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "16px",
          fontFamily: "system-ui, sans-serif",
          background: "#f8fafc",
          color: "#0f172a",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <div style={{ fontSize: "48px" }}>⚠️</div>
        <h1 style={{ fontSize: "20px", fontWeight: 700, margin: 0 }}>
          TrackFlow 遇到了问题
        </h1>
        <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
          应用发生了未预期的错误，请刷新页面重试
        </p>
        <button
          onClick={reset}
          style={{
            padding: "10px 24px",
            borderRadius: "8px",
            border: "none",
            background: "#2563eb",
            color: "white",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          刷新重试
        </button>
      </body>
    </html>
  );
}
