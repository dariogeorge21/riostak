"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavLink } from "@/utils/navigation";

type DesktopNavProps = {
  links: readonly NavLink[];
};

/**
 * Right-aligned Awwwards-inspired floating pill navigation dock.
 * Client leaf so `usePathname()` highlights the active route accurately.
 */
export default function DesktopNav({ links }: DesktopNavProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="hidden items-center gap-1 rounded-full border border-primary/12 bg-surface-container-lowest/80 p-1.5 shadow-[0_4px_24px_-6px_rgba(0,8,31,0.08)] backdrop-blur-md lg:flex"
    >
      {links.map((link) => {
        const isActive =
          link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            aria-current={isActive ? "page" : undefined}
            className={`group relative inline-flex min-h-9 items-center gap-1.5 rounded-full px-4 py-1.5 font-display text-label-md uppercase tracking-[0.14em] transition-all duration-200 ${
              isActive
                ? "bg-primary font-semibold text-cream shadow-xs"
                : "text-on-surface-variant hover:bg-cream hover:text-primary"
            }`}
            href={link.href}
          >
            <span
              aria-hidden="true"
              className={`font-mono text-[10px] tracking-normal transition-colors ${
                isActive
                  ? "text-gold"
                  : "text-on-surface-variant/60 group-hover:text-secondary"
              }`}
            >
              {link.index}
            </span>
            <span>{link.label}</span>
            {isActive ? (
              <span
                aria-hidden="true"
                className="ml-0.5 h-1.5 w-1.5 rounded-full bg-gold"
              />
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
