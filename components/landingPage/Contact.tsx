import Link from "next/link";
import { ArrowForwardIcon } from "../Icons";

const ADMISSIONS = [
  { label: "Admissions Status", value: "Open (Fall 2026)", highlight: true },
  { label: "Cohort Format", value: "Hybrid / Global", highlight: false },
  { label: "Scholarships", value: "Needs-Blind Available", highlight: false },
] as const;

/** Section 06: Closing call to action on the deep navy block. */
export default function Contact() {
  return (
    <section className="w-full bg-navy py-space-3xl text-cream" id="contact">
      <div className="mx-auto max-w-screen-2xl px-margin lg:px-margin-desktop">
        <div className="grid grid-cols-1 items-center gap-gutter-desktop lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="mb-space-sm flex items-center gap-space-xs">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-secondary-container" />
              <p className="font-display text-label-xs uppercase tracking-[0.25em] text-gold">
                The Next Cohort Begins Soon
              </p>
            </div>
            <h2 className="mb-space-lg font-display text-headline-xl-mobile uppercase text-cream md:text-headline-xl">
              Begin Your Journey
              <br />
              Towards Flourishing
            </h2>
            <p className="mb-space-xl max-w-2xl text-body-lg text-primary-fixed-dim">
              Join thousands of scholars, educators, founders, and community builders advancing
              human potential through disciplined evidence, contemplative clarity, and deep
              compassion.
            </p>
            <div className="flex flex-wrap items-center gap-space-md">
              <Link
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-cream px-8 py-3.5 font-display text-label-md font-semibold uppercase tracking-wider text-navy transition-colors hover:bg-white active:bg-white"
                href="/#learn"
              >
                Start Learning Today
              </Link>
              <Link
                className="group inline-flex min-h-11 items-center gap-space-xs px-4 py-3 font-display text-label-md font-semibold uppercase tracking-wider text-gold transition-colors hover:text-white"
                href="/#about"
              >
                <span>Talk to Faculty</span>
                <span
                  aria-hidden="true"
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-gold text-navy"
                >
                  <ArrowForwardIcon className="h-4 w-4" />
                </span>
              </Link>
            </div>
          </div>

          <div className="mt-space-xl flex flex-col justify-end lg:col-span-4 lg:mt-0">
            <div className="flex flex-col gap-space-md bg-navy-deep p-space-lg">
              <dl className="flex flex-col gap-space-md">
                {ADMISSIONS.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between gap-space-sm border-b border-white/10 pb-space-sm"
                  >
                    <dt className="font-display text-label-xs uppercase tracking-widest text-tertiary-fixed-dim">
                      {item.label}
                    </dt>
                    <dd
                      className={`font-display text-label-xs uppercase tracking-widest ${
                        item.highlight ? "font-bold text-gold" : "text-cream"
                      }`}
                    >
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="pt-space-xs text-body-sm text-primary-fixed-dim">
                Tuition is subsidized by the RIOSTAK Foundation to guarantee open access for
                community educators.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
