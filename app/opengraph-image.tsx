import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Eirik Kvam software developer portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "88px",
          color: "#eaf0ff",
          background: "#03040c",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ color: "#6cc6ff", fontSize: 28, letterSpacing: 8 }}>
          SOFTWARE DEVELOPER
        </div>
        <div style={{ fontSize: 82, fontWeight: 700, marginTop: 24 }}>
          Eirik Kvam
        </div>
        <div style={{ color: "#9fb0d6", fontSize: 34, marginTop: 22 }}>
          Projects · Experience · Certifications · Skills
        </div>
        <div style={{ color: "#ffb454", fontSize: 28, marginTop: 76 }}>
          Trondheim, Norway · eirikkvam.dev
        </div>
        <div
          style={{
            position: "absolute",
            right: 90,
            top: 80,
            fontSize: 90,
          }}
        >
          🛰️
        </div>
      </div>
    ),
    size
  );
}
