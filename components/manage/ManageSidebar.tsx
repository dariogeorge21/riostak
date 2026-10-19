"use client";

import Link from "next/link";
import { logoutAction } from "@/app/actions/authActions";
import Wordmark from "@/components/Wordmark";
import type { AdminUser } from "@/utils/auth";

export type ManageTab = "blogs" | "courses" | "submissions";

interface ManageSidebarProps {
  activeTab: ManageTab;
  onSelectTab: (tab: ManageTab) => void;
  user: AdminUser;
  blogCount: number;
  courseCount: number;
  submissionCount: number;
}

export default function ManageSidebar({
  activeTab,
  onSelectTab,
  user,
  blogCount,
  courseCount,
  submissionCount,
}: ManageSidebarProps) {
  return (
    <aside className="flex w-full flex-col justify-between border-b border-primary/10 bg-surface-container-low p-space-md sm:p-space-lg lg:w-72 lg:min-h-[calc(100vh-5rem)] lg:border-b-0 lg:border-r">
      <div>
        {/* Brand identity & console label */}
        <div className="mb-space-lg flex items-center justify-between border-b border-primary/10 pb-space-md">
          <div className="flex items-center gap-2.5">
            <Wordmark className="h-8 w-8" />
            <div className="flex flex-col">
              <span className="font-display text-label-xs font-bold uppercase tracking-[0.2em] text-primary">
                RIOSTAK
              </span>
              <span className="text-[10px] uppercase tracking-wider text-secondary">
                Secretariat Console
              </span>
            </div>
          </div>
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-secondary" />
          </span>
        </div>

        {/* Navigation Tabs */}
        <nav aria-label="Management sections" className="flex flex-col gap-1.5">
          {/* Blogs Tab */}
          <button
            className={`group flex items-center justify-between rounded-xs px-3.5 py-3 text-left transition-all ${
              activeTab === "blogs"
                ? "bg-primary text-cream shadow-xs"
                : "text-on-surface-variant hover:bg-cream hover:text-primary"
            }`}
            onClick={() => onSelectTab("blogs")}
            type="button"
          >
            <div className="flex items-center gap-space-sm">
              <svg
                aria-hidden="true"
                className={`h-4 w-4 ${activeTab === "blogs" ? "text-gold" : "text-on-surface-variant"}`}
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              <span className="font-display text-label-sm uppercase tracking-wider">Blogs</span>
            </div>
            <span
              className={`rounded-full px-2 py-0.5 font-mono text-[11px] font-bold ${
                activeTab === "blogs"
                  ? "bg-cream/20 text-cream"
                  : "bg-surface-container text-on-surface-variant"
              }`}
            >
              {blogCount}
            </span>
          </button>

          {/* Courses Tab */}
          <button
            className={`group flex items-center justify-between rounded-xs px-3.5 py-3 text-left transition-all ${
              activeTab === "courses"
                ? "bg-primary text-cream shadow-xs"
                : "text-on-surface-variant hover:bg-cream hover:text-primary"
            }`}
            onClick={() => onSelectTab("courses")}
            type="button"
          >
            <div className="flex items-center gap-space-sm">
              <svg
                aria-hidden="true"
                className={`h-4 w-4 ${activeTab === "courses" ? "text-gold" : "text-on-surface-variant"}`}
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
              </svg>
              <span className="font-display text-label-sm uppercase tracking-wider">Courses</span>
            </div>
            <span
              className={`rounded-full px-2 py-0.5 font-mono text-[11px] font-bold ${
                activeTab === "courses"
                  ? "bg-cream/20 text-cream"
                  : "bg-surface-container text-on-surface-variant"
              }`}
            >
              {courseCount}
            </span>
          </button>

          {/* Submissions Tab */}
          <button
            className={`group flex items-center justify-between rounded-xs px-3.5 py-3 text-left transition-all ${
              activeTab === "submissions"
                ? "bg-primary text-cream shadow-xs"
                : "text-on-surface-variant hover:bg-cream hover:text-primary"
            }`}
            onClick={() => onSelectTab("submissions")}
            type="button"
          >
            <div className="flex items-center gap-space-sm">
              <svg
                aria-hidden="true"
                className={`h-4 w-4 ${
                  activeTab === "submissions" ? "text-gold" : "text-on-surface-variant"
                }`}
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span className="font-display text-label-sm uppercase tracking-wider">
                Submissions
              </span>
            </div>
            <span
              className={`rounded-full px-2 py-0.5 font-mono text-[11px] font-bold ${
                activeTab === "submissions"
                  ? "bg-cream/20 text-cream"
                  : "bg-surface-container text-on-surface-variant"
              }`}
            >
              {submissionCount}
            </span>
          </button>
        </nav>
      </div>

      {/* Footer: User Details, Public Link & Sign Out */}
      <div className="mt-space-xl border-t border-primary/10 pt-space-md">
        <div className="mb-space-md flex items-center gap-space-sm px-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-display text-[12px] font-bold text-cream">
            {user.username.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="font-display text-label-xs font-bold text-primary">
              {user.fullName || user.username}
            </span>
            <span className="font-mono text-[10px] text-secondary">@{user.username}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1 border-t border-primary/10 pt-space-sm">
          <Link
            className="flex items-center justify-between rounded-xs px-3 py-2 text-body-sm text-on-surface-variant transition-colors hover:bg-cream hover:text-primary"
            href="/"
            target="_blank"
          >
            <span>Public Site</span>
            <span className="text-[12px]">↗</span>
          </Link>

          <form action={logoutAction}>
            <button
              className="flex w-full items-center justify-between rounded-xs px-3 py-2 text-left text-body-sm text-red-700 transition-colors hover:bg-red-50 hover:text-red-900"
              type="submit"
            >
              <span>Sign Out</span>
              <svg
                aria-hidden="true"
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" x2="9" y1="12" y2="12" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
