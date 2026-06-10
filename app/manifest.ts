import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Eirik Kvam | Portfolio",
    short_name: "Eirik Kvam",
    description:
      "Portfolio of Eirik Kvam, a software developer based in Trondheim, Norway.",
    start_url: "/",
    display: "standalone",
    background_color: "#03040c",
    theme_color: "#03040c",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
