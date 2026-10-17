import Link from "next/link";
import Wordmark from "./Wordmark";

type FooterColumn = {
  heading: string;
  links: readonly { label: string; href: string }[];
};

const FOOTER_COLUMNS: readonly FooterColumn[] = [
  {
    heading: "01 // Academics",
    links: [
      { label: "Curriculum", href: "/#learn" },
      { label: "Fellowships", href: "/#learn" },
      { label: "Seminars", href: "/#learn" },
      { label: "Open Modules", href: "/#library" },
    ],
  },
  {
    heading: "02 // Inquiry",
    links: [
      { label: "Publications", href: "/#research" },
      { label: "Working Papers", href: "/#research" },
      { label: "Field Trials", href: "/#impact" },
      { label: "Faculty", href: "/#about" },
    ],
  },
];

/** Global site footer. */
export default function Footer() {
  return (
    <footer className="w-full bg-cream text-on-surface">
      <div className="mx-auto max-w-7xl px-margin pb-space-2xl pt-space-3xl lg:px-margin-desktop">
        <div className="grid grid-cols-1 gap-gutter-desktop lg:grid-cols-12">
          <div className="flex flex-col justify-between gap-space-md lg:col-span-4">
            <div>
              <Wordmark className="h-40 w-40" />
              <p className="mt-space-md max-w-sm text-body-sm text-on-surface-variant">
                An interdisciplinary educational institute and research laboratory dedicated to
                advancing human flourishing through empirical inquiry and ethical design.
              </p>
            </div>
            <p className="font-display text-label-xs uppercase text-on-surface-variant">
              EST. 2026 // CAMBRIDGE &amp; GLOBAL
            </p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-gutter lg:col-span-4">
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.heading} className="flex flex-col gap-space-md">
                <h2 className="font-display text-label-xs uppercase text-on-surface">
                  {column.heading}
                </h2>
                <ul className="flex flex-col gap-space-sm">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        className="inline-flex min-h-6 items-center text-body-sm text-on-surface-variant transition-colors hover:text-primary"
                        href={link.href}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          <div className="flex flex-col gap-space-md lg:col-span-4">
            <div>
              <h2 className="font-display text-label-xs uppercase text-on-surface">
                03 // Despatches
              </h2>
              <h3 className="mt-space-xs font-display text-headline-sm text-primary">
                Stay informed on discoveries
              </h3>
              <p className="mt-space-xs text-body-sm text-on-surface-variant">
                A monthly digest synthesizing research findings and philosophical inquiry on
                flourishing.
              </p>
            </div>
            {/* Disabled until a newsletter provider is connected; no submission path exists yet. */}
            <form aria-describedby="newsletter-status" className="flex items-end gap-space-xs">
              <div className="flex-1">
                <label className="sr-only" htmlFor="newsletter-email">
                  Institutional email
                </label>
                <input
                  className="w-full border-b border-on-surface/20 bg-transparent px-space-md py-space-sm text-body-sm text-on-surface placeholder:text-on-surface-variant disabled:cursor-not-allowed disabled:opacity-60"
                  disabled
                  id="newsletter-email"
                  name="email"
                  placeholder="Institutional email"
                  type="email"
                />
              </div>
              <button
                className="min-h-11 shrink-0 rounded-full bg-primary px-space-lg font-display text-label-md uppercase tracking-wide text-on-primary disabled:cursor-not-allowed disabled:opacity-50"
                disabled
                type="submit"
              >
                Subscribe
              </button>
            </form>
            <p className="text-body-sm text-on-surface-variant" id="newsletter-status">
              Subscriptions open soon.
            </p>
          </div>
        </div>

        <div className="mt-space-3xl flex flex-col items-center justify-between gap-space-md pt-space-lg md:flex-row">
          <p className="text-body-sm text-on-surface-variant">
            © 2026 RIOSTAK. All rights reserved.
          </p>
          <Link
            className="inline-flex min-h-11 items-center font-display text-label-xs uppercase text-on-surface-variant transition-colors hover:text-primary"
            href="/#contact"
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
