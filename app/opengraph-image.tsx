import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Eirik Engen Kvam software developer portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Vendored TTFs of the site's actual fonts (Orbitron for headings, Space
// Grotesk for body) so the card matches the live site instead of falling back
// to the platform's generic sans-serif.
const orbitronMedium = fetch(
  new URL("./fonts/Orbitron-Medium.ttf", import.meta.url)
).then((res) => res.arrayBuffer());
const orbitronBold = fetch(
  new URL("./fonts/Orbitron-Bold.ttf", import.meta.url)
).then((res) => res.arrayBuffer());
const spaceGroteskRegular = fetch(
  new URL("./fonts/SpaceGrotesk-Regular.ttf", import.meta.url)
).then((res) => res.arrayBuffer());
const spaceGroteskMedium = fetch(
  new URL("./fonts/SpaceGrotesk-Medium.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

export default async function OpenGraphImage() {
  const [orbitronMediumData, orbitronBoldData, spaceRegularData, spaceMediumData] =
    await Promise.all([
      orbitronMedium,
      orbitronBold,
      spaceGroteskRegular,
      spaceGroteskMedium,
    ]);

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
          fontFamily: "Space Grotesk",
        }}
      >
        <div
          style={{
            color: "#6cc6ff",
            fontFamily: "Orbitron",
            fontWeight: 500,
            fontSize: 28,
            letterSpacing: 8,
          }}
        >
          SOFTWARE DEVELOPER
        </div>
        <div
          style={{
            fontFamily: "Orbitron",
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
    {
      ...size,
      fonts: [
        { name: "Orbitron", data: orbitronMediumData, weight: 500, style: "normal" },
        { name: "Orbitron", data: orbitronBoldData, weight: 700, style: "normal" },
        { name: "Space Grotesk", data: spaceRegularData, weight: 400, style: "normal" },
        { name: "Space Grotesk", data: spaceMediumData, weight: 500, style: "normal" },
      ],
    }
  );
}
