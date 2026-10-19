"use client";

import { useEffect, useState } from "react";
import type { BlogItem } from "@/app/actions/blogActions";
import { ArrowForwardIcon, VerifiedIcon } from "@/components/Icons";

interface BlogCatalogSectionProps {
  blogs: readonly BlogItem[];
}

export default function BlogCatalogSection({ blogs }: BlogCatalogSectionProps) {
  const [selectedLabel, setSelectedLabel] = useState<string>("All");
  const [activeReadingId, setActiveReadingId] = useState<string | null>(null);

  const labels = ["All", ...Array.from(new Set(blogs.map((b) => b.label)))];

  const filteredBlogs = blogs.filter((b) => {
    if (selectedLabel === "All") return true;
    return b.label === selectedLabel;
  });

  useEffect(() => {
    if (!activeReadingId) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveReadingId(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeReadingId]);

  return (
    <div className="flex flex-col">
      {/* Category Filter Chips */}
      <div className="mb-space-xl flex flex-wrap items-center justify-between gap-space-md border-b border-primary/10 pb-space-md">
        <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Monograph series filter">
          {labels.map((label) => {
            const isActive = selectedLabel === label;
            return (
              <button
                key={label}
                aria-selected={isActive}
                className={`min-h-9 rounded-full px-4 py-1.5 font-display text-label-xs uppercase tracking-wider transition-all ${
                  isActive
                    ? "bg-primary text-cream shadow-xs"
                    : "bg-surface-container text-on-surface-variant hover:bg-surface-variant hover:text-primary"
                }`}
                onClick={() => setSelectedLabel(label)}
                role="tab"
                type="button"
              >
                {label}
              </button>
            );
          })}
        </div>

        <p className="font-mono text-[11px] uppercase tracking-wider text-on-surface-variant">
          Showing {filteredBlogs.length} of {blogs.length} Monographs
        </p>
      </div>

      {/* Editorial Monographs Grid / Accordion */}
      <div className="flex flex-col divide-y divide-primary/15 border-y border-primary/15">
        {filteredBlogs.map((blog) => {
          const isReading = activeReadingId === blog.id;
          const drawerId = `monograph-drawer-${blog.id}`;

          return (
            <article key={blog.id} className="py-space-xl transition-colors hover:bg-cream/20">
              <div className="grid grid-cols-1 items-start gap-gutter-desktop lg:grid-cols-12 xl:gap-16">
                {/* Column A: Monograph Header & Identity */}
                <div className="flex flex-col lg:col-span-4">
                  <div className="mb-space-sm flex items-center gap-space-sm">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary font-display text-[11px] font-bold text-cream">
                      {blog.index_code}
                    </span>
                    <span className="font-display text-label-xs font-bold uppercase tracking-[0.2em] text-secondary">
                      {blog.label}
                    </span>
                  </div>

                  <h2 className="font-display text-headline-sm uppercase leading-tight text-primary sm:text-headline-md">
                    {blog.title}
                  </h2>

                  <div className="mt-space-md flex flex-col border-t border-primary/10 pt-space-sm">
                    <span className="font-display text-label-xs font-semibold uppercase tracking-wider text-primary">
                      {blog.author_name}
                    </span>
                    <span className="text-[12px] text-on-surface-variant">
                      {blog.author_title || "Fellowship Contributor"}
                    </span>
                    <div className="mt-2 flex items-center gap-space-sm text-[11px] text-on-surface-variant">
                      <span className="font-mono">{blog.reading_time}</span>
                      <span>•</span>
                      <span>
                        {blog.published_at
                          ? new Date(blog.published_at).toLocaleDateString("en-US", {
                              month: "short",
                              year: "numeric",
                            })
                          : "Autumn 2026"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Column B: Abstract Narrative & Inline Reading Trigger */}
                <div className="flex flex-col justify-between bg-surface-container-low p-space-lg sm:p-space-xl lg:col-span-8">
                  <div>
                    <p className="font-serif text-xl font-light italic leading-relaxed text-primary lg:text-2xl">
                      &ldquo;{blog.excerpt}&rdquo;
                    </p>
                  </div>

                  <div className="mt-space-lg flex flex-wrap items-center justify-between gap-space-md border-t border-primary/10 pt-space-md">
                    <span className="inline-flex items-center gap-1.5 font-display text-label-xs uppercase tracking-widest text-secondary">
                      <VerifiedIcon className="h-4 w-4" />
                      Peer-Reviewed Monograph
                    </span>

                    <button
                      aria-controls={drawerId}
                      aria-expanded={isReading}
                      className={`group inline-flex min-h-11 items-center justify-center gap-space-xs rounded-full px-6 font-display text-label-md font-semibold uppercase tracking-wider transition-all duration-200 active:scale-[0.98] ${
                        isReading
                          ? "bg-secondary text-on-secondary hover:bg-primary hover:text-cream"
                          : "bg-primary text-cream hover:bg-secondary hover:text-on-secondary shadow-xs"
                      }`}
                      onClick={() =>
                        setActiveReadingId((prev) => (prev === blog.id ? null : blog.id))
                      }
                      type="button"
                    >
                      <span>{isReading ? "Close Reading Drawer" : "Read Full Monograph"}</span>
                      <span
                        aria-hidden="true"
                        className={`flex h-5 w-5 items-center justify-center rounded-full bg-cream/15 text-cream transition-transform duration-300 ${
                          isReading ? "rotate-90" : "group-hover:translate-x-1"
                        }`}
                      >
                        <ArrowForwardIcon className="h-3 w-3" />
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Hidden Inline Animated Reading Drawer (Exact style matching CourseQuoteSection) */}
              <div
                aria-hidden={!isReading}
                className={`grid transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isReading
                    ? "mt-space-xl grid-rows-[1fr] opacity-100"
                    : "mt-0 grid-rows-[0fr] opacity-0 pointer-events-none"
                }`}
                id={drawerId}
              >
                <div className="overflow-hidden">
                  <div className="border-l-4 border-gold bg-surface-container-lowest p-space-lg shadow-lg ring-1 ring-primary/10 sm:p-space-xl">
                    {/* Drawer Header Bar */}
                    <div className="mb-space-lg flex flex-wrap items-center justify-between gap-space-sm border-b border-primary/10 pb-space-md">
                      <div className="flex items-center gap-space-sm">
                        <span className="inline-flex h-2.5 w-2.5 rounded-full bg-gold" />
                        <p className="font-display text-label-xs font-bold uppercase tracking-[0.22em] text-primary">
                          Scholarly Monograph // {blog.index_code} — {blog.title}
                        </p>
                      </div>
                      <div className="flex items-center gap-space-md">
                        <span className="font-mono text-[11px] text-on-surface-variant">
                          OPEN CITATION // CC-BY-NC 4.0
                        </span>
                        <button
                          className="font-display text-label-xs uppercase tracking-widest text-on-surface-variant underline-offset-4 transition-colors hover:text-primary hover:underline"
                          onClick={() => setActiveReadingId(null)}
                          type="button"
                        >
                          Dismiss [ESC]
                        </button>
                      </div>
                    </div>

                    {/* Monograph Full Text Content */}
                    <div className="prose max-w-none space-y-space-md text-body-md leading-relaxed text-primary">
                      {blog.content.split("\n\n").map((paragraph, idx) => {
                        if (paragraph.startsWith("## ")) {
                          return (
                            <h3
                              key={idx}
                              className="font-display text-headline-sm uppercase text-primary pt-space-sm"
                            >
                              {paragraph.replace("## ", "")}
                            </h3>
                          );
                        }
                        if (paragraph.startsWith("### ")) {
                          return (
                            <h4
                              key={idx}
                              className="font-display text-title-md uppercase text-secondary pt-space-xs"
                            >
                              {paragraph.replace("### ", "")}
                            </h4>
                          );
                        }
                        if (paragraph.startsWith("- ") || paragraph.startsWith("1. ")) {
                          return (
                            <div
                              key={idx}
                              className="border-l-2 border-secondary/40 bg-cream/40 p-space-md font-sans text-body-sm text-primary"
                            >
                              {paragraph}
                            </div>
                          );
                        }
                        return (
                          <p key={idx} className="text-body-md leading-relaxed text-on-surface">
                            {paragraph}
                          </p>
                        );
                      })}
                    </div>

                    {/* Footer Citation & Close Bar */}
                    <div className="mt-space-xl flex flex-wrap items-center justify-between gap-space-md border-t border-primary/10 pt-space-md">
                      <p className="font-mono text-[11px] text-on-surface-variant">
                        Citation: {blog.author_name} (2026). &ldquo;{blog.title}&rdquo;. RIOSTAK
                        Monograph Series, Vol. 01, No. {blog.index_code}.
                      </p>
                      <button
                        className="inline-flex min-h-10 items-center justify-center rounded-full border border-primary/20 px-6 font-display text-label-xs uppercase tracking-wider text-primary hover:border-primary hover:bg-primary/5"
                        onClick={() => setActiveReadingId(null)}
                        type="button"
                      >
                        Close Reading Drawer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
