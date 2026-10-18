import Link from "next/link";
import { ArrowForwardIcon } from "../Icons";

const AUDIENCES = [
  {
    index: "01",
    title: "Individuals",
    tags: "Metacognition • Somatic Agency • Purpose",
    body: "Rigorous personal inquiries into cognitive resilience, emotional sovereignty, meaning-making, and navigating ambient societal noise with lucidity.",
    href: "/#learn",
  },
  {
    index: "02",
    title: "Families & Bonds",
    tags: "Relational Safety • Empathy • Generational Care",
    body: "Frameworks for cultivating deep presence, intergenerational repair, non-coercive conflict resolution, and enduring emotional safety networks.",
    href: "/#learn",
  },
  {
    index: "03",
    title: "Communities",
    tags: "Civic Cohesion • Mutual Aid • Shared Ecology",
    body: "Civic vitality toolkits and collective flourishing metrics designed for neighborhoods, cooperatives, and high-trust democratic assemblies.",
    href: "/#impact",
  },
  {
    index: "04",
    title: "Educators & Leaders",
    tags: "Pedagogical Design • Ethical Governance",
    body: "Post-industrial pedagogies and institutional design protocols empowering teachers, chancellors, and organizational stewards to foster thriving systems.",
    href: "/#learn",
  },
] as const;

/** Section 02: Who we serve — four audience rows. */
export default function Audience() {
  return (
    <section
      className="mx-auto w-full max-w-screen-2xl px-margin py-space-3xl lg:px-margin-desktop"
      id="audience"
    >
      <div className="mb-space-2xl flex flex-col justify-between md:flex-row md:items-end">
        <div>
          <div className="mb-space-xs flex items-center gap-space-xs">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-secondary-container" />
            <p className="font-display text-label-md uppercase text-on-surface-variant">
              02 // Audience &amp; Scope
            </p>
          </div>
          <h2 className="font-display text-headline-lg-mobile uppercase text-primary md:text-headline-lg">
            Who We Serve
          </h2>
        </div>
        <p className="mt-space-md max-w-md text-body-md text-on-surface-variant md:mt-0">
          Flourishing operates fractally—from the solitary architecture of the mind to global
          communities. Our research branches systematically into four active spheres.
        </p>
      </div>

      <ul className="flex flex-col gap-space-md">
        {AUDIENCES.map((audience) => (
          <li key={audience.index}>
            <Link
              className="group block bg-surface-container p-space-lg transition-all hover:bg-surface-variant lg:p-space-xl"
              href={audience.href}
            >
              <div className="grid grid-cols-1 items-center gap-gutter lg:grid-cols-12">
                <span className="font-display text-label-md font-bold tracking-widest text-secondary lg:col-span-1">
                  {`// ${audience.index}`}
                </span>
                <div className="lg:col-span-4">
                  <h3 className="font-display text-headline-md uppercase text-primary transition-transform group-hover:translate-x-1">
                    {audience.title}
                  </h3>
                  <p className="mt-1 font-display text-label-xs uppercase tracking-widest text-on-surface-variant">
                    {audience.tags}
                  </p>
                </div>
                <p className="text-body-md text-on-surface-variant lg:col-span-5">
                  {audience.body}
                </p>
                <div className="flex items-center lg:col-span-2 lg:justify-end">
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-on-primary transition-transform group-hover:scale-110 group-hover:bg-secondary group-hover:text-on-secondary"
                  >
                    <ArrowForwardIcon className="h-[18px] w-[18px]" />
                  </span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
