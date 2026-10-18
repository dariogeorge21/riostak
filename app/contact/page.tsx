import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDownwardIcon } from "@/components/Icons";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact — RIOSTAK | Institutional Communications & Admissions",
  description:
    "Direct secretariat desk for academic fellowship inquiries, research partnerships, curricular licensing, and monograph requests.",
};

const SECRETARIAT_HUBS = [
  {
    office: "OFFICE 1",
    code: "HUB 01",
    address: "OFFICE 1",
    email: "office1@riostak.org",
    phone: "+1 (555) 010-0101",
    focus: "Cognitive Epistemology & Fellowship Board",
  },
  {
    office: "OFFICE 2",
    code: "HUB 02",
    address: "OFFICE 2",
    email: "office2@riostak.org",
    phone: "+1 (555) 010-0102",
    focus: "Neuro-Phenomenology & Quantitative Laboratory",
  },
  {
    office: "OFFICE 3",
    code: "HUB 03",
    address: "OFFICE 3",
    email: "office3@riostak.org",
    phone: "+1 (555) 010-0103",
    focus: "Research Cohorts & Civic Practice",
  },
] as const;

const INQUIRY_FAQS = [
  {
    index: "03.01",
    category: "Visiting Chairs & Fellowships",
    question: "Are visiting fellowships funded?",
    answer:
      "All accepted fellows receive non-residential research stipends, computational compute grants, and publication support under our needs-blind endowment.",
  },
  {
    index: "03.02",
    category: "Curricula & Open Syllabi",
    question: "Can university faculties adopt RIOSTAK modules?",
    answer:
      "Yes. Syllabi, longitudinal assessment rubrics, and interactive courseware are freely provided to accredited institutions under open scholarly licenses.",
  },
  {
    index: "03.03",
    category: "Monographs & Press",
    question: "How do reviewers request pre-publication galley proofs?",
    answer:
      "Galley proofs and empirical datasets are released to credentialed journalists and peer reviewers 14 days prior to monograph distribution under standard embargo.",
  },
] as const;

export default function ContactPage() {
  return (
    <main className="flex min-h-screen w-full flex-col justify-between bg-cream pt-20 text-primary">
        {/* Main Content Area */}
        <div className="mx-auto flex w-full max-w-screen-2xl flex-1 flex-col justify-center px-margin py-space-2xl lg:px-margin-desktop lg:py-space-3xl">
          {/* Header Status & Classification Bar */}
          <div className="flex flex-wrap items-center justify-between gap-space-sm border-b border-primary/10 pb-space-lg">
            <div className="flex items-center gap-space-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-secondary" />
              </span>
              <p className="font-display text-label-xs font-bold uppercase tracking-[0.2em] text-secondary">
                Academic Secretariat Desk Active // Response Window &lt; 48H
              </p>
            </div>
            <p className="font-display text-label-xs uppercase tracking-widest text-on-surface-variant">
              Dossier 04 // Communications &amp; Admissions
            </p>
          </div>

          {/* Monumental Hero Section */}
          <div className="py-space-2xl lg:py-space-3xl">
            <div className="max-w-4xl">
              <p className="mb-space-xs font-display text-label-xs font-bold uppercase tracking-[0.25em] text-on-surface-variant">
                Direct Inquiries
              </p>
              <h1 className="font-display text-headline-xl-mobile uppercase leading-[0.92] tracking-tight text-primary sm:text-headline-lg lg:text-headline-xl">
                Connect With
                <br />
                The Institute
              </h1>

              <p className="mt-space-xl font-serif text-2xl font-light italic leading-snug text-primary lg:text-3xl">
                &ldquo;Whether inquiring about academic fellowships, curriculum licensing,
                longitudinal empirical datasets, or institutional partnerships, our secretariat
                lines are open.&rdquo;
              </p>

              <p className="mt-space-md max-w-2xl text-body-lg text-on-surface-variant">
                RIOSTAK maintains active administrative liaisons across OFFICE 1, OFFICE 2, and
                OFFICE 3. Every academic and collaborative proposal is reviewed directly by our
                Secretariat under institutional non-disclosure standards.
              </p>
            </div>

            {/* Quick Metrics Bar */}
            <div className="mt-space-2xl grid grid-cols-2 gap-gutter border-y border-primary/10 py-space-lg sm:grid-cols-4">
              <div>
                <p className="font-display text-label-xs uppercase tracking-wider text-on-surface-variant">
                  Initial Review SLA
                </p>
                <p className="mt-1 font-display text-title-md font-bold text-primary">
                  24–48 Hours
                </p>
              </div>
              <div>
                <p className="font-display text-label-xs uppercase tracking-wider text-on-surface-variant">
                  Secretariat Desks
                </p>
                <p className="mt-1 font-display text-title-md font-bold text-primary">
                  3 Offices
                </p>
              </div>
              <div>
                <p className="font-display text-label-xs uppercase tracking-wider text-on-surface-variant">
                  Data Protection
                </p>
                <p className="mt-1 font-display text-title-md font-bold text-primary">
                  Encrypted &amp; Confidential
                </p>
              </div>
              <div>
                <p className="font-display text-label-xs uppercase tracking-wider text-on-surface-variant">
                  Fellowship Grants
                </p>
                <p className="mt-1 font-display text-title-md font-bold text-primary">
                  Needs-Blind
                </p>
              </div>
            </div>
          </div>

          {/* 2-Column Core Section: Interactive Form + Global Hubs */}
          <div className="grid grid-cols-1 gap-gutter-desktop lg:grid-cols-12">
            {/* Left 7 Columns: Form Console */}
            <div className="flex flex-col gap-space-md lg:col-span-7">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-label-xs font-bold uppercase tracking-[0.2em] text-primary">
                  Transmission Console // Encrypted
                </h2>
                <span className="font-mono text-[11px] text-on-surface-variant">
                  SEC-FORM-REV-2026.4
                </span>
              </div>
              <ContactForm />
            </div>

            {/* Right 5 Columns: Secretariat Hubs Directory & Protocol */}
            <div className="flex flex-col gap-space-lg lg:col-span-5">
              {/* Directory Card */}
              <div className="border border-primary/10 bg-surface-container/40 p-space-lg lg:p-space-xl">
                <div className="mb-space-lg border-b border-primary/10 pb-space-sm">
                  <p className="font-display text-label-xs font-bold uppercase tracking-[0.2em] text-secondary">
                    02 // Secretariat Directory
                  </p>
                  <h3 className="mt-1 font-display text-headline-sm uppercase text-primary">
                    Research Hubs
                  </h3>
                </div>

                <div className="flex flex-col divide-y divide-primary/10">
                  {SECRETARIAT_HUBS.map((hub) => (
                    <div key={hub.office} className="py-space-md first:pt-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-display text-title-sm font-semibold uppercase text-primary">
                          {hub.office}
                        </h4>
                        <span className="font-mono text-[10px] text-on-surface-variant">
                          {hub.code}
                        </span>
                      </div>
                      <p className="mt-1 font-sans text-body-sm text-on-surface-variant">
                        {hub.address}
                      </p>
                      <p className="mt-0.5 font-display text-label-xs text-secondary">
                        {hub.focus}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[12px] text-primary">
                        <a
                          className="transition-colors hover:text-secondary hover:underline"
                          href={`mailto:${hub.email}`}
                        >
                          {hub.email}
                        </a>
                        <span aria-hidden="true" className="text-primary/30">
                          •
                        </span>
                        <a
                          className="transition-colors hover:text-secondary hover:underline"
                          href={`tel:${hub.phone.replace(/[^+\d]/g, "")}`}
                        >
                          {hub.phone}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Protocol Card */}
              <div className="border border-primary/10 bg-surface-container-lowest p-space-lg">
                <p className="font-display text-label-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">
                  Institutional Review Protocols
                </p>
                <ul className="mt-space-md flex flex-col gap-space-sm text-body-sm text-on-surface-variant">
                  <li className="flex items-start gap-space-xs">
                    <span className="font-display text-label-xs font-bold text-secondary">
                      [01]
                    </span>
                    <span>
                      <strong className="text-primary">Direct Faculty Routing:</strong> Inquiries
                      pertaining to research collaborations or syllabi are routed directly to
                      principal investigators.
                    </span>
                  </li>
                  <li className="flex items-start gap-space-xs">
                    <span className="font-display text-label-xs font-bold text-secondary">
                      [02]
                    </span>
                    <span>
                      <strong className="text-primary">Research Embargoes:</strong> Press and media
                      inquiries should state pending publication deadlines for expedited review.
                    </span>
                  </li>
                  <li className="flex items-start gap-space-xs">
                    <span className="font-display text-label-xs font-bold text-secondary">
                      [03]
                    </span>
                    <span>
                      <strong className="text-primary">Emergency Academic Contact:</strong> Visiting
                      chairs requiring immediate travel verification may use the direct OFFICE 1
                      telephone dispatch.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 3-Column FAQ & Editorial Guidance */}
          <div className="mt-space-3xl border-t border-primary/10 pt-space-2xl">
            <div className="mb-space-xl flex flex-wrap items-end justify-between gap-space-sm">
              <div>
                <p className="font-display text-label-xs font-bold uppercase tracking-[0.2em] text-secondary">
                  03 // Clarifications
                </p>
                <h2 className="mt-1 font-display text-headline-sm uppercase text-primary lg:text-headline-md">
                  Frequently Directed Inquiries
                </h2>
              </div>
              <Link
                className="font-display text-label-xs uppercase tracking-wider text-on-surface-variant transition-colors hover:text-primary"
                href="/about"
              >
                Read Institute Charter &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-gutter md:grid-cols-3">
              {INQUIRY_FAQS.map((faq) => (
                <div
                  key={faq.index}
                  className="flex flex-col justify-between border border-primary/10 bg-surface-container/50 p-space-lg transition-colors hover:bg-surface-container"
                >
                  <div>
                    <div className="mb-space-md flex items-center justify-between">
                      <span className="font-display text-label-xs font-bold uppercase tracking-widest text-secondary">
                        {faq.index}
                      </span>
                      <span className="font-display text-label-xs uppercase tracking-widest text-on-surface-variant">
                        {faq.category}
                      </span>
                    </div>
                    <h3 className="mb-space-xs font-display text-title-md font-semibold text-primary">
                      {faq.question}
                    </h3>
                  </div>
                  <p className="mt-space-md text-body-sm text-on-surface-variant">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Full-Width Baseline Ticker */}
        <div className="w-full border-t border-primary/15">
          <div className="w-full px-margin py-space-lg lg:px-margin-desktop">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-space-sm font-display text-label-xs uppercase tracking-[0.25em] text-on-surface-variant">
                <ArrowDownwardIcon className="h-4 w-4 motion-safe:animate-bounce text-secondary" />
                <span>Secretariat Communications Active</span>
              </p>
              <div className="hidden items-center gap-space-xl text-on-surface-variant md:flex lg:gap-space-2xl">
                <span className="font-display text-label-xs uppercase tracking-wider">
                  OFFICE 1
                </span>
                <span aria-hidden="true" className="h-1 w-1 rounded-full bg-secondary" />
                <span className="font-display text-label-xs uppercase tracking-wider">
                  OFFICE 2
                </span>
                <span aria-hidden="true" className="h-1 w-1 rounded-full bg-secondary" />
                <span className="font-display text-label-xs uppercase tracking-wider">
                  OFFICE 3
                </span>
                <span aria-hidden="true" className="h-1 w-1 rounded-full bg-secondary" />
                <span className="font-display text-label-xs font-bold uppercase tracking-wider text-primary">
                  {"// 2026 ACTIVE"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
  );
}
