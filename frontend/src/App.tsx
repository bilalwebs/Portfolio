import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/scroll-progress";
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
import { BackToTop } from "@/components/back-to-top";
import { CustomCursor } from "@/components/custom-cursor";
import { Preloader } from "@/components/preloader";
import { ProjectsPage } from "@/pages/projects";
import { CertificatesPage } from "@/pages/certificates";
import { NotFound } from "@/pages/not-found";

function HomePage() {
  return (
    <>
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
      <BackToTop />
      <Chatbot />
    </>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <div className="dark min-h-screen overflow-x-clip bg-background text-foreground md:cursor-none md:[&_*]:cursor-none">
        <ScrollProgress />
        <Preloader />
        <CustomCursor />
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/certificates" element={<CertificatesPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
