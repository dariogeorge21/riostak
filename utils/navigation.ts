/** Primary site navigation routes shared across desktop and mobile navigation. */
export type NavLink = {
  index: string;
  label: string;
  href: string;
};

export const SITE_NAV_LINKS: readonly NavLink[] = [
  { index: "01", label: "Home", href: "/" },
  { index: "02", label: "About", href: "/about" },
  { index: "03", label: "Courses", href: "/courses" },
  { index: "04", label: "Blogs", href: "/blogs" },
  { index: "05", label: "Contact", href: "/contact" },
];
