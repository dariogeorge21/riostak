"use client";

import { useState } from "react";
import { ArrowForwardIcon, VerifiedIcon } from "../Icons";

const INQUIRY_TOPICS = [
  { id: "fellowships", label: "Academic Fellowship", code: "01" },
  { id: "research", label: "Research Collaboration", code: "02" },
  { id: "curricula", label: "Curricula & Licensing", code: "03" },
  { id: "press", label: "Press & Monographs", code: "04" },
  { id: "general", label: "General Inquiry", code: "05" },
] as const;

type TopicId = (typeof INQUIRY_TOPICS)[number]["id"];

type FormValues = {
  fullName: string;
  email: string;
  affiliation: string;
  role: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

export default function ContactForm() {
  const [selectedTopic, setSelectedTopic] = useState<TopicId>("fellowships");
  const [values, setValues] = useState<FormValues>({
    fullName: "",
    email: "",
    affiliation: "",
    role: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    referenceId: string;
    topicLabel: string;
    email: string;
  } | null>(null);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!values.fullName.trim()) {
      newErrors.fullName = "Please provide your full legal or academic name.";
    }

    if (!values.email.trim()) {
      newErrors.email = "Institutional or professional email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!values.message.trim()) {
      newErrors.message = "Please describe the scope of your inquiry.";
    } else if (values.message.trim().length < 20) {
      newErrors.message = "Please provide at least 20 characters for your inquiry.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate verified academic dispatch
    setTimeout(() => {
      const topicObj = INQUIRY_TOPICS.find((t) => t.id === selectedTopic);
      const generatedRef = `RIO-${new Date().getFullYear()}-${Math.floor(
        1000 + Math.random() * 9000
      )}`;

      setSubmittedData({
        referenceId: generatedRef,
        topicLabel: topicObj?.label ?? "General Inquiry",
        email: values.email,
      });

      setIsSubmitting(false);
      setValues({
        fullName: "",
        email: "",
        affiliation: "",
        role: "",
        message: "",
      });
      setErrors({});
    }, 600);
  };

  if (submittedData) {
    return (
      <div className="flex flex-col justify-between border border-secondary/40 bg-surface-container-lowest p-space-xl shadow-lg">
        <div>
          <div className="mb-space-md flex items-center justify-between border-b border-primary/10 pb-space-sm">
            <div className="flex items-center gap-space-xs text-secondary">
              <VerifiedIcon className="h-5 w-5" />
              <p className="font-display text-label-xs font-bold uppercase tracking-widest">
                Inquiry Dispatched // Received
              </p>
            </div>
            <p className="font-display text-label-xs uppercase tracking-widest text-on-surface-variant">
              Ref: {submittedData.referenceId}
            </p>
          </div>

          <h3 className="mb-space-sm font-display text-headline-sm uppercase text-primary">
            Dossier Transmitted to Secretariat
          </h3>

          <p className="mb-space-lg text-body-md text-on-surface-variant">
            Thank you for connecting with the RIOSTAK Institute. Your transmission regarding{" "}
            <strong className="text-primary">{submittedData.topicLabel}</strong> has been catalogued
            under reference code <code className="bg-cream px-1.5 py-0.5 font-display text-label-xs font-bold text-primary">{submittedData.referenceId}</code>.
          </p>

          <div className="mb-space-xl flex flex-col gap-space-sm bg-cream/60 p-space-md">
            <div className="flex items-center justify-between text-body-sm">
              <span className="font-display text-label-xs uppercase tracking-wider text-on-surface-variant">
                Confirmation Route
              </span>
              <span className="font-sans font-medium text-primary">{submittedData.email}</span>
            </div>
            <div className="flex items-center justify-between text-body-sm">
              <span className="font-display text-label-xs uppercase tracking-wider text-on-surface-variant">
                Academic Review SLA
              </span>
              <span className="font-sans font-medium text-secondary">Within 48 Business Hours</span>
            </div>
          </div>
        </div>

        <button
          className="inline-flex min-h-12 items-center justify-center self-start rounded-full bg-primary px-8 font-display text-label-md font-semibold uppercase tracking-wider text-cream shadow-sm transition-all duration-200 hover:bg-secondary hover:text-on-secondary active:scale-[0.98]"
          onClick={() => setSubmittedData(null)}
          type="button"
        >
          Submit Another Inquiry
        </button>
      </div>
    );
  }

  return (
    <form
      aria-label="Institutional Inquiry Form"
      className="flex flex-col gap-space-xl border border-primary/10 bg-surface-container-lowest p-space-lg shadow-sm lg:p-space-xl"
      noValidate
      onSubmit={handleSubmit}
    >
      {/* Topic selection chips */}
      <div>
        <p className="mb-space-sm font-display text-label-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">
          01 // Select Inquiry Department
        </p>
        <div className="flex flex-wrap gap-2" role="radiogroup">
          {INQUIRY_TOPICS.map((topic) => {
            const isSelected = selectedTopic === topic.id;
            return (
              <button
                key={topic.id}
                aria-checked={isSelected}
                className={`inline-flex min-h-10 items-center gap-space-xs rounded-full px-4 py-2 font-display text-label-xs uppercase tracking-wider transition-all ${
                  isSelected
                    ? "bg-primary text-cream shadow-sm"
                    : "bg-surface-container text-on-surface-variant hover:bg-surface-variant hover:text-primary"
                }`}
                onClick={() => setSelectedTopic(topic.id)}
                role="radio"
                type="button"
              >
                <span
                  className={`font-mono text-[10px] ${
                    isSelected ? "text-gold" : "text-on-surface-variant"
                  }`}
                >
                  {topic.code}
                </span>
                <span>{topic.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Inputs grid */}
      <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2">
        {/* Full Name */}
        <div className="flex flex-col gap-1.5">
          <label
            className="font-display text-label-xs uppercase tracking-widest text-primary"
            htmlFor="fullName"
          >
            Full Name <span className="text-secondary">*</span>
          </label>
          <input
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
            aria-invalid={Boolean(errors.fullName)}
            className={`w-full rounded-xs border bg-cream/20 px-4 py-3 font-sans text-body-md text-primary placeholder:text-on-surface-variant/50 transition-all focus:border-gold focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold/30 ${
              errors.fullName ? "border-red-500" : "border-primary/20"
            }`}
            id="fullName"
            name="fullName"
            onChange={(e) => setValues({ ...values, fullName: e.target.value })}
            placeholder="Dr. Eleanor Vance"
            type="text"
            value={values.fullName}
          />
          {errors.fullName ? (
            <p className="text-[12px] text-red-600" id="fullName-error">
              {errors.fullName}
            </p>
          ) : null}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label
            className="font-display text-label-xs uppercase tracking-widest text-primary"
            htmlFor="email"
          >
            Institutional Email <span className="text-secondary">*</span>
          </label>
          <input
            aria-describedby={errors.email ? "email-error" : undefined}
            aria-invalid={Boolean(errors.email)}
            className={`w-full rounded-xs border bg-cream/20 px-4 py-3 font-sans text-body-md text-primary placeholder:text-on-surface-variant/50 transition-all focus:border-gold focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold/30 ${
              errors.email ? "border-red-500" : "border-primary/20"
            }`}
            id="email"
            name="email"
            onChange={(e) => setValues({ ...values, email: e.target.value })}
            placeholder="e.vance@riostak.org"
            type="email"
            value={values.email}
          />
          {errors.email ? (
            <p className="text-[12px] text-red-600" id="email-error">
              {errors.email}
            </p>
          ) : null}
        </div>

        {/* Organization / Institution */}
        <div className="flex flex-col gap-1.5">
          <label
            className="font-display text-label-xs uppercase tracking-widest text-primary"
            htmlFor="affiliation"
          >
            Organization / Institution
          </label>
          <input
            className="w-full rounded-xs border border-primary/20 bg-cream/20 px-4 py-3 font-sans text-body-md text-primary placeholder:text-on-surface-variant/50 transition-all focus:border-gold focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold/30"
            id="affiliation"
            name="affiliation"
            onChange={(e) => setValues({ ...values, affiliation: e.target.value })}
            placeholder="Department of Cognitive Sciences"
            type="text"
            value={values.affiliation}
          />
        </div>

        {/* Role / Title */}
        <div className="flex flex-col gap-1.5">
          <label
            className="font-display text-label-xs uppercase tracking-widest text-primary"
            htmlFor="role"
          >
            Academic / Professional Title
          </label>
          <input
            className="w-full rounded-xs border border-primary/20 bg-cream/20 px-4 py-3 font-sans text-body-md text-primary placeholder:text-on-surface-variant/50 transition-all focus:border-gold focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold/30"
            id="role"
            name="role"
            onChange={(e) => setValues({ ...values, role: e.target.value })}
            placeholder="Principal Investigator / Chancellor"
            type="text"
            value={values.role}
          />
        </div>
      </div>

      {/* Message Textarea */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label
            className="font-display text-label-xs uppercase tracking-widest text-primary"
            htmlFor="message"
          >
            Proposal or Inquiry Overview <span className="text-secondary">*</span>
          </label>
          <span className="font-mono text-[11px] text-on-surface-variant">
            {values.message.length} / 1000
          </span>
        </div>
        <textarea
          aria-describedby={errors.message ? "message-error" : undefined}
          aria-invalid={Boolean(errors.message)}
          className={`min-h-[140px] w-full resize-y rounded-xs border bg-cream/20 px-4 py-3 font-sans text-body-md text-primary placeholder:text-on-surface-variant/50 transition-all focus:border-gold focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold/30 ${
            errors.message ? "border-red-500" : "border-primary/20"
          }`}
          id="message"
          maxLength={1000}
          name="message"
          onChange={(e) => setValues({ ...values, message: e.target.value })}
          placeholder="Please describe your interest, cohort requirements, or proposed research integration..."
          value={values.message}
        />
        {errors.message ? (
          <p className="text-[12px] text-red-600" id="message-error">
            {errors.message}
          </p>
        ) : null}
      </div>

      {/* Bottom Dispatch Trigger */}
      <div className="flex flex-col items-start justify-between gap-space-md border-t border-primary/10 pt-space-md sm:flex-row sm:items-center">
        <p className="text-body-sm text-on-surface-variant">
          Transmissions are reviewed directly by the Academic Secretariat under non-disclosure terms.
        </p>

        <button
          className="group inline-flex min-h-12 w-full items-center justify-center gap-space-sm rounded-full bg-primary px-8 font-display text-label-md font-semibold uppercase tracking-wider text-cream shadow-sm transition-all duration-200 hover:bg-secondary hover:text-on-secondary disabled:opacity-50 sm:w-auto"
          disabled={isSubmitting}
          type="submit"
        >
          <span>{isSubmitting ? "Transmitting..." : "Transmit Inquiry"}</span>
          <span
            aria-hidden="true"
            className="flex h-6 w-6 items-center justify-center rounded-full bg-cream/15 text-cream transition-transform duration-200 group-hover:translate-x-1"
          >
            <ArrowForwardIcon className="h-3.5 w-3.5" />
          </span>
        </button>
      </div>
    </form>
  );
}
