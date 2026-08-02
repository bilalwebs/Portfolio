import profileImg from "@/assets/profile.jpg";
import aboutImg from "@/assets/about.png";
import project1 from "@/assets/Gulzaren.jpeg";
import project2 from "@/assets/amd.jpeg";
import project3 from "@/assets/mentor.jpeg";
import project4 from "@/assets/project-4.jpg";
import cert1 from "@/assets/cert-1.PNG";
import cert2 from "@/assets/cert-2.jpg";
import cert3 from "@/assets/cert-3.jpg";
import cert4 from "@/assets/cert-4.png";
import cert5 from "@/assets/cert-5.PNG";

export const profile = {
  name: "Muhammad Bilal Hussain",
  role:"AI Engineer | Full-Stack Engineer",
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
    "Computer Vision",
    "Docker",
    "Vercel"
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
  title: "Python For Data Science - Real Time Coding Exercises",
  org: "Udemy",
  issuer: "Data Science Lovers",
  issued: "June 2024",
  credentialId: "UC-a30de616-e8b4-45a4-89e6-f150824664ee",
  image: cert5,
  href: "https://www.udemy.com/certificate/UC-a30de616-e8b4-45a4-89e6-f150824664ee/",
}
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
    "Developed an AI-powered video captioning platform that generates multiple caption styles from a single video using Vision Language Models, FFmpeg, FastAPI, and automated LLM-based quality evaluation.",
  status: "Results Pending",
},
  {
  tag: "Hackathon",
  title: "DYLP Vibe Coding Hackathon 2026",
  description:
    "Developed 'Gulzareen', an AI-powered crop residue classification platform that helps farmers identify agricultural waste, estimate market value, discover reuse opportunities, and reduce crop burning through computer vision and AI.",
  status: "Results Pending",
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
