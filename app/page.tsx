import { Suspense } from "react";
import Hero from "@/components/landingPage/Hero";
import About from "@/components/landingPage/About";
import Audience from "@/components/landingPage/Audience";
import Framework from "@/components/landingPage/Framework";
import Initiatives from "@/components/landingPage/Initiatives";
import Blogs from "@/components/landingPage/Blogs";
import Impact from "@/components/landingPage/Impact";
import Contact from "@/components/landingPage/Contact";
import { getCourses } from "@/app/actions/courseActions";
import { getPublishedBlogs } from "@/app/actions/blogActions";

async function LiveInitiatives() {
  const courses = await getCourses();
  return <Initiatives courses={courses} />;
}

async function LiveBlogs() {
  const blogs = await getPublishedBlogs();
  return <Blogs blogs={blogs} />;
}

function InitiativesSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-space-3xl px-margin py-space-3xl lg:px-margin-desktop animate-pulse">
      <div className="h-6 w-48 rounded bg-primary/10" />
      <div className="grid grid-cols-1 items-center gap-gutter-desktop lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-5">
          <div className="h-8 w-16 bg-primary/10 rounded" />
          <div className="h-10 w-3/4 bg-primary/10 rounded" />
          <div className="h-20 w-full bg-primary/5 rounded" />
        </div>
        <div className="aspect-[16/10] w-full bg-primary/10 rounded lg:col-span-7" />
      </div>
    </div>
  );
}

function BlogsSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-space-2xl px-margin py-space-3xl lg:px-margin-desktop animate-pulse">
      <div className="h-6 w-64 rounded bg-primary/10" />
      <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-3">
        <div className="h-64 rounded bg-primary/5 border border-primary/10 p-6" />
        <div className="h-64 rounded bg-primary/5 border border-primary/10 p-6" />
        <div className="h-64 rounded bg-primary/5 border border-primary/10 p-6" />
      </div>
    </div>
  );
}

/**
 * Landing page root Server Component.
 * Employs React Suspense streaming for dynamic course curricula and monograph field notes,
 * enabling instant partial prerendering under Next.js 16.
 */
export default function Home() {
  return (
    <main className="w-full bg-cream text-primary">
      <Hero />
      <About />
      <Audience />
      <Framework />
      <Suspense fallback={<InitiativesSkeleton />}>
        <LiveInitiatives />
      </Suspense>
      <Suspense fallback={<BlogsSkeleton />}>
        <LiveBlogs />
      </Suspense>
      <Impact />
      <Contact />
    </main>
  );
}
