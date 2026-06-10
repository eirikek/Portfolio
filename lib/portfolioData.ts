/**
 * Portfolio data configuration.
 *
 * The whole experience is data-driven: each "layer" is an orbital plane, and
 * each item in a layer becomes a body (planet / satellite / cluster) on that
 * orbit. Edit this file to change the content of the site.
 */

export type LayerId = "projects" | "experience" | "certifications" | "skills";

/** Visual archetype used to render a body in a layer. */
export type BodyKind = "project" | "experience" | "satellite" | "cluster";

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
  tagline: "Full-stack developer · Web and digital solutions",
  email: "hello@eirikkvam.dev",
  linkedin: "https://www.linkedin.com/in/eirikek",
  github: "https://github.com/eirikek",
  cv: "/cv.pdf",
};

export const layers: OrbitLayer[] = [
  {
    id: "projects",
    title: "Projects",
    kind: "project",
    orbitRadius: 16,
    orbitSpeed: 0.06,
    accent: "#6cc6ff",
    bodies: [
      {
        id: "nasa-hunch-norway",
        name: "NASA HUNCH Norway",
        description:
          "Designed and developed a new website for NASA HUNCH Norway. Built the editorial workflow in Sanity CMS, implemented SEO, API integrations and a contact form secured with reCAPTCHA Enterprise, and configured deployment and integrations across Vercel, Google Cloud and Google Workspace.",
        meta: "May 2026 — Jun 2026",
        tags: ["Next.js", "React", "TypeScript", "Sanity CMS", "Google Cloud"],
        link: { label: "Visit website", url: "https://www.nasahunch.no/" },
        color: "#4f8cff",
        atmosphere: "#9ec5ff",
        radius: 2.3,
      },
      {
        id: "norstec-summit-2026",
        name: "NORSTEC Summit 2026",
        description:
          "Designed and developed a progressive web app for NORSTEC Summit, a national student conference connecting students and the Norwegian space industry. The app gave attendees quick access to the programme, practical information and event content before and during the summit.",
        meta: "Feb 2026 — Mar 2026",
        tags: ["PWA", "React", "TypeScript", "UX Design"],
        link: { label: "Visit app", url: "https://summit.norstec.no/" },
        color: "#397dcc",
        atmosphere: "#8bc8ff",
        radius: 2.1,
      },
      {
        id: "norstec-website",
        name: "NORSTEC Website",
        description:
          "Worked in a three-person team to design and launch NORSTEC's new website. Contributed across visual identity, frontend development and technical setup, including the component architecture, responsive interface, Sanity CMS integration, content structure and user journeys.",
        meta: "Oct 2025 — Jan 2026",
        tags: ["Next.js", "TypeScript", "Sanity CMS", "Responsive Design"],
        link: { label: "Visit website", url: "https://norstec.no/" },
        color: "#2f9ec4",
        atmosphere: "#a3e6fa",
        radius: 2.2,
      },
      {
        id: "hostscena",
        name: "Høstscena",
        description:
          "Developed and launched a new website for Høstscena, a cultural festival in Ålesund. Led the frontend implementation, integrated Sanity CMS for editorial publishing, configured Vercel hosting and improved performance and SEO for better visibility and usability.",
        meta: "Apr 2025 — Sep 2025",
        tags: ["Next.js", "React", "TypeScript", "Sanity CMS", "SEO"],
        link: { label: "Visit website", url: "https://www.hostscena.no/" },
        color: "#3674b8",
        atmosphere: "#a8d4ff",
        radius: 2.0,
      },
      {
        id: "nuto",
        name: "NUTO Online Store",
        description:
          "Planned, designed and developed a complete online store independently. Delivered the visual identity and logo, product structure, payment and shipping integrations, publishing workflow, hosting and ongoing operations.",
        meta: "Feb 2021 — Aug 2021",
        tags: ["E-commerce", "Web Design", "Payments", "Hosting", "WordPress"],
        link: { label: "Visit website", url: "https://bymein.no/" },
        color: "#4666a8",
        atmosphere: "#b7ccff",
        radius: 1.9,
      },
      {
        id: "grethes-vev",
        name: "Grethes Vev",
        description:
          "Designed and developed a focused portfolio website presenting textile art, crafts and paintings. Prioritised clear visual presentation, simple information architecture and straightforward content publishing.",
        meta: "Jun 2021 — Jul 2021",
        tags: ["Web Design", "Frontend", "Content Structure"],
        link: { label: "Visit website", url: "https://grethesvev.com/" },
        color: "#315c92",
        atmosphere: "#9dc8ed",
        radius: 1.8,
      },
    ],
  },
  {
    id: "experience",
    title: "Experience",
    kind: "experience",
    orbitRadius: 20,
    orbitSpeed: 0.045,
    accent: "#ff5a67",
    bodies: [
      {
        id: "experience-norstec",
        name: "NORSTEC",
        description:
          "Contribute to NORSTEC's technical direction, digital platforms and organisational development. Progressed from Software Developer to Head of Development & Digital Solutions and joined the board in April 2026.",
        meta: "Board Member & Head of Development · Nov 2025 — Present",
        tags: ["Technical Leadership", "Software Development", "Digital Strategy"],
        color: "#c9364b",
        atmosphere: "#ff9aa5",
        radius: 2.4,
      },
      {
        id: "experience-hoggorm",
        name: "Hoggorm Design",
        description:
          "Co-founded a design and development studio delivering tailored websites and digital products. Work spans client discovery, visual design, full-stack development, CMS implementation, deployment and ongoing technical delivery.",
        meta: "Co-Founder & Full-Stack Developer · Aug 2024 — Present",
        tags: ["Full-Stack Development", "Client Delivery", "Web Design"],
        color: "#b92f43",
        atmosphere: "#ff8f9c",
        radius: 2.3,
      },
      {
        id: "experience-nasa-hunch",
        name: "NASA HUNCH Norway",
        description:
          "Designed, developed and delivered NASA HUNCH Norway's new website and supporting integrations, covering the frontend, CMS, SEO, APIs, security and cloud deployment.",
        meta: "Full-Stack Developer · May 2026 — Jun 2026",
        tags: ["Next.js", "Sanity CMS", "Google Cloud", "Vercel"],
        color: "#d54152",
        atmosphere: "#ffa4ad",
        radius: 2.1,
      },
      {
        id: "experience-atea",
        name: "Atea Norway",
        description:
          "Delivered local IT consulting and technical support in Trondheim, working with users, workplace technology and Microsoft environments while diagnosing and resolving operational issues.",
        meta: "IT Consultant · Nov 2024 — May 2026",
        tags: ["Microsoft 365", "Technical Support", "Troubleshooting", "Customer Service"],
        color: "#a9293d",
        atmosphere: "#f48693",
        radius: 2.0,
      },
      {
        id: "experience-golf",
        name: "Ålesund Golf Club",
        description:
          "Handled seasonal customer service and day-to-day member and visitor support across four summer seasons.",
        meta: "Customer Service Representative · May 2020 — Aug 2023",
        tags: ["Customer Service", "Sales", "Operations"],
        color: "#982438",
        atmosphere: "#e97c89",
        radius: 1.8,
      },
      {
        id: "experience-military",
        name: "Norwegian Armed Forces",
        description:
          "Completed one year of military service at Setermoen, developing discipline, teamwork, self-leadership and the ability to perform reliably under pressure.",
        meta: "Military Service · Aug 2021 — Jul 2022",
        tags: ["Teamwork", "Self-Leadership", "First Aid"],
        color: "#861f33",
        atmosphere: "#d97180",
        radius: 1.9,
      },
      {
        id: "experience-alesund-municipality",
        name: "Ålesund Municipality",
        description:
          "Worked part-time as a support worker, providing practical assistance and contributing to reliable day-to-day services.",
        meta: "Support Worker · Oct 2018 — Jul 2021",
        tags: ["Support Work", "Communication", "Responsibility"],
        color: "#741a2d",
        atmosphere: "#ca6677",
        radius: 1.8,
      },
      {
        id: "education-ntnu",
        name: "NTNU",
        description:
          "Computer Science studies at the Norwegian University of Science and Technology, building a broad foundation across software development, databases, systems and collaborative project work.",
        meta: "BSc · Computer Science",
        tags: ["Computer Science", "Software Development", "Databases", "Systems"],
        color: "#631527",
        atmosphere: "#b85c6e",
        radius: 2.0,
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
        id: "cert-azure-data",
        name: "Azure Data Fundamentals",
        description:
          "Microsoft certification covering core data concepts, relational and non-relational data, analytics workloads and data services on Azure.",
        meta: "Microsoft · Issued Mar 2026",
        tags: ["Azure", "Data", "Analytics"],
        link: {
          label: "View credential",
          url: "https://learn.microsoft.com/api/credentials/share/nb-no/EirikEngenKvam-6767/3915D80E6D516B9F?sharingId=199EBDCB37909FB4",
        },
        color: "#25a779",
        atmosphere: "#9aefd0",
        radius: 1.1,
      },
      {
        id: "cert-security-compliance-identity",
        name: "Security, Compliance & Identity",
        description:
          "Microsoft fundamentals certification covering security, compliance and identity concepts across Microsoft cloud services.",
        meta: "Microsoft · Issued Jan 2026",
        tags: ["Security", "Compliance", "Identity"],
        link: {
          label: "View credential",
          url: "https://learn.microsoft.com/api/credentials/share/nb-no/EirikEngenKvam-6767/D079755023B40D32?sharingId=199EBDCB37909FB4",
        },
        color: "#31b688",
        atmosphere: "#a8f5d8",
        radius: 1.1,
      },
      {
        id: "cert-azure-ai",
        name: "Azure AI Fundamentals",
        description:
          "Microsoft certification covering artificial intelligence and machine learning concepts and the related services available in Azure.",
        meta: "Microsoft · Issued Jan 2026",
        tags: ["Azure AI", "Machine Learning", "Cloud"],
        link: {
          label: "View credential",
          url: "https://learn.microsoft.com/api/credentials/share/nb-no/EirikEngenKvam-6767/7276987C1D928A76?sharingId=199EBDCB37909FB4",
        },
        color: "#289f72",
        atmosphere: "#99e8c8",
        radius: 1.1,
      },
      {
        id: "cert-azure-fundamentals",
        name: "Azure Fundamentals",
        description:
          "Microsoft certification covering cloud concepts, Azure architecture and services, and Azure management and governance.",
        meta: "Microsoft · Issued Dec 2025",
        tags: ["Azure", "Cloud", "Governance"],
        link: {
          label: "View credential",
          url: "https://learn.microsoft.com/api/credentials/share/nb-no/EirikEngenKvam-6767/96408B3814CB926A?sharingId=199EBDCB37909FB4",
        },
        color: "#238f66",
        atmosphere: "#8eddbd",
        radius: 1.1,
      },
      {
        id: "cert-microsoft-365",
        name: "Microsoft 365 Fundamentals",
        description:
          "Microsoft certification covering Microsoft 365 applications and services, security and compliance capabilities, and cloud-based productivity concepts.",
        meta: "Microsoft · Issued Sep 2025",
        tags: ["Microsoft 365", "Cloud", "Security"],
        link: {
          label: "View credential",
          url: "https://learn.microsoft.com/api/credentials/share/en-us/EirikEngenKvam-6767/D118461A4480108A",
        },
        color: "#1f805d",
        atmosphere: "#83cfae",
        radius: 1.1,
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
        id: "skill-web-frontend",
        name: "Web & Frontend",
        description:
          "Web and frontend technologies I have worked with.",
        tags: ["React.js", "Next.js", "TypeScript", "JavaScript", "HTML5", "CSS", "Tailwind CSS", "Figma"],
        color: "#e879f9",
        atmosphere: "#f5d0fe",
        radius: 1.6,
      },
      {
        id: "skill-backend-api",
        name: "Backend & API",
        description:
          "Backend languages, frameworks and API technologies I have experience with.",
        tags: ["Python", "C#", "ASP.NET", "Java", "GraphQL", "Swagger", "Assembly"],
        color: "#c084fc",
        atmosphere: "#e9d5ff",
        radius: 1.6,
      },
      {
        id: "skill-databases",
        name: "Databases",
        description:
          "Database technologies I have worked with.",
        tags: ["PostgreSQL", "SQL", "SQLite", "MongoDB"],
        color: "#a78bfa",
        atmosphere: "#ddd6fe",
        radius: 1.6,
      },
      {
        id: "skill-devops-tools",
        name: "DevOps & Tools",
        description:
          "Deployment platforms and development tools I have used.",
        tags: ["Docker", "Git", "Vercel", "Netlify", "Azure"],
        color: "#f472b6",
        atmosphere: "#fbcfe8",
        radius: 1.6,
      },
      {
        id: "skill-cms-platforms",
        name: "CMS & Web Platforms",
        description:
          "Content management systems and web platforms I have worked with.",
        tags: ["Sanity CMS", "WordPress"],
        color: "#d96ccf",
        atmosphere: "#f7c3ef",
        radius: 1.6,
      },
      {
        id: "skill-it-infrastructure",
        name: "IT Operations & Infrastructure",
        description:
          "Infrastructure and workplace management technologies I have supported.",
        tags: ["Active Directory", "Microsoft Entra ID (Azure AD)", "Microsoft Intune", "Windows Server", "Citrix", "Remote Desktop Manager", "Adaxes"],
        color: "#b565d4",
        atmosphere: "#e8c3f5",
        radius: 1.6,
      },
      {
        id: "skill-itsm-collaboration",
        name: "ITSM & Collaboration",
        description:
          "Service management and collaboration tools and methods I have used.",
        tags: ["ServiceNow", "Microsoft 365", "Exchange", "Teams", "Office", "Scrum"],
        color: "#9f65cf",
        atmosphere: "#ddc5f2",
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
