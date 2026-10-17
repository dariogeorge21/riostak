/** Primary site navigation. Targets are in-page anchors on the landing page. */
export type NavLink = {
  label: string;
  href: string;
};

export const SITE_NAV_LINKS: readonly NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Learn", href: "/#learn" },
  { label: "Research", href: "/#research" },
  { label: "Impact", href: "/#impact" },
  { label: "Contact", href: "/#contact" },
];
