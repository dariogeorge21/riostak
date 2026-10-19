import Image from "next/image";
import Link from "next/link";

type WordmarkProps = {
  className?: string;
  isDark?: boolean;
};

/** Official RIOSTAK logo. Shared by the header and footer. */
export default function Wordmark({
  className = "h-16 w-16",
  isDark = false,
}: WordmarkProps) {
  return (
    <Link
      aria-label="RIOSTAK home"
      className={`inline-flex items-center justify-center transition-all duration-300 ${
        isDark
          ? "rounded-xl bg-cream p-1 shadow-xs ring-1 ring-cream/25"
          : "rounded-xl bg-transparent p-0"
      }`}
      href="/"
    >
      <Image
        alt="RIOSTAK — Towards Flourishing"
        className={`${className} object-contain mix-blend-multiply`}
        height={256}
        priority
        src="/logo.jpeg"
        width={256}
      />
    </Link>
  );
}
