import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Timeline } from "@/components/sections/timeline";
import { Skills } from "@/components/sections/skills";
import { Projects } from "@/components/sections/projects";
import { Process } from "@/components/sections/process";
import { Recognition } from "@/components/sections/recognition";
import { Certificates } from "@/components/sections/certificates";
import { Contact } from "@/components/sections/contact";
import { Chatbot } from "@/components/chatbot";
import { CustomCursor } from "@/components/custom-cursor";
import { Preloader } from "@/components/preloader";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
meta: [
  {
    title: "Muhammad Bilal Hussain | AI Engineer & Full-Stack Developer",
  },
  {
    name: "description",
    content:
      "Portfolio of Muhammad Bilal Hussain, an AI Engineer and Full-Stack Developer specializing in Agentic AI, FastAPI, React, Next.js, LangChain, LangGraph, Retrieval-Augmented Generation (RAG), and Large Language Models.",
  },
  {
    property: "og:title",
    content: "Muhammad Bilal Hussain | AI Engineer & Full-Stack Developer",
  },
  {
    property: "og:description",
    content:
      "Explore Muhammad Bilal Hussain's portfolio showcasing AI-powered applications, Agentic AI, full-stack projects, hackathons, certifications, and software engineering expertise.",
  },
  {
    property: "og:type",
    content: "website",
  },
  {
    name: "twitter:card",
    content: "summary_large_image",
  },
  {
    name: "twitter:title",
    content: "Muhammad Bilal Hussain | AI Engineer & Full-Stack Developer",
  },
  {
    name: "twitter:description",
    content:
      "Portfolio of Muhammad Bilal Hussain featuring AI, Agentic AI, FastAPI, React, Next.js, LangChain, LangGraph, and modern software projects.",
  },
  {
    name: "keywords",
    content:
      "Muhammad Bilal Hussain, AI Engineer, Full Stack Developer, Agentic AI, FastAPI, React, Next.js, LangChain, LangGraph, RAG, Python, Portfolio",
  },
  {
    name: "author",
    content: "Muhammad Bilal Hussain",
  },
],
  }),
});

function Index() {
  return (
    <div className="dark min-h-screen overflow-x-clip bg-background text-foreground md:cursor-none md:[&_*]:cursor-none">
      <Preloader />
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Timeline />
        <Skills />
        <Process />
        <Projects />
        <Recognition />
        <Certificates />
        <Contact />
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}
