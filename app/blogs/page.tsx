import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDownwardIcon, ArrowForwardIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Blogs & Despatches — RIOSTAK | Scholarly Inquiries & Field Notes",
  description:
    "Long-form essays, empirical field dispatches, and faculty monographs from RIOSTAK fellows are coming soon.",
};

const BLOG_PREVIEWS = [
  {
    index: "01.01",
    label: "Editorial Dispatches",
    title: "Neurobiology & Contemplation",
    description:
      "Monthly peer-reviewed inquiries bridging somatic neuroscience, cognitive architecture, and ethical praxis.",
  },
  {
    index: "01.02",
    label: "Fellowship Essays",
    title: "Global Laboratory Field Notes",
    description:
      "Direct reflections and trial notes from visiting scholars across our OFFICE 1, OFFICE 2, and OFFICE 3 desks.",
  },
  {
    index: "01.03",
    label: "Monograph Series",
    title: "Post-Industrial Pedagogy",
    description:
      "Extended treatises on empirical educational reform, public flourishing indices, and longitudinal ethics.",
  },
] as const;

export default function BlogsPage() {
  return (
    <main className="flex min-h-screen w-full flex-col justify-between bg-cream pt-20 text-primary">
        {/* Main Content Area */}
        <div className="mx-auto flex w-full max-w-screen-2xl flex-1 flex-col justify-center px-margin py-space-3xl lg:px-margin-desktop">
          {/* Status pill & breadcrumbs */}
          <div className="flex flex-wrap items-center justify-between gap-space-sm border-b border-primary/10 pb-space-lg">
            <div className="flex items-center gap-space-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-secondary" />
              </span>
              <p className="font-display text-label-xs uppercase tracking-[0.2em] text-secondary">
                Despatches // Volume 01 In Editorial Peer Review
              </p>
            </div>
            <p className="font-display text-label-xs uppercase tracking-widest text-on-surface-variant">
              Inaugural Issue // Autumn 2026
            </p>
          </div>

          {/* Central Hero Block */}
          <div className="py-space-3xl">
            <p className="mb-space-md font-display text-label-xs font-semibold uppercase tracking-[0.25em] text-on-surface-variant">
              Blogs &amp; Despatches
            </p>
            <h1 className="font-display text-headline-xl-mobile uppercase leading-[0.92] tracking-tight text-primary sm:text-headline-lg lg:text-headline-xl">
              Coming
              <br />
              Soon
            </h1>

            <p className="mt-space-xl max-w-2xl font-serif text-2xl font-light italic leading-snug text-primary lg:text-3xl">
              &ldquo;Preparing our open publication series of empirical treatises, laboratory field
              notes, and contemplative essays.&rdquo;
            </p>

            <p className="mt-space-lg max-w-xl text-body-lg text-on-surface-variant">
              The RIOSTAK Despatches portal is currently under active curation by our fellowship
              editorial board. The first volume of long-form scholarly monographs will be published
              shortly.
            </p>

            {/* CTAs */}
            <div className="mt-space-2xl flex flex-wrap items-center gap-space-md">
              <Link
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-8 font-display text-label-md font-semibold uppercase tracking-wider text-cream shadow-sm transition-all duration-200 hover:bg-secondary hover:text-on-secondary active:scale-[0.98]"
                href="/"
              >
                Return Home
              </Link>
              <Link
                className="group inline-flex min-h-12 items-center gap-space-xs rounded-full border border-primary/20 px-6 font-display text-label-md font-semibold uppercase tracking-wider text-primary transition-all duration-200 hover:border-primary hover:bg-primary/5 active:scale-[0.98]"
                href="/#research"
              >
                <span>Explore Research Inquiries</span>
                <span
                  aria-hidden="true"
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary transition-all duration-200 group-hover:translate-x-1 group-hover:bg-primary group-hover:text-cream"
                >
                  <ArrowForwardIcon className="h-3.5 w-3.5" />
                </span>
              </Link>
            </div>
          </div>

          {/* Architectural Preview Cards */}
          <div className="grid grid-cols-1 gap-gutter border-t border-primary/10 pt-space-2xl md:grid-cols-3">
            {BLOG_PREVIEWS.map((item) => (
              <div
                key={item.index}
                className="flex flex-col justify-between bg-surface-container/60 p-space-lg transition-colors hover:bg-surface-container"
              >
                <div>
                  <div className="mb-space-md flex items-center justify-between">
                    <span className="font-display text-label-xs font-bold uppercase tracking-widest text-secondary">
                      {item.index}
                    </span>
                    <span className="font-display text-label-xs uppercase tracking-widest text-on-surface-variant">
                      {item.label}
                    </span>
                  </div>
                  <h3 className="mb-space-xs font-display text-headline-sm uppercase text-primary">
                    {item.title}
                  </h3>
                </div>
                <p className="mt-space-md text-body-sm text-on-surface-variant">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Full-Width Baseline Ticker */}
        <div className="w-full border-t border-primary/15">
          <div className="w-full px-margin py-space-lg lg:px-margin-desktop">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-space-sm font-display text-label-xs uppercase tracking-[0.25em] text-on-surface-variant">
                <ArrowDownwardIcon className="h-4 w-4 motion-safe:animate-bounce text-secondary" />
                <span>Editorial Desk // Peer Review Active</span>
              </p>
              <div className="hidden items-center gap-space-xl text-on-surface-variant md:flex lg:gap-space-2xl">
                <span className="font-display text-label-xs uppercase tracking-wider">
                  Volume 01 Monographs
                </span>
                <span aria-hidden="true" className="h-1 w-1 rounded-full bg-secondary" />
                <span className="font-display text-label-xs uppercase tracking-wider">
                  OFFICE 1 • OFFICE 2 • OFFICE 3
                </span>
                <span aria-hidden="true" className="h-1 w-1 rounded-full bg-secondary" />
                <span className="font-display text-label-xs font-bold uppercase tracking-wider text-primary">
                  {"// 2026 INAUGURAL"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
  );
}
