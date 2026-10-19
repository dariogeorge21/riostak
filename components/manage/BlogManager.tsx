"use client";

import { useState, useTransition } from "react";
import {
  type BlogItem,
  createBlogAction,
  deleteBlogAction,
  toggleBlogStatusAction,
  updateBlogAction,
} from "@/app/actions/blogActions";
import { ArrowForwardIcon } from "@/components/Icons";

const BLOG_LABELS = [
  "Editorial Dispatches",
  "Fellowship Essays",
  "Monograph Series",
  "Working Papers",
] as const;

interface BlogManagerProps {
  initialBlogs: BlogItem[];
}

export default function BlogManager({ initialBlogs }: BlogManagerProps) {
  const [blogs, setBlogs] = useState<BlogItem[]>(initialBlogs);
  const [isCreating, setIsCreating] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [deletingBlogId, setDeletingBlogId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const filteredBlogs = blogs.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.index_code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" ? true : b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await createBlogAction(formData);
      if (res.success) {
        setIsCreating(false);
        // Optimistic refresh
        const newBlog: BlogItem = {
          id: `temp-${Date.now()}`,
          title: formData.get("title")?.toString() || "",
          slug:
            formData.get("slug")?.toString() ||
            formData.get("title")?.toString().toLowerCase().replace(/[^a-z0-9]+/g, "-") ||
            "",
          index_code: formData.get("index_code")?.toString() || "01.04",
          label: formData.get("label")?.toString() || "Editorial Dispatch",
          excerpt: formData.get("excerpt")?.toString() || "",
          content: formData.get("content")?.toString() || "",
          author_name: formData.get("author_name")?.toString() || "RIOSTAK Fellowship",
          author_title: formData.get("author_title")?.toString() || "Academic Secretariat",
          reading_time: formData.get("reading_time")?.toString() || "5 min read",
          status: (formData.get("status")?.toString() as "published" | "draft") || "published",
          published_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        };
        setBlogs((prev) => [newBlog, ...prev]);
      } else {
        setFormError(res.error || "Failed to create blog entry.");
      }
    });
  };

  const handleUpdateSubmit = (id: string, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await updateBlogAction(id, formData);
      if (res.success) {
        setEditingBlogId(null);
        setBlogs((prev) =>
          prev.map((b) =>
            b.id === id
              ? {
                  ...b,
                  title: formData.get("title")?.toString() || b.title,
                  index_code: formData.get("index_code")?.toString() || b.index_code,
                  label: formData.get("label")?.toString() || b.label,
                  excerpt: formData.get("excerpt")?.toString() || b.excerpt,
                  content: formData.get("content")?.toString() || b.content,
                  author_name: formData.get("author_name")?.toString() || b.author_name,
                  author_title: formData.get("author_title")?.toString() || b.author_title,
                  reading_time: formData.get("reading_time")?.toString() || b.reading_time,
                  status: (formData.get("status")?.toString() as "published" | "draft") || b.status,
                }
              : b
          )
        );
      } else {
        setFormError(res.error || "Failed to update blog entry.");
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const res = await deleteBlogAction(id);
      if (res.success) {
        setBlogs((prev) => prev.filter((b) => b.id !== id));
        setDeletingBlogId(null);
      } else {
        setFormError(res.error || "Failed to delete blog entry.");
      }
    });
  };

  const handleToggleStatus = (id: string, currentStatus: "published" | "draft" | "archived") => {
    const nextStatus = currentStatus === "published" ? "draft" : "published";
    setBlogs((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: nextStatus } : b))
    );

    startTransition(async () => {
      await toggleBlogStatusAction(id, currentStatus);
    });
  };

  return (
    <section aria-labelledby="blogs-manager-heading" className="flex flex-1 flex-col">
      {/* Top Console Bar */}
      <div className="flex flex-wrap items-center justify-between gap-space-md border-b border-primary/10 pb-space-lg">
        <div>
          <div className="flex items-center gap-space-xs">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-secondary" />
            <h1
              className="font-display text-headline-sm uppercase tracking-tight text-primary"
              id="blogs-manager-heading"
            >
              Editorial Despatches &amp; Monographs
            </h1>
          </div>
          <p className="mt-1 text-body-sm text-on-surface-variant">
            Manage peer-reviewed articles, scholarly working papers, and fellowship treatises.
          </p>
        </div>

        <button
          aria-expanded={isCreating}
          className={`inline-flex min-h-11 items-center justify-center gap-space-xs rounded-full px-6 font-display text-label-md font-semibold uppercase tracking-wider transition-all duration-200 active:scale-[0.98] ${
            isCreating
              ? "bg-secondary text-on-secondary"
              : "bg-primary text-cream hover:bg-secondary hover:text-on-secondary shadow-sm"
          }`}
          onClick={() => {
            setIsCreating((prev) => !prev);
            setEditingBlogId(null);
            setFormError(null);
          }}
          type="button"
        >
          <span>{isCreating ? "Close Form" : "+ New Blog Monograph"}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="mt-space-md flex flex-wrap items-center justify-between gap-space-md border-b border-primary/10 pb-space-md">
        <div className="flex flex-wrap items-center gap-2">
          {(["all", "published", "draft"] as const).map((status) => (
            <button
              key={status}
              className={`rounded-full px-3.5 py-1 font-display text-label-xs uppercase tracking-wider transition-colors ${
                statusFilter === status
                  ? "bg-primary text-cream font-bold"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-variant hover:text-primary"
              }`}
              onClick={() => setStatusFilter(status)}
              type="button"
            >
              {status}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-72">
          <input
            className="w-full rounded-xs border border-primary/15 bg-cream/40 px-3 py-1.5 font-sans text-body-sm text-primary placeholder:text-on-surface-variant/50 focus:border-gold focus:bg-white focus:outline-none"
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search monographs, authors..."
            type="search"
            value={searchQuery}
          />
        </div>
      </div>

      {/* Hidden Inline Animated Creation Drawer (Top of list) */}
      <div
        aria-hidden={!isCreating}
        className={`grid transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isCreating
            ? "my-space-lg grid-rows-[1fr] opacity-100"
            : "my-0 grid-rows-[0fr] opacity-0 pointer-events-none"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-l-4 border-gold bg-surface-container-lowest p-space-lg shadow-lg ring-1 ring-primary/10 sm:p-space-xl">
            <div className="mb-space-md flex items-center justify-between border-b border-primary/10 pb-space-sm">
              <p className="font-display text-label-xs font-bold uppercase tracking-[0.2em] text-primary">
                New Editorial Monograph // Formulation Console
              </p>
              <button
                className="font-display text-label-xs uppercase tracking-wider text-on-surface-variant hover:text-primary"
                onClick={() => setIsCreating(false)}
                type="button"
              >
                Dismiss [ESC]
              </button>
            </div>

            {formError ? (
              <p className="mb-space-md text-[13px] text-red-600 font-semibold">{formError}</p>
            ) : null}

            <form className="flex flex-col gap-space-md" onSubmit={handleCreateSubmit}>
              <div className="grid grid-cols-1 gap-space-md sm:grid-cols-12">
                <div className="sm:col-span-8 flex flex-col gap-1">
                  <label className="font-display text-label-xs uppercase tracking-wider text-primary">
                    Monograph Title *
                  </label>
                  <input
                    className="w-full rounded-xs border border-primary/20 bg-cream/20 px-3 py-2 text-body-sm focus:border-gold focus:bg-white focus:outline-none"
                    name="title"
                    placeholder="e.g. Somatic Regulation and Human Flourishing"
                    required
                    type="text"
                  />
                </div>

                <div className="sm:col-span-4 flex flex-col gap-1">
                  <label className="font-display text-label-xs uppercase tracking-wider text-primary">
                    Index Code *
                  </label>
                  <input
                    className="w-full rounded-xs border border-primary/20 bg-cream/20 px-3 py-2 font-mono text-body-sm focus:border-gold focus:bg-white focus:outline-none"
                    defaultValue={`01.0${blogs.length + 1}`}
                    name="index_code"
                    required
                    type="text"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-space-md sm:grid-cols-3">
                <div className="flex flex-col gap-1">
                  <label className="font-display text-label-xs uppercase tracking-wider text-primary">
                    Category Series
                  </label>
                  <select
                    className="w-full rounded-xs border border-primary/20 bg-cream/20 px-3 py-2 text-body-sm focus:border-gold focus:bg-white focus:outline-none"
                    name="label"
                  >
                    {BLOG_LABELS.map((label) => (
                      <option key={label} value={label}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-display text-label-xs uppercase tracking-wider text-primary">
                    Author Name
                  </label>
                  <input
                    className="w-full rounded-xs border border-primary/20 bg-cream/20 px-3 py-2 text-body-sm focus:border-gold focus:bg-white focus:outline-none"
                    defaultValue="Dr. Clara Lin"
                    name="author_name"
                    type="text"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-display text-label-xs uppercase tracking-wider text-primary">
                    Reading Time
                  </label>
                  <input
                    className="w-full rounded-xs border border-primary/20 bg-cream/20 px-3 py-2 text-body-sm focus:border-gold focus:bg-white focus:outline-none"
                    defaultValue="6 min read"
                    name="reading_time"
                    type="text"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-display text-label-xs uppercase tracking-wider text-primary">
                  Lead Excerpt (Summary) *
                </label>
                <textarea
                  className="w-full rounded-xs border border-primary/20 bg-cream/20 px-3 py-2 text-body-sm focus:border-gold focus:bg-white focus:outline-none"
                  name="excerpt"
                  placeholder="Concise abstract or thesis summary..."
                  required
                  rows={2}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-display text-label-xs uppercase tracking-wider text-primary">
                  Editorial Body Content (Markdown) *
                </label>
                <textarea
                  className="w-full rounded-xs border border-primary/20 bg-cream/20 px-3 py-2 font-mono text-body-sm focus:border-gold focus:bg-white focus:outline-none"
                  name="content"
                  placeholder="## Abstract&#10;&#10;Long-form empirical inquiry..."
                  required
                  rows={6}
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-space-md border-t border-primary/10 pt-space-md">
                <div className="flex items-center gap-space-sm">
                  <label className="font-display text-label-xs uppercase tracking-wider text-primary">
                    Status:
                  </label>
                  <select
                    className="rounded-xs border border-primary/20 bg-cream/30 px-3 py-1 font-display text-label-xs uppercase tracking-wider text-primary"
                    defaultValue="published"
                    name="status"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <div className="flex items-center gap-space-sm">
                  <button
                    className="inline-flex min-h-10 items-center justify-center rounded-full border border-primary/20 px-5 font-display text-label-xs uppercase tracking-wider text-on-surface-variant hover:border-primary hover:text-primary"
                    onClick={() => setIsCreating(false)}
                    type="button"
                  >
                    Cancel
                  </button>
                  <button
                    className="inline-flex min-h-10 items-center justify-center gap-space-xs rounded-full bg-primary px-6 font-display text-label-xs font-semibold uppercase tracking-wider text-cream shadow-xs hover:bg-secondary hover:text-on-secondary disabled:opacity-50"
                    disabled={isPending}
                    type="submit"
                  >
                    <span>{isPending ? "Publishing..." : "Save Monograph"}</span>
                    <ArrowForwardIcon className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Monograph Items List */}
      <div className="mt-space-lg flex flex-col divide-y divide-primary/10 border-y border-primary/10">
        {filteredBlogs.length === 0 ? (
          <div className="py-space-2xl text-center">
            <p className="font-serif text-lg italic text-on-surface-variant">
              No monographs match your current criteria.
            </p>
          </div>
        ) : (
          filteredBlogs.map((blog) => {
            const isEditing = editingBlogId === blog.id;
            const isDeleting = deletingBlogId === blog.id;

            return (
              <article key={blog.id} className="py-space-md transition-colors hover:bg-cream/30">
                <div className="flex flex-wrap items-center justify-between gap-space-md px-space-sm">
                  <div className="flex items-start gap-space-md sm:items-center">
                    <span className="font-mono text-label-xs font-bold text-secondary">
                      {blog.index_code}
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-space-xs">
                        <h2 className="font-display text-body-md font-bold text-primary">
                          {blog.title}
                        </h2>
                        <span className="font-display text-[10px] uppercase tracking-wider text-on-surface-variant">
                          • {blog.label}
                        </span>
                      </div>
                      <p className="mt-0.5 line-clamp-1 max-w-xl text-body-sm text-on-surface-variant">
                        {blog.excerpt}
                      </p>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center gap-space-sm">
                    {/* Status Pill / Toggle */}
                    <button
                      className={`rounded-full px-3 py-1 font-display text-[10px] font-bold uppercase tracking-wider transition-colors ${
                        blog.status === "published"
                          ? "bg-secondary-container text-on-secondary-container hover:bg-secondary hover:text-on-secondary"
                          : "bg-surface-variant text-on-surface-variant hover:bg-primary hover:text-cream"
                      }`}
                      onClick={() => handleToggleStatus(blog.id, blog.status)}
                      title="Click to toggle status"
                      type="button"
                    >
                      {blog.status}
                    </button>

                    {/* Edit Trigger */}
                    <button
                      aria-expanded={isEditing}
                      className="rounded-full border border-primary/20 px-3 py-1 font-display text-label-xs uppercase tracking-wider text-primary hover:border-primary hover:bg-primary/5"
                      onClick={() => {
                        setEditingBlogId((prev) => (prev === blog.id ? null : blog.id));
                        setIsCreating(false);
                      }}
                      type="button"
                    >
                      {isEditing ? "Close" : "Edit"}
                    </button>

                    {/* Delete Trigger */}
                    <button
                      className="rounded-full border border-red-200 px-3 py-1 font-display text-label-xs uppercase tracking-wider text-red-600 hover:bg-red-50 hover:text-red-800"
                      onClick={() => setDeletingBlogId(blog.id)}
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Inline Deletion Confirmation Barrier */}
                {isDeleting ? (
                  <div className="mx-space-sm mt-space-md border border-red-300 bg-red-50 p-space-md text-red-900">
                    <p className="font-display text-label-xs font-bold uppercase tracking-wider">
                      Confirm Monograph Deletion
                    </p>
                    <p className="mt-1 text-body-sm">
                      Are you sure you want to permanently delete &ldquo;{blog.title}&rdquo;? This
                      action cannot be undone.
                    </p>
                    <div className="mt-space-sm flex items-center gap-space-sm">
                      <button
                        className="rounded-full bg-red-700 px-4 py-1.5 font-display text-label-xs font-bold uppercase text-white hover:bg-red-800"
                        onClick={() => handleDelete(blog.id)}
                        type="button"
                      >
                        Confirm Delete
                      </button>
                      <button
                        className="rounded-full border border-red-300 px-4 py-1.5 font-display text-label-xs uppercase text-red-800 hover:bg-red-100"
                        onClick={() => setDeletingBlogId(null)}
                        type="button"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : null}

                {/* Hidden Inline Animated Edit Drawer (Directly below item) */}
                <div
                  aria-hidden={!isEditing}
                  className={`grid transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isEditing
                      ? "mt-space-md grid-rows-[1fr] opacity-100"
                      : "mt-0 grid-rows-[0fr] opacity-0 pointer-events-none"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="border-l-4 border-gold bg-surface-container-lowest p-space-md shadow-md ring-1 ring-primary/10 sm:p-space-lg">
                      <div className="mb-space-md flex items-center justify-between border-b border-primary/10 pb-space-sm">
                        <p className="font-display text-label-xs font-bold uppercase tracking-[0.2em] text-primary">
                          Inline Editor // {blog.index_code} — {blog.title}
                        </p>
                        <button
                          className="font-display text-label-xs uppercase tracking-wider text-on-surface-variant hover:text-primary"
                          onClick={() => setEditingBlogId(null)}
                          type="button"
                        >
                          Dismiss [ESC]
                        </button>
                      </div>

                      <form
                        className="flex flex-col gap-space-md"
                        onSubmit={(e) => handleUpdateSubmit(blog.id, e)}
                      >
                        <div className="grid grid-cols-1 gap-space-md sm:grid-cols-12">
                          <div className="sm:col-span-8 flex flex-col gap-1">
                            <label className="font-display text-label-xs uppercase tracking-wider text-primary">
                              Monograph Title *
                            </label>
                            <input
                              className="w-full rounded-xs border border-primary/20 bg-cream/20 px-3 py-2 text-body-sm focus:border-gold focus:bg-white focus:outline-none"
                              defaultValue={blog.title}
                              name="title"
                              required
                              type="text"
                            />
                          </div>

                          <div className="sm:col-span-4 flex flex-col gap-1">
                            <label className="font-display text-label-xs uppercase tracking-wider text-primary">
                              Index Code *
                            </label>
                            <input
                              className="w-full rounded-xs border border-primary/20 bg-cream/20 px-3 py-2 font-mono text-body-sm focus:border-gold focus:bg-white focus:outline-none"
                              defaultValue={blog.index_code}
                              name="index_code"
                              required
                              type="text"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-space-md sm:grid-cols-3">
                          <div className="flex flex-col gap-1">
                            <label className="font-display text-label-xs uppercase tracking-wider text-primary">
                              Category Series
                            </label>
                            <select
                              className="w-full rounded-xs border border-primary/20 bg-cream/20 px-3 py-2 text-body-sm focus:border-gold focus:bg-white focus:outline-none"
                              defaultValue={blog.label}
                              name="label"
                            >
                              {BLOG_LABELS.map((label) => (
                                <option key={label} value={label}>
                                  {label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="font-display text-label-xs uppercase tracking-wider text-primary">
                              Author Name
                            </label>
                            <input
                              className="w-full rounded-xs border border-primary/20 bg-cream/20 px-3 py-2 text-body-sm focus:border-gold focus:bg-white focus:outline-none"
                              defaultValue={blog.author_name}
                              name="author_name"
                              type="text"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="font-display text-label-xs uppercase tracking-wider text-primary">
                              Reading Time
                            </label>
                            <input
                              className="w-full rounded-xs border border-primary/20 bg-cream/20 px-3 py-2 text-body-sm focus:border-gold focus:bg-white focus:outline-none"
                              defaultValue={blog.reading_time}
                              name="reading_time"
                              type="text"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="font-display text-label-xs uppercase tracking-wider text-primary">
                            Lead Excerpt *
                          </label>
                          <textarea
                            className="w-full rounded-xs border border-primary/20 bg-cream/20 px-3 py-2 text-body-sm focus:border-gold focus:bg-white focus:outline-none"
                            defaultValue={blog.excerpt}
                            name="excerpt"
                            required
                            rows={2}
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="font-display text-label-xs uppercase tracking-wider text-primary">
                            Editorial Content (Markdown) *
                          </label>
                          <textarea
                            className="w-full rounded-xs border border-primary/20 bg-cream/20 px-3 py-2 font-mono text-body-sm focus:border-gold focus:bg-white focus:outline-none"
                            defaultValue={blog.content}
                            name="content"
                            required
                            rows={6}
                          />
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-space-md border-t border-primary/10 pt-space-md">
                          <div className="flex items-center gap-space-sm">
                            <label className="font-display text-label-xs uppercase tracking-wider text-primary">
                              Status:
                            </label>
                            <select
                              className="rounded-xs border border-primary/20 bg-cream/30 px-3 py-1 font-display text-label-xs uppercase tracking-wider text-primary"
                              defaultValue={blog.status}
                              name="status"
                            >
                              <option value="published">Published</option>
                              <option value="draft">Draft</option>
                            </select>
                          </div>

                          <div className="flex items-center gap-space-sm">
                            <button
                              className="inline-flex min-h-10 items-center justify-center rounded-full border border-primary/20 px-5 font-display text-label-xs uppercase tracking-wider text-on-surface-variant hover:border-primary hover:text-primary"
                              onClick={() => setEditingBlogId(null)}
                              type="button"
                            >
                              Cancel
                            </button>
                            <button
                              className="inline-flex min-h-10 items-center justify-center gap-space-xs rounded-full bg-primary px-6 font-display text-label-xs font-semibold uppercase tracking-wider text-cream shadow-xs hover:bg-secondary hover:text-on-secondary disabled:opacity-50"
                              disabled={isPending}
                              type="submit"
                            >
                              <span>{isPending ? "Saving..." : "Update Monograph"}</span>
                              <ArrowForwardIcon className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
