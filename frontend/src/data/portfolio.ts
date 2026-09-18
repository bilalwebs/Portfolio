import profileImg from "@/assets/profile.jpg";
import aboutImg from "@/assets/about.png";
import project1 from "@/assets/Gulzaren.jpeg";
import project2 from "@/assets/amd.jpeg";
import project3 from "@/assets/mentor.jpeg";
import project5 from "@/assets/project-5.jpeg";
import project6 from "@/assets/project-6.PNG";
import project7 from "@/assets/project-8.PNG";
import project8 from "@/assets/project-9.png";
import project9 from "@/assets/project-7.PNG";
import project10 from "@/assets/project-10.png";
import cert1 from "@/assets/cert-1.PNG";
import cert2 from "@/assets/cert-2.jpg";
import cert3 from "@/assets/cert-3.jpg";
import cert4 from "@/assets/cert-4.png";
import cert5 from "@/assets/cert-5.PNG";
import cert6 from "@/assets/cert-6.jpeg";
import cert7 from "@/assets/cert-7.png";
import cert8 from "@/assets/cert-8.png";
import cert9 from "@/assets/cert-9.PNG";
import cert10 from "@/assets/cert-10.PNG";

export const profile = {
  name: "Muhammad Bilal Hussain",
  role:"AI Engineer | Full-Stack Engineer | Agentic AI ",
  greeting: "Hello, I'm",
tagline:
  "Building intelligent AI applications and scalable full-stack solutions with Python, FastAPI, React, Next.js, and Large Language Models—focused on solving real-world problems through modern software engineering.",
  location: "Karachi, Pakistan",
  email: "bilalhussain42201@gmail.com",
  phone: "+92 335 2009245",
  resumeUrl: "/resume/Bilal_Hussain.pdf",
  image: profileImg,
  aboutImage: aboutImg,
};

export const stats = [
  { label: "Projects", value: "15+" },
  { label: "Hackathons", value: "4+" },
  { label: "Certificates", value: "10+" },
  { label: "Technologies", value: "25+" },
];

export const socials = [
  { name: "GitHub", href: "https://github.com/bilalwebs", icon: "Github" as const },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/bilal-hussain-dev/", icon: "Linkedin" as const },
  { name: "Hugging Face", href: "https://huggingface.co/BilalCode", icon: "Huggingface" as const },
  // { name: "Twitter", href: "https://twitter.com", icon: "Twitter" as const },
  // { name: "Dribbble", href: "https://dribbble.com", icon: "Dribbble" as const },
];

export const journey = [
  {
    type: "Education",
    title: "Matriculation",
    org: "Takbeer Secondary School, Karachi",
    period: "2020",
    description:
      "Completed Science from the Board of Secondary Education Karachi.",
  },
  {
    type: "Education",
    title: "Intermediate (Pre-Engineering)",
    org: "Aisha Bawany Government College, Karachi",
    period: "2022",
    description:
      "Completed Pre-Engineering from the Board of Intermediate Education Karachi.",
  },
  {
    type: "Education",
    title: "BS Software Engineering (Ongoing)",
    org: "Sindh Madressatul Islam University (SMIU), Karachi",
    period: "2022 – Present",
    description:
      "Pursuing a Bachelor's degree in Software Engineering with a focus on Artificial Intelligence, Full-Stack Development, Agentic AI, and modern software engineering practices.",
  },
  {
    type: "Certification",
    title: "Certified Cloud Applied Generative AI Engineer",
    org: "Governor House Karachi",
    period: "2024 – Present",
    description:
      "Comprehensive training in Generative AI, Agentic AI, Cloud Computing, FastAPI, LangChain, LangGraph, RAG, and production-ready AI application development.",
  },
  {
    type: "Experience",
    title: "Front-end AI Engineer Intern",
    org: "FlyRank AI",
    period: "Jun 2026 – Present",
    description:
      "Accepted into FlyRank AI's Front-end AI Engineering Internship (July 2026 Cohort). Working remotely on AI-powered frontend development, building modern user interfaces, and integrating Artificial Intelligence technologies into real-world applications.",
  },
];

export const skills = {
  Frontend: [
    { name: "HTML5", level: 80 },
    { name: "CSS3", level: 78 },
    { name: "JavaScript (ES6+)", level: 75 },
    { name: "React.js", level: 72 },
    { name: "Next.js", level: 65 },
    { name: "Tailwind CSS", level: 75 },
  ],

  Backend: [
    { name: "Python", level: 88 },
    { name: "FastAPI", level: 85 },
    { name: "SQLAlchemy", level: 82 },
    { name: "SQLite", level: 85 },
    { name: "JWT Authentication", level: 80 },
    { name: "REST APIs", level: 85 },
  ],

  AI: [
    { name: "Agentic AI", level: 85 },
    { name: "LangChain", level: 82 },
    { name: "LangGraph", level: 75 },
    { name: "RAG", level: 80 },
    { name: "Prompt Engineering", level: 82 },
    { name: "LLM Integration", level: 80 },
  ],

  Tools: [
    { name: "Git & GitHub", level: 85 },
    { name: "VS Code", level: 90 },
    { name: "Postman", level: 80 },
    { name: "Streamlit", level: 82 },
    { name: "Vercel", level: 75 },
    { name: "Docker", level: 60 },
  ],
};
export const projects = [
  {
  title: "Gulzareen – AI Crop Residue Classification Platform",
  description:
    "An AI-powered platform that classifies agricultural crop residue from smartphone images, estimates market value, recommends reuse opportunities, detects contamination, and calculates CO₂ emissions using Computer Vision and Machine Learning.",
  image: project1,
  tech: [
  "Python",
  "FastAPI",
  "React",
  "TypeScript",
  "ONNX Runtime",
  "Azure Custom Vision",
  "Computer Vision",
],
  github: "https://github.com/bilalwebs/Gulzareen",
  demo: "https://gulzareen.vercel.app/",
},
{
  title: "AMD Video Captioning AI",
  description:
    "An AI-powered video captioning platform that generates multiple caption styles from a single video using Vision Language Models, FFmpeg, FastAPI, and automated LLM-based quality evaluation.",
  image: project2,
  tech: [
    "Python",
    "FastAPI",
    "Fireworks AI",
    "Vision LLM",
    "FFmpeg",
    "HTML",
    "JavaScript"
  ],
  github: "https://github.com/bilalwebs/AMD-Hackathon",
  demo: "https://amd-hackathon.streamlit.app/",
},
{
  title: "Qwen Multi-Agent Automation System",
  description:
    "A production-ready multi-agent AI system built on Qwen Cloud that automates complex workflows through intelligent task planning, tool calling, memory, and collaborative AI agents.",
  image: project3,
  tech: [
    "Python",
    "FastAPI",
    "Qwen",
    "Agentic AI",
    "LLMs",
    "React"
  ],
  github: "https://github.com/bilalwebs/MentorOS",
  demo: "https://mentoros-ai.vercel.app/",
},
{
  title: "SmartHire – AI-Powered Smart Recruitment Platform",
  description:
    "A production-oriented AI-assisted recruitment and ATS platform with explainable hybrid candidate matching, multi-tenant workspaces, secure authentication, resume analysis, and human-in-the-loop hiring workflows.",
  image: project5,
  tech: [
    "React",
    "TypeScript",
    "Vite",
    "Python",
    "FastAPI",
    "PostgreSQL",
    "SQLAlchemy",
    "Google Gemini",
    "scikit-learn",
    "JWT",
    "Docker",
    "Nginx"
  ],
  github: "https://github.com/mazhar-naseer/AI-Powered-Smart-Recruitment",
  demo: "https://smarthire-prod.vercel.app/",
},
{
  title: "RedStore – Ecommerce Website Design",
  description:
    "A fully responsive, modern ecommerce frontend for a sportswear and fitness fashion store. Built with pure HTML, CSS, and vanilla JavaScript — featuring product catalog, single product gallery, cart, and account pages.",
  image: project6,
  tech: [
    "HTML5",
    "CSS3",
    "JavaScript (ES6)",
    "Responsive Design",
    "Font Awesome"
  ],
  github: "https://github.com/bilalwebs/RedStore-Ecommerce-Website-Design",
  demo: "https://redstore-bybilal.vercel.app/",
},
{
  title: "Cara – Ecommerce Website",
  description:
    "A fully responsive, multipage ecommerce front-end for a fashion retail store, built with vanilla HTML, CSS, and JavaScript — featuring product catalog, single product gallery, blog, cart, and checkout flow.",
  image: project7,
  tech: [
    "HTML5",
    "CSS3",
    "JavaScript (ES6)",
    "Responsive Design",
    "Font Awesome"
  ],
  github: "https://github.com/bilalwebs/Cara-Ecommerce",
  demo: "https://cara-store-by-bilal.vercel.app/",
},
{
  title: "GIAIC Website Clone",
  description:
    "A pixel-perfect, fully responsive frontend recreation of the official Governor Sindh Initiative for Artificial Intelligence, Web 3.0 & Metaverse (GIAIC) website. Built with Next.js, React, TypeScript, and Tailwind CSS, featuring modern UI, optimized performance, and SEO-ready architecture.",
  image: project8,
  tech: [
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "App Router",
    "Responsive Design"
  ],
  github: "https://github.com/bilalwebs/giaic-website-clone",
  demo: "https://bilal-giaic.vercel.app/",
},
{
  title: "Flight Assistant AI",
  description:
    "A full-stack AI flight booking platform built with Next.js frontend, FastAPI backend, and a conversational travel assistant powered by the OpenAI Agents SDK and Gemini/Groq. Features secure JWT authentication, real-time seat availability, automated PNR generation, and server-authoritative pricing.",
  image: project10, 
  tech: [
    "Next.js",
    "React",
    "TypeScript",
    "FastAPI",
    "Python",
    "OpenAI Agents SDK",
    "Tailwind CSS",
    "SQLite",
  ],
  github: "https://github.com/bilalwebs/flight_assistant",
  demo: "https://bilal-flight-assistant.vercel.app/",
},
{
  title: "Civic Voice – AI-Powered Civic Complaint Generator",
  description:
    "A Streamlit-based web application that converts informal descriptions of civic problems into professional, structured complaint letters. Features smart priority detection, AI generation via Google Gemini with robust template fallback, multi-language input awareness (English/Urdu/Roman Urdu), department routing, and multi-format export (TXT, DOCX, PDF, mailto, QR code).",
  image: project11, 
  tech: [
    "Python",
    "Streamlit",
    "Google Gemini",
    "python-docx",
    "fpdf2",
    "qrcode",
    "Pillow",
  ],
  github: "https://github.com/bilalwebs/civic-voice",
  demo: "https://civic-voice.streamlit.app/",
},
];
export const certificates = [
  {
    title: "CS50x Puzzle Day 2026",
    org: "Harvard University",
    image: cert1,
    href: "https://certificates.cs50.io/2d097c23-246c-466c-a75b-2b10e650eeed.pdf?size=letter",
  },
  {
    title: "Postman API Fundamentals Student Expert",
    org: "Postman",
    image: cert4,
    href: "https://badges.parchment.com/public/assertions/L2grLLy3T3CDLg-tcZEaYA",
  },
  {
    title: "Stanford Code in Place: Programming Methodologies",
    org: "Stanford University",
    image: cert3,
    href: "https://codeinplace.stanford.edu/cip5/certificate/o3h6t1",
  },
  {
    title: "Legacy Responsive Web Design V8",
    org: "freeCodeCamp",
    image: cert2,
    href: "https://www.freecodecamp.org/certification/bilalcode1/responsive-web-design",
  },
  {
  title: "Certificate of Achievement – Top 30 Innovative Projects",
  org: "Digital Youth Leadership Program (DYLP)",
  image: cert6,
  href: "https://drive.google.com/file/d/1Q52FpBlSgbjTOiKKh1LKXjtVkEvCncQW/view?usp=sharing",
},
  {
  title: "Python For Data Science - Real Time Coding Exercises",
  org: "Udemy",
  issuer: "Data Science Lovers",
  issued: "June 2024",
  credentialId: "UC-a30de616-e8b4-45a4-89e6-f150824664ee",
  image: cert5,
  href: "https://www.udemy.com/certificate/UC-a30de616-e8b4-45a4-89e6-f150824664ee/",
},
{
    title: "NativeBuilder: Build Without Limits",
    org: "AI Factory",
    image: cert7,
    href: "https://lablab.ai/u/@bilalhussain-dev/ai-hackathons/nativebuilder-build-without-limits/certificate",
  },
{
    title: "AMD Developer Hackathon: ACT II",
    org: "AMD",
    image: cert8,
    href: "https://lablab.ai/u/@Slick_Silkw514/ai-hackathons/amd-developer-hackathon-act-ii/certificate",
  },
  {
  title: "AI Fluency Internship Program",
  org: "FlyRank.ai",
  image: cert9, 
  href: "https://drive.google.com/file/d/1ahWNFrSaR7sgG5oBb3xrJmYCmjNm_xbc/view?usp=sharing",
},
{
  title: "Front-end AI Engineering Internship Program",
  org: "FlyRank.ai",
  image: cert10,
  href: "https://drive.google.com/file/d/1UY50OukNv1Aus1darDSjUqpysDFoloWe/view?usp=sharing",
},
];
export const recognitions = [
  {
    tag: "Hackathon",
    title: "Global AI Hackathon Series with Qwen Cloud",
    description:
      "Developed a production-ready AI agent using Qwen Cloud, multi-agent workflows, cloud deployment, and LLM-powered automation for the international AI hackathon.",
    status: "Results Pending",
  },

  {
    tag: "Hackathon",
    title: "AMD Developer Hackathon: ACT II",
    description:
      "Developed an AI-powered video captioning platform for AMD Hackathon Track 2, generating four caption styles from video using Vision Language Models, FastAPI, FFmpeg, and LLM-based evaluation.",
    status: "Track 2 — Video Captioning",
  },

  {
    tag: "Hackathon",
    title: "DYLP Vibe Coding Hackathon 2026",
    description:
      "Built 'Gulzareen', an AI-powered crop residue classification platform that helps farmers identify agricultural waste, estimate market value, discover reuse opportunities, and reduce crop burning through computer vision and AI.",
    status: "Top 30 Innovative Projects",
  },

  {
    tag: "Hackathon",
    title: "NativeBuilder: Build Without Limits",
    description:
      "Participated in the NativeBuilder: Build Without Limits AI hackathon organized by AI Factory, developing an AI-powered project as part of the hackathon.",
    status: "Certificate of Participation",
  },
];

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Certificates", href: "#certificates" },
  { label: "Contact", href: "#contact" },
];
