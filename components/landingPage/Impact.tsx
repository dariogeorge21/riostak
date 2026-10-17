import Link from "next/link";
import { VerifiedIcon } from "../Icons";

const METRICS = [
  {
    value: "100K+",
    label: "Learners Worldwide",
    description: "Completing foundational certificates and guided cohorts.",
    valueClassName: "text-[4rem] lg:text-[4.5rem]",
  },
  {
    value: "150+",
    label: "Curricula & Resources",
    description: "Peer-reviewed syllabi, field kits, and somatic manuals.",
    valueClassName: "text-[4rem] lg:text-[4.5rem]",
  },
  {
    value: "50+",
    label: "Countries Reached",
    description: "Cross-cultural validation across diverse global communities.",
    valueClassName: "text-[4rem] lg:text-[4.5rem]",
  },
  {
    value: "ACTIVE",
    label: "Empirical Field Trials",
    description: "Longitudinal studies continuously assessing human flourishing.",
    valueClassName: "text-[3rem] lg:text-[3.25rem]",
  },
] as const;

/** Section 05: Collective impact metrics and institutional quote. */
export default function Impact() {
  return (
    <section className="w-full bg-surface-container py-space-3xl" id="impact">
      <div className="mx-auto max-w-7xl px-margin lg:px-margin-desktop">
        <div className="mb-space-2xl flex items-center justify-between">
          <div>
            <p className="mb-space-xs font-display text-label-xs font-bold uppercase tracking-[0.25em] text-secondary">
              05 // Empirical Proof
            </p>
            <h2 className="font-display text-headline-lg-mobile uppercase text-primary md:text-headline-lg">
              Our Collective Impact
            </h2>
          </div>
          <p className="hidden font-display text-label-xs uppercase text-on-surface-variant md:block">
            Audited Longitudinal Outcomes
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-4">
          {METRICS.map((metric) => (
            <li key={metric.label} className="flex flex-col justify-between bg-cream p-space-lg">
              <div>
                <p
                  className={`font-display font-bold leading-none tracking-tighter text-primary ${metric.valueClassName}`}
                >
                  {metric.value}
                </p>
                <div aria-hidden="true" className="my-space-md h-1 w-12 bg-secondary" />
              </div>
              <div>
                <p className="font-display text-label-md font-semibold uppercase tracking-[0.18em] text-primary">
                  {metric.label}
                </p>
                <p className="mt-1 text-body-sm text-on-surface-variant">{metric.description}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-space-2xl flex flex-col items-center justify-between gap-space-lg bg-cream-deep p-space-xl md:flex-row">
          <div className="flex items-center gap-space-md">
            <VerifiedIcon className="h-8 w-8 shrink-0 text-secondary" />
            <blockquote className="max-w-xl text-body-sm text-primary">
              &ldquo;Flourishing is not an accidental mood state; it is an empirical discipline
              cultivated through discernment, ethical fidelity, and relational communion.&rdquo;
            </blockquote>
          </div>
          <Link
            className="inline-flex min-h-11 shrink-0 items-center font-display text-label-xs font-bold uppercase tracking-widest text-primary transition-colors hover:text-secondary"
            href="/#impact"
          >
            Read Annual Impact Dossier →
          </Link>
        </div>
      </div>
    </section>
  );
}
