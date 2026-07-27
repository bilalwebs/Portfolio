import profileImg from "@/assets/profile.jpg";
import aboutImg from "@/assets/about.jpg";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";
import project4 from "@/assets/project-4.jpg";
import cert1 from "@/assets/cert-1.jpg";
import cert2 from "@/assets/cert-2.jpg";
import cert3 from "@/assets/cert-3.jpg";

export const profile = {
  name: "Aiden Vector",
  role: "Full-Stack Engineer & UI Architect",
  greeting: "Hello, I'm",
  tagline:
    "I craft high-performance, delightful web experiences at the edge of design and engineering — turning complex product ideas into pixel-precise, production-ready interfaces.",
  location: "Remote · Berlin, DE",
  email: "hello@aidenvector.dev",
  phone: "+49 30 5555 0182",
  resumeUrl: "#",
  image: profileImg,
  aboutImage: aboutImg,
};

export const stats = [
  { label: "Years Experience", value: "6+" },
  { label: "Projects Shipped", value: "80+" },
  { label: "Certificates", value: "14" },
  { label: "Happy Clients", value: "40+" },
];

export const socials = [
  { name: "GitHub", href: "https://github.com", icon: "Github" as const },
  { name: "LinkedIn", href: "https://linkedin.com", icon: "Linkedin" as const },
  { name: "Twitter", href: "https://twitter.com", icon: "Twitter" as const },
  { name: "Dribbble", href: "https://dribbble.com", icon: "Dribbble" as const },
];

export const journey = [
  {
    type: "Education",
    title: "B.Sc. Computer Science",
    org: "Technical University of Berlin",
    period: "2016 — 2020",
    description:
      "Focused on human–computer interaction, distributed systems, and applied ML. Graduated with honors.",
  },
  {
    type: "Internship",
    title: "Frontend Intern",
    org: "Prism Labs",
    period: "2019",
    description:
      "Shipped design-system primitives used across 12 internal tools. Built the first accessibility audit pipeline.",
  },
  {
    type: "Experience",
    title: "Product Engineer",
    org: "Northwave Studio",
    period: "2020 — 2022",
    description:
      "Led the rebuild of the flagship SaaS dashboard. Cut TTI by 62% and increased retention by 24%.",
  },
  {
    type: "Experience",
    title: "Senior Full-Stack Engineer",
    org: "Halcyon AI",
    period: "2022 — Present",
    description:
      "Architecting agentic tooling and realtime interfaces used by 40k+ makers. Mentoring a team of 5.",
  },
  {
    type: "Achievement",
    title: "Awwwards Site of the Day",
    org: "Awwwards",
    period: "2024",
    description:
      "Recognized for a generative motion portfolio built with WebGL, Motion, and a custom shader stack.",
  },
];

export const skills = {
  Frontend: [
    { name: "React / Next.js", level: 96 },
    { name: "TypeScript", level: 94 },
    { name: "Tailwind CSS", level: 95 },
    { name: "Motion / GSAP", level: 88 },
  ],
  Backend: [
    { name: "Node.js / Bun", level: 92 },
    { name: "PostgreSQL", level: 86 },
    { name: "GraphQL", level: 80 },
    { name: "Edge Functions", level: 84 },
  ],
  Tools: [
    { name: "Git / GitHub", level: 95 },
    { name: "Figma", level: 90 },
    { name: "Docker", level: 78 },
    { name: "Vite / Turbo", level: 88 },
  ],
  AI: [
    { name: "LLM App Design", level: 90 },
    { name: "Vector Search", level: 82 },
    { name: "Prompt Engineering", level: 88 },
    { name: "Agent Tooling", level: 78 },
  ],
};

export const projects = [
  {
    title: "Halcyon Command Center",
    description:
      "A realtime observability suite for agentic workflows. Streams 12M events/day with sub-100ms UI updates.",
    image: project1,
    tech: ["Next.js", "tRPC", "Postgres", "Motion"],
    github: "https://github.com",
    demo: "https://example.com",
  },
  {
    title: "Northwave Commerce",
    description:
      "Headless e-commerce storefront optimized for edge rendering. Ranked in the top 1% Lighthouse scores.",
    image: project2,
    tech: ["Remix", "Shopify", "Tailwind"],
    github: "https://github.com",
    demo: "https://example.com",
  },
  {
    title: "Nova Chat",
    description:
      "Multi-model AI assistant with agent tools, RAG, and a beautifully minimal command interface.",
    image: project3,
    tech: ["React", "OpenAI", "Supabase"],
    github: "https://github.com",
    demo: "https://example.com",
  },
  {
    title: "Pulse Analytics",
    description:
      "Zero-config product analytics with cohort explorer, funnels, and AI-generated insight briefings.",
    image: project4,
    tech: ["TanStack", "Clickhouse", "D3"],
    github: "https://github.com",
    demo: "https://example.com",
  },
];

export const certificates = [
  {
    title: "Advanced React Patterns",
    org: "Frontend Masters",
    image: cert1,
    href: "#",
  },
  {
    title: "System Design Professional",
    org: "Educative",
    image: cert2,
    href: "#",
  },
  {
    title: "Generative AI Specialist",
    org: "DeepLearning.AI",
    image: cert3,
    href: "#",
  },
];

export const recognitions = [
  {
    tag: "Hackathon",
    title: "NCAI Hackathon, NUCES",
    description:
      "Top 6 finalist, placing in the Top 50 of 10,000 teams with ProctorVision AI. Special recognition from Prof. Fan Zhang of Zhejiang University.",
    status: null as null | "Results Pending",
  },
  {
    tag: "Hackathon",
    title: "AMD Developer Hackathon: ACT II",
    description:
      "Led the team that built LogiSecure, an on-premise AI logistics copilot on AMD ROCm.",
    status: "Results Pending" as const,
  },
  {
    tag: "Hackathon",
    title: "Vibe Coding Hackathon 2026",
    description:
      "Led the team that built Gulzareen, turning crop residue into farmer income.",
    status: "Results Pending" as const,
  },
  {
    tag: "Hackathon",
    title: "OpenAI Build Week",
    description: "Built Markdown Lens, a privacy-first in-browser Markdown viewer.",
    status: null,
  },
  {
    tag: "Kaggle",
    title: "Digit Recognizer",
    description: "Ranked 73rd of 3,380 participants.",
    status: null,
  },
  {
    tag: "Kaggle",
    title: "Titanic, ML from Disaster",
    description: "Ranked 219th of 45,633 participants.",
    status: null,
  },
  {
    tag: "Award",
    title: "UET Merit Scholarship",
    description:
      "A1 merit-category admission and the Merit Scholarship reserved for the top 50 of the incoming cohort.",
    status: null,
  },
  {
    tag: "Recognition",
    title: "Teaching Assistant",
    description:
      "Selected on core-course performance to support a 250-student junior batch in programming fundamentals and OOP.",
    status: null,
  },
  {
    tag: "Certification",
    title: "CS50x and applied AI",
    description:
      "Harvard CS50x, plus computer vision and ML explainability tracks on Kaggle and Nvidia RAG.",
    status: null,
  },
];

export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Journey", href: "#journey" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Recognition", href: "#recognition" },
  { label: "Certificates", href: "#certificates" },
  { label: "Contact", href: "#contact" },
];
