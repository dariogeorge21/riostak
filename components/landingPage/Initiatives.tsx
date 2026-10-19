import Link from "next/link";
import { ArrowForwardIcon } from "../Icons";
import { type CourseItem, INITIAL_SEED_COURSES } from "@/utils/courseTypes";
import { getYoutubeEmbedUrl } from "@/utils/youtube";

type Offering = {
  id: string;
  anchorId: string;
  index: string;
  title: string;
  tags: string;
  body: string;
  cta: string;
  href: string;
  youtubeUrl: string;
  caption: string;
  /** Video column first on desktop (text left) vs. second (text right). */
  imageOnRight: boolean;
  frameClassName: string;
  accentClassName: string;
  captionClassName: string;
};

type InitiativesProps = {
  courses?: CourseItem[];
};

/** Section 04: Core initiatives — alternating editorial offering cases with live YouTube video lectures. */
export default function Initiatives({ courses }: InitiativesProps) {
  const activeCourses = (courses && courses.length > 0 ? courses : INITIAL_SEED_COURSES).filter(
    (c) => c.status === "published"
  );

  const offerings: Offering[] = activeCourses.map((c, idx) => {
    const isEven = idx % 2 === 0;
    const defaultAnchor =
      idx === 0 ? "learn" : idx === 1 ? "research" : idx === 2 ? "library" : c.slug;

    return {
      id: c.slug || c.id,
      anchorId: defaultAnchor,
      index: c.index_code || `0${idx + 1}`,
      title: c.title,
      tags: c.tags,
      body: c.body,
      cta: "Inspect Syllabus & Quote",
      href: `/courses#${c.slug || c.id}`,
      youtubeUrl: c.youtube_url,
      caption: c.caption || "Curriculum // 2026",
      imageOnRight: isEven,
      frameClassName:
        c.frame_class_name || (isEven ? "bg-primary-container" : "bg-secondary-container"),
      accentClassName:
        c.accent_class_name ||
        (isEven
          ? "-bottom-3 -right-3 h-2/3 w-2/3 bg-secondary-container"
          : "-bottom-3 -left-3 h-2/3 w-2/3 bg-primary"),
      captionClassName: isEven ? "bottom-6 right-6" : "left-6 top-6",
    };
  });

  return (
    <section
      aria-labelledby="initiatives-heading"
      className="mx-auto flex w-full max-w-screen-2xl flex-col gap-space-3xl px-margin py-space-3xl lg:px-margin-desktop"
      id="initiatives"
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
          {"// Live Curricula & Video Seminars"}
        </p>
      </div>

      {offerings.map((offering) => (
        <article
          key={offering.id}
          className="relative grid grid-cols-1 items-center gap-gutter-desktop lg:grid-cols-12 scroll-mt-24"
          id={offering.anchorId}
        >
          {/* Invisible target for direct slug navigation */}
          {offering.anchorId !== offering.id && (
            <span aria-hidden="true" className="sr-only" id={offering.id} />
          )}

          <div
            className={`lg:col-span-5 ${
              offering.imageOnRight ? "order-2 lg:order-1" : "order-2"
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
            <p className="mb-space-md text-body-md text-on-surface-variant leading-relaxed">
              {offering.body}
            </p>

            {offering.youtubeUrl && (
              <div className="mb-space-md inline-flex items-center gap-space-xs rounded-full border border-primary/10 bg-surface-container-low px-3 py-1">
                <span className="h-2 w-2 rounded-full bg-[#FF0000] animate-pulse" />
                <span className="font-display text-label-xs uppercase tracking-wider text-on-surface-variant">
                  Video Seminar Available
                </span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-space-md">
              <Link
                className="group inline-flex min-h-11 items-center gap-space-sm"
                href={offering.href}
              >
                <span className="font-display text-label-xs font-bold uppercase tracking-[0.2em] text-primary transition-colors group-hover:text-secondary">
                  {offering.cta}
                </span>
                <ArrowForwardIcon className="h-3.5 w-3.5 text-primary transition-transform group-hover:translate-x-1 group-hover:text-secondary" />
              </Link>
              {offering.youtubeUrl && (
                <a
                  className="inline-flex min-h-11 items-center gap-1.5 font-display text-label-xs font-bold uppercase tracking-wider text-secondary transition-colors hover:text-primary"
                  href={offering.youtubeUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                  title={`Watch ${offering.title} on YouTube`}
                >
                  <span>Watch on YouTube</span>
                  <span aria-hidden="true">↗</span>
                </a>
              )}
            </div>
          </div>

          <div
            className={`lg:col-span-7 ${
              offering.imageOnRight ? "order-1 lg:order-2" : "order-1"
            }`}
          >
            <div className={`relative aspect-video w-full p-2.5 sm:p-4 ${offering.frameClassName}`}>
              <div
                aria-hidden="true"
                className={`absolute -z-10 hidden sm:block ${offering.accentClassName}`}
              />
              <div className="relative h-full w-full overflow-hidden bg-black shadow-md ring-1 ring-primary/10">
                <iframe
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="h-full w-full border-0"
                  loading="lazy"
                  src={getYoutubeEmbedUrl(offering.youtubeUrl)}
                  title={`${offering.title} — Video Seminar`}
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
