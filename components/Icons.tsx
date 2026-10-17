type IconProps = {
  className?: string;
};

/** Decorative arrow pointing right. Always paired with visible or aria-label text. */
export function ArrowForwardIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/** Decorative arrow pointing down, used by the hero scroll hint. */
export function ArrowDownwardIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M12 5v14M6 13l6 6 6-6" />
    </svg>
  );
}

/** Decorative check-badge used beside the impact quote. */
export function VerifiedIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M12 2.5l2.4 1.9 3-.2 1 2.9 2.5 1.7-.9 2.9.9 2.9-2.5 1.7-1 2.9-3-.2-2.4 1.9-2.4-1.9-3 .2-1-2.9-2.5-1.7.9-2.9-.9-2.9 2.5-1.7 1-2.9 3 .2z" />
      <path d="M8.5 12.2l2.4 2.4 4.6-4.9" />
    </svg>
  );
}
