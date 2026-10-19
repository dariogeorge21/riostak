import Link from "next/link";
import { ArrowForwardIcon } from "../Icons";
import { type BlogItem, INITIAL_SEED_BLOGS } from "@/utils/blogTypes";

type BlogsSectionProps = {
  blogs?: BlogItem[];
};

/**
 * Section 05: Scholarly Monographs & Field Notes.
 * Displays peer-reviewed dispatches on the landing page connected to live Supabase blog data.
 */
export default function Blogs({ blogs }: BlogsSectionProps) {
  const publishedBlogs = (
    blogs && blogs.length > 0 ? blogs : INITIAL_SEED_BLOGS
  ).filter((b) => b.status === "published");

  // Feature up to 3 monographs on the landing page
  const featuredBlogs = publishedBlogs.slice(0, 3);

  return (
    <section
      aria-labelledby="landing-blogs-heading"
      className="mx-auto flex w-full max-w-screen-2xl flex-col gap-space-2xl px-margin py-space-3xl lg:px-margin-desktop"
      id="blogs"
    >
      {/* Section Header */}
      <div className="flex flex-col justify-between gap-space-md border-b border-primary/15 pb-space-lg md:flex-row md:items-end">
        <div>
          <div className="mb-space-xs flex items-center gap-space-xs">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-secondary" />
            <h2
              className="font-display text-label-md uppercase tracking-[0.18em] text-primary"
              id="landing-blogs-heading"
            >
              05 // Blogs
            </h2>
          </div>
          <p className="font-display text-headline-lg-mobile uppercase text-primary md:text-headline-lg">
            Blogs
          </p>
          <p className="mt-space-xs max-w-2xl text-body-md text-on-surface-variant">
            Open-access treatises, laboratory dispatches, and contemplative inquiries published
            by the RIOSTAK academic fellowship.
          </p>
        </div>

        <div className="shrink-0">
          <Link
            className="group inline-flex min-h-11 items-center gap-space-xs rounded-full border border-primary/20 px-5 font-display text-label-xs font-bold uppercase tracking-wider text-primary transition-all duration-200 hover:border-primary hover:bg-primary/5 active:scale-[0.98]"
            href="/blogs"
          >
            <span>Explore All Blogs ({publishedBlogs.length})</span>
            <ArrowForwardIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Empty State */}
      {featuredBlogs.length === 0 ? (
        <div className="border border-primary/15 bg-surface-container-lowest p-space-2xl text-center">
          <p className="font-display text-label-xs font-bold uppercase tracking-widest text-secondary">
            Volume 01 In Curation
          </p>
          <p className="mt-space-sm font-display text-title-md uppercase text-primary">
            No Published Monographs Available
          </p>
          <p className="mx-auto mt-space-xs max-w-md text-body-sm text-on-surface-variant">
            Inaugural treatises are currently undergoing peer review by the academic secretariat.
            New monographs will appear here upon publication.
          </p>
        </div>
      ) : (
        /* Monographs Grid */
        <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-3">
          {featuredBlogs.map((blog) => (
            <article
              key={blog.id}
              className="group flex flex-col justify-between border border-primary/10 bg-surface-container-lowest p-space-xl transition-all duration-300 hover:border-primary/30 hover:bg-surface-container-low hover:shadow-sm"
            >
              <div>
                {/* Index and classification row */}
                <div className="mb-space-md flex items-center justify-between border-b border-primary/10 pb-space-sm text-label-xs">
                  <span className="font-mono text-xs font-bold tracking-wider text-secondary">
                    {blog.index_code}
                  </span>
                  <div className="flex items-center gap-space-xs">
                    <span className="font-display text-[11px] uppercase tracking-widest text-on-surface-variant">
                      {blog.label}
                    </span>
                    <span aria-hidden="true" className="text-on-surface-variant/40">
                      •
                    </span>
                    <span className="font-mono text-[11px] text-on-surface-variant">
                      {blog.reading_time}
                    </span>
                  </div>
                </div>

                {/* Monograph Title */}
                <h3 className="mb-space-sm font-display text-headline-sm uppercase leading-snug tracking-tight text-primary transition-colors group-hover:text-secondary">
                  <Link href={`/blogs#monograph-${blog.slug}`}>
                    {blog.title}
                  </Link>
                </h3>

                {/* Excerpt narrative */}
                <p className="line-clamp-4 text-body-sm leading-relaxed text-on-surface-variant">
                  {blog.excerpt}
                </p>
              </div>

              {/* Monograph Card Footer */}
              <div className="mt-space-xl flex items-center justify-between border-t border-primary/10 pt-space-md">
                <div className="min-w-0 pr-space-sm">
                  <p className="truncate font-display text-label-xs font-bold uppercase tracking-wider text-primary">
                    {blog.author_name}
                  </p>
                  <p className="truncate text-[11px] text-on-surface-variant">
                    {blog.author_title}
                  </p>
                </div>

                <Link
                  aria-label={`Read monograph: ${blog.title}`}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/5 text-primary transition-all duration-200 group-hover:bg-primary group-hover:text-cream"
                  href={`/blogs#monograph-${blog.slug}`}
                >
                  <ArrowForwardIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Bottom Secretariat Prompt Banner */}
      <div className="flex flex-col items-center justify-between gap-space-md rounded-xs border border-primary/15 bg-surface-container-low px-space-lg py-space-md sm:flex-row">
        <div className="flex items-center gap-space-sm">
          <span className="font-mono text-label-xs font-bold uppercase tracking-widest text-secondary">
            Peer-Review Open
          </span>
          <span aria-hidden="true" className="hidden text-on-surface-variant/40 sm:inline">
            •
          </span>
          <p className="text-body-sm text-on-surface-variant">
            Have an empirical contribution or institutional field note to propose?
          </p>
        </div>
        <Link
          className="inline-flex min-h-9 items-center gap-1 font-display text-label-xs font-bold uppercase tracking-wider text-primary transition-colors hover:text-secondary"
          href="/contact"
        >
          <span>Submit Abstract to Secretariat</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
