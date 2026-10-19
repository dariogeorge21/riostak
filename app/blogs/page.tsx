import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getPublishedBlogs } from "@/app/actions/blogActions";
import BlogCatalogSection from "@/components/blogs/BlogCatalogSection";
import { ArrowDownwardIcon, ArrowForwardIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Blogs — RIOSTAK",
  description:
    "Explore RIOSTAK's peer-reviewed blogs, empirical field notes, and contemplative essays from visiting fellows.",
};

async function BlogList() {
  const blogs = await getPublishedBlogs();
  return <BlogCatalogSection blogs={blogs} />;
}

function BlogCatalogSkeleton() {
  return (
    <div className="flex flex-col gap-space-md py-space-lg animate-pulse">
      <div className="h-9 w-64 rounded-full bg-primary/10" />
      <div className="h-40 w-full rounded-xs bg-primary/5" />
      <div className="h-40 w-full rounded-xs bg-primary/5" />
    </div>
  );
}

export default function BlogsPage() {
  return (
    <main className="flex min-h-screen w-full flex-col justify-between bg-cream pt-20 text-primary">
      {/* Main Content Area */}
      <div className="mx-auto flex w-full max-w-screen-2xl flex-1 flex-col px-margin py-space-2xl lg:px-margin-desktop lg:py-space-3xl">
        {/* Status pill & volume classification */}
        <div className="flex flex-wrap items-center justify-between gap-space-sm border-b border-primary/10 pb-space-lg">
          <div className="flex items-center gap-space-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-secondary" />
            </span>
            <p className="font-display text-label-xs font-bold uppercase tracking-[0.2em] text-secondary">
              Blogs // Volume 01 Open Access
            </p>
          </div>
          <p className="font-display text-label-xs uppercase tracking-widest text-on-surface-variant">
            Volume 01 // 2026 Academic Series
          </p>
        </div>

        {/* Central Editorial Hero Block */}
        <section aria-labelledby="blogs-hero-heading" className="py-space-2xl lg:py-space-3xl">
          <div className="grid grid-cols-1 items-end gap-gutter-desktop lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="mb-space-xs font-display text-label-xs font-bold uppercase tracking-[0.25em] text-on-surface-variant">
                Scholarly Monograph Series
              </p>
              <h1
                className="font-display text-headline-xl-mobile uppercase leading-[0.92] tracking-tight text-primary sm:text-headline-lg lg:text-headline-xl"
                id="blogs-hero-heading"
              >
                Blogs
              </h1>

              <p className="mt-space-xl max-w-2xl font-serif text-2xl font-light italic leading-snug text-primary lg:text-3xl">
                &ldquo;Rigorous empirical treatises, laboratory trial notes, and contemplative essays
                advancing human flourishing.&rdquo;
              </p>

              <p className="mt-space-md max-w-2xl text-body-lg text-on-surface-variant">
                Every dispatch is published open-access under academic peer curation. Inspect the
                blogs below and click <strong className="font-medium text-primary">Read Full Monograph</strong> to
                expand the complete text directly inline.
              </p>

              <div className="mt-space-xl flex flex-wrap items-center gap-space-md">
                <a
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-8 font-display text-label-md font-semibold uppercase tracking-wider text-cream shadow-sm transition-all duration-200 hover:bg-secondary hover:text-on-secondary active:scale-[0.98]"
                  href="#monograph-catalog"
                >
                  Explore Blogs
                </a>
                <Link
                  className="group inline-flex min-h-12 items-center gap-space-xs rounded-full border border-primary/20 px-6 font-display text-label-md font-semibold uppercase tracking-wider text-primary transition-all duration-200 hover:border-primary hover:bg-primary/5 active:scale-[0.98]"
                  href="/manage"
                >
                  <span>Curator Console</span>
                  <span
                    aria-hidden="true"
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary transition-all duration-200 group-hover:translate-x-1 group-hover:bg-primary group-hover:text-cream"
                  >
                    <ArrowForwardIcon className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </div>
            </div>

            {/* Right Column Summary Card */}
            <div className="lg:col-span-4">
              <div className="border border-primary/10 bg-surface-container-low p-space-lg sm:p-space-xl">
                <p className="font-display text-label-xs font-bold uppercase tracking-[0.2em] text-secondary">
                  Publication Desk // At a Glance
                </p>
                <p className="mt-space-xs font-display text-headline-md uppercase text-primary">
                  Volume 01
                </p>
                <ul className="mt-space-md flex flex-col divide-y divide-primary/10 border-y border-primary/10 text-body-sm text-primary">
                  <li className="py-space-sm flex items-center justify-between">
                    <span>01.01 Neurobiology &amp; Contemplation</span>
                    <span className="font-mono text-[10px] text-secondary">7m</span>
                  </li>
                  <li className="py-space-sm flex items-center justify-between">
                    <span>01.02 Global Laboratory Field Notes</span>
                    <span className="font-mono text-[10px] text-secondary">5m</span>
                  </li>
                  <li className="py-space-sm flex items-center justify-between">
                    <span>01.03 Post-Industrial Pedagogy</span>
                    <span className="font-mono text-[10px] text-secondary">10m</span>
                  </li>
                </ul>
                <p className="mt-space-md text-body-sm text-on-surface-variant">
                  Monographs are licensed under Creative Commons for open citation and institutional
                  teaching.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Monograph Catalog Section */}
        <section aria-labelledby="catalog-heading" className="pt-space-md" id="monograph-catalog">
          <div className="mb-space-lg flex flex-wrap items-end justify-between gap-space-sm border-b border-primary/15 pb-space-lg">
            <div>
              <div className="flex items-center gap-space-xs">
                <span aria-hidden="true" className="h-2 w-2 rounded-full bg-secondary" />
                <h2
                  className="font-display text-label-md uppercase tracking-[0.18em] text-primary"
                  id="catalog-heading"
                >
                  01 // Monograph Archive
                </h2>
              </div>
              <p className="mt-1 text-body-sm text-on-surface-variant">
                Peer-reviewed editorial inquiries with expandable inline reader drawers.
              </p>
            </div>
            <p className="font-display text-label-xs uppercase tracking-widest text-secondary">
              {"// Select Any Monograph to Read Inline"}
            </p>
          </div>

          <Suspense fallback={<BlogCatalogSkeleton />}>
            <BlogList />
          </Suspense>
        </section>
      </div>

      {/* Full-Width Baseline Ticker */}
      <div className="w-full border-t border-primary/15">
        <div className="w-full px-margin py-space-lg lg:px-margin-desktop">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-space-sm font-display text-label-xs uppercase tracking-[0.25em] text-on-surface-variant">
              <ArrowDownwardIcon className="h-4 w-4 motion-safe:animate-bounce text-secondary" />
              <span>Editorial Publication Portal Active</span>
            </p>
            <div className="hidden items-center gap-space-xl text-on-surface-variant md:flex lg:gap-space-2xl">
              <span className="font-display text-label-xs uppercase tracking-wider">
                Volume 01 Inquiries
              </span>
              <span aria-hidden="true" className="h-1 w-1 rounded-full bg-secondary" />
              <span className="font-display text-label-xs uppercase tracking-wider">
                CAMBRIDGE • ZURICH • SINGAPORE
              </span>
              <span aria-hidden="true" className="h-1 w-1 rounded-full bg-secondary" />
              <span className="font-display text-label-xs font-bold uppercase tracking-wider text-primary">
                {"// 2026 INAUGURAL"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
