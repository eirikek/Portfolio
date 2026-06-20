import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Eirik Engen Kvam software developer portfolio";
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
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            color: "#6cc6ff",
            fontWeight: 500,
            fontSize: 28,
            letterSpacing: 8,
          }}
        >
          SOFTWARE DEVELOPER
        </div>
        <div
          style={{
            fontWeight: 700,
            fontSize: 64,
            marginTop: 24,
          }}
        >
          Eirik Engen Kvam
        </div>
        <div
          style={{
            color: "#9fb0d6",
            fontSize: 34,
            marginTop: 24,
          }}
        >
          Projects · Experience · Certifications · Skills
        </div>
        <div
          style={{
            color: "#ffb454",
            fontWeight: 500,
            fontSize: 28,
            marginTop: 72,
          }}
        >
          Trondheim, Norway · eirikkvam.no
        </div>
      </div>
    ),
    size
  );
}
