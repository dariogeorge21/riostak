"use client";

import { useEffect, useState } from "react";
import { getYoutubeEmbedUrl } from "@/utils/youtube";
import { ArrowForwardIcon, VerifiedIcon } from "../Icons";

export type CourseOffering = {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  tags: string;
  body: string;
  extendedBody: string;
  format: string;
  syllabusHighlights: readonly string[];
  youtubeUrl: string;
  imageSrc?: string;
  imageAlt?: string;
  caption?: string;
  frameClassName?: string;
  accentClassName?: string;
  imageClassName?: string;
};

const COHORT_TIERS = [
  "1–15 Seats (Seminar)",
  "16–50 Seats (Department)",
  "51–200 Seats (Faculty)",
  "200+ Seats (Institutional)",
] as const;

const DELIVERY_MODES = [
  "Autonomous Digital",
  "Faculty-Led Hybrid",
  "Custom Intensive",
] as const;

type CohortTier = (typeof COHORT_TIERS)[number];
type DeliveryMode = (typeof DELIVERY_MODES)[number];

type QuoteFormValues = {
  fullName: string;
  email: string;
  organization: string;
  cohortTier: CohortTier;
  deliveryMode: DeliveryMode;
  timeline: string;
  notes: string;
};

type QuoteFormErrors = Partial<Record<"fullName" | "email" | "organization", string>>;

type SubmittedQuote = {
  referenceId: string;
  fullName: string;
  email: string;
  organization: string;
  cohortTier: CohortTier;
  deliveryMode: DeliveryMode;
  timeline: string;
};

const INITIAL_FORM_VALUES: QuoteFormValues = {
  fullName: "",
  email: "",
  organization: "",
  cohortTier: COHORT_TIERS[1],
  deliveryMode: DELIVERY_MODES[1],
  timeline: "Autumn 2026",
  notes: "",
};

/** Individual course row with alternating left/right layout and an inline animated quote drawer. */
function CourseRow({
  course,
  isReversed,
}: {
  course: CourseOffering;
  isReversed: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [values, setValues] = useState<QuoteFormValues>(INITIAL_FORM_VALUES);
  const [errors, setErrors] = useState<QuoteFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedQuote, setSubmittedQuote] = useState<SubmittedQuote | null>(null);

  const drawerId = `quote-drawer-${course.id}`;
  const headingId = `course-heading-${course.id}`;

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const validate = (): boolean => {
    const nextErrors: QuoteFormErrors = {};

    if (!values.fullName.trim()) {
      nextErrors.fullName = "Please enter your full name.";
    }

    if (!values.email.trim()) {
      nextErrors.email = "Institutional or work email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!values.organization.trim()) {
      nextErrors.organization = "Please specify your organization or institution.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      setSubmittedQuote({
        referenceId: `RIO-QT-${course.index}-${randomDigits}`,
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        organization: values.organization.trim(),
        cohortTier: values.cohortTier,
        deliveryMode: values.deliveryMode,
        timeline: values.timeline.trim() || "Flexible / 2026",
      });
      setIsSubmitting(false);
      setValues(INITIAL_FORM_VALUES);
      setErrors({});
    }, 550);
  };

  const handleToggleQuote = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <article
      aria-labelledby={headingId}
      className="border-t border-primary/15 py-space-2xl first:border-t-0 lg:py-space-3xl"
      id={course.id}
    >
      {/* Main 2-Column Alternating Grid: Left Course Name / Visual vs. Right Course About */}
      <div className="grid grid-cols-1 items-start gap-gutter-desktop lg:grid-cols-12 xl:gap-16">
        {/* Column A: Course Name, Classification Metadata & Visual Plate */}
        <div
          className={`flex flex-col justify-between lg:col-span-6 ${
            isReversed ? "lg:order-2" : "lg:order-1"
          }`}
        >
          {/* Index & Syllabus Code Bar */}
          {/* Index & Video Classification Bar */}
          <div className="mb-space-md flex items-center justify-between border-b border-primary/10 pb-space-sm">
            <div className="flex items-center gap-space-sm">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary font-display text-label-xs font-bold text-cream">
                {course.index}
              </span>
              <span className="font-display text-label-xs font-bold uppercase tracking-[0.2em] text-secondary">
                {course.tags}
              </span>
            </div>
            <a
              className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-red-600 hover:text-red-800 transition-colors"
              href={course.youtubeUrl}
              rel="noopener noreferrer"
              target="_blank"
              title="Open on YouTube"
            >
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              <span>YouTube Video</span>
            </a>
          </div>

          {/* Course Name & Subtitle */}
          <h3
            className="font-display text-headline-lg-mobile uppercase leading-[0.98] tracking-tight text-primary sm:text-headline-md lg:text-headline-lg"
            id={headingId}
          >
            {course.title}
          </h3>
          <p className="mt-space-sm font-serif text-xl font-light italic text-on-surface-variant lg:text-2xl">
            {course.subtitle}
          </p>

          {/* YouTube Video Embed & Watch Link */}
          <div className="mt-space-xl">
            <div className="relative aspect-video w-full overflow-hidden rounded-xs border border-primary/20 bg-primary shadow-lg ring-1 ring-primary/10">
              <iframe
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-full w-full"
                loading="lazy"
                src={getYoutubeEmbedUrl(course.youtubeUrl)}
                title={`${course.title} — Lecture & Curriculum Video`}
              />
            </div>
            <div className="mt-space-sm flex flex-wrap items-center justify-between gap-2 px-1">
              <p className="font-display text-label-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                {course.caption || "Open Curriculum Lecture"}
              </p>
              <a
                className="group inline-flex items-center gap-1.5 font-display text-label-xs font-bold uppercase tracking-wider text-red-700 hover:text-red-900 transition-colors"
                href={course.youtubeUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                <svg
                  aria-hidden="true"
                  className="h-3.5 w-3.5 text-red-600 transition-transform group-hover:scale-110"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                <span>Watch on YouTube ↗</span>
              </a>
            </div>
          </div>
        </div>

        {/* Column B: Course About, Syllabus Architecture & Request Quote Trigger */}
        <div
          className={`flex flex-col justify-between bg-surface-container-low p-space-lg sm:p-space-xl lg:col-span-6 ${
            isReversed ? "lg:order-1" : "lg:order-2"
          }`}
        >
          <div>
            {/* Section Eyebrow */}
            <div className="mb-space-md flex items-center justify-between border-b border-primary/10 pb-space-sm">
              <p className="font-display text-label-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                Course Dossier // Overview &amp; Syllabus
              </p>
              <span className="inline-flex items-center gap-1.5 font-display text-label-xs uppercase tracking-widest text-secondary">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-secondary" />
                Enrolling Now
              </span>
            </div>

            {/* Primary Narrative (from Landing Page) */}
            <p className="text-body-lg leading-relaxed text-primary">{course.body}</p>

            {/* Extended Curriculum Context */}
            <p className="mt-space-md text-body-md leading-relaxed text-on-surface-variant">
              {course.extendedBody}
            </p>

            {/* Key Syllabus Pillars */}
            <div className="mt-space-xl border-t border-primary/10 pt-space-lg">
              <p className="mb-space-md font-display text-label-xs font-bold uppercase tracking-[0.2em] text-primary">
                Included Modules &amp; Deliverables
              </p>
              <ul className="grid grid-cols-1 gap-space-sm sm:grid-cols-2">
                {course.syllabusHighlights.map((highlight, idx) => (
                  <li
                    key={highlight}
                    className="flex items-start gap-space-xs bg-cream/70 px-space-md py-space-sm"
                  >
                    <span className="font-mono text-[11px] font-bold text-secondary">
                      0{idx + 1}
                    </span>
                    <span className="text-body-sm font-medium text-primary">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Format & Licensing Metadata Strip */}
            <dl className="mt-space-lg grid grid-cols-2 gap-gutter border-t border-primary/10 pt-space-md">
              <div>
                <dt className="font-display text-label-xs uppercase tracking-widest text-on-surface-variant">
                  Delivery Architecture
                </dt>
                <dd className="mt-1 font-display text-body-sm font-semibold text-primary">
                  {course.format}
                </dd>
              </div>
              <div>
                <dt className="font-display text-label-xs uppercase tracking-widest text-on-surface-variant">
                  Institutional Licensing
                </dt>
                <dd className="mt-1 font-display text-body-sm font-semibold text-secondary">
                  Custom Cohort Quote
                </dd>
              </div>
            </dl>
          </div>

          {/* Action Bar: Request Quote Trigger */}
          <div className="mt-space-xl flex flex-wrap items-center justify-between gap-space-md border-t border-primary/15 pt-space-lg">
            <div>
              <p className="font-display text-label-xs uppercase tracking-widest text-on-surface-variant">
                Custom Tuition &amp; Institutional Grants
              </p>
              <p className="text-body-sm text-primary">
                Tailored to cohort size and academic calendar.
              </p>
            </div>

            <button
              aria-controls={drawerId}
              aria-expanded={isOpen}
              className={`group inline-flex min-h-12 items-center justify-center gap-space-sm rounded-full px-7 font-display text-label-md font-semibold uppercase tracking-wider shadow-sm transition-all duration-200 active:scale-[0.98] ${
                isOpen
                  ? "bg-secondary text-on-secondary hover:bg-primary hover:text-cream"
                  : "bg-primary text-cream hover:bg-secondary hover:text-on-secondary"
              }`}
              onClick={handleToggleQuote}
              type="button"
            >
              <span>{isOpen ? "Close Quote Form" : "Request Quote"}</span>
              <span
                aria-hidden="true"
                className={`flex h-6 w-6 items-center justify-center rounded-full bg-cream/15 text-cream transition-transform duration-300 ${
                  isOpen ? "rotate-90" : "group-hover:translate-x-1"
                }`}
              >
                <ArrowForwardIcon className="h-3.5 w-3.5" />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Hidden Inline Animated Quote Drawer — Opens Directly Below This Course and Before Next Course */}
      <div
        aria-hidden={!isOpen}
        className={`grid transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen
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
                  Inline Quote Console // {course.index} — {course.title}
                </p>
              </div>
              <div className="flex items-center gap-space-md">
                <span className="font-mono text-[11px] text-on-surface-variant">
                   SLA: &lt; 24H RESPONSE
                </span>
                <button
                  className="font-display text-label-xs uppercase tracking-widest text-on-surface-variant underline-offset-4 transition-colors hover:text-primary hover:underline"
                  onClick={() => setIsOpen(false)}
                  type="button"
                >
                  Dismiss [ESC]
                </button>
              </div>
            </div>

            {submittedQuote ? (
              /* Dummy Submit Confirmation View */
              <div className="flex flex-col justify-between gap-space-lg bg-cream/50 p-space-lg sm:p-space-xl">
                <div>
                  <div className="mb-space-sm flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-space-xs text-secondary">
                      <VerifiedIcon className="h-5 w-5" />
                      <span className="font-display text-label-xs font-bold uppercase tracking-widest">
                        Quote Dossier Registered
                      </span>
                    </div>
                    <span className="bg-primary px-3 py-1 font-mono text-[11px] font-semibold text-gold">
                      REF: {submittedQuote.referenceId}
                    </span>
                  </div>

                  <h4 className="font-display text-headline-sm uppercase text-primary">
                    Custom Proposal in Preparation for {submittedQuote.organization}
                  </h4>
                  <p className="mt-space-xs max-w-2xl text-body-md text-on-surface-variant">
                    Thank you, <strong className="text-primary">{submittedQuote.fullName}</strong>.
                    Our Academic Secretariat has logged your quote request for{" "}
                    <strong className="text-primary">{course.title}</strong> and will dispatch a
                    tailored syllabus and tuition schedule to{" "}
                    <span className="underline">{submittedQuote.email}</span>.
                  </p>

                  {/* Summary Pill Grid */}
                  <dl className="mt-space-lg grid grid-cols-1 gap-gutter border-t border-primary/10 pt-space-md sm:grid-cols-3">
                    <div>
                      <dt className="font-display text-label-xs uppercase tracking-widest text-on-surface-variant">
                        Selected Cohort Tier
                      </dt>
                      <dd className="mt-1 font-display text-body-sm font-semibold text-primary">
                        {submittedQuote.cohortTier}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-display text-label-xs uppercase tracking-widest text-on-surface-variant">
                        Delivery Modality
                      </dt>
                      <dd className="mt-1 font-display text-body-sm font-semibold text-primary">
                        {submittedQuote.deliveryMode}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-display text-label-xs uppercase tracking-widest text-on-surface-variant">
                        Target Window
                      </dt>
                      <dd className="mt-1 font-display text-body-sm font-semibold text-secondary">
                        {submittedQuote.timeline}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="flex flex-wrap items-center gap-space-md border-t border-primary/10 pt-space-md">
                  <button
                    className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-6 font-display text-label-md font-semibold uppercase tracking-wider text-cream transition-colors hover:bg-secondary hover:text-on-secondary"
                    onClick={() => setSubmittedQuote(null)}
                    type="button"
                  >
                    Request Another Quote
                  </button>
                  <button
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-primary/20 px-6 font-display text-label-md font-semibold uppercase tracking-wider text-primary transition-colors hover:border-primary hover:bg-primary/5"
                    onClick={() => setIsOpen(false)}
                    type="button"
                  >
                    Close Drawer
                  </button>
                </div>
              </div>
            ) : (
              /* Interactive Inline Quote Form */
              <form
                aria-label={`Request quote for ${course.title}`}
                className="flex flex-col gap-space-lg"
                noValidate
                onSubmit={handleSubmit}
              >
                {/* Row 1: Cohort Tier & Delivery Mode Chips */}
                <div className="grid grid-cols-1 gap-gutter lg:grid-cols-12">
                  <div className="lg:col-span-7">
                    <p className="mb-space-xs font-display text-label-xs font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                      01 // Select Cohort Size
                    </p>
                    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Cohort size">
                      {COHORT_TIERS.map((tier) => {
                        const active = values.cohortTier === tier;
                        return (
                          <button
                            key={tier}
                            aria-checked={active}
                            className={`min-h-10 rounded-full px-4 py-2 font-display text-label-xs uppercase tracking-wider transition-all ${
                              active
                                ? "bg-primary text-cream shadow-xs"
                                : "bg-surface-container text-on-surface-variant hover:bg-surface-variant hover:text-primary"
                            }`}
                            onClick={() => setValues((prev) => ({ ...prev, cohortTier: tier }))}
                            role="radio"
                            tabIndex={isOpen ? 0 : -1}
                            type="button"
                          >
                            {tier}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="lg:col-span-5">
                    <p className="mb-space-xs font-display text-label-xs font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                      02 // Delivery Format
                    </p>
                    <div
                      className="flex flex-wrap gap-2"
                      role="radiogroup"
                      aria-label="Delivery format"
                    >
                      {DELIVERY_MODES.map((mode) => {
                        const active = values.deliveryMode === mode;
                        return (
                          <button
                            key={mode}
                            aria-checked={active}
                            className={`min-h-10 rounded-full px-4 py-2 font-display text-label-xs uppercase tracking-wider transition-all ${
                              active
                                ? "bg-secondary text-on-secondary shadow-xs"
                                : "bg-surface-container text-on-surface-variant hover:bg-surface-variant hover:text-primary"
                            }`}
                            onClick={() => setValues((prev) => ({ ...prev, deliveryMode: mode }))}
                            role="radio"
                            tabIndex={isOpen ? 0 : -1}
                            type="button"
                          >
                            {mode}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Row 2: Contact & Institutional Fields */}
                <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-4">
                  {/* Full Name */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      className="font-display text-label-xs uppercase tracking-widest text-primary"
                      htmlFor={`${course.id}-fullName`}
                    >
                      Full Name <span className="text-secondary">*</span>
                    </label>
                    <input
                      aria-describedby={
                        errors.fullName ? `${course.id}-fullName-error` : undefined
                      }
                      aria-invalid={Boolean(errors.fullName)}
                      aria-required="true"
                      className={`w-full rounded-xs border bg-cream/25 px-3.5 py-2.5 font-sans text-body-md text-primary placeholder:text-on-surface-variant/50 transition-colors focus:border-gold focus:bg-white focus:outline-none ${
                        errors.fullName ? "border-red-600" : "border-primary/20"
                      }`}
                      id={`${course.id}-fullName`}
                      name="fullName"
                      onChange={(e) =>
                        setValues((prev) => ({ ...prev, fullName: e.target.value }))
                      }
                      placeholder="Dr. Clara Lin"
                      tabIndex={isOpen ? 0 : -1}
                      type="text"
                      value={values.fullName}
                    />
                    {errors.fullName ? (
                      <p className="text-[12px] text-red-600" id={`${course.id}-fullName-error`}>
                        {errors.fullName}
                      </p>
                    ) : null}
                  </div>

                  {/* Institutional Email */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      className="font-display text-label-xs uppercase tracking-widest text-primary"
                      htmlFor={`${course.id}-email`}
                    >
                      Work / Academic Email <span className="text-secondary">*</span>
                    </label>
                    <input
                      aria-describedby={errors.email ? `${course.id}-email-error` : undefined}
                      aria-invalid={Boolean(errors.email)}
                      aria-required="true"
                      className={`w-full rounded-xs border bg-cream/25 px-3.5 py-2.5 font-sans text-body-md text-primary placeholder:text-on-surface-variant/50 transition-colors focus:border-gold focus:bg-white focus:outline-none ${
                        errors.email ? "border-red-600" : "border-primary/20"
                      }`}
                      id={`${course.id}-email`}
                      name="email"
                      onChange={(e) => setValues((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="c.lin@riostak.org"
                      tabIndex={isOpen ? 0 : -1}
                      type="email"
                      value={values.email}
                    />
                    {errors.email ? (
                      <p className="text-[12px] text-red-600" id={`${course.id}-email-error`}>
                        {errors.email}
                      </p>
                    ) : null}
                  </div>

                  {/* Organization */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      className="font-display text-label-xs uppercase tracking-widest text-primary"
                      htmlFor={`${course.id}-organization`}
                    >
                      Institution / Organization <span className="text-secondary">*</span>
                    </label>
                    <input
                      aria-describedby={
                        errors.organization ? `${course.id}-organization-error` : undefined
                      }
                      aria-invalid={Boolean(errors.organization)}
                      aria-required="true"
                      className={`w-full rounded-xs border bg-cream/25 px-3.5 py-2.5 font-sans text-body-md text-primary placeholder:text-on-surface-variant/50 transition-colors focus:border-gold focus:bg-white focus:outline-none ${
                        errors.organization ? "border-red-600" : "border-primary/20"
                      }`}
                      id={`${course.id}-organization`}
                      name="organization"
                      onChange={(e) =>
                        setValues((prev) => ({ ...prev, organization: e.target.value }))
                      }
                      placeholder="Institute of Cognitive Inquiry"
                      tabIndex={isOpen ? 0 : -1}
                      type="text"
                      value={values.organization}
                    />
                    {errors.organization ? (
                      <p
                        className="text-[12px] text-red-600"
                        id={`${course.id}-organization-error`}
                      >
                        {errors.organization}
                      </p>
                    ) : null}
                  </div>

                  {/* Target Timeline */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      className="font-display text-label-xs uppercase tracking-widest text-primary"
                      htmlFor={`${course.id}-timeline`}
                    >
                      Preferred Start Window
                    </label>
                    <input
                      className="w-full rounded-xs border border-primary/20 bg-cream/25 px-3.5 py-2.5 font-sans text-body-md text-primary placeholder:text-on-surface-variant/50 transition-colors focus:border-gold focus:bg-white focus:outline-none"
                      id={`${course.id}-timeline`}
                      name="timeline"
                      onChange={(e) =>
                        setValues((prev) => ({ ...prev, timeline: e.target.value }))
                      }
                      placeholder="Autumn 2026 / Q4"
                      tabIndex={isOpen ? 0 : -1}
                      type="text"
                      value={values.timeline}
                    />
                  </div>
                </div>

                {/* Row 3: Custom Notes + Submit Bar */}
                <div className="grid grid-cols-1 items-end gap-gutter lg:grid-cols-12">
                  <div className="flex flex-col gap-1.5 lg:col-span-8">
                    <label
                      className="font-display text-label-xs uppercase tracking-widest text-primary"
                      htmlFor={`${course.id}-notes`}
                    >
                      Curriculum Customization or Grant Notes (Optional)
                    </label>
                    <input
                      className="w-full rounded-xs border border-primary/20 bg-cream/25 px-3.5 py-2.5 font-sans text-body-md text-primary placeholder:text-on-surface-variant/50 transition-colors focus:border-gold focus:bg-white focus:outline-none"
                      id={`${course.id}-notes`}
                      name="notes"
                      onChange={(e) => setValues((prev) => ({ ...prev, notes: e.target.value }))}
                      placeholder="Share specific learning objectives, faculty seminar requests, or subsidy requirements..."
                      tabIndex={isOpen ? 0 : -1}
                      type="text"
                      value={values.notes}
                    />
                  </div>

                  <div className="flex items-center justify-end gap-space-sm lg:col-span-4">
                    <button
                      className="inline-flex min-h-12 items-center justify-center rounded-full border border-primary/20 px-5 font-display text-label-md uppercase tracking-wider text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
                      onClick={() => setIsOpen(false)}
                      tabIndex={isOpen ? 0 : -1}
                      type="button"
                    >
                      Cancel
                    </button>
                    <button
                      className="group inline-flex min-h-12 flex-1 items-center justify-center gap-space-xs rounded-full bg-primary px-7 font-display text-label-md font-semibold uppercase tracking-wider text-cream shadow-sm transition-all duration-200 hover:bg-secondary hover:text-on-secondary disabled:opacity-50 sm:flex-initial"
                      disabled={isSubmitting}
                      tabIndex={isOpen ? 0 : -1}
                      type="submit"
                    >
                      <span>{isSubmitting ? "Submitting..." : "Submit Quote Request"}</span>
                      <span
                        aria-hidden="true"
                        className="flex h-6 w-6 items-center justify-center rounded-full bg-cream/15 text-cream transition-transform duration-200 group-hover:translate-x-1"
                      >
                        <ArrowForwardIcon className="h-3.5 w-3.5" />
                      </span>
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

/** Interactive course catalog list with alternating left/right rows and inline quote forms. */
export default function CourseQuoteSection({
  courses,
}: {
  courses: readonly CourseOffering[];
}) {
  return (
    <div className="flex flex-col">
      {courses.map((course, index) => (
        <CourseRow key={course.id} course={course} isReversed={index % 2 === 1} />
      ))}
    </div>
  );
}
