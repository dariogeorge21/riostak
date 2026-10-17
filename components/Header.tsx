import Link from "next/link";
import { SITE_NAV_LINKS } from "@/utils/navigation";
import MobileNav from "./MobileNav";
import Wordmark from "./Wordmark";

/** Fixed global navigation bar. */
export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-cream/95 backdrop-blur-md">
      <div className="relative mx-auto flex h-20 max-w-7xl items-center justify-between px-margin lg:px-margin-desktop">
        <Wordmark />

        <nav aria-label="Primary" className="hidden items-center gap-space-lg md:flex">
          {SITE_NAV_LINKS.map((link, index) => (
            <Link
              key={link.href}
              aria-current={index === 0 ? "page" : undefined}
              className={`font-display text-label-md uppercase transition-colors hover:text-navy ${
                index === 0 ? "font-semibold text-navy" : "text-on-surface-variant"
              }`}
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-space-sm">
          <Link
            className="hidden min-h-11 items-center justify-center rounded-full bg-primary px-space-lg font-display text-label-md uppercase tracking-wider text-on-primary transition-colors hover:bg-gold hover:text-primary active:bg-gold sm:inline-flex"
            href="/#learn"
          >
            Start Learning
          </Link>
          <MobileNav links={SITE_NAV_LINKS} />
        </div>
      </div>
    </header>
  );
}
