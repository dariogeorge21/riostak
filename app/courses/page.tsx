import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowDownwardIcon, ArrowForwardIcon } from "@/components/Icons";
import CourseQuoteSection, {
  type CourseOffering,
} from "@/components/courses/CourseQuoteSection";
import { getCourses } from "@/app/actions/courseActions";
import { courseItemToOffering } from "@/utils/courseTypes";

export const metadata: Metadata = {
  title: "Courses — RIOSTAK | Curricula, Research & Educational Guidance",
  description:
    "Explore RIOSTAK's core academic offerings: Courses and Learning Resources, Research & Insights, and Educational Content & Guidance, with open video lectures available to watch now.",
};

const INITIAL_FALLBACK_COURSES: readonly CourseOffering[] = [
  {
    id: "courses-and-learning-resources",
    index: "01",
    title: "Courses and Learning Resources",
    subtitle:
      "Autonomous digital modules paired with rigorous weekly faculty dialogues for enduring cognitive and somatic competency.",
    tags: "Online • Immersive Academics • Cohorts",
    body: "Structured curricula combining autonomous digital modules with rigorous weekly faculty dialogues. From foundational neuroscience to advanced contemplative practice, participants cultivate verifiable internal competencies through sustained, evidence-based inquiry.",
    extendedBody:
      "Designed for universities, leadership fellowships, and dedicated learning cohorts, this curriculum bridges empirical cognitive science with structured contemplative praxis across a twelve-week semester.",
    format: "Digital Modules + Live Seminars",
    syllabusHighlights: [
      "Foundational Neuroscience & Metacognition",
      "Weekly Faculty Dialogues & Socratic Labs",
      "Somatic Regulation & Autonomic Resilience",
      "Audited Competency & Cohort Certification",
    ],
    youtubeUrl: "https://www.youtube.com/watch?v=inpok4MKVLM",
    imageSrc: "/images/offering-courses.jpg",
    imageAlt: "RIOSTAK immersive cohort in session",
    caption: "Curriculum // Autumn 2026",
    frameClassName: "bg-primary-container",
    accentClassName: "-bottom-3 -right-3 h-2/3 w-2/3 bg-secondary-container",
    imageClassName: "",
  },
  {
    id: "research-and-insights",
    index: "02",
    title: "Research & Insights",
    subtitle:
      "Multidisciplinary empirical inquiry, longitudinal flourishing indices, and validated diagnostic instruments.",
    tags: "Multidisciplinary Empirical Inquiry • Field Trials",
    body: "Our independent lab produces peer-reviewed working papers, longitudinal flourishing indices, and validated diagnostic tools. We collaborate globally with university departments to interrogate what conditions genuinely sustain human vitality across lifespan stages.",
    extendedBody:
      "Institutions and research departments can license our longitudinal measurement frameworks, commission collaborative field trials, or integrate our empirical methodology workshops into graduate seminars.",
    format: "Research Seminars & Field Kits",
    syllabusHighlights: [
      "Longitudinal Flourishing Index Licensing",
      "Validated Psychometric & Somatic Diagnostics",
      "Collaborative University Field Trial Protocols",
      "Peer-Reviewed Working Paper Seminars",
    ],
    youtubeUrl: "https://www.youtube.com/watch?v=O-6f5wQXSu8",
    imageSrc: "/images/offering-research.jpg",
    imageAlt: "RIOSTAK empirical white papers and monographs",
    caption: "Open Access // Monographs",
    frameClassName: "bg-secondary-container",
    accentClassName: "-bottom-3 -left-3 h-2/3 w-2/3 bg-primary",
    imageClassName: "grayscale-[15%]",
  },
  {
    id: "educational-content-and-guidance",
    index: "03",
    title: "Educational Content & Guidance",
    subtitle:
      "Daily contemplative praxis, micro-learning field notes, and actionable clinical toolkits for organizations and communities.",
    tags: "Daily Praxis • Micro-Learning • Open Toolkits",
    body: "Accessible audio contemplation, daily field notes, and interactive toolkits formulated for immediate practical application. We demystify ancient wisdom and modern clinical practices into actionable, unpretentious five-minute daily practices.",
    extendedBody:
      "Ideal for community organizations, educators, and civic institutions seeking turnkey audio libraries, printed field manuals, and structured daily micro-learning tracks without multi-month scheduling overhead.",
    format: "Audio Library & Field Manuals",
    syllabusHighlights: [
      "Guided Five-Minute Somatic & Audio Praxis",
      "Printable Educator & Community Field Notes",
      "Relational Safety & Conflict Repair Toolkits",
      "Turnkey Institutional Library Integration",
    ],
    youtubeUrl: "https://www.youtube.com/watch?v=w6T02g5hnT4",
    imageSrc: "/images/offering-guidance.jpg",
    imageAlt: "Everyday contemplative praxis in action",
    caption: "Digital Repository // Free Access",
    frameClassName: "bg-primary-container",
    accentClassName: "-right-3 -top-3 h-1/2 w-1/2 bg-secondary-container",
    imageClassName: "",
  },
];

async function LiveCourseCatalog() {
  const coursesData = await getCourses();
  const publishedCourses = coursesData.filter((c) => c.status === "published");
  const courses: readonly CourseOffering[] =
    publishedCourses.length > 0
      ? publishedCourses.map(courseItemToOffering)
      : INITIAL_FALLBACK_COURSES;

  return <CourseQuoteSection courses={courses} />;
}

function CourseCatalogSkeleton() {
  return (
    <div className="flex flex-col gap-space-2xl py-space-lg animate-pulse">
      <div className="h-64 w-full rounded-xs bg-primary/5 border border-primary/10" />
      <div className="h-64 w-full rounded-xs bg-primary/5 border border-primary/10" />
    </div>
  );
}

export default function CoursesPage() {
  return (
    <main className="flex min-h-screen w-full flex-col justify-between bg-cream pt-20 text-primary">
      {/* Main Content Container */}
      <div className="mx-auto flex w-full max-w-screen-2xl flex-1 flex-col px-margin py-space-2xl lg:px-margin-desktop lg:py-space-3xl">
        {/* Top Status & Classification Bar */}
        <div className="flex flex-wrap items-center justify-between gap-space-sm border-b border-primary/10 pb-space-lg">
          <div className="flex items-center gap-space-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-secondary" />
            </span>
            <p className="font-display text-label-xs font-bold uppercase tracking-[0.2em] text-secondary">
              Dossier 02 // Curricula &amp; Cohort Licensing Open
            </p>
          </div>
          <p className="font-display text-label-xs uppercase tracking-widest text-on-surface-variant">
            {`0${INITIAL_FALLBACK_COURSES.length} Core Offerings // 2026 Academic Cycle`}
          </p>
        </div>

        {/* Hero Section */}
        <section aria-labelledby="courses-hero-heading" className="py-space-2xl lg:py-space-3xl">
          <div className="grid grid-cols-1 items-end gap-gutter-desktop lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="mb-space-xs font-display text-label-xs font-bold uppercase tracking-[0.25em] text-on-surface-variant">
                Academic Syllabus &amp; Licensing
              </p>
              <h1
                className="font-display text-headline-xl-mobile uppercase leading-[0.92] tracking-tight text-primary sm:text-headline-lg lg:text-headline-xl"
                id="courses-hero-heading"
              >
                Curricula For
                <br />
                Human Flourishing
              </h1>
              <p className="mt-space-xl max-w-2xl font-serif text-2xl font-light italic leading-snug text-primary lg:text-3xl">
                &ldquo;Rigorous learning architectures translating cognitive science, somatic
                resilience, and contemplative wisdom into living institutional practice.&rdquo;
              </p>
              <p className="mt-space-md max-w-2xl text-body-lg text-on-surface-variant">
                Every RIOSTAK offering is designed for university departments, educator
                fellowships, and civic cohorts. Inspect the three core programs below and select{" "}
                <strong className="font-medium text-primary">Watch Now</strong> on any course to
                stream the lecture directly on YouTube.
              </p>

              <div className="mt-space-xl flex flex-wrap items-center gap-space-md">
                <a
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-8 font-display text-label-md font-semibold uppercase tracking-wider text-cream shadow-sm transition-all duration-200 hover:bg-secondary hover:text-on-secondary active:scale-[0.98]"
                  href="#course-catalog"
                >
                  Inspect {INITIAL_FALLBACK_COURSES.length} Courses
                </a>
                <Link
                  className="group inline-flex min-h-12 items-center gap-space-xs rounded-full border border-primary/20 px-6 font-display text-label-md font-semibold uppercase tracking-wider text-primary transition-all duration-200 hover:border-primary hover:bg-primary/5 active:scale-[0.98]"
                  href="/contact"
                >
                  <span>Speak With Secretariat</span>
                  <span
                    aria-hidden="true"
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary transition-all duration-200 group-hover:translate-x-1 group-hover:bg-primary group-hover:text-cream"
                  >
                    <ArrowForwardIcon className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </div>
            </div>

            {/* Right Column Summary Card */}
            <div className="lg:col-span-4">
              <div className="border border-primary/10 bg-surface-container-low p-space-lg sm:p-space-xl">
                <p className="font-display text-label-xs font-bold uppercase tracking-[0.2em] text-secondary">
                  Program Index // At a Glance
                </p>
                <p className="mt-space-xs font-display text-headline-md uppercase text-primary">
                  0{INITIAL_FALLBACK_COURSES.length} Core Tracks
                </p>
                <ul className="mt-space-md flex flex-col divide-y divide-primary/10 border-y border-primary/10">
                  {INITIAL_FALLBACK_COURSES.map((course) => (
                    <li key={course.id} className="py-space-sm">
                      <a
                        className="group flex items-center justify-between gap-space-sm text-body-sm font-medium text-primary transition-colors hover:text-secondary"
                        href={`#${course.id}`}
                      >
                        <span className="flex items-center gap-space-xs">
                          <span className="font-mono text-[11px] font-bold text-secondary">
                            {course.index}
                          </span>
                          <span>{course.title}</span>
                        </span>
                        <ArrowForwardIcon className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-1" />
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="mt-space-md text-body-sm text-on-surface-variant">
                  Subsidized tuition grants are available for accredited educators and community
                  stewards.
                </p>
              </div>
            </div>
          </div>

          {/* 4-Metric Bar */}
          <div className="mt-space-2xl grid grid-cols-2 gap-gutter border-y border-primary/10 py-space-lg sm:grid-cols-4">
            <div>
              <p className="font-display text-label-xs uppercase tracking-wider text-on-surface-variant">
                Active Programs
              </p>
              <p className="mt-1 font-display text-title-md font-bold text-primary">
                0{INITIAL_FALLBACK_COURSES.length} Core Offerings
              </p>
            </div>
            <div>
              <p className="font-display text-label-xs uppercase tracking-wider text-on-surface-variant">
                Lecture Access
              </p>
              <p className="mt-1 font-display text-title-md font-bold text-primary">
                Open YouTube Stream
              </p>
            </div>
            <div>
              <p className="font-display text-label-xs uppercase tracking-wider text-on-surface-variant">
                Delivery Formats
              </p>
              <p className="mt-1 font-display text-title-md font-bold text-primary">
                Digital &amp; Hybrid
              </p>
            </div>
            <div>
              <p className="font-display text-label-xs uppercase tracking-wider text-on-surface-variant">
                Foundation Endowment
              </p>
              <p className="mt-1 font-display text-title-md font-bold text-primary">
                Needs-Blind Grants
              </p>
            </div>
          </div>
        </section>

        {/* Course Catalog Section with Alternating Rows & Direct Watch Now Links */}
        <section aria-labelledby="catalog-heading" className="pt-space-md" id="course-catalog">
          <div className="mb-space-lg flex flex-wrap items-end justify-between gap-space-sm border-b border-primary/15 pb-space-lg">
            <div>
              <div className="flex items-center gap-space-xs">
                <span aria-hidden="true" className="h-2 w-2 rounded-full bg-secondary" />
                <h2
                  className="font-display text-label-md uppercase tracking-[0.18em] text-primary"
                  id="catalog-heading"
                >
                  01 // Course Directory
                </h2>
              </div>
              <p className="mt-1 text-body-sm text-on-surface-variant">
                Alternating syllabus specifications with direct YouTube lecture access per
                course.
              </p>
            </div>
            <p className="font-display text-label-xs uppercase tracking-widest text-secondary">
              {"// Select 'Watch Now' To Stream On YouTube"}
            </p>
          </div>

          <Suspense fallback={<CourseCatalogSkeleton />}>
            <LiveCourseCatalog />
          </Suspense>
        </section>
      </div>

      {/* Full-Width Baseline Ticker */}
      <div className="w-full border-t border-primary/15">
        <div className="w-full px-margin py-space-lg lg:px-margin-desktop">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-space-sm font-display text-label-xs uppercase tracking-[0.25em] text-on-surface-variant">
              <ArrowDownwardIcon className="h-4 w-4 text-secondary motion-safe:animate-bounce" />
              <span>Curriculum Licensing Desk Active</span>
            </p>
            <div className="hidden items-center gap-space-xl text-on-surface-variant md:flex lg:gap-space-2xl">
              <span className="font-display text-label-xs uppercase tracking-wider">
                Syllabus Edition 4.2
              </span>
              <span aria-hidden="true" className="h-1 w-1 rounded-full bg-secondary" />
              <span className="font-display text-label-xs uppercase tracking-wider">
                OFFICE 1 • OFFICE 2 • OFFICE 3
              </span>
              <span aria-hidden="true" className="h-1 w-1 rounded-full bg-secondary" />
              <span className="font-display text-label-xs font-bold uppercase tracking-wider text-primary">
                {"// 2026"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
