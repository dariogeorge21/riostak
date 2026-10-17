"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { NavLink } from "@/utils/navigation";

type MobileNavProps = {
  links: readonly NavLink[];
};

/**
 * Disclosure menu for viewports below `md`. This is the only client boundary in
 * the header; the desktop navigation stays a Server Component.
 */
export default function MobileNav({ links }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

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
    <div className="md:hidden">
      <button
        ref={toggleRef}
        aria-controls="mobile-navigation"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        className="flex h-11 w-11 items-center justify-center rounded-full text-navy transition-colors hover:bg-cream-deep active:bg-cream-deep"
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <svg
          aria-hidden="true"
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          {isOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>

      {isOpen && (
        <nav
          aria-label="Mobile"
          className="absolute inset-x-0 top-20 border-t border-navy/10 bg-cream px-margin py-space-md shadow-sm"
          id="mobile-navigation"
        >
          <ul className="flex flex-col">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  className="flex min-h-11 items-center font-display text-label-md uppercase text-on-surface-variant transition-colors hover:text-navy"
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
