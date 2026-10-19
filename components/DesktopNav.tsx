"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavLink } from "@/utils/navigation";

type DesktopNavProps = {
  links: readonly NavLink[];
  isDark?: boolean;
};

/**
 * Right-aligned Awwwards-inspired floating pill navigation dock.
 * Client leaf so `usePathname()` highlights the active route accurately.
 */
export default function DesktopNav({ links, isDark = false }: DesktopNavProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className={`hidden items-center gap-1 rounded-full border p-1.5 backdrop-blur-md transition-colors duration-300 lg:flex ${
        isDark
          ? "border-cream/15 bg-primary-container/75 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.45)]"
          : "border-primary/12 bg-surface-container-lowest/80 shadow-[0_4px_24px_-6px_rgba(0,8,31,0.08)]"
      }`}
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
                ? isDark
                  ? "bg-cream font-semibold text-primary shadow-xs"
                  : "bg-primary font-semibold text-cream shadow-xs"
                : isDark
                  ? "text-cream/75 hover:bg-cream/10 hover:text-cream"
                  : "text-on-surface-variant hover:bg-cream hover:text-primary"
            }`}
            href={link.href}
          >
            <span
              aria-hidden="true"
              className={`font-mono text-[10px] tracking-normal transition-colors ${
                isActive
                  ? isDark
                    ? "text-secondary"
                    : "text-gold"
                  : isDark
                    ? "text-cream/45 group-hover:text-secondary-container"
                    : "text-on-surface-variant/60 group-hover:text-secondary"
              }`}
            >
              {link.index}
            </span>
            <span>{link.label}</span>
            {isActive ? (
              <span
                aria-hidden="true"
                className={`ml-0.5 h-1.5 w-1.5 rounded-full ${
                  isDark ? "bg-secondary" : "bg-gold"
                }`}
              />
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
