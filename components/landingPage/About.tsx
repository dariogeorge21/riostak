import Image from "next/image";
import Link from "next/link";
import { ArrowForwardIcon } from "../Icons";

const PRINCIPLES = [
  {
    index: "01.01 // Foundation",
    title: "Evidence-Informed",
    body: "Grounded strictly in multidisciplinary cognitive science, developmental psychology, and verifiable field measurements.",
  },
  {
    index: "01.02 // Primacy",
    title: "Human-Centered",
    body: "Organized around uncompromised somatic dignity, subjective interiority, and authentic psychological safety.",
  },
  {
    index: "01.03 // Plurality",
    title: "Globally Relevant",
    body: "Developed across cross-cultural ethnographic cohorts to evade western, educated, and industrialized biases.",
  },
  {
    index: "01.04 // Horizon",
    title: "Future-Focused",
    body: "Cultivating intergenerational resilience, ethical stewardship, and systemic agency in an automated century.",
  },
] as const;

/** Section 01: About RIOSTAK, with the four operating principles. */
export default function About() {
  return (
    <section className="w-full bg-surface-container-low py-space-3xl" id="about">
      <div className="mx-auto max-w-screen-2xl px-margin lg:px-margin-desktop">
        <div className="flex items-center justify-between pb-space-lg">
          <div className="flex items-center gap-space-xs">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-secondary" />
            <p className="font-display text-label-md uppercase text-primary">01 — About RIOSTAK</p>
          </div>
          <p className="hidden font-display text-label-xs uppercase text-on-surface-variant sm:block">
            {"// Empirical Epistemology"}
          </p>
        </div>

        <div className="mt-space-xl grid grid-cols-1 items-center gap-gutter-desktop lg:grid-cols-12">
          <div className="flex flex-col justify-between lg:col-span-6">
            <h2 className="mb-space-lg font-display text-headline-lg-mobile uppercase text-primary md:text-headline-lg">
              Towards
              <br />
              Flourishing
            </h2>
            <p className="mb-space-lg font-serif text-2xl font-light italic leading-snug text-primary lg:text-3xl">
              &ldquo;Evidence-informed learning synthesized for deep wellbeing, authentic human
              connection, and durable psychological vitality.&rdquo;
            </p>
            <p className="mb-space-xl max-w-lg text-body-md text-on-surface-variant">
              Founded as an interdisciplinary laboratory and open educational trust, RIOSTAK
              translates peer-reviewed cognitive science, contemplative traditions, and ethical
              design into actionable curricula. We replace fragmented self-help with structural
              intellectual rigor.
            </p>
            <Link
              className="group inline-flex min-h-11 items-center gap-space-sm self-start font-display text-label-md uppercase tracking-[0.15em] text-primary transition-colors hover:text-secondary"
              href="/#contact"
            >
              <span>Read Institute Charter</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-on-primary transition-all group-hover:bg-secondary group-hover:text-on-secondary">
                <ArrowForwardIcon className="h-4 w-4" />
              </span>
            </Link>
          </div>

          <div className="relative lg:col-span-6">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-secondary-container">
              <div
                aria-hidden="true"
                className="absolute -left-4 -top-4 -z-10 hidden h-full w-full bg-primary-container sm:block"
              />
              <Image
                alt="Researchers and students in a seminar at the RIOSTAK collaborative symposium"
                className="object-cover grayscale-[10%]"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                src="/images/about-symposium.jpg"
              />
              <p className="absolute bottom-4 left-4 z-30 bg-primary px-space-md py-space-xs font-display text-label-xs uppercase tracking-widest text-on-primary">
                Field Laboratory // Cohort VI
              </p>
            </div>
          </div>
        </div>

        <ul className="mt-space-3xl grid grid-cols-1 gap-gutter pt-space-2xl md:grid-cols-2 lg:grid-cols-4">
          {PRINCIPLES.map((principle) => (
            <li
              key={principle.index}
              className="flex min-h-[220px] flex-col justify-between bg-surface-container p-space-lg"
            >
              <div>
                <p className="mb-space-md block font-display text-label-xs uppercase text-secondary">
                  {principle.index}
                </p>
                <h3 className="mb-space-xs font-display text-headline-sm uppercase text-primary">
                  {principle.title}
                </h3>
              </div>
              <p className="text-body-sm text-on-surface-variant">{principle.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
