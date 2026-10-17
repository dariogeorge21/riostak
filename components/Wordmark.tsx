import Image from "next/image";
import Link from "next/link";

/** Official RIOSTAK logo. Shared by the header and footer. */
export default function Wordmark({ className = "h-16 w-16" }: { className?: string }) {
  return (
    <Link aria-label="RIOSTAK home" className="inline-block" href="/">
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
