"use client";

import { useState, useTransition } from "react";
import {
  type CourseItem,
  createCourseAction,
  deleteCourseAction,
  toggleCourseStatusAction,
  updateCourseAction,
} from "@/app/actions/courseActions";
import { ArrowForwardIcon } from "@/components/Icons";

interface CourseManagerProps {
  initialCourses: CourseItem[];
}

export default function CourseManager({ initialCourses }: CourseManagerProps) {
  const [courses, setCourses] = useState<CourseItem[]>(initialCourses);
  const [isCreating, setIsCreating] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [deletingCourseId, setDeletingCourseId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.index_code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" ? true : c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await createCourseAction(formData);
      if (res.success) {
        setIsCreating(false);
        const highlights = (formData.get("syllabus_highlights")?.toString() || "")
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);

        const newCourse: CourseItem = {
          id: `temp-${Date.now()}`,
          slug:
            formData.get("slug")?.toString() ||
            formData.get("title")?.toString().toLowerCase().replace(/[^a-z0-9]+/g, "-") ||
            "",
          index_code: formData.get("index_code")?.toString() || "04",
          title: formData.get("title")?.toString() || "",
          subtitle: formData.get("subtitle")?.toString() || "",
          tags: formData.get("tags")?.toString() || "Online • Academic Cohort",
          body: formData.get("body")?.toString() || "",
          extended_body: formData.get("extended_body")?.toString() || "",
          format: formData.get("format")?.toString() || "Digital Modules + Live Seminars",
          syllabus_highlights: highlights,
          youtube_url:
            formData.get("youtube_url")?.toString().trim() ||
            "https://www.youtube.com/watch?v=inpok4MKVLM",
          image_src: "/images/offering-courses.jpg",
          image_alt: "RIOSTAK course offering",
          caption: formData.get("caption")?.toString() || "Curriculum // 2026",
          status: (formData.get("status")?.toString() as "published" | "draft") || "published",
          sort_order: courses.length + 1,
          created_at: new Date().toISOString(),
        };
        setCourses((prev) => [...prev, newCourse]);
      } else {
        setFormError(res.error || "Failed to create course offering.");
      }
    });
  };

  const handleUpdateSubmit = (id: string, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await updateCourseAction(id, formData);
      if (res.success) {
        setEditingCourseId(null);
        const highlights = (formData.get("syllabus_highlights")?.toString() || "")
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);

        setCourses((prev) =>
          prev.map((c) =>
            c.id === id
              ? {
                  ...c,
                  title: formData.get("title")?.toString() || c.title,
                  index_code: formData.get("index_code")?.toString() || c.index_code,
                  subtitle: formData.get("subtitle")?.toString() || c.subtitle,
                  tags: formData.get("tags")?.toString() || c.tags,
                  body: formData.get("body")?.toString() || c.body,
                  extended_body: formData.get("extended_body")?.toString() || c.extended_body,
                  format: formData.get("format")?.toString() || c.format,
                  syllabus_highlights: highlights.length > 0 ? highlights : c.syllabus_highlights,
                  youtube_url: formData.get("youtube_url")?.toString() || c.youtube_url,
                  caption: formData.get("caption")?.toString() || c.caption,
                  status: (formData.get("status")?.toString() as "published" | "draft") || c.status,
                }
              : c
          )
        );
      } else {
        setFormError(res.error || "Failed to update course offering.");
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const res = await deleteCourseAction(id);
      if (res.success) {
        setCourses((prev) => prev.filter((c) => c.id !== id));
        setDeletingCourseId(null);
      } else {
        setFormError(res.error || "Failed to delete course.");
      }
    });
  };

  const handleToggleStatus = (id: string, currentStatus: "published" | "draft" | "archived") => {
    const nextStatus = currentStatus === "published" ? "draft" : "published";
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: nextStatus } : c))
    );

    startTransition(async () => {
      await toggleCourseStatusAction(id, currentStatus);
    });
  };

  return (
    <section aria-labelledby="courses-manager-heading" className="flex flex-1 flex-col">
      {/* Top Console Bar */}
      <div className="flex flex-wrap items-center justify-between gap-space-md border-b border-primary/10 pb-space-lg">
        <div>
          <div className="flex items-center gap-space-xs">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-secondary" />
            <h1
              className="font-display text-headline-sm uppercase tracking-tight text-primary"
              id="courses-manager-heading"
            >
              Academic Curricula &amp; YouTube Courses
            </h1>
          </div>
          <p className="mt-1 text-body-sm text-on-surface-variant">
            Manage course offerings with embedded YouTube lectures, direct video links, and syllabus modules.
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
            setEditingCourseId(null);
            setFormError(null);
          }}
          type="button"
        >
          <span>{isCreating ? "Close Form" : "+ New Course Offering"}</span>
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
            placeholder="Search courses..."
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
                New Course Curriculum // Formulation Console
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
                <div className="sm:col-span-9 flex flex-col gap-1">
                  <label className="font-display text-label-xs uppercase tracking-wider text-primary">
                    Course Title *
                  </label>
                  <input
                    className="w-full rounded-xs border border-primary/20 bg-cream/20 px-3 py-2 text-body-sm focus:border-gold focus:bg-white focus:outline-none"
                    name="title"
                    placeholder="e.g. Somatic Regulation & Leadership"
                    required
                    type="text"
                  />
                </div>

                <div className="sm:col-span-3 flex flex-col gap-1">
                  <label className="font-display text-label-xs uppercase tracking-wider text-primary">
                    Index *
                  </label>
                  <input
                    className="w-full rounded-xs border border-primary/20 bg-cream/20 px-3 py-2 font-mono text-body-sm focus:border-gold focus:bg-white focus:outline-none"
                    defaultValue={`0${courses.length + 1}`}
                    name="index_code"
                    required
                    type="text"
                  />
                </div>
              </div>

              {/* YouTube Video URL Field */}
              <div className="flex flex-col gap-1">
                <label className="font-display text-label-xs uppercase tracking-wider text-primary">
                  YouTube Video Link (Uploaded on YouTube) *
                </label>
                <div className="relative flex items-center">
                  <span className="pointer-events-none absolute left-3 flex items-center text-red-600">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </span>
                  <input
                    className="w-full rounded-xs border border-primary/20 bg-cream/20 py-2 pl-9 pr-3 text-body-sm focus:border-gold focus:bg-white focus:outline-none"
                    defaultValue="https://www.youtube.com/watch?v=inpok4MKVLM"
                    name="youtube_url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    required
                    type="url"
                  />
                </div>
                <p className="text-[11px] text-on-surface-variant">
                  This video will be embedded directly in an interactive iframe on the course catalog and provide a direct YouTube visit link.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="font-display text-label-xs uppercase tracking-wider text-primary">
                    Subtitle / Pitch *
                  </label>
                  <input
                    className="w-full rounded-xs border border-primary/20 bg-cream/20 px-3 py-2 text-body-sm focus:border-gold focus:bg-white focus:outline-none"
                    name="subtitle"
                    placeholder="Concise programmatic thesis or cohort premise..."
                    required
                    type="text"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-display text-label-xs uppercase tracking-wider text-primary">
                    Tags Strip
                  </label>
                  <input
                    className="w-full rounded-xs border border-primary/20 bg-cream/20 px-3 py-2 text-body-sm focus:border-gold focus:bg-white focus:outline-none"
                    defaultValue="Online • Immersive Academics • Cohorts"
                    name="tags"
                    type="text"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="font-display text-label-xs uppercase tracking-wider text-primary">
                    Delivery Format
                  </label>
                  <input
                    className="w-full rounded-xs border border-primary/20 bg-cream/20 px-3 py-2 text-body-sm focus:border-gold focus:bg-white focus:outline-none"
                    defaultValue="Digital Modules + Live Seminars"
                    name="format"
                    type="text"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-display text-label-xs uppercase tracking-wider text-primary">
                    Caption
                  </label>
                  <input
                    className="w-full rounded-xs border border-primary/20 bg-cream/20 px-3 py-2 text-body-sm focus:border-gold focus:bg-white focus:outline-none"
                    defaultValue="Curriculum // Autumn 2026"
                    name="caption"
                    type="text"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-display text-label-xs uppercase tracking-wider text-primary">
                  Primary Course Narrative *
                </label>
                <textarea
                  className="w-full rounded-xs border border-primary/20 bg-cream/20 px-3 py-2 text-body-sm focus:border-gold focus:bg-white focus:outline-none"
                  name="body"
                  placeholder="Primary catalog narrative..."
                  required
                  rows={2}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-display text-label-xs uppercase tracking-wider text-primary">
                  Extended Syllabus &amp; Institutional Scope
                </label>
                <textarea
                  className="w-full rounded-xs border border-primary/20 bg-cream/20 px-3 py-2 text-body-sm focus:border-gold focus:bg-white focus:outline-none"
                  name="extended_body"
                  placeholder="Extended background on cohort structure, target audience, licensing..."
                  rows={2}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-display text-label-xs uppercase tracking-wider text-primary">
                  Syllabus Highlights (One module per line)
                </label>
                <textarea
                  className="w-full rounded-xs border border-primary/20 bg-cream/20 px-3 py-2 font-mono text-body-sm focus:border-gold focus:bg-white focus:outline-none"
                  defaultValue={"Foundational Neuroscience & Metacognition\nWeekly Faculty Dialogues & Socratic Labs\nSomatic Regulation & Autonomic Resilience\nAudited Competency & Cohort Certification"}
                  name="syllabus_highlights"
                  rows={4}
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
                    <span>{isPending ? "Creating..." : "Save Course"}</span>
                    <ArrowForwardIcon className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Courses Items List */}
      <div className="mt-space-lg flex flex-col divide-y divide-primary/10 border-y border-primary/10">
        {filteredCourses.length === 0 ? (
          <div className="py-space-2xl text-center">
            <p className="font-serif text-lg italic text-on-surface-variant">
              No courses match your current criteria.
            </p>
          </div>
        ) : (
          filteredCourses.map((course) => {
            const isEditing = editingCourseId === course.id;
            const isDeleting = deletingCourseId === course.id;

            return (
              <article key={course.id} className="py-space-md transition-colors hover:bg-cream/30">
                <div className="flex flex-wrap items-center justify-between gap-space-md px-space-sm">
                  <div className="flex items-start gap-space-md sm:items-center">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary font-display text-label-xs font-bold text-cream">
                      {course.index_code}
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-space-xs">
                        <h2 className="font-display text-body-md font-bold text-primary">
                          {course.title}
                        </h2>
                        {course.youtube_url ? (
                          <a
                            className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold uppercase text-red-800 transition-colors hover:bg-red-200"
                            href={course.youtube_url}
                            rel="noopener noreferrer"
                            target="_blank"
                            title="Open on YouTube"
                          >
                            <svg className="h-3 w-3 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                            </svg>
                            <span>YouTube ↗</span>
                          </a>
                        ) : null}
                      </div>
                      <p className="mt-0.5 line-clamp-1 max-w-xl text-body-sm text-on-surface-variant">
                        {course.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center gap-space-sm">
                    {/* Status Pill / Toggle */}
                    <button
                      className={`rounded-full px-3 py-1 font-display text-[10px] font-bold uppercase tracking-wider transition-colors ${
                        course.status === "published"
                          ? "bg-secondary-container text-on-secondary-container hover:bg-secondary hover:text-on-secondary"
                          : "bg-surface-variant text-on-surface-variant hover:bg-primary hover:text-cream"
                      }`}
                      onClick={() => handleToggleStatus(course.id, course.status)}
                      title="Click to toggle status"
                      type="button"
                    >
                      {course.status}
                    </button>

                    {/* Edit Trigger */}
                    <button
                      aria-expanded={isEditing}
                      className="rounded-full border border-primary/20 px-3 py-1 font-display text-label-xs uppercase tracking-wider text-primary hover:border-primary hover:bg-primary/5"
                      onClick={() => {
                        setEditingCourseId((prev) => (prev === course.id ? null : course.id));
                        setIsCreating(false);
                      }}
                      type="button"
                    >
                      {isEditing ? "Close" : "Edit"}
                    </button>

                    {/* Delete Trigger */}
                    <button
                      className="rounded-full border border-red-200 px-3 py-1 font-display text-label-xs uppercase tracking-wider text-red-600 hover:bg-red-50 hover:text-red-800"
                      onClick={() => setDeletingCourseId(course.id)}
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
                      Confirm Course Deletion
                    </p>
                    <p className="mt-1 text-body-sm">
                      Are you sure you want to permanently delete &ldquo;{course.title}&rdquo;?
                      This will remove it from the course catalog.
                    </p>
                    <div className="mt-space-sm flex items-center gap-space-sm">
                      <button
                        className="rounded-full bg-red-700 px-4 py-1.5 font-display text-label-xs font-bold uppercase text-white hover:bg-red-800"
                        onClick={() => handleDelete(course.id)}
                        type="button"
                      >
                        Confirm Delete
                      </button>
                      <button
                        className="rounded-full border border-red-300 px-4 py-1.5 font-display text-label-xs uppercase text-red-800 hover:bg-red-100"
                        onClick={() => setDeletingCourseId(null)}
                        type="button"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : null}

                {/* Hidden Inline Animated Edit Drawer (Directly below item, exact CourseQuoteSection style) */}
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
                          Inline Syllabus Editor // {course.index_code} — {course.title}
                        </p>
                        <button
                          className="font-display text-label-xs uppercase tracking-wider text-on-surface-variant hover:text-primary"
                          onClick={() => setEditingCourseId(null)}
                          type="button"
                        >
                          Dismiss [ESC]
                        </button>
                      </div>

                      <form
                        className="flex flex-col gap-space-md"
                        onSubmit={(e) => handleUpdateSubmit(course.id, e)}
                      >
                        <div className="grid grid-cols-1 gap-space-md sm:grid-cols-12">
                          <div className="sm:col-span-9 flex flex-col gap-1">
                            <label className="font-display text-label-xs uppercase tracking-wider text-primary">
                              Course Title *
                            </label>
                            <input
                              className="w-full rounded-xs border border-primary/20 bg-cream/20 px-3 py-2 text-body-sm focus:border-gold focus:bg-white focus:outline-none"
                              defaultValue={course.title}
                              name="title"
                              required
                              type="text"
                            />
                          </div>

                          <div className="sm:col-span-3 flex flex-col gap-1">
                            <label className="font-display text-label-xs uppercase tracking-wider text-primary">
                              Index *
                            </label>
                            <input
                              className="w-full rounded-xs border border-primary/20 bg-cream/20 px-3 py-2 font-mono text-body-sm focus:border-gold focus:bg-white focus:outline-none"
                              defaultValue={course.index_code}
                              name="index_code"
                              required
                              type="text"
                            />
                          </div>
                        </div>

                        {/* YouTube Video URL Field */}
                        <div className="flex flex-col gap-1">
                          <label className="font-display text-label-xs uppercase tracking-wider text-primary">
                            YouTube Video Link (Uploaded on YouTube) *
                          </label>
                          <div className="relative flex items-center">
                            <span className="pointer-events-none absolute left-3 flex items-center text-red-600">
                              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                              </svg>
                            </span>
                            <input
                              className="w-full rounded-xs border border-primary/20 bg-cream/20 py-2 pl-9 pr-3 text-body-sm focus:border-gold focus:bg-white focus:outline-none"
                              defaultValue={course.youtube_url || "https://www.youtube.com/watch?v=inpok4MKVLM"}
                              name="youtube_url"
                              placeholder="https://www.youtube.com/watch?v=..."
                              required
                              type="url"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2">
                          <div className="flex flex-col gap-1">
                            <label className="font-display text-label-xs uppercase tracking-wider text-primary">
                              Subtitle / Premise *
                            </label>
                            <input
                              className="w-full rounded-xs border border-primary/20 bg-cream/20 px-3 py-2 text-body-sm focus:border-gold focus:bg-white focus:outline-none"
                              defaultValue={course.subtitle}
                              name="subtitle"
                              required
                              type="text"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="font-display text-label-xs uppercase tracking-wider text-primary">
                              Tags Strip
                            </label>
                            <input
                              className="w-full rounded-xs border border-primary/20 bg-cream/20 px-3 py-2 text-body-sm focus:border-gold focus:bg-white focus:outline-none"
                              defaultValue={course.tags}
                              name="tags"
                              type="text"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2">
                          <div className="flex flex-col gap-1">
                            <label className="font-display text-label-xs uppercase tracking-wider text-primary">
                              Delivery Format
                            </label>
                            <input
                              className="w-full rounded-xs border border-primary/20 bg-cream/20 px-3 py-2 text-body-sm focus:border-gold focus:bg-white focus:outline-none"
                              defaultValue={course.format}
                              name="format"
                              type="text"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="font-display text-label-xs uppercase tracking-wider text-primary">
                              Caption
                            </label>
                            <input
                              className="w-full rounded-xs border border-primary/20 bg-cream/20 px-3 py-2 text-body-sm focus:border-gold focus:bg-white focus:outline-none"
                              defaultValue={course.caption}
                              name="caption"
                              type="text"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="font-display text-label-xs uppercase tracking-wider text-primary">
                            Primary Narrative *
                          </label>
                          <textarea
                            className="w-full rounded-xs border border-primary/20 bg-cream/20 px-3 py-2 text-body-sm focus:border-gold focus:bg-white focus:outline-none"
                            defaultValue={course.body}
                            name="body"
                            required
                            rows={2}
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="font-display text-label-xs uppercase tracking-wider text-primary">
                            Extended Syllabus &amp; Cohort Scope
                          </label>
                          <textarea
                            className="w-full rounded-xs border border-primary/20 bg-cream/20 px-3 py-2 text-body-sm focus:border-gold focus:bg-white focus:outline-none"
                            defaultValue={course.extended_body}
                            name="extended_body"
                            rows={2}
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="font-display text-label-xs uppercase tracking-wider text-primary">
                            Syllabus Highlights (One module per line)
                          </label>
                          <textarea
                            className="w-full rounded-xs border border-primary/20 bg-cream/20 px-3 py-2 font-mono text-body-sm focus:border-gold focus:bg-white focus:outline-none"
                            defaultValue={course.syllabus_highlights.join("\n")}
                            name="syllabus_highlights"
                            rows={4}
                          />
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-space-md border-t border-primary/10 pt-space-md">
                          <div className="flex items-center gap-space-sm">
                            <label className="font-display text-label-xs uppercase tracking-wider text-primary">
                              Status:
                            </label>
                            <select
                              className="rounded-xs border border-primary/20 bg-cream/30 px-3 py-1 font-display text-label-xs uppercase tracking-wider text-primary"
                              defaultValue={course.status}
                              name="status"
                            >
                              <option value="published">Published</option>
                              <option value="draft">Draft</option>
                            </select>
                          </div>

                          <div className="flex items-center gap-space-sm">
                            <button
                              className="inline-flex min-h-10 items-center justify-center rounded-full border border-primary/20 px-5 font-display text-label-xs uppercase tracking-wider text-on-surface-variant hover:border-primary hover:text-primary"
                              onClick={() => setEditingCourseId(null)}
                              type="button"
                            >
                              Cancel
                            </button>
                            <button
                              className="inline-flex min-h-10 items-center justify-center gap-space-xs rounded-full bg-primary px-6 font-display text-label-xs font-semibold uppercase tracking-wider text-cream shadow-xs hover:bg-secondary hover:text-on-secondary disabled:opacity-50"
                              disabled={isPending}
                              type="submit"
                            >
                              <span>{isPending ? "Saving..." : "Update Course"}</span>
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
