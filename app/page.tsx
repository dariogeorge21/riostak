import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/landingPage/Hero";
import Section1 from "@/components/landingPage/Section1";
import Section2 from "@/components/landingPage/Section2";
import Section3 from "@/components/landingPage/Section3";
import Section4 from "@/components/landingPage/Section4";
import Section5 from "@/components/landingPage/Section5";
import Section6 from "@/components/landingPage/Section6";

export default function Home() {
  return (
    <>
      <Header />
      <main className="w-full bg-cream pt-20 text-primary">
        <Hero />
        <Section1 />
        <Section2 />
        <Section3 />
        <Section4 />
        <Section5 />
        <Section6 />
      </main>
      <Footer />
    </>
  );
}
