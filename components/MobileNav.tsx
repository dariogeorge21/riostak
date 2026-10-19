"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { NavLink } from "@/utils/navigation";
import { ArrowForwardIcon } from "./Icons";

type MobileNavProps = {
  links: readonly NavLink[];
  isDark?: boolean;
};

/**
 * Mobile disclosure menu for viewports below `lg` with identical navigation
 * functionalities to `DesktopNav` (numbered pill items, active-route indicator,
 * office telemetry stamp, and `Start Learning` CTA).
 */
export default function MobileNav({ links, isDark = false }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        toggleRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <div className="lg:hidden">
      <button
        ref={toggleRef}
        aria-controls="mobile-navigation"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-200 ${
          isOpen
            ? isDark
              ? "border-cream bg-cream text-primary shadow-xs"
              : "border-primary bg-primary text-cream shadow-xs"
            : isDark
              ? "border-cream/20 bg-primary-container/80 text-cream hover:border-cream/40 hover:bg-primary-container"
              : "border-primary/15 bg-surface-container-lowest/90 text-primary hover:border-primary/40 hover:bg-cream-deep"
        }`}
        onClick={() => setIsOpen((prev) => !prev)}
        type="button"
      >
        <svg
          aria-hidden="true"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.75"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path d="M4 8h16M8 16h12" />
          )}
        </svg>
      </button>

      {isOpen && (
        <nav
          aria-label="Mobile"
          className={`fixed inset-x-0 top-20 z-50 border-y px-3 py-space-md shadow-xl backdrop-blur-xl transition-colors duration-300 sm:px-5 ${
            isDark
              ? "border-cream/15 bg-primary/98 text-cream"
              : "border-primary/15 bg-cream/98 text-primary"
          }`}
          id="mobile-navigation"
        >
          <div className="w-full">
            {/* Same Pill-Style Navigation Items as DesktopNav */}
            <ul className="flex flex-col gap-1.5 py-space-xs">
              {links.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);

                return (
                  <li key={link.href}>
                    <Link
                      aria-current={isActive ? "page" : undefined}
                      className={`group flex min-h-12 items-center justify-between rounded-full px-4 py-2 font-display text-label-md uppercase tracking-[0.14em] transition-all duration-200 ${
                        isActive
                          ? isDark
                            ? "bg-cream font-semibold text-primary shadow-xs"
                            : "bg-primary font-semibold text-cream shadow-xs"
                          : isDark
                            ? "bg-primary-container/60 text-cream/80 hover:bg-primary-container hover:text-cream"
                            : "bg-surface-container-lowest/80 text-on-surface-variant hover:bg-cream-deep hover:text-primary"
                      }`}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="flex items-center gap-2.5">
                        <span
                          aria-hidden="true"
                          className={`font-mono text-[11px] tracking-normal ${
                            isActive
                              ? isDark
                                ? "text-secondary"
                                : "text-gold"
                              : isDark
                                ? "text-secondary-container"
                                : "text-secondary"
                          }`}
                        >
                          {link.index}
                        </span>
                        <span>{link.label}</span>
                        {isActive ? (
                          <span
                            aria-hidden="true"
                            className={`h-1.5 w-1.5 rounded-full ${
                              isDark ? "bg-secondary" : "bg-gold"
                            }`}
                          />
                        ) : null}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`flex h-7 w-7 items-center justify-center rounded-full transition-all ${
                          isActive
                            ? isDark
                              ? "bg-primary text-secondary-container"
                              : "bg-gold text-primary"
                            : isDark
                              ? "bg-cream/10 text-cream group-hover:translate-x-0.5 group-hover:bg-cream group-hover:text-primary"
                              : "bg-primary/5 text-primary group-hover:translate-x-0.5 group-hover:bg-primary group-hover:text-cream"
                        }`}
                      >
                        <ArrowForwardIcon className="h-3.5 w-3.5" />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Primary Start Learning CTA matching Desktop */}
            <div
              className={`mt-space-sm flex items-center justify-between border-t pt-space-md ${
                isDark ? "border-cream/15" : "border-primary/10"
              }`}
            >
              <Link
                className={`group inline-flex min-h-11 items-center gap-2 rounded-full py-1.5 pl-5 pr-2 font-display text-label-md font-semibold uppercase tracking-[0.14em] shadow-xs transition-all duration-200 ${
                  isDark
                    ? "bg-cream text-primary hover:bg-secondary-container hover:text-primary"
                    : "bg-primary text-cream hover:bg-secondary hover:text-on-secondary"
                }`}
                href="/courses"
                onClick={() => setIsOpen(false)}
              >
                <span>Start Learning</span>
                <span
                  aria-hidden="true"
                  className={`flex h-7 w-7 items-center justify-center rounded-full transition-transform duration-200 group-hover:translate-x-0.5 ${
                    isDark
                      ? "bg-primary text-secondary-container group-hover:bg-primary group-hover:text-cream"
                      : "bg-gold text-primary group-hover:bg-cream"
                  }`}
                >
                  <ArrowForwardIcon className="h-3.5 w-3.5" />
                </span>
              </Link>
            </div>
          </div>
        </nav>
      )}
    </div>
  );
}
