"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SITE_NAV_LINKS } from "@/utils/navigation";
import DesktopNav from "./DesktopNav";
import { ArrowForwardIcon, UserAuthIcon } from "./Icons";
import MobileNav from "./MobileNav";
import Wordmark from "./Wordmark";

const HEADER_HEIGHT_PX = 80;

/**
 * Fixed full-bleed global navigation bar:
 * - Edge-to-edge (`w-full`) so the logo anchors the left corner and nav items anchor the right corner.
 * - Matches the dark blue (`bg-primary`) Hero palette while viewing the landing page Hero section,
 *   then transitions smoothly back to the original warm cream (`bg-cream`) once the viewport reaches
 *   the next section (`#about`) or on inner routes.
 */
export default function Header() {
  const pathname = usePathname();
  const [hasPassedHero, setHasPassedHero] = useState(false);

  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    const updateNavSurface = () => {
      const heroEl = document.getElementById("hero");
      if (heroEl) {
        const { bottom } = heroEl.getBoundingClientRect();
        setHasPassedHero(bottom <= HEADER_HEIGHT_PX);
        return;
      }

      const aboutEl = document.getElementById("about");
      if (aboutEl) {
        const { top } = aboutEl.getBoundingClientRect();
        setHasPassedHero(top <= HEADER_HEIGHT_PX);
        return;
      }

      setHasPassedHero(window.scrollY > window.innerHeight - HEADER_HEIGHT_PX);
    };

    updateNavSurface();
    window.addEventListener("scroll", updateNavSurface, { passive: true });
    window.addEventListener("resize", updateNavSurface, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateNavSurface);
      window.removeEventListener("resize", updateNavSurface);
    };
  }, [pathname]);

  const isHeroDark = pathname === "/" && !hasPassedHero;
  const isAuthActive = pathname.startsWith("/login") || pathname.startsWith("/manage");

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 w-full border-b backdrop-blur-xl transition-colors duration-300 ease-out ${
        isHeroDark
          ? "border-cream/15 bg-primary/90 text-cream"
          : "border-primary/12 bg-cream/90 text-primary"
      }`}
    >
      <div className="flex h-20 w-full items-center justify-between gap-3 px-3 sm:px-5 lg:px-6">
        {/* Left Corner: Logo & Brand Identity */}
        <div className="flex shrink-0 items-center gap-3">
          <Wordmark
            className="h-12 w-12 shrink-0 transition-transform duration-300 hover:scale-[1.03]"
            isDark={isHeroDark}
          />
          <div
            aria-hidden="true"
            className={`h-7 w-px transition-colors duration-300 ${
              isHeroDark ? "bg-cream/20" : "bg-primary/15"
            }`}
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span
                className={`font-display text-[20px] font-bold uppercase tracking-[0.2em] transition-colors duration-300 ${
                  isHeroDark ? "text-cream" : "text-primary"
                }`}
              >
                RIOSTAK
              </span>
            </div>
          </div>
        </div>

        {/* Right Corner: Nav Items + Start Learning CTA + Auth Login Icon + Mobile Trigger */}
        <div className="flex shrink-0 items-center justify-end gap-2 sm:gap-2.5">
          <DesktopNav isDark={isHeroDark} links={SITE_NAV_LINKS} />

          <div
            aria-hidden="true"
            className={`hidden h-6 w-px transition-colors duration-300 lg:block ${
              isHeroDark ? "bg-cream/20" : "bg-primary/15"
            }`}
          />

          <Link
            className={`group hidden min-h-10 items-center gap-2 rounded-full py-1.5 pl-4 pr-2 font-display text-label-md font-semibold uppercase tracking-[0.14em] shadow-xs transition-all duration-200 active:scale-[0.98] md:inline-flex ${
              isHeroDark
                ? "bg-cream text-primary hover:bg-secondary-container hover:text-primary"
                : "bg-primary text-cream hover:bg-secondary hover:text-on-secondary"
            }`}
            href="/courses"
          >
            <span>Start Learning</span>
            <span
              aria-hidden="true"
              className={`flex h-7 w-7 items-center justify-center rounded-full transition-transform duration-200 group-hover:translate-x-0.5 ${
                isHeroDark
                  ? "bg-primary text-secondary-container group-hover:bg-primary group-hover:text-cream"
                  : "bg-gold text-primary group-hover:bg-cream"
              }`}
            >
              <ArrowForwardIcon className="h-3.5 w-3.5" />
            </span>
          </Link>

          <Link
            aria-current={isAuthActive ? "page" : undefined}
            aria-label="Curator Login"
            className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-200 active:scale-[0.96] ${
              isAuthActive
                ? isHeroDark
                  ? "border-gold bg-gold text-primary shadow-xs"
                  : "border-primary bg-primary text-gold shadow-xs"
                : isHeroDark
                  ? "border-cream/20 bg-primary-container/80 text-cream hover:border-gold hover:bg-cream hover:text-primary"
                  : "border-primary/15 bg-surface-container-lowest/90 text-primary hover:border-primary/40 hover:bg-primary hover:text-cream"
            }`}
            href="/login"
            title="Curator Login"
          >
            <UserAuthIcon className="h-4 w-4" />
          </Link>

          <MobileNav isDark={isHeroDark} links={SITE_NAV_LINKS} />
        </div>
      </div>
    </header>
  );
}
