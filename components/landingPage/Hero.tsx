import Image from "next/image";
import Link from "next/link";
import { ArrowDownwardIcon, ArrowForwardIcon } from "../Icons";

/** Landing page hero: an editorial statement, portrait object, and focused entry points. */
export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-primary text-cream">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-24 h-[28rem] w-[28rem] rounded-full bg-secondary-container/10 blur-3xl"
      />

      <div className="relative mx-auto flex min-h-[calc(100svh-5rem)] w-full max-w-screen-2xl flex-col px-margin pb-space-lg pt-space-2xl lg:px-margin-desktop lg:pb-space-xl lg:pt-space-3xl">
        <div className="flex items-center justify-between border-b border-cream/20 pb-space-md">
          <p className="font-display text-label-xs uppercase tracking-[0.22em] text-cream/70">
            RIOSTAK / Institute for Human Flourishing
          </p>
          <p className="hidden font-display text-label-xs uppercase tracking-[0.22em] text-cream/50 sm:block">
            01 — 04
          </p>
        </div>

        <div className="grid flex-1 grid-cols-1 items-center gap-space-2xl py-space-2xl lg:grid-cols-12 lg:gap-0 lg:py-space-xl">
          <div className="relative z-10 lg:col-span-8 lg:-mr-16">
            <p className="mb-space-lg flex items-center gap-space-sm font-display text-label-xs uppercase tracking-[0.2em] text-secondary-container">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-secondary-container" />
              The human question, studied seriously
            </p>

            <h1 className="max-w-5xl font-display text-[clamp(3.5rem,9.5vw,9.5rem)] font-medium uppercase leading-[0.84] tracking-[-0.075em] text-cream">
              Make room
              <br />
              <span className="font-serif font-light italic normal-case tracking-[-0.06em] text-secondary-container">
                for
              </span>{" "}
              flourishing.
            </h1>

            <div className="mt-space-xl flex max-w-xl flex-col gap-space-lg sm:flex-row sm:items-end sm:gap-space-2xl">
              <p className="max-w-sm text-body-md leading-relaxed text-cream/65">
                RIOSTAK turns the science of human wellbeing into useful knowledge, meaningful
                practice, and a more considered way forward.
              </p>
              <Link
                className="group inline-flex min-h-12 shrink-0 items-center gap-space-sm self-start border-b border-secondary-container pb-space-sm font-display text-label-md font-semibold uppercase tracking-[0.16em] text-cream transition-colors hover:border-cream hover:text-secondary-container"
                href="/courses"
              >
                <span>Begin exploring</span>
                <span
                  aria-hidden="true"
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary-container text-primary transition-transform duration-200 group-hover:translate-x-1"
                >
                  <ArrowForwardIcon className="h-3.5 w-3.5" />
                </span>
              </Link>
            </div>
          </div>

          {/* <div className="relative mx-auto w-full max-w-sm lg:col-span-4 lg:mx-0 lg:max-w-none">
            <div
              aria-hidden="true"
              className="absolute -bottom-4 -left-4 h-full w-full border border-secondary-container/50"
            />
            <div className="relative aspect-[4/5] overflow-hidden bg-cream">
              <Image
                alt="Portrait of a human flourishing research fellow"
                className="object-cover object-top grayscale-[15%] mix-blend-multiply"
                fill
                priority
                sizes="(min-width: 1024px) 32vw, (min-width: 640px) 420px, 100vw"
                src="/images/hero-portrait.jpg"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/70 to-transparent px-space-md pb-space-md pt-2xl">
                <p className="font-display text-label-xs uppercase tracking-[0.18em] text-cream">
                  A living field guide
                </p>
              </div>
              <span
                aria-hidden="true"
                className="absolute right-space-md top-space-md flex h-12 w-12 items-center justify-center rounded-full border border-primary/30 font-serif text-2xl italic text-primary"
              >
                R
              </span>
            </div>
          </div> */}
        </div>

        <div className="flex items-end justify-between border-t border-cream/20 pt-space-md">
          <Link
            className="group inline-flex items-center gap-space-sm font-display text-label-xs uppercase tracking-[0.22em] text-cream/70 transition-colors hover:text-cream"
            href="/#about"
          >
            <ArrowDownwardIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-1" />
            <span>Scroll to discover</span>
          </Link>
          <p className="hidden max-w-xs text-right font-serif text-sm italic text-cream/45 md:block">
            “A generous life begins with a better question.”
          </p>
        </div>
      </div>
    </section>
  );
}
