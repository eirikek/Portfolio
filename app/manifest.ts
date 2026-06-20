import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Eirik Engen Kvam | Portfolio",
    short_name: "Eirik Kvam",
    description:
      "Portfolio of Eirik Engen Kvam, a software developer based in Trondheim, Norway.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    lang: "en",
    categories: ["portfolio", "technology", "developer"],
    background_color: "#03040c",
    theme_color: "#03040c",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
