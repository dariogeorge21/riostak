import Image from "next/image";
import Link from "next/link";
import { ArrowForwardIcon } from "../Icons";

type Offering = {
  id: string;
  index: string;
  title: string;
  tags: string;
  body: string;
  cta: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
  caption: string;
  /** Image column first on desktop (text left) vs. second (text right). */
  imageOnRight: boolean;
  frameClassName: string;
  accentClassName: string;
  captionClassName: string;
  imageClassName: string;
};

const OFFERINGS: readonly Offering[] = [
  {
    id: "learn",
    index: "01",
    title: "Courses and Learning Resources",
    tags: "Online • Immersive Academics • Cohorts",
    body: "Structured curricula combining autonomous digital modules with rigorous weekly faculty dialogues. From foundational neuroscience to advanced contemplative practice, participants cultivate verifiable internal competencies through sustained, evidence-based inquiry.",
    cta: "View Modules",
    href: "/#learn",
    imageSrc: "/images/offering-courses.jpg",
    imageAlt: "RIOSTAK immersive cohort in session",
    caption: "Curriculum // Autumn 2026",
    imageOnRight: true,
    frameClassName: "bg-primary-container",
    accentClassName: "-bottom-3 -right-3 h-2/3 w-2/3 bg-secondary-container",
    captionClassName: "bottom-6 right-6",
    imageClassName: "",
  },
  {
    id: "research",
    index: "02",
    title: "Research & Insights",
    tags: "Multidisciplinary Empirical Inquiry • Field Trials",
    body: "Our independent lab produces peer-reviewed working papers, longitudinal flourishing indices, and validated diagnostic tools. We collaborate globally with university departments to interrogate what conditions genuinely sustain human vitality across lifespan stages.",
    cta: "Access Working Papers",
    href: "/#research",
    imageSrc: "/images/offering-research.jpg",
    imageAlt: "RIOSTAK empirical white papers and monographs",
    caption: "Open Access // Monographs",
    imageOnRight: false,
    frameClassName: "bg-secondary-container",
    accentClassName: "-bottom-3 -left-3 h-2/3 w-2/3 bg-primary",
    captionClassName: "left-6 top-6",
    imageClassName: "grayscale-[15%]",
  },
  {
    id: "library",
    index: "03",
    title: "Educational Content & Guidance",
    tags: "Daily Praxis • Micro-Learning • Open Toolkits",
    body: "Accessible audio contemplation, daily field notes, and interactive toolkits formulated for immediate practical application. We demystify ancient wisdom and modern clinical practices into actionable, unpretentious five-minute daily practices.",
    cta: "Open Library",
    href: "/#library",
    imageSrc: "/images/offering-guidance.jpg",
    imageAlt: "Everyday contemplative praxis in action",
    caption: "Digital Repository // Free Access",
    imageOnRight: true,
    frameClassName: "bg-primary-container",
    accentClassName: "-right-3 -top-3 h-1/2 w-1/2 bg-secondary-container",
    captionClassName: "bottom-6 left-6",
    imageClassName: "",
  },
];

/** Section 04: Core initiatives — alternating editorial offering cases. */
export default function Initiatives() {
  return (
    <section
      aria-labelledby="initiatives-heading"
      className="mx-auto flex w-full max-w-screen-2xl flex-col gap-space-3xl px-margin py-space-3xl lg:px-margin-desktop"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-xs">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-secondary" />
          <h2
            className="font-display text-label-md uppercase text-primary"
            id="initiatives-heading"
          >
            04 // Core Initiatives
          </h2>
        </div>
        <p className="hidden font-display text-label-xs uppercase text-on-surface-variant sm:block">
          {"// Offerings 2026"}
        </p>
      </div>

      {OFFERINGS.map((offering) => (
        <article
          key={offering.id}
          className="grid grid-cols-1 items-center gap-gutter-desktop lg:grid-cols-12"
          id={offering.id}
        >
          <div
            className={`lg:col-span-5 ${offering.imageOnRight ? "order-2 lg:order-1" : "order-2"
              }`}
          >
            <p className="mb-space-xs block font-display text-label-lg font-bold tracking-widest text-primary">
              {offering.index}
            </p>
            <h3 className="mb-space-sm font-display text-headline-md uppercase tracking-tight text-primary">
              {offering.title}
            </h3>
            <p className="mb-space-md font-display text-label-xs font-bold uppercase tracking-widest text-secondary">
              {offering.tags}
            </p>
            <p className="mb-space-lg text-body-md text-on-surface-variant">{offering.body}</p>
            <Link
              className="group inline-flex min-h-11 items-center gap-space-sm"
              href={offering.href}
            >
              <span className="font-display text-label-xs font-bold uppercase tracking-[0.2em] text-primary transition-colors group-hover:text-secondary">
                {offering.cta}
              </span>
              <span
                aria-hidden="true"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-on-primary transition-transform group-hover:translate-x-1 group-hover:bg-secondary group-hover:text-on-secondary"
              >
                <ArrowForwardIcon className="h-4 w-4" />
              </span>
            </Link>
          </div>

          <div
            className={`lg:col-span-7 ${offering.imageOnRight ? "order-1 lg:order-2" : "order-1"
              }`}
          >
            <div className={`relative aspect-[16/10] w-full p-4 ${offering.frameClassName}`}>
              <div
                aria-hidden="true"
                className={`absolute -z-10 hidden sm:block ${offering.accentClassName}`}
              />
              <div className="relative h-full w-full overflow-hidden">
                <Image
                  alt={offering.imageAlt}
                  className={`object-cover object-center ${offering.imageClassName}`}
                  fill
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  src={offering.imageSrc}
                />
              </div>
              <p
                className={`absolute z-30 bg-cream px-space-md py-1 font-display text-label-xs uppercase tracking-widest text-primary ${offering.captionClassName}`}
              >
                {offering.caption}
              </p>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
