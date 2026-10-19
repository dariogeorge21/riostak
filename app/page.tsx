import Hero from "@/components/landingPage/Hero";
import About from "@/components/landingPage/About";
import Audience from "@/components/landingPage/Audience";
import Framework from "@/components/landingPage/Framework";
import Initiatives from "@/components/landingPage/Initiatives";
import Impact from "@/components/landingPage/Impact";
import Contact from "@/components/landingPage/Contact";

export default function Home() {
  return (
    <main className="w-full bg-cream text-primary">
      <Hero />
      <About />
      <Audience />
      <Framework />
      <Initiatives />
      <Impact />
      <Contact />
    </main>
  );
}
