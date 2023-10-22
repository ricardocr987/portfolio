import About from "@/components/about";
import Contact from "@/components/contact";
import Experience from "@/components/experience";
import Header from "@/components/header";
import Intro from "@/components/intro";
import Projects from "@/components/projects";
import Skills from "@/components/skills";

export default function Home() {
  return (
    <main className="flex flex-col items-center px-4 mt-32">
      <Header />
      <Intro />
      <About />
      <Projects />
      <Skills />
      <Experience />
      <Contact />
    </main>
  );
}
