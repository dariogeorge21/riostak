import Image from "next/image";
import Link from "next/link";
import { ArrowDownwardIcon, ArrowForwardIcon } from "../Icons";

/** Landing page hero: monumental headline, primary CTAs, portrait plate, and full-width ticker. */
export default function Hero() {
  return (
    <section className="relative w-full pt-space-xl">
      {/* Hero Main Grid: Centered Wide Editorial Container */}
      <div className="mx-auto w-full max-w-screen-2xl px-margin lg:px-margin-desktop">
        <div className="grid grid-cols-1 items-center gap-gutter-desktop lg:grid-cols-12 xl:gap-16">
          {/* Left Column: Eyebrow, Monumental Headline, Narrative & Actions */}
          <div className="z-10 flex flex-col lg:col-span-7">
            {/* Eyebrow badge */}
            <div className="mb-space-md flex items-center gap-space-sm">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-secondary-container ring-4 ring-secondary-container/20"
              />
              <p className="font-display text-label-xs uppercase tracking-[0.2em] text-on-surface-variant">
                Institute for Empirical Flourishing // Global Initiative
              </p>
            </div>

            {/* Monumental Headline */}
            <h1 className="font-display text-headline-xl-mobile uppercase leading-[0.94] tracking-tight text-primary sm:text-headline-lg lg:text-headline-xl">
              The Science
              <br />
              And Art
              <br />
              Of Human
              <br />
              Flourishing
            </h1>

            {/* Body Narrative */}
            <p className="mt-space-lg max-w-xl text-body-lg leading-relaxed text-on-surface-variant">
              We advance empirical understanding to help individuals, relationships, communities,
              and institutions flourish with clarity, deliberate purpose, and sustained compassion.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="mt-space-xl flex flex-wrap items-center gap-space-md">
              <Link
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-8 font-display text-label-md font-semibold uppercase tracking-wider text-cream shadow-sm transition-all duration-200 hover:bg-secondary hover:text-on-secondary hover:shadow-md active:scale-[0.98]"
                href="/#learn"
              >
                Explore Courses
              </Link>
              <Link
                className="group inline-flex min-h-12 items-center gap-space-xs rounded-full border border-primary/20 px-6 font-display text-label-md font-semibold uppercase tracking-wider text-primary transition-all duration-200 hover:border-primary hover:bg-primary/5 hover:text-primary active:scale-[0.98]"
                href="/#research"
              >
                <span>View Research Indices</span>
                <span
                  aria-hidden="true"
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary transition-all duration-200 group-hover:translate-x-1 group-hover:bg-primary group-hover:text-cream"
                >
                  <ArrowForwardIcon className="h-3.5 w-3.5" />
                </span>
              </Link>
            </div>
          </div>

          {/* Right Column: Architectural Portrait Plate with Dummy Overlay */}
          <div className="relative mt-space-xl flex justify-center lg:col-span-5 lg:mt-0 lg:justify-end">
            <div className="relative aspect-[4/5] w-full max-w-sm overflow-hidden bg-primary-container shadow-2xl sm:max-w-md lg:max-w-none">
              <div
                aria-hidden="true"
                className="absolute -inset-2 -z-10 hidden translate-x-3 translate-y-3 bg-primary sm:block"
              />
              <Image
                alt="Portrait of a human flourishing research fellow"
                className="object-cover object-center contrast-110 grayscale-[20%]"
                fill
                priority
                sizes="(min-width: 1024px) 38vw, (min-width: 640px) 450px, 100vw"
                src="/images/hero-portrait.jpg"
              />
              <p className="absolute bottom-3 right-3 z-30 bg-cream/95 px-space-sm py-1 font-display text-label-xs font-semibold uppercase tracking-widest text-primary shadow-xs backdrop-blur-xs">
                Plate 01 // Archive
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Ticker / Baseline Bar: Full-Width Edge-to-Edge Cover */}
      <div className="mt-space-3xl w-full border-t border-primary/15">
        <div className="w-full px-margin py-space-lg lg:px-margin-desktop">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-space-sm font-display text-label-xs uppercase tracking-[0.25em] text-on-surface-variant">
              <ArrowDownwardIcon className="h-4 w-4 motion-safe:animate-bounce text-secondary" />
              <span>Scroll to Inspect</span>
            </p>
            <div className="hidden items-center gap-space-xl text-on-surface-variant md:flex lg:gap-space-2xl">
              <span className="font-display text-label-xs uppercase tracking-wider">
                Framework Version 4.2
              </span>
              <span aria-hidden="true" className="h-1 w-1 rounded-full bg-secondary" />
              <span className="font-display text-label-xs uppercase tracking-wider">
                Cambridge • Zurich • Singapore
              </span>
              <span aria-hidden="true" className="h-1 w-1 rounded-full bg-secondary" />
              <span className="font-display text-label-xs font-bold uppercase tracking-wider text-primary">
                {"// 2026"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
