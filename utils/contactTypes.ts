export const INQUIRY_TOPICS = [
  { id: "fellowships", label: "Academic Fellowship", code: "01" },
  { id: "research", label: "Research Collaboration", code: "02" },
  { id: "curricula", label: "Curricula & Licensing", code: "03" },
  { id: "press", label: "Press & Monographs", code: "04" },
  { id: "general", label: "General Inquiry", code: "05" },
] as const;

export type TopicId = (typeof INQUIRY_TOPICS)[number]["id"];

export type ContactSubmissionStatus = "new" | "reviewed" | "archived";

export type ContactSubmissionItem = {
  id: string;
  reference_id: string;
  topic_id: TopicId | string;
  topic_label: string;
  full_name: string;
  email: string;
  affiliation: string;
  role: string;
  message: string;
  status: ContactSubmissionStatus;
  admin_notes: string;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  created_at: string;
  updated_at?: string;
};

export const INITIAL_SEED_SUBMISSIONS: ContactSubmissionItem[] = [
  {
    id: "seed-sub-1",
    reference_id: "RIO-2026-4812",
    topic_id: "fellowships",
    topic_label: "Academic Fellowship",
    full_name: "Dr. Eleanor Vance",
    email: "e.vance@cambridge-cognition.edu",
    affiliation: "Department of Cognitive Sciences, Cambridge",
    role: "Principal Investigator",
    message:
      "We are interested in nominating two postdoctoral fellows for the Autumn 2026 visiting cohort on neuro-phenomenology and longitudinal autonomic regulation.",
    status: "new",
    admin_notes: "",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "seed-sub-2",
    reference_id: "RIO-2026-7390",
    topic_id: "curricula",
    topic_label: "Curricula & Licensing",
    full_name: "Prof. Marcus Thorne",
    email: "m.thorne@eth-zurich.ch",
    affiliation: "ETH Zurich — Human Factors Lab",
    role: "Faculty Director",
    message:
      "Requesting open scholarly licensing documentation to adopt the 12-week Somatic Regulation & Metacognition module across our graduate seminar series.",
    status: "reviewed",
    admin_notes: "Forwarded syllabus package and licensing rubric via HUB 02.",
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
