"use client";

import { useState, useTransition } from "react";
import {
  type ContactSubmissionItem,
  type ContactSubmissionStatus,
  deleteContactSubmissionAction,
  updateContactSubmissionAction,
} from "@/app/actions/contactActions";
import { INQUIRY_TOPICS } from "@/utils/contactTypes";

interface SubmissionManagerProps {
  initialSubmissions: ContactSubmissionItem[];
}

export default function SubmissionManager({ initialSubmissions }: SubmissionManagerProps) {
  const [submissions, setSubmissions] = useState<ContactSubmissionItem[]>(initialSubmissions);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ContactSubmissionStatus>("all");
  const [topicFilter, setTopicFilter] = useState<string>("all");
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState<string>("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const newCount = submissions.filter((s) => s.status === "new").length;
  const reviewedCount = submissions.filter((s) => s.status === "reviewed").length;
  const archivedCount = submissions.filter((s) => s.status === "archived").length;

  const filteredSubmissions = submissions.filter((s) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      s.reference_id.toLowerCase().includes(q) ||
      s.full_name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.affiliation.toLowerCase().includes(q) ||
      s.role.toLowerCase().includes(q) ||
      s.message.toLowerCase().includes(q) ||
      s.topic_label.toLowerCase().includes(q);

    const matchesStatus = statusFilter === "all" ? true : s.status === statusFilter;
    const matchesTopic = topicFilter === "all" ? true : s.topic_id === topicFilter;

    return matchesSearch && matchesStatus && matchesTopic;
  });

  const handleStatusChange = (id: string, nextStatus: ContactSubmissionStatus) => {
    setActionError(null);
    setSubmissions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: nextStatus } : item))
    );

    startTransition(async () => {
      const res = await updateContactSubmissionAction(id, { status: nextStatus });
      if (!res.success) {
        setActionError(res.error || "Failed to update submission status.");
      }
    });
  };

  const handleSaveNotes = (id: string) => {
    setActionError(null);
    const trimmedNotes = notesDraft.trim();
    setSubmissions((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, admin_notes: trimmedNotes } : item
      )
    );
    setEditingNotesId(null);

    startTransition(async () => {
      const res = await updateContactSubmissionAction(id, { admin_notes: trimmedNotes });
      if (!res.success) {
        setActionError(res.error || "Failed to save secretariat notes.");
      }
    });
  };

  const handleDelete = (id: string) => {
    setActionError(null);
    startTransition(async () => {
      const res = await deleteContactSubmissionAction(id);
      if (res.success) {
        setSubmissions((prev) => prev.filter((item) => item.id !== id));
        setDeletingId(null);
      } else {
        setActionError(res.error || "Failed to delete submission.");
      }
    });
  };

  const getStatusBadgeClasses = (status: ContactSubmissionStatus) => {
    switch (status) {
      case "new":
        return "bg-secondary/15 text-secondary border-secondary/30";
      case "reviewed":
        return "bg-emerald-950/10 text-emerald-800 border-emerald-800/25";
      case "archived":
        return "bg-primary/10 text-on-surface-variant border-primary/15";
    }
  };

  return (
    <section aria-labelledby="submissions-manager-heading" className="flex flex-1 flex-col">
      {/* Top Console Bar */}
      <div className="flex flex-wrap items-center justify-between gap-space-md border-b border-primary/10 pb-space-lg">
        <div>
          <div className="flex items-center gap-space-xs">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-secondary" />
            <p className="font-display text-label-xs font-bold uppercase tracking-[0.2em] text-secondary">
              03 // Secretariat Console
            </p>
          </div>
          <h1
            className="mt-1 font-display text-headline-md uppercase text-primary"
            id="submissions-manager-heading"
          >
            Form Submissions
          </h1>
          <p className="mt-1 text-body-sm text-on-surface-variant">
            Review institutional inquiries, fellowship proposals, and curricular licensing dispatches
            submitted via the public contact desk.
          </p>
        </div>

        {/* Status Summary Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="rounded-xs border border-primary/10 bg-surface-container-low px-3.5 py-2">
            <p className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">
              Total
            </p>
            <p className="font-display text-title-md font-bold text-primary">
              {submissions.length}
            </p>
          </div>
          <div className="rounded-xs border border-secondary/25 bg-secondary/5 px-3.5 py-2">
            <p className="font-mono text-[10px] uppercase tracking-wider text-secondary">
              New
            </p>
            <p className="font-display text-title-md font-bold text-secondary">
              {newCount}
            </p>
          </div>
          <div className="rounded-xs border border-emerald-800/20 bg-emerald-950/5 px-3.5 py-2">
            <p className="font-mono text-[10px] uppercase tracking-wider text-emerald-800">
              Reviewed
            </p>
            <p className="font-display text-title-md font-bold text-emerald-800">
              {reviewedCount}
            </p>
          </div>
          <div className="rounded-xs border border-primary/10 bg-surface-container-low px-3.5 py-2">
            <p className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">
              Archived
            </p>
            <p className="font-display text-title-md font-bold text-on-surface-variant">
              {archivedCount}
            </p>
          </div>
        </div>
      </div>

      {actionError ? (
        <div
          className="mt-space-md rounded-xs border border-red-500/30 bg-red-50 px-4 py-3 text-body-sm text-red-700"
          role="alert"
        >
          {actionError}
        </div>
      ) : null}

      {/* Filter & Search Bar */}
      <div className="mt-space-lg flex flex-col justify-between gap-space-md border-b border-primary/10 pb-space-md lg:flex-row lg:items-center">
        <div className="flex flex-wrap items-center gap-2">
          {(["all", "new", "reviewed", "archived"] as const).map((st) => {
            const active = statusFilter === st;
            return (
              <button
                key={st}
                className={`rounded-full px-3.5 py-1.5 font-display text-label-xs uppercase tracking-wider transition-all ${
                  active
                    ? "bg-primary text-cream shadow-xs"
                    : "bg-surface-container text-on-surface-variant hover:bg-surface-variant hover:text-primary"
                }`}
                onClick={() => setStatusFilter(st)}
                type="button"
              >
                {st === "all" ? "All Dispatches" : st}
              </button>
            );
          })}

          <select
            aria-label="Filter by inquiry department"
            className="rounded-full border border-primary/15 bg-surface-container-lowest px-3.5 py-1.5 font-display text-label-xs uppercase tracking-wider text-primary focus:border-gold focus:outline-none"
            onChange={(e) => setTopicFilter(e.target.value)}
            value={topicFilter}
          >
            <option value="all">All Departments</option>
            {INQUIRY_TOPICS.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {`${topic.code} // ${topic.label}`}
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-full lg:w-80">
          <input
            aria-label="Search contact submissions"
            className="w-full rounded-xs border border-primary/20 bg-surface-container-lowest px-3.5 py-2 font-sans text-body-sm text-primary placeholder:text-on-surface-variant/60 focus:border-gold focus:outline-none"
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reference, scholar, email, or text..."
            type="search"
            value={searchQuery}
          />
        </div>
      </div>

      {/* Submissions List */}
      <div className="mt-space-lg flex flex-col gap-space-md">
        {filteredSubmissions.length === 0 ? (
          <div className="border border-primary/10 bg-surface-container-lowest p-space-2xl text-center">
            <p className="font-display text-label-xs font-bold uppercase tracking-widest text-secondary">
              Secretariat Queue Empty
            </p>
            <p className="mt-space-xs font-display text-title-md uppercase text-primary">
              No Matching Form Submissions
            </p>
            <p className="mx-auto mt-1 max-w-md text-body-sm text-on-surface-variant">
              Adjust your search filters or wait for new inquiries transmitted from the public
              contact page.
            </p>
          </div>
        ) : (
          filteredSubmissions.map((item) => {
            const isEditingNotes = editingNotesId === item.id;
            const isConfirmingDelete = deletingId === item.id;

            return (
              <article
                key={item.id}
                className="border border-primary/12 bg-surface-container-lowest p-space-lg shadow-2xs transition-colors hover:border-primary/25 sm:p-space-xl"
              >
                {/* Top Metadata Row */}
                <div className="flex flex-wrap items-center justify-between gap-space-sm border-b border-primary/10 pb-space-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-xs bg-primary px-2.5 py-1 font-mono text-xs font-bold tracking-wider text-cream">
                      {item.reference_id}
                    </span>
                    <span className="rounded-full border border-primary/15 bg-cream/60 px-3 py-0.5 font-display text-label-xs uppercase tracking-wider text-primary">
                      {item.topic_label}
                    </span>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 font-display text-[10px] font-bold uppercase tracking-widest ${getStatusBadgeClasses(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <time
                    className="font-mono text-xs text-on-surface-variant"
                    dateTime={item.created_at}
                  >
                    {new Date(item.created_at).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </time>
                </div>

                {/* Sender Identity & Message Grid */}
                <div className="mt-space-md grid grid-cols-1 gap-gutter lg:grid-cols-12">
                  {/* Left 4 Cols: Sender Dossier */}
                  <div className="flex flex-col justify-between border-b border-primary/10 pb-space-md lg:col-span-4 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-space-md">
                    <div>
                      <p className="font-display text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                        Correspondent
                      </p>
                      <h2 className="mt-0.5 font-display text-title-md font-bold text-primary">
                        {item.full_name}
                      </h2>
                      {item.role ? (
                        <p className="text-body-sm font-medium text-secondary">{item.role}</p>
                      ) : null}
                      {item.affiliation ? (
                        <p className="mt-0.5 text-body-sm text-on-surface-variant">
                          {item.affiliation}
                        </p>
                      ) : null}

                      <div className="mt-space-sm">
                        <a
                          className="inline-flex items-center gap-1.5 font-mono text-xs font-medium text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:text-secondary hover:decoration-secondary"
                          href={`mailto:${item.email}?subject=${encodeURIComponent(
                            `Re: [${item.reference_id}] RIOSTAK — ${item.topic_label}`
                          )}`}
                        >
                          <span>{item.email}</span>
                          <span aria-hidden="true">↗</span>
                        </a>
                      </div>
                    </div>

                    {/* Status Switcher Controls */}
                    <div className="mt-space-md pt-space-sm">
                      <p className="mb-1.5 font-display text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                        Set Review Status
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {(["new", "reviewed", "archived"] as const).map((st) => {
                          const active = item.status === st;
                          return (
                            <button
                              key={st}
                              className={`rounded-xs px-2.5 py-1 font-display text-[10px] font-bold uppercase tracking-wider transition-all ${
                                active
                                  ? "bg-primary text-cream"
                                  : "border border-primary/15 bg-surface-container-low text-on-surface-variant hover:border-primary/40 hover:text-primary"
                              }`}
                              disabled={isPending && active}
                              onClick={() => handleStatusChange(item.id, st)}
                              type="button"
                            >
                              {st}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Right 8 Cols: Inquiry Overview & Secretariat Notes */}
                  <div className="flex flex-col justify-between lg:col-span-8">
                    <div>
                      <p className="font-display text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                        Inquiry Transmission
                      </p>
                      <div className="mt-2 rounded-xs border border-primary/8 bg-cream/35 p-space-md font-sans text-body-md leading-relaxed whitespace-pre-wrap text-primary">
                        {item.message}
                      </div>

                      {/* Secretariat Internal Notes */}
                      <div className="mt-space-md">
                        {isEditingNotes ? (
                          <div className="flex flex-col gap-2 rounded-xs border border-gold/40 bg-surface-container-low p-space-sm">
                            <label
                              className="font-display text-[10px] font-bold uppercase tracking-widest text-secondary"
                              htmlFor={`notes-${item.id}`}
                            >
                              Secretariat Internal Review Notes
                            </label>
                            <textarea
                              className="min-h-[76px] w-full rounded-xs border border-primary/20 bg-white px-3 py-2 font-sans text-body-sm text-primary focus:border-gold focus:outline-none"
                              id={`notes-${item.id}`}
                              onChange={(e) => setNotesDraft(e.target.value)}
                              placeholder="Record routing desk, faculty liaison, or follow-up actions..."
                              value={notesDraft}
                            />
                            <div className="flex items-center justify-end gap-2">
                              <button
                                className="rounded-xs px-3 py-1 font-display text-label-xs uppercase tracking-wider text-on-surface-variant hover:text-primary"
                                onClick={() => setEditingNotesId(null)}
                                type="button"
                              >
                                Cancel
                              </button>
                              <button
                                className="rounded-full bg-primary px-4 py-1.5 font-display text-label-xs font-semibold uppercase tracking-wider text-cream hover:bg-secondary hover:text-on-secondary"
                                disabled={isPending}
                                onClick={() => handleSaveNotes(item.id)}
                                type="button"
                              >
                                Save Notes
                              </button>
                            </div>
                          </div>
                        ) : item.admin_notes ? (
                          <div className="flex items-start justify-between gap-space-sm rounded-xs border-l-2 border-secondary bg-surface-container-low px-3.5 py-2.5">
                            <div>
                              <p className="font-display text-[10px] font-bold uppercase tracking-widest text-secondary">
                                Secretariat Note
                              </p>
                              <p className="mt-0.5 text-body-sm text-primary">
                                {item.admin_notes}
                              </p>
                            </div>
                            <button
                              className="shrink-0 font-display text-[10px] font-bold uppercase tracking-wider text-on-surface-variant underline-offset-4 hover:text-primary hover:underline"
                              onClick={() => {
                                setEditingNotesId(item.id);
                                setNotesDraft(item.admin_notes || "");
                              }}
                              type="button"
                            >
                              Edit Note
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="mt-space-md flex flex-wrap items-center justify-between gap-2 border-t border-primary/10 pt-space-sm">
                      <div className="flex flex-wrap items-center gap-2">
                        <a
                          className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-primary px-4 font-display text-label-xs font-semibold uppercase tracking-wider text-cream transition-colors hover:bg-secondary hover:text-on-secondary"
                          href={`mailto:${item.email}?subject=${encodeURIComponent(
                            `Re: [${item.reference_id}] RIOSTAK — ${item.topic_label}`
                          )}`}
                        >
                          <span>Reply via Email</span>
                          <span aria-hidden="true">↗</span>
                        </a>

                        {!isEditingNotes && !item.admin_notes ? (
                          <button
                            className="inline-flex min-h-9 items-center rounded-full border border-primary/20 px-4 font-display text-label-xs uppercase tracking-wider text-primary transition-colors hover:border-primary hover:bg-cream"
                            onClick={() => {
                              setEditingNotesId(item.id);
                              setNotesDraft(item.admin_notes || "");
                            }}
                            type="button"
                          >
                            + Add Secretariat Note
                          </button>
                        ) : null}
                      </div>

                      {isConfirmingDelete ? (
                        <div className="flex items-center gap-2">
                          <span className="font-display text-label-xs uppercase tracking-wider text-red-700">
                            Confirm Delete?
                          </span>
                          <button
                            className="rounded-full bg-red-700 px-3.5 py-1 font-display text-label-xs font-bold uppercase tracking-wider text-white hover:bg-red-800"
                            disabled={isPending}
                            onClick={() => handleDelete(item.id)}
                            type="button"
                          >
                            Delete
                          </button>
                          <button
                            className="rounded-full border border-primary/20 px-3 py-1 font-display text-label-xs uppercase tracking-wider text-primary"
                            onClick={() => setDeletingId(null)}
                            type="button"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          className="font-display text-label-xs uppercase tracking-wider text-red-700 transition-colors hover:text-red-900 hover:underline"
                          onClick={() => setDeletingId(item.id)}
                          type="button"
                        >
                          Delete Record
                        </button>
                      )}
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
