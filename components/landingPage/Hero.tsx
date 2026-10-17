import Image from "next/image";
import Link from "next/link";
import { ArrowDownwardIcon, ArrowForwardIcon } from "../Icons";

/** Landing page hero: monumental headline, primary CTAs and portrait plate. */
export default function Hero() {
  return (
    <section className="relative mx-auto w-full max-w-7xl overflow-hidden px-margin pb-space-3xl pt-space-xl lg:px-margin-desktop">
      <div className="grid grid-cols-1 items-start gap-gutter-desktop lg:grid-cols-12">
        <div className="z-10 flex flex-col justify-between lg:col-span-8">
          <div className="mb-space-md flex items-center gap-space-sm">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-secondary-container" />
            <p className="font-display text-label-xs uppercase text-on-surface-variant">
              Institute for Empirical Flourishing // Global Initiative
            </p>
          </div>

          <h1 className="max-w-4xl font-display text-headline-xl-mobile uppercase text-primary md:text-headline-xl">
            The Science
            <br />
            And Art
            <br />
            Of Human
            <br />
            Flourishing
          </h1>

          <div className="mt-space-2xl grid grid-cols-1 items-end gap-gutter md:grid-cols-12">
            <p className="max-w-md text-body-lg text-on-surface-variant md:col-span-7">
              We advance empirical understanding to help individuals, relationships, communities,
              and institutions flourish with clarity, deliberate purpose, and sustained compassion.
            </p>

            <div className="flex flex-col items-start gap-space-md md:col-span-5 md:items-end">
              <div className="flex items-center gap-space-sm">
                <Link
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-7 font-display text-label-md uppercase tracking-wider text-cream transition-all duration-200 hover:bg-secondary hover:text-on-secondary active:bg-secondary"
                  href="/#learn"
                >
                  Explore Courses
                </Link>
                <Link
                  aria-label="Our Research"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-cream transition-transform hover:scale-105 hover:bg-secondary hover:text-on-secondary active:scale-95"
                  href="/#research"
                >
                  <ArrowForwardIcon className="h-[18px] w-[18px]" />
                </Link>
              </div>
              <p className="font-display text-label-xs uppercase tracking-widest text-on-surface-variant">
                View Research Indices
              </p>
            </div>
          </div>
        </div>

        <div className="relative mt-space-xl lg:col-span-4 lg:mt-0">
          <div className="relative aspect-[4/5] w-full bg-primary-container">
            <div
              aria-hidden="true"
              className="absolute -inset-2 -z-10 hidden translate-x-3 translate-y-3 bg-primary sm:block"
            />
            <Image
              alt="Portrait of a human flourishing research fellow"
              className="object-cover object-center contrast-110 grayscale-[20%]"
              fill
              preload
              sizes="(min-width: 1024px) 30vw, 100vw"
              src="/images/hero-portrait.jpg"
            />
            <p className="absolute bottom-3 right-3 bg-cream px-space-sm py-0.5 font-display text-label-xs uppercase text-primary">
              Plate 01 // Archive
            </p>
          </div>
        </div>
      </div>

      <div className="mt-space-3xl flex items-center justify-between pt-space-lg">
        <p className="flex items-center gap-space-xs font-display text-label-xs uppercase tracking-[0.25em] text-on-surface-variant">
          <ArrowDownwardIcon className="h-4 w-4 motion-safe:animate-bounce" />
          Scroll to Inspect
        </p>
        <div className="hidden items-center gap-space-2xl text-on-surface-variant sm:flex">
          <span className="font-display text-label-xs uppercase">Framework Version 4.2</span>
          <span className="font-display text-label-xs uppercase">
            Cambridge • Zurich • Singapore
          </span>
          <span className="font-display text-label-xs font-bold uppercase text-primary">
            {"// 2026"}
          </span>
        </div>
      </div>
    </section>
  );
}
