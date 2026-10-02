// ─── Types ────────────────────────────────────────────────────────────────────

export interface EventStat {
  value: string;
  label: string;
}

export interface EventMedia {
  id: string;
  type: "image" | "video";
  /** Image URL, or MP4 URL for videos. */
  src: string;
  /** Thumbnail for videos. */
  poster?: string;
  /** Very short caption / tagline shown on the card. */
  caption: string;
}

export interface EventData {
  id: string;
  /** Chapter page this event is showcased on (e.g. "haryana"). */
  chapterId: string;
  /** Hidden events are not shown on the home page or chapter page. */
  visible: boolean;
  title: string;
  location: string;
  date: string;
  /** Implementation partner / NGO, shown as "In partnership with …". */
  partner: string;
  /** Project Zūl's role, e.g. "Organiser & Principal Sponsor". */
  role: string;
  /** Short description for the home page card. */
  summary: string;
  /** Fuller account for the chapter page, one entry per paragraph. */
  description: string[];
  heroImage: string;
  stats: EventStat[];
  media: EventMedia[];
}

// ─── Default data ─────────────────────────────────────────────────────────────

export const defaultEvents: EventData[] = [
  {
    id: "haryana-hackathon",
    chapterId: "haryana",
    visible: false,
    title: "Project Zūl Haryana Hackathon",
    location: "Haryana",
    date: "December 2027",
    partner: "Indigo Knowledge Prism Foundation (IKP)",
    role: "Organiser & Principal Sponsor",
    summary:
      "Students from 10 schools across Haryana came together to turn ideas into solutions through a day of building, problem-solving and collaboration.",
    description: [
      "Project Zūl organised the Haryana Hackathon in partnership with Indigo Knowledge Prism Foundation (IKP), bringing together students from 10 schools across the state to put their robotics and electronics learning into action.",
      "Working in teams, students were challenged to identify real problems in their schools and communities and build working prototypes to solve them, using the circuits, sensors and coding skills developed through Project Zūl sessions.",
      "Project Zūl was the organiser and principal sponsor of the event.",
    ],
    heroImage: "",
    stats: [
      { value: "10", label: "Schools" },
      { value: "500", label: "Students" },
      { value: "10", label: "Teams" },
      { value: "8", label: "Projects built" },
    ],
    media: [],
  },
];
