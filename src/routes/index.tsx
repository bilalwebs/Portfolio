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
      { title: "Aiden Vector — Full-Stack Engineer & UI Architect" },
      {
        name: "description",
        content:
          "Portfolio of Aiden Vector — full-stack engineer and UI architect crafting fast, delightful, production-ready web experiences.",
      },
      { property: "og:title", content: "Aiden Vector — Full-Stack Engineer & UI Architect" },
      {
        property: "og:description",
        content:
          "Portfolio of Aiden Vector — full-stack engineer and UI architect crafting fast, delightful, production-ready web experiences.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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
