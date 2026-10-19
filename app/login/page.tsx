import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/utils/auth";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin Secretariat Access — RIOSTAK",
  description: "Secure administrative access for RIOSTAK institutional fellows and content curators.",
};

export default async function LoginPage() {
  const session = await getAdminSession();
  if (session) {
    redirect("/manage");
  }

  return (
    <main className="flex min-h-screen w-full flex-col justify-between bg-cream pt-20 text-primary">
      <div className="mx-auto flex w-full max-w-screen-xl flex-1 flex-col items-center justify-center px-margin py-space-2xl lg:px-margin-desktop lg:py-space-3xl">
        {/* Top Status & Classification Bar */}
        <div className="mb-space-xl flex w-full max-w-md items-center justify-between border-b border-primary/10 pb-space-sm">
          <div className="flex items-center gap-space-xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-secondary" />
            </span>
            <span className="font-display text-label-xs font-bold uppercase tracking-[0.2em] text-secondary">
              Portal
            </span>
          </div>
          <span className="font-mono text-[11px] uppercase tracking-wider text-on-surface-variant">
            AUTH // SEC-01
          </span>
        </div>

        {/* Central Minimalist Login Card */}
        <div className="w-full max-w-md border border-primary/15 bg-surface-container-lowest p-space-xl shadow-lg ring-1 ring-primary/5">
          <div className="mb-space-xl">
            <p className="font-display text-label-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
              Restricted Console
            </p>
            <h1 className="mt-space-xs font-display text-headline-sm uppercase tracking-tight text-primary">
              Institutional Login
            </h1>
            <p className="mt-space-xs font-serif text-body-md font-light italic text-on-surface-variant">
              &ldquo;Curate empirical monographs, cohort syllabi, and public research dispatches.&rdquo;
            </p>
          </div>

          <LoginForm />

          {/* Institutional note */}
          <div className="mt-space-xl border-t border-primary/10 pt-space-md">
            <div className="flex items-start gap-space-xs bg-cream/60 p-space-sm">
              <span className="font-mono text-[11px] font-bold text-secondary">INFO</span>
              <p className="text-[12px] leading-relaxed text-on-surface-variant">
                Authentication verified against Supabase database table with bcrypt hashing.
                Initial credentials: <strong className="font-mono text-primary">sdc</strong> /{" "}
                <strong className="font-mono text-primary">sdc.123</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
