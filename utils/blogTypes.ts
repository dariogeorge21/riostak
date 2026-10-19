export type BlogItem = {
  id: string;
  slug: string;
  index_code: string;
  label: string;
  title: string;
  excerpt: string;
  content: string;
  author_name: string;
  author_title: string;
  reading_time: string;
  cover_image?: string | null;
  status: "published" | "draft" | "archived";
  published_at: string;
  created_at: string;
};

export const INITIAL_SEED_BLOGS: readonly BlogItem[] = [
  {
    id: "blog-01",
    slug: "neurobiology-and-contemplation",
    index_code: "01.01",
    label: "Editorial Dispatches",
    title: "Neurobiology & Contemplation",
    excerpt:
      "Monthly peer-reviewed inquiries bridging somatic neuroscience, cognitive architecture, and ethical praxis.",
    content: `## Abstract

The intersection of contemplative traditions and modern neuroscience offers profound insights into human cognitive adaptability. Through empirical fMRI and autonomic biomarkers, our research examines how focused attention practices alter neuroplasticity and emotional regulation across adult developmental stages.

### Longitudinal Findings

Our preliminary five-year longitudinal cohort indicates a measurable stabilization in heart rate variability (HRV) and sustained attentional control among subjects engaging in daily structured contemplation.

1. **Attentional Stability:** 32% reduction in cognitive distraction metrics during continuous performance tests.
2. **Somatic Resilience:** Rapid parasympathetic rebound following acute stress exposure.
3. **Relational Flourishing:** Enhanced self-reported relational safety and empathetic accuracy.`,
    author_name: "Dr. Clara Lin",
    author_title: "Senior Fellow in Cognitive Neuroscience",
    reading_time: "7 min read",
    cover_image: null,
    status: "published",
    published_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: "blog-02",
    slug: "global-laboratory-field-notes",
    index_code: "01.02",
    label: "Fellowship Essays",
    title: "Global Laboratory Field Notes",
    excerpt:
      "Direct reflections and trial notes from visiting scholars across our Cambridge, Zurich, and Singapore desks.",
    content: `## Field Notes from the Desks

Scholarly inquiry cannot remain confined to secluded libraries. Over the past academic quarter, our visiting fellows in Cambridge, Zurich, and Singapore carried diagnostic flourishing instruments into applied institutional contexts.

### Institutional Integration Observations

- **Zurich Lab:** Testing somatic reset protocols within tertiary educational faculty teams.
- **Singapore Desk:** Assessing the scalability of micro-learning toolkits across multilingual civic organizations.
- **Cambridge Center:** Establishing standardized psychometric baselines for organizational flourishing.`,
    author_name: "RIOSTAK Global Secretariat",
    author_title: "Visiting Fellowship Board",
    reading_time: "5 min read",
    cover_image: null,
    status: "published",
    published_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "blog-03",
    slug: "post-industrial-pedagogy",
    index_code: "01.03",
    label: "Monograph Series",
    title: "Post-Industrial Pedagogy",
    excerpt:
      "Extended treatises on empirical educational reform, public flourishing indices, and longitudinal ethics.",
    content: `## Monograph Overview

As industrial models of schooling face widespread exhaustion, higher education and professional academies demand a new pedagogical orientation—one rooted in contemplative depth, epistemological humility, and somatic regulation.

### Core Architectural Axioms

1. **Pedagogy as Formation, Not Information:** Learning architectures must prioritize cognitive discernment over rote assimilation.
2. **Embodied Epistemology:** Intellectual rigor flourishes when physiological state regulation is integrated into pedagogical pacing.
3. **Ethical Teleology:** Education must orient the learner toward collective flourishing rather than atomized productivity.`,
    author_name: "Prof. Alistair Vance",
    author_title: "Chair of Human Development Studies",
    reading_time: "10 min read",
    cover_image: null,
    status: "published",
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
];
