import { getYoutubeEmbedUrl } from "@/utils/youtube";
import { ArrowForwardIcon } from "../Icons";

export type CourseOffering = {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  tags: string;
  body: string;
  extendedBody: string;
  format: string;
  syllabusHighlights: readonly string[];
  youtubeUrl: string;
  imageSrc?: string;
  imageAlt?: string;
  caption?: string;
  frameClassName?: string;
  accentClassName?: string;
  imageClassName?: string;
};

/** Individual course row with alternating left/right layout and direct Watch Now YouTube link. */
function CourseRow({
  course,
  isReversed,
}: {
  course: CourseOffering;
  isReversed: boolean;
}) {
  const headingId = `course-heading-${course.id}`;

  return (
    <article
      aria-labelledby={headingId}
      className="border-t border-primary/15 py-space-2xl first:border-t-0 lg:py-space-3xl"
      id={course.id}
    >
      {/* Main 2-Column Alternating Grid: Left Course Name / Visual vs. Right Course About */}
      <div className="grid grid-cols-1 items-start gap-gutter-desktop lg:grid-cols-12 xl:gap-16">
        {/* Column A: Course Name, Classification Metadata & Visual Plate */}
        <div
          className={`flex flex-col justify-between lg:col-span-6 ${
            isReversed ? "lg:order-2" : "lg:order-1"
          }`}
        >
          {/* Index & Video Classification Bar */}
          <div className="mb-space-md flex items-center justify-between border-b border-primary/10 pb-space-sm">
            <div className="flex items-center gap-space-sm">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary font-display text-label-xs font-bold text-cream">
                {course.index}
              </span>
              <span className="font-display text-label-xs font-bold uppercase tracking-[0.2em] text-secondary">
                {course.tags}
              </span>
            </div>
            <a
              className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-red-600 transition-colors hover:text-red-800"
              href={course.youtubeUrl}
              rel="noopener noreferrer"
              target="_blank"
              title="Open on YouTube"
            >
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              <span>YouTube Video</span>
            </a>
          </div>

          {/* Course Name & Subtitle */}
          <h3
            className="font-display text-headline-lg-mobile uppercase leading-[0.98] tracking-tight text-primary sm:text-headline-md lg:text-headline-lg"
            id={headingId}
          >
            {course.title}
          </h3>
          <p className="mt-space-sm font-serif text-xl font-light italic text-on-surface-variant lg:text-2xl">
            {course.subtitle}
          </p>

          {/* YouTube Video Embed & Watch Link */}
          <div className="mt-space-xl">
            <div className="relative aspect-video w-full overflow-hidden rounded-xs border border-primary/20 bg-primary shadow-lg ring-1 ring-primary/10">
              <iframe
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-full w-full"
                loading="lazy"
                src={getYoutubeEmbedUrl(course.youtubeUrl)}
                title={`${course.title} — Lecture & Curriculum Video`}
              />
            </div>
            <div className="mt-space-sm flex flex-wrap items-center justify-between gap-2 px-1">
              <p className="font-display text-label-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                {course.caption || "Open Curriculum Lecture"}
              </p>
              <a
                className="group inline-flex items-center gap-1.5 font-display text-label-xs font-bold uppercase tracking-wider text-red-700 transition-colors hover:text-red-900"
                href={course.youtubeUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                <svg
                  aria-hidden="true"
                  className="h-3.5 w-3.5 text-red-600 transition-transform group-hover:scale-110"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                <span>Watch on YouTube ↗</span>
              </a>
            </div>
          </div>
        </div>

        {/* Column B: Course About, Syllabus Architecture & Watch Now CTA */}
        <div
          className={`flex flex-col justify-between bg-surface-container-low p-space-lg sm:p-space-xl lg:col-span-6 ${
            isReversed ? "lg:order-1" : "lg:order-2"
          }`}
        >
          <div>
            {/* Section Eyebrow */}
            <div className="mb-space-md flex items-center justify-between border-b border-primary/10 pb-space-sm">
              <p className="font-display text-label-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                Course Dossier // Overview &amp; Syllabus
              </p>
              <span className="inline-flex items-center gap-1.5 font-display text-label-xs uppercase tracking-widest text-secondary">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-secondary" />
                Available Now
              </span>
            </div>

            {/* Primary Narrative (from Landing Page) */}
            <p className="text-body-lg leading-relaxed text-primary">{course.body}</p>

            {/* Extended Curriculum Context */}
            <p className="mt-space-md text-body-md leading-relaxed text-on-surface-variant">
              {course.extendedBody}
            </p>

            {/* Key Syllabus Pillars */}
            <div className="mt-space-xl border-t border-primary/10 pt-space-lg">
              <p className="mb-space-md font-display text-label-xs font-bold uppercase tracking-[0.2em] text-primary">
                Included Modules &amp; Deliverables
              </p>
              <ul className="grid grid-cols-1 gap-space-sm sm:grid-cols-2">
                {course.syllabusHighlights.map((highlight, idx) => (
                  <li
                    key={highlight}
                    className="flex items-start gap-space-xs bg-cream/70 px-space-md py-space-sm"
                  >
                    <span className="font-mono text-[11px] font-bold text-secondary">
                      0{idx + 1}
                    </span>
                    <span className="text-body-sm font-medium text-primary">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Format & Access Metadata Strip */}
            <dl className="mt-space-lg grid grid-cols-2 gap-gutter border-t border-primary/10 pt-space-md">
              <div>
                <dt className="font-display text-label-xs uppercase tracking-widest text-on-surface-variant">
                  Delivery Architecture
                </dt>
                <dd className="mt-1 font-display text-body-sm font-semibold text-primary">
                  {course.format}
                </dd>
              </div>
              <div>
                <dt className="font-display text-label-xs uppercase tracking-widest text-on-surface-variant">
                  Lecture Access
                </dt>
                <dd className="mt-1 font-display text-body-sm font-semibold text-secondary">
                  Open YouTube Stream
                </dd>
              </div>
            </dl>
          </div>

          {/* Action Bar: Watch Now Link */}
          <div className="mt-space-xl flex flex-wrap items-center justify-between gap-space-md border-t border-primary/15 pt-space-lg">
            <div>
              <p className="font-display text-label-xs uppercase tracking-widest text-on-surface-variant">
                Open Curriculum Lecture
              </p>
              <p className="text-body-sm text-primary">
                Stream the full session directly on YouTube.
              </p>
            </div>

            <a
              className="group inline-flex min-h-12 items-center justify-center gap-space-sm rounded-full bg-primary px-7 font-display text-label-md font-semibold uppercase tracking-wider text-cream shadow-sm transition-all duration-200 hover:bg-secondary hover:text-on-secondary active:scale-[0.98]"
              href={course.youtubeUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span>Watch Now</span>
              <span
                aria-hidden="true"
                className="flex h-6 w-6 items-center justify-center rounded-full bg-cream/15 text-cream transition-transform duration-300 group-hover:translate-x-1"
              >
                <ArrowForwardIcon className="h-3.5 w-3.5" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

/** Course catalog list with alternating left/right rows and Watch Now YouTube actions. */
export default function CourseQuoteSection({
  courses,
}: {
  courses: readonly CourseOffering[];
}) {
  return (
    <div className="flex flex-col">
      {courses.map((course, index) => (
        <CourseRow key={course.id} course={course} isReversed={index % 2 === 1} />
      ))}
    </div>
  );
}
