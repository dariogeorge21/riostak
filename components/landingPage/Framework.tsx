import { ArrowForwardIcon } from "../Icons";

const PILLARS = [
  {
    index: "01",
    title: "Understand Deeply",
    tag: "Cognition",
    body: "Cultivate cognitive clarity, metacognitive self-awareness, and emotional wisdom free from reactionary conditioning.",
  },
  {
    index: "02",
    title: "Relate Meaningfully",
    tag: "Attachment",
    body: "Nurture unfeigned relational connection, non-defensive presence, and mutual affective safety across differences.",
  },
  {
    index: "03",
    title: "Live Purposefully",
    tag: "Telos",
    body: "Align diurnal routines with enduring eudaimonic values, sustained intentionality, and generational contribution.",
  },
  {
    index: "04",
    title: "Act Ethically",
    tag: "Ethics",
    body: "Exercise rigorous moral reasoning, radical civic responsibility, and active benevolent stewardship for vulnerable ecosystems.",
  },
  {
    index: "05",
    title: "Nurture Wellbeing",
    tag: "Somatic",
    body: "Sustain somatic nervous system balance, regenerative circadian cycles, and autonomic resilience under duress.",
  },
  {
    index: "06",
    title: "Enable Thriving",
    tag: "Ecology",
    body: "Construct physical, civic, and digital environments engineered deliberately to unlock latent collective capacity.",
  },
] as const;

/** Section 03: The framework — six pillars of flourishing. */
export default function Framework() {
  return (
    <section className="w-full bg-cream-deep py-space-3xl" id="framework">
      <div className="mx-auto max-w-screen-2xl px-margin lg:px-margin-desktop">
        <div className="mb-space-2xl flex flex-col justify-between md:flex-row md:items-baseline">
          <div>
            <p className="mb-space-xs font-display text-label-xs font-bold uppercase tracking-[0.25em] text-secondary">
              03 // Empirical Architecture
            </p>
            <h2 className="font-display text-headline-lg-mobile uppercase text-primary md:text-headline-lg">
              Six Pillars of Flourishing
            </h2>
          </div>
          <p className="mt-space-sm font-display text-label-xs uppercase text-on-surface-variant md:mt-0">
            RIOSTAK Core Matrix • Peer-Reviewed Standards
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((pillar) => (
            <li
              key={pillar.index}
              className="flex min-h-[300px] flex-col justify-between bg-cream p-space-xl transition-colors hover:bg-surface-container-lowest"
            >
              <div>
                <div className="mb-space-lg flex items-center justify-between">
                  <span className="font-display text-label-md font-bold tracking-[0.2em] text-primary">
                    {pillar.index}
                  </span>
                  <span aria-hidden="true" className="h-2 w-2 rounded-full bg-secondary" />
                </div>
                <h3 className="mb-space-sm font-display text-headline-sm uppercase text-primary">
                  {pillar.title}
                </h3>
                <p className="text-body-sm text-on-surface-variant">{pillar.body}</p>
              </div>
              <div className="flex items-center justify-between pt-space-lg">
                <span className="font-display text-label-xs uppercase tracking-widest text-on-surface-variant">
                  {pillar.tag}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
