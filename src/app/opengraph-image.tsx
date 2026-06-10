import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Dopamin alışveriş simülasyonu";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(135deg, #fffaf0 0%, #f5f0ff 48%, #fff3b8 100%)",
          color: "#172033",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          padding: 72,
          width: "100%",
        }}
      >
        <div
          style={{
            background: "rgba(255, 255, 255, 0.86)",
            border: "1px solid rgba(88, 77, 214, 0.22)",
            borderRadius: 28,
            display: "flex",
            flexDirection: "column",
            gap: 24,
            padding: 64,
            width: "100%",
          }}
        >
          <div style={{ color: "#584dd6", fontSize: 30, fontWeight: 700 }}>
            Dopamin · Simülasyon Modu
          </div>
          <div style={{ fontSize: 78, fontWeight: 800, letterSpacing: 0, lineHeight: 1.05 }}>
            Alışveriş hissi, gerçek ödeme olmadan.
          </div>
          <div style={{ color: "#526070", fontSize: 32, lineHeight: 1.35, maxWidth: 900 }}>
            Sanal Sipariş, sanal sepet ve harcamadan kapanış deneyimi.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
