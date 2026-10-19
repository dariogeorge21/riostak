export type CourseItem = {
  id: string;
  slug: string;
  index_code: string;
  title: string;
  subtitle: string;
  tags: string;
  body: string;
  extended_body: string;
  format: string;
  syllabus_highlights: string[];
  youtube_url: string;
  image_src: string;
  image_alt: string;
  caption: string;
  frame_class_name?: string;
  accent_class_name?: string;
  image_class_name?: string;
  status: "published" | "draft" | "archived";
  sort_order: number;
  created_at: string;
};

export const INITIAL_SEED_COURSES: readonly CourseItem[] = [
  {
    id: "course-01",
    slug: "courses-and-learning-resources",
    index_code: "01",
    title: "Courses and Learning Resources",
    subtitle:
      "Autonomous digital modules paired with rigorous weekly faculty dialogues for enduring cognitive and somatic competency.",
    tags: "Online • Immersive Academics • Cohorts",
    body: "Structured curricula combining autonomous digital modules with rigorous weekly faculty dialogues. From foundational neuroscience to advanced contemplative practice, participants cultivate verifiable internal competencies through sustained, evidence-based inquiry.",
    extended_body:
      "Designed for universities, leadership fellowships, and dedicated learning cohorts, this curriculum bridges empirical cognitive science with structured contemplative praxis across a twelve-week semester.",
    format: "Digital Modules + Live Seminars",
    syllabus_highlights: [
      "Foundational Neuroscience & Metacognition",
      "Weekly Faculty Dialogues & Socratic Labs",
      "Somatic Regulation & Autonomic Resilience",
      "Audited Competency & Cohort Certification",
    ],
    youtube_url: "https://www.youtube.com/watch?v=inpok4MKVLM",
    image_src: "/images/offering-courses.jpg",
    image_alt: "RIOSTAK immersive cohort in session",
    caption: "Curriculum // Autumn 2026",
    frame_class_name: "bg-primary-container",
    accent_class_name: "-bottom-3 -right-3 h-2/3 w-2/3 bg-secondary-container",
    image_class_name: "",
    status: "published",
    sort_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: "course-02",
    slug: "research-and-insights",
    index_code: "02",
    title: "Research & Insights",
    subtitle:
      "Multidisciplinary empirical inquiry, longitudinal flourishing indices, and validated diagnostic instruments.",
    tags: "Multidisciplinary Empirical Inquiry • Field Trials",
    body: "Our independent lab produces peer-reviewed working papers, longitudinal flourishing indices, and validated diagnostic tools. We collaborate globally with university departments to interrogate what conditions genuinely sustain human vitality across lifespan stages.",
    extended_body:
      "Institutions and research departments can license our longitudinal measurement frameworks, commission collaborative field trials, or integrate our empirical methodology workshops into graduate seminars.",
    format: "Research Seminars & Field Kits",
    syllabus_highlights: [
      "Longitudinal Flourishing Index Licensing",
      "Validated Psychometric & Somatic Diagnostics",
      "Collaborative University Field Trial Protocols",
      "Peer-Reviewed Working Paper Seminars",
    ],
    youtube_url: "https://www.youtube.com/watch?v=O-6f5wQXSu8",
    image_src: "/images/offering-research.jpg",
    image_alt: "RIOSTAK empirical white papers and monographs",
    caption: "Open Access // Monographs",
    frame_class_name: "bg-secondary-container",
    accent_class_name: "-bottom-3 -left-3 h-2/3 w-2/3 bg-primary",
    image_class_name: "grayscale-[15%]",
    status: "published",
    sort_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: "course-03",
    slug: "educational-content-and-guidance",
    index_code: "03",
    title: "Educational Content & Guidance",
    subtitle:
      "Daily contemplative praxis, micro-learning field notes, and actionable clinical toolkits for organizations and communities.",
    tags: "Daily Praxis • Micro-Learning • Open Toolkits",
    body: "Accessible audio contemplation, daily field notes, and interactive toolkits formulated for immediate practical application. We demystify ancient wisdom and modern clinical practices into actionable, unpretentious five-minute daily practices.",
    extended_body:
      "Ideal for community organizations, educators, and civic institutions seeking turnkey audio libraries, printed field manuals, and structured daily micro-learning tracks without multi-month scheduling overhead.",
    format: "Audio Library & Field Manuals",
    syllabus_highlights: [
      "Guided Five-Minute Somatic & Audio Praxis",
      "Printable Educator & Community Field Notes",
      "Relational Safety & Conflict Repair Toolkits",
      "Turnkey Institutional Library Integration",
    ],
    youtube_url: "https://www.youtube.com/watch?v=w6T02g5hnT4",
    image_src: "/images/offering-guidance.jpg",
    image_alt: "Everyday contemplative praxis in action",
    caption: "Digital Repository // Free Access",
    frame_class_name: "bg-primary-container",
    accent_class_name: "-right-3 -top-3 h-1/2 w-1/2 bg-secondary-container",
    image_class_name: "",
    status: "published",
    sort_order: 3,
    created_at: new Date().toISOString(),
  },
];
