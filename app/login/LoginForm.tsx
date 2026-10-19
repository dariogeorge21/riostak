"use client";

import { useActionState, useState } from "react";
import { loginAction } from "@/app/actions/authActions";
import { ArrowForwardIcon } from "@/components/Icons";

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="flex flex-col gap-space-lg" noValidate>
      {state?.error ? (
        <div
          aria-live="polite"
          className="border-l-4 border-red-600 bg-red-50 p-space-sm text-body-sm text-red-900"
          role="alert"
        >
          <p className="font-semibold">{state.error}</p>
        </div>
      ) : null}

      {/* Username Field */}
      <div className="flex flex-col gap-1.5">
        <label
          className="font-display text-label-xs uppercase tracking-widest text-primary"
          htmlFor="admin-username"
        >
          Username <span className="text-secondary">*</span>
        </label>
        <input
          autoComplete="username"
          autoFocus
          className="w-full rounded-xs border border-primary/20 bg-cream/30 px-3.5 py-2.5 font-sans text-body-md text-primary placeholder:text-on-surface-variant/50 transition-colors focus:border-gold focus:bg-white focus:outline-none"
          defaultValue="sdc"
          id="admin-username"
          name="username"
          placeholder="e.g. sdc"
          required
          type="text"
        />
      </div>

      {/* Password Field */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label
            className="font-display text-label-xs uppercase tracking-widest text-primary"
            htmlFor="admin-password"
          >
            Password <span className="text-secondary">*</span>
          </label>
          <button
            className="text-[12px] font-medium text-secondary hover:text-primary"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
            type="button"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <input
          autoComplete="current-password"
          className="w-full rounded-xs border border-primary/20 bg-cream/30 px-3.5 py-2.5 font-sans text-body-md text-primary placeholder:text-on-surface-variant/50 transition-colors focus:border-gold focus:bg-white focus:outline-none"
          defaultValue="sdc.123"
          id="admin-password"
          name="password"
          placeholder="••••••••"
          required
          type={showPassword ? "text" : "password"}
        />
      </div>

      {/* Submit Button */}
      <button
        className="group mt-space-sm inline-flex min-h-12 w-full items-center justify-center gap-space-xs rounded-full bg-primary px-8 font-display text-label-md font-semibold uppercase tracking-wider text-cream shadow-sm transition-all duration-200 hover:bg-secondary hover:text-on-secondary disabled:opacity-50 active:scale-[0.98]"
        disabled={isPending}
        type="submit"
      >
        <span>{isPending ? "Verifying Credentials..." : "Authenticate Session"}</span>
        <span
          aria-hidden="true"
          className="flex h-6 w-6 items-center justify-center rounded-full bg-cream/15 text-cream transition-transform duration-200 group-hover:translate-x-1"
        >
          <ArrowForwardIcon className="h-3.5 w-3.5" />
        </span>
      </button>
    </form>
  );
}
