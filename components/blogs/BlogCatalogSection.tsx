"use client";

import { useEffect, useState } from "react";
import type { BlogItem } from "@/app/actions/blogActions";
import { ArrowForwardIcon, VerifiedIcon } from "@/components/Icons";
import {
  extractToc,
  getMarkdownStats,
  parseMarkdownBlocks,
  stripInlineMarkdown,
} from "@/utils/markdown";
import MarkdownRenderer, {
  type ReaderFontMode,
  type ReaderSizeMode,
} from "./MarkdownRenderer";

interface BlogCatalogSectionProps {
  blogs: readonly BlogItem[];
}

export default function BlogCatalogSection({ blogs }: BlogCatalogSectionProps) {
  const [selectedLabel, setSelectedLabel] = useState<string>("All");
  const [activeReadingId, setActiveReadingId] = useState<string | null>(null);
  const [readerFont, setReaderFont] = useState<ReaderFontMode>("serif");
  const [readerSize, setReaderSize] = useState<ReaderSizeMode>("md");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const labels = ["All", ...Array.from(new Set(blogs.map((b) => b.label)))];

  const filteredBlogs = blogs.filter((b) => {
    if (selectedLabel === "All") return true;
    return b.label === selectedLabel;
  });

  // Auto-open monograph reading drawer if navigated via #monograph-<slug>
  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash;
      if (!hash.startsWith("#monograph-")) return;
      const targetSlug = hash.replace("#monograph-", "");
      const matched = blogs.find((b) => b.slug === targetSlug);
      if (matched) {
        setSelectedLabel("All");
        setActiveReadingId(matched.id);
      }
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, [blogs]);

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

  const handleCopyCitation = (blog: BlogItem) => {
    const citation = `${blog.author_name} (2026). "${blog.title}". RIOSTAK Monograph Series, Vol. 01, No. ${blog.index_code}.`;
    navigator.clipboard?.writeText(citation);
    setCopiedId(blog.id);
    window.setTimeout(() => {
      setCopiedId((prev) => (prev === blog.id ? null : prev));
    }, 2500);
  };

  return (
    <div className="flex flex-col">
      {/* Category Filter Chips */}
      <div className="mb-space-xl flex flex-wrap items-center justify-between gap-space-md border-b border-primary/10 pb-space-md">
        <div
          aria-label="Monograph series filter"
          className="flex flex-wrap items-center gap-2"
          role="tablist"
        >
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
          const blocks = parseMarkdownBlocks(blog.content);
          const toc = extractToc(blocks);
          const stats = getMarkdownStats(blog.content);

          return (
            <article
              key={blog.id}
              className="py-space-xl transition-colors hover:bg-cream/20"
              id={`monograph-${blog.slug}`}
            >
              <div className="grid grid-cols-1 items-start gap-gutter-desktop lg:grid-cols-12 xl:gap-16">
                {/* Column A: Monograph Header & Identity */}
                <div className="flex flex-col lg:col-span-4">
                  <div className="mb-space-sm flex items-center gap-space-sm">
                    <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-primary px-1.5 font-display text-[11px] font-bold text-cream">
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
                    <div className="mt-2 flex flex-wrap items-center gap-space-sm text-[11px] text-on-surface-variant">
                      <span className="font-mono">{blog.reading_time || stats.readingTime}</span>
                      <span>•</span>
                      <span className="font-mono">{stats.words} words</span>
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
                      &ldquo;{stripInlineMarkdown(blog.excerpt)}&rdquo;
                    </p>

                    {toc.length > 0 ? (
                      <div className="mt-space-md flex flex-wrap items-center gap-1.5 border-t border-primary/8 pt-space-sm">
                        <span className="mr-1 font-display text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                          Sections:
                        </span>
                        {toc.slice(0, 4).map((item) => (
                          <span
                            key={item.id}
                            className="rounded-full bg-cream px-2.5 py-0.5 font-display text-[10px] uppercase tracking-wider text-primary"
                          >
                            {item.text}
                          </span>
                        ))}
                      </div>
                    ) : null}
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
                          : "bg-primary text-cream shadow-xs hover:bg-secondary hover:text-on-secondary"
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

              {/* Expandable Inline Monograph Reader Drawer */}
              <div
                aria-hidden={!isReading}
                className={`grid transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isReading
                    ? "mt-space-xl grid-rows-[1fr] opacity-100"
                    : "pointer-events-none mt-0 grid-rows-[0fr] opacity-0"
                }`}
                id={drawerId}
              >
                <div className="overflow-hidden">
                  <div className="border-l-4 border-gold bg-surface-container-lowest p-space-lg shadow-lg ring-1 ring-primary/10 sm:p-space-xl lg:p-space-2xl">
                    {/* Reader Top Console Bar: Metadata + Typography Controls */}
                    <div className="mb-space-xl flex flex-wrap items-center justify-between gap-space-md border-b border-primary/12 pb-space-md">
                      <div className="flex items-center gap-space-sm">
                        <span className="inline-flex h-2.5 w-2.5 rounded-full bg-gold" />
                        <p className="font-display text-label-xs font-bold uppercase tracking-[0.22em] text-primary">
                          Scholarly Monograph // {blog.index_code} — {blog.title}
                        </p>
                      </div>

                      {/* Reader Controls: Typeface, Text Size, Dismiss */}
                      <div className="flex flex-wrap items-center gap-3">
                        {/* Font Family Switcher */}
                        <div
                          aria-label="Reading typeface"
                          className="inline-flex items-center rounded-full border border-primary/15 bg-cream/60 p-0.5"
                          role="group"
                        >
                          <button
                            className={`rounded-full px-2.5 py-0.5 font-serif text-xs italic transition-colors ${
                              readerFont === "serif"
                                ? "bg-primary text-cream"
                                : "text-on-surface-variant hover:text-primary"
                            }`}
                            onClick={() => setReaderFont("serif")}
                            title="Editorial Serif Typeface"
                            type="button"
                          >
                            Serif
                          </button>
                          <button
                            className={`rounded-full px-2.5 py-0.5 font-sans text-[11px] font-medium transition-colors ${
                              readerFont === "sans"
                                ? "bg-primary text-cream"
                                : "text-on-surface-variant hover:text-primary"
                            }`}
                            onClick={() => setReaderFont("sans")}
                            title="Clean Sans-Serif Typeface"
                            type="button"
                          >
                            Sans
                          </button>
                        </div>

                        {/* Font Size Switcher */}
                        <div
                          aria-label="Reading font size"
                          className="inline-flex items-center rounded-full border border-primary/15 bg-cream/60 p-0.5"
                          role="group"
                        >
                          {(
                            [
                              { id: "sm", label: "A-" },
                              { id: "md", label: "A" },
                              { id: "lg", label: "A+" },
                            ] as const
                          ).map((sz) => (
                            <button
                              key={sz.id}
                              className={`rounded-full px-2 py-0.5 font-mono text-[11px] font-bold transition-colors ${
                                readerSize === sz.id
                                  ? "bg-primary text-cream"
                                  : "text-on-surface-variant hover:text-primary"
                              }`}
                              onClick={() => setReaderSize(sz.id)}
                              title={`Text size: ${sz.id.toUpperCase()}`}
                              type="button"
                            >
                              {sz.label}
                            </button>
                          ))}
                        </div>

                        <button
                          className="font-display text-label-xs uppercase tracking-widest text-on-surface-variant underline-offset-4 transition-colors hover:text-primary hover:underline"
                          onClick={() => setActiveReadingId(null)}
                          type="button"
                        >
                          Dismiss [ESC]
                        </button>
                      </div>
                    </div>

                    {/* Monograph Title Banner & Abstract Callout inside Reader */}
                    <header className="mb-space-xl border-b border-primary/10 pb-space-lg">
                      <div className="mb-space-xs flex flex-wrap items-center gap-2 font-mono text-xs text-secondary">
                        <span>VOL. 01 // NO. {blog.index_code}</span>
                        <span>•</span>
                        <span>{blog.label.toUpperCase()}</span>
                        <span>•</span>
                        <span>{blog.reading_time || stats.readingTime}</span>
                      </div>
                      <h3 className="font-display text-headline-md uppercase leading-tight tracking-tight text-primary lg:text-headline-lg">
                        {blog.title}
                      </h3>
                      <p className="mt-space-md max-w-3xl font-serif text-xl font-light italic leading-relaxed text-on-surface-variant">
                        {stripInlineMarkdown(blog.excerpt)}
                      </p>
                    </header>

                    {/* Reader Body Layout: TOC Sidebar (if >= 2 headings) + Formatted Content */}
                    <div className="grid grid-cols-1 gap-gutter-desktop lg:grid-cols-12">
                      {toc.length >= 2 ? (
                        <aside className="lg:col-span-3">
                          <div className="sticky top-28 rounded-xs border border-primary/10 bg-cream/45 p-4">
                            <p className="mb-3 font-display text-label-xs font-bold uppercase tracking-[0.2em] text-secondary">
                              Monograph Outline
                            </p>
                            <ul className="space-y-2 border-l border-primary/15 pl-3">
                              {toc.map((heading) => (
                                <li
                                  key={heading.id}
                                  className={heading.level >= 3 ? "pl-2.5" : ""}
                                >
                                  <a
                                    className="block font-display text-xs uppercase tracking-wider text-on-surface-variant transition-colors hover:text-primary"
                                    href={`#${blog.id}-${heading.id}`}
                                  >
                                    {heading.text}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </aside>
                      ) : null}

                      <div className={toc.length >= 2 ? "lg:col-span-9" : "lg:col-span-12"}>
                        <MarkdownRenderer
                          content={blog.content}
                          fontMode={readerFont}
                          idPrefix={blog.id}
                          sizeMode={readerSize}
                        />
                      </div>
                    </div>

                    {/* Footer Citation & Close Bar */}
                    <div className="mt-space-2xl flex flex-wrap items-center justify-between gap-space-md border-t border-primary/12 pt-space-md">
                      <p className="font-mono text-[11px] text-on-surface-variant">
                        Citation: {blog.author_name} (2026). &ldquo;{blog.title}&rdquo;. RIOSTAK
                        Monograph Series, Vol. 01, No. {blog.index_code}.
                      </p>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          className="inline-flex min-h-10 items-center justify-center rounded-full border border-primary/20 bg-cream/50 px-4 font-display text-label-xs uppercase tracking-wider text-primary transition-colors hover:border-primary hover:bg-cream"
                          onClick={() => handleCopyCitation(blog)}
                          type="button"
                        >
                          {copiedId === blog.id ? "✓ Citation Copied" : "Copy Citation"}
                        </button>
                        <button
                          className="inline-flex min-h-10 items-center justify-center rounded-full bg-primary px-6 font-display text-label-xs uppercase tracking-wider text-cream transition-colors hover:bg-secondary hover:text-on-secondary"
                          onClick={() => setActiveReadingId(null)}
                          type="button"
                        >
                          Close Reading Drawer
                        </button>
                      </div>
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
