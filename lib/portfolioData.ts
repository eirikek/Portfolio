/**
 * Portfolio data configuration.
 *
 * The whole experience is data-driven: each "layer" is an orbital plane, and
 * each item in a layer becomes a body (planet / satellite / cluster) on that
 * orbit. Edit this file to change the content of the site.
 */

export type LayerId = "projects" | "experience" | "certifications" | "skills";

/** Visual archetype used to render a body in a layer. */
export type BodyKind = "planet" | "satellite" | "cluster";

export interface PortfolioBody {
  id: string;
  /** Short label shown under / near the body. */
  name: string;
  /** Longer descriptive text shown in the detail HUD. */
  description: string;
  /** Optional supporting line (role, date, issuer, etc.). */
  meta?: string;
  /** Optional list of tags / tech / bullets. */
  tags?: string[];
  /** Optional external link. */
  link?: { label: string; url: string };
  /** Base color of the body. */
  color: string;
  /** Secondary / atmosphere color. */
  atmosphere: string;
  /** Relative body radius (scene units). */
  radius: number;
}

export interface OrbitLayer {
  id: LayerId;
  title: string;
  kind: BodyKind;
  /** Radius of the orbit ring for this layer. */
  orbitRadius: number;
  /** Base orbital speed multiplier. */
  orbitSpeed: number;
  /** Accent color for HUD + ring. */
  accent: string;
  bodies: PortfolioBody[];
}

export interface ContactInfo {
  name: string;
  tagline: string;
  email: string;
  linkedin: string;
  github: string;
  cv: string;
}

export const contact: ContactInfo = {
  name: "Eirik Kvam",
  tagline: "Full-stack developer · 3D & web experiences",
  email: "hello@eirikkvam.dev",
  linkedin: "https://www.linkedin.com/in/eirikek",
  github: "https://github.com/eirikek",
  cv: "/cv.pdf",
};

export const layers: OrbitLayer[] = [
  {
    id: "projects",
    title: "Projects",
    kind: "planet",
    orbitRadius: 16,
    orbitSpeed: 0.06,
    accent: "#6cc6ff",
    bodies: [
      {
        id: "nebula-ui",
        name: "Nebula UI",
        description:
          "A component system and design language for data-heavy dashboards, focused on motion, density and accessibility.",
        meta: "Design system · React + TS",
        tags: ["React", "TypeScript", "Design Systems", "Storybook"],
        link: { label: "View project", url: "https://github.com/eirikek" },
        color: "#4f8cff",
        atmosphere: "#9ec5ff",
        radius: 2.1,
      },
      {
        id: "orbital-cms",
        name: "Orbital CMS",
        description:
          "A headless content platform with real-time collaboration, edge caching and a visual schema builder.",
        meta: "Full-stack · Next.js + Postgres",
        tags: ["Next.js", "Postgres", "tRPC", "Edge"],
        link: { label: "View project", url: "https://github.com/eirikek" },
        color: "#c084fc",
        atmosphere: "#e6cbff",
        radius: 2.4,
      },
      {
        id: "stellar-maps",
        name: "Stellar Maps",
        description:
          "An interactive WebGL mapping engine rendering millions of points with smooth clustering and time playback.",
        meta: "WebGL · Three.js",
        tags: ["Three.js", "WebGL", "GLSL", "Data Viz"],
        link: { label: "View project", url: "https://github.com/eirikek" },
        color: "#34d399",
        atmosphere: "#a7f3d0",
        radius: 1.9,
      },
      {
        id: "pulse-analytics",
        name: "Pulse Analytics",
        description:
          "A privacy-first product analytics suite with a streaming ingestion pipeline and instant funnels.",
        meta: "Platform · Go + ClickHouse",
        tags: ["Go", "ClickHouse", "Kafka", "Analytics"],
        link: { label: "View project", url: "https://github.com/eirikek" },
        color: "#fb923c",
        atmosphere: "#ffd6a8",
        radius: 2.2,
      },
    ],
  },
  {
    id: "experience",
    title: "Work Experience",
    kind: "planet",
    orbitRadius: 20,
    orbitSpeed: 0.045,
    accent: "#ffb454",
    bodies: [
      {
        id: "exp-lead",
        name: "Aurora Labs",
        description:
          "Led a small product team building 3D configuration tools for manufacturing clients.",
        meta: "Lead Frontend Engineer · 2023 — Present",
        tags: ["Leadership", "Three.js", "Architecture"],
        color: "#ff8c42",
        atmosphere: "#ffcfa3",
        radius: 2.3,
      },
      {
        id: "exp-senior",
        name: "Meridian",
        description:
          "Built and scaled the design system and core web app used by hundreds of thousands of users.",
        meta: "Senior Engineer · 2020 — 2023",
        tags: ["React", "Design Systems", "Performance"],
        color: "#f97316",
        atmosphere: "#ffd0a8",
        radius: 2.1,
      },
      {
        id: "exp-fullstack",
        name: "Bytewave",
        description:
          "Full-stack work across product features, internal tooling and CI/CD for a fast-growing startup.",
        meta: "Full-stack Developer · 2018 — 2020",
        tags: ["Node.js", "AWS", "Vue"],
        color: "#fbbf24",
        atmosphere: "#ffe6a8",
        radius: 1.9,
      },
    ],
  },
  {
    id: "certifications",
    title: "Certifications",
    kind: "satellite",
    orbitRadius: 24,
    orbitSpeed: 0.08,
    accent: "#4fd1a1",
    bodies: [
      {
        id: "cert-aws",
        name: "AWS Solutions Architect",
        description:
          "Associate-level certification covering scalable, resilient cloud architecture on AWS.",
        meta: "Amazon Web Services · 2023",
        tags: ["Cloud", "Architecture"],
        color: "#38bdf8",
        atmosphere: "#bae6fd",
        radius: 1.1,
      },
      {
        id: "cert-cka",
        name: "Certified Kubernetes Admin",
        description:
          "Hands-on certification for deploying and operating production Kubernetes clusters.",
        meta: "CNCF · 2022",
        tags: ["Kubernetes", "DevOps"],
        color: "#22d3ee",
        atmosphere: "#a5f3fc",
        radius: 1.0,
      },
      {
        id: "cert-gcp",
        name: "GCP Professional",
        description:
          "Professional cloud developer certification focused on building scalable apps on Google Cloud.",
        meta: "Google Cloud · 2021",
        tags: ["Cloud", "GCP"],
        color: "#60a5fa",
        atmosphere: "#bfdbfe",
        radius: 1.1,
      },
      {
        id: "cert-sec",
        name: "Security Essentials",
        description:
          "Foundational application security certification covering OWASP and secure development.",
        meta: "GIAC · 2021",
        tags: ["Security", "OWASP"],
        color: "#818cf8",
        atmosphere: "#c7d2fe",
        radius: 1.0,
      },
    ],
  },
  {
    id: "skills",
    title: "Skills",
    kind: "cluster",
    orbitRadius: 28,
    orbitSpeed: 0.03,
    accent: "#f0abfc",
    bodies: [
      {
        id: "skill-frontend",
        name: "Frontend",
        description:
          "Building fast, accessible, animated interfaces with a strong eye for detail.",
        tags: ["React", "Next.js", "TypeScript", "CSS", "Framer Motion"],
        color: "#e879f9",
        atmosphere: "#f5d0fe",
        radius: 1.6,
      },
      {
        id: "skill-3d",
        name: "3D / Graphics",
        description:
          "Realtime 3D for the web — scenes, shaders and performant rendering.",
        tags: ["Three.js", "R3F", "GLSL", "Blender"],
        color: "#c084fc",
        atmosphere: "#e9d5ff",
        radius: 1.6,
      },
      {
        id: "skill-backend",
        name: "Backend",
        description:
          "APIs, data and infrastructure that scale cleanly under load.",
        tags: ["Node.js", "Go", "Postgres", "GraphQL"],
        color: "#a78bfa",
        atmosphere: "#ddd6fe",
        radius: 1.6,
      },
      {
        id: "skill-cloud",
        name: "Cloud / DevOps",
        description:
          "Shipping and operating software with automated, reliable pipelines.",
        tags: ["AWS", "Docker", "Kubernetes", "CI/CD"],
        color: "#f472b6",
        atmosphere: "#fbcfe8",
        radius: 1.6,
      },
    ],
  },
];

export const layerOrder: LayerId[] = layers.map((l) => l.id);

export function getLayer(id: LayerId): OrbitLayer {
  const layer = layers.find((l) => l.id === id);
  if (!layer) throw new Error(`Unknown layer: ${id}`);
  return layer;
}
