import Link from "next/link";
import { SITE_NAV_LINKS } from "@/utils/navigation";
import DesktopNav from "./DesktopNav";
import { ArrowForwardIcon } from "./Icons";
import MobileNav from "./MobileNav";
import Wordmark from "./Wordmark";

/**
 * Fixed full-bleed global navigation bar:
 * - Edge-to-edge (`w-full`) so the logo anchors the left corner and nav items anchor the right corner.
 * - Center architectural bridge fills the middle span between brand and navigation.
 * - Identical navigation links, active-route indicators, and CTA across desktop and mobile.
 */
export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 w-full border-b border-primary/12 bg-cream/90 backdrop-blur-xl">
      <div className="flex h-20 w-full items-center justify-between gap-3 px-3 sm:px-5 lg:px-6">
        {/* Left Corner: Logo & Brand Identity */}
        <div className="flex shrink-0 items-center gap-3">
          <Wordmark className="h-14 w-14 shrink-0 transition-transform duration-300 hover:scale-[1.03]" />
          <div aria-hidden="true" className="h-7 w-px bg-primary/15" />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-secondary" />
              </span>
              <span className="font-display text-[20px] font-bold uppercase tracking-[0.2em] text-primary">
                RIOSTAK 
              </span>
            </div>
          </div>
        </div>

        {/* Right Corner: Nav Items + Start Learning CTA + Mobile Trigger */}
        <div className="flex shrink-0 items-center justify-end gap-2 sm:gap-3">
          <DesktopNav links={SITE_NAV_LINKS} />

          <div
            aria-hidden="true"
            className="hidden h-6 w-px bg-primary/15 lg:block"
          />

          <Link
            className="group hidden min-h-10 items-center gap-2 rounded-full bg-primary py-1.5 pl-4 pr-2 font-display text-label-md font-semibold uppercase tracking-[0.14em] text-cream shadow-xs transition-all duration-200 hover:bg-secondary hover:text-on-secondary active:scale-[0.98] md:inline-flex"
            href="/courses"
          >
            <span>Start Learning</span>
            <span
              aria-hidden="true"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-gold text-primary transition-transform duration-200 group-hover:translate-x-0.5 group-hover:bg-cream"
            >
              <ArrowForwardIcon className="h-3.5 w-3.5" />
            </span>
          </Link>

          <MobileNav links={SITE_NAV_LINKS} />
        </div>
      </div>
    </header>
  );
}
