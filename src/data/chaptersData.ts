import vedPortrait from "@/assets/ved-portrait.jpg";
import virPortrait from "@/assets/vir-portrait.jpg";
import aravPortrait from "@/assets/arav-portrait-real.png";
import kaavyaPortrait from "@/assets/kaavya-portrait-real.png";
import balurghatVideoPoster from "@/assets/balurghat-video-poster.jpg";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GalleryImageItem {
  src: string;
  alt: string;
  caption?: string;
}

export interface ChapterVideo {
  id: string;
  title: string;
  description: string;
  /** Video source URL. Empty string signals a placeholder. */
  src: string;
  /** Poster / thumbnail URL */
  poster?: string;
  duration: string;
}

export interface ChapterAward {
  id: string;
  title: string;
  organization: string;
  year: string;
}

export interface ChapterSections {
  about: boolean;
  chapterStory: boolean;
  videoRow1: boolean;
  videoRow2: boolean;
  gallery: boolean;
  events: boolean;
  awards: boolean;
}

export interface ChapterLead {
  name: string;
  title?: string;
  bio: string[];
  image?: string;
}

export interface ChapterData {
  id: string;
  name: string;
  region: string;
  tagline: string;
  description: string[];
  lead: ChapterLead | null;
  leads?: ChapterLead[];
  stats: { label: string; value: string }[];
  featuredVideo: ChapterVideo;
  videoRow1: { sectionTitle: string; videos: ChapterVideo[] };
  videoRow2: { sectionTitle: string; videos: ChapterVideo[] };
  gallery: { sectionTitle: string; images: GalleryImageItem[] };
  awards: ChapterAward[];
  sections: ChapterSections;
}

// ─── Default data ─────────────────────────────────────────────────────────────

export const defaultChapters: ChapterData[] = [
  // ── Balurghat ────────────────────────────────────────────────────────────────
  {
    id: "balurghat",
    name: "West Bengal",
    region: "",
    tagline: "Bringing robotics to every classroom in West Bengal",
    description: [
      "Following the success of Project Zūl in Jammu & Kashmir, the Balurghat chapter is expanding practical robotics learning to West Bengal. The Balurghat chapter brings hands-on robotics learning to local schools through Arduino-based workshops. Students learn electronics, coding, and problem-solving while building projects that address real challenges in their communities.",
      "The program is designed to be self-sustaining. Teachers are trained, schools receive robotics kits, and structured lesson plans help them continue the program independently.",
      "So far, the initiative has reached 600+ students across 6 schools, trained 25+ teachers, and donated 40 Arduino kits, enabling schools to continue robotics education beyond the initial workshops.",
    ],
    lead: {
      name: "Kaavya Majumder",
      bio: [
        "Kaavya is a student from Mumbai interested in how technology, sustainability, and systems thinking intersect to solve real-world problems. Her work ranges from building platforms for sustainable lifestyle and community like Climate Crusaders, to developing a device designed to monitor groundwater levels.",
        "Her academic interests focus on modelling complex systems and networks — understanding how ideas, behaviors, and environmental changes spread through interconnected systems.",
        "Through Project Zūl, Kaavya hopes to inspire students to see technology not just as something they study, but as a tool they can use to solve problems in their own communities.",
      ],
    },
    stats: [
      { label: "Students", value: "600+" },
      { label: "Schools", value: "6" },
      { label: "Teachers", value: "25+" },
      { label: "Arduino Kits", value: "40" },
    ],
    featuredVideo: {
      id: "bv-featured",
      title: "Chapter Story — Balurghat",
      description: "Meet the students, mentors, and teachers who made Balurghat their own lab.",
      src: "https://video.wixstatic.com/video/02b2cd_efe7c821083141f696802d27560260e2/1080p/mp4/file.mp4",
      poster: balurghatVideoPoster,
      duration: "3:45",
    },
    videoRow1: {
      sectionTitle: "Impact Reels",
      videos: [
        {
          id: "bv1", title: "Workshop Day 1", description: "First hands-on Arduino session with students.", src: "", duration: "1:20",
        },
        {
          id: "bv2", title: "Sensor Lab", description: "Students build light and temperature sensors.", src: "", duration: "2:05",
        },
        {
          id: "bv3", title: "Final Showcase", description: "Community showcase of student-built robots.", src: "", duration: "1:45",
        },
        {
          id: "bv4", title: "Teacher Training", description: "Training 25+ teachers to run the program independently.", src: "", duration: "2:30",
        },
      ],
    },
    videoRow2: {
      sectionTitle: "Community Stories",
      videos: [
        {
          id: "bv5", title: "Kit Distribution", description: "Distributing 40 Arduino kits to local schools.", src: "", duration: "1:55",
        },
        {
          id: "bv6", title: "Parents Speak", description: "Families share how the program changed their children.", src: "", duration: "2:15",
        },
        {
          id: "bv7", title: "Student Projects", description: "Students present their homegrown solutions.", src: "", duration: "1:30",
        },
      ],
    },
    gallery: {
      sectionTitle: "Field Notes from Balurghat",
      images: [],
    },
    awards: [
      // { id: "ba1", title: "Best Chapter Initiative", year: "2024", organization: "Project Zūl National" },
      // { id: "ba2", title: "Youth STEM Outreach Award", year: "2023", organization: "West Bengal Govt." },
      { id: "ba3", title: "Letter of Appreciation for Project Zūl Balurghat Chapter", year: "2025", organization: "Sukanta Majumdar, Union Minister of State for Education and DoNER" },
    ],
    sections: {
      about: true,
      chapterStory: true,
      videoRow1: true,
      videoRow2: true,
      gallery: true,
      events: true,
      awards: true,
    },
  },

  // ── Haryana ──────────────────────────────────────────────────────────────────
  {
    id: "haryana",
    name: "Haryana",
    region: "",
    tagline: "Green fields, greener futures — robotics meets sustainability",
    description: [
      "<b>Taking robotics from classrooms to village labs</b>",
      " In Haryana, Project Zūl has worked in partnership with Indigo Knowledge Prism Foundation (IKP) to bring hands-on STEM learning to students across different learning environments.",
      "The chapter began with online training for teachers, introducing them to Project Zūl's robotics curriculum and preparing them to conduct activities with their own students. These teachers then took the learning into the classroom across 6 schools, guiding students through robotics and electronics before the Project Zūl team visited the school for an interactive hands-on session.",
      "The journey extended beyond the traditional classroom to two Village Research Labs established by IKP in rural Haryana. Here, Project Zūl introduced students to the fundamentals of circuits, electronics and robotics through practical activities designed to encourage experimentation, problem-solving and curiosity.",
      "From training teachers remotely to building circuits with students in village labs, the Haryana chapter reflects Project Zūl's larger goal: making hands-on STEM learning accessible wherever students learn.",
    ],
    lead: {
      name: "Kaavya Majumder",
      title: "Project Lead & Chapter Head",
      bio: [
        "Kaavya leads Project Zūl's programmes in Haryana, playing a key role in building its partnership with IKP and planning its activities, engagements and expansion into schools and village learning spaces. She has travelled to remote parts of Haryana to lead sessions, while working closely with teachers and students to gather feedback and use those insights to continually refine the curriculum and future sessions.",
      ],
      image: kaavyaPortrait,
    },
    leads: [
      {
        name: "Ved Hariharan",
        title: "Chapter Head",
        bio: [
          "Ved helps implement Project Zūl's Haryana chapter, from training teachers through online sessions to travelling to remote schools and village labs for hands-on workshops. He focuses on making sessions interactive and accessible, using games and challenges to help students learn robotics through experimentation.",
        ],
        image: vedPortrait,
      },
      {
        name: "Vir Hariharan",
        title: "Chapter Head",
        bio: [
          "Vir works across Project Zūl's Haryana chapter, conducting teacher training and taking hands-on robotics sessions in schools and village labs across the state. He enjoys finding creative, gamified ways to turn circuits and robotics into experiences that keep students curious, involved and eager to build for themselves.",
        ],
        image: virPortrait,
      },
    ],
    stats: [
      { label: "Schools", value: "7" },
      { label: "Students", value: "3060+" },
      { label: "Teachers", value: "10" },
      { label: "Kits Donated", value: "40" },
    ],
    featuredVideo: {
      id: "hv-featured",
      title: "Chapter Story — Haryana",
      description: "A journey through Haryana's sustainable revolution — from wheat fields to student-built robots.",
      src: "",
      duration: "4:32",
    },
    videoRow1: {
      sectionTitle: "Impact Reels",
      videos: [
        { id: "hv1", title: "Solar Fields", description: "How Haryana students are building solar-powered irrigation monitors.", src: "", duration: "1:20" },
        { id: "hv2", title: "Water Harvest", description: "Rainwater monitoring projects built by students across rural Haryana.", src: "", duration: "2:05" },
        { id: "hv3", title: "Tree Drive", description: "School students planting and tracking 10,000 trees using Arduino sensors.", src: "", duration: "1:45" },
        { id: "hv4", title: "Eco Markets", description: "Zero-waste market monitoring systems built by student teams.", src: "", duration: "2:30" },
      ],
    },
    videoRow2: {
      sectionTitle: "Community Stories",
      videos: [
        { id: "hv5", title: "Clean Air Lab", description: "Air quality monitoring programs in Gurugram schools.", src: "", duration: "1:55" },
        { id: "hv6", title: "Soil Sensors", description: "Organic farming initiatives using student-built soil monitors.", src: "", duration: "2:15" },
        { id: "hv7", title: "Youth Innovators", description: "Meet the student eco-champions changing Haryana's future.", src: "", duration: "1:30" },
        { id: "hv8", title: "Wind Turbine Lab", description: "Mini wind energy experiments at rural Haryana schools.", src: "", duration: "3:00" },
      ],
    },
    gallery: {
      sectionTitle: "Field Notes from Haryana",
      images: [],
    },
    awards: [
      //{ id: "ha1", title: "Best Green Chapter Award", year: "2024", organization: "Project Zūl National" },
      //{ id: "ha2", title: "State STEM Initiative Award", year: "2023", organization: "Haryana Govt." },
    ],
    sections: {
      about: true,
      chapterStory: true,
      videoRow1: true,
      videoRow2: true,
      gallery: true,
      events: true,
      awards: true,
    },
  },

  // ── Kashmir ──────────────────────────────────────────────────────────────────
  {
    id: "kashmir",
    name: "Kashmir",
    region: "Jammu & Kashmir",
    tagline: "The Founding Chapter",
    description: [
      "Project Zūl began where it had to, in the valley my family was forced to leave, and where students like me might have been, had history unfolded differently. Growing up hearing stories of displacement, I became acutely aware of how geography and circumstance determine access. The inequity was not abstract, it was personal.",
      "That awareness brought me back to Kashmir, not to reclaim what was lost, but to build something in its place. I recognised that students in the region's government schools were capable and curious, yet systematically shut out of the kind of practical, technology-driven education that students in urban centres take for granted. Project Zūl was my attempt to close that distance.",
      "The J&K chapter introduced hands-on robotics education to government schools across Jammu through Arduino-based workshops designed specifically for low-resource settings. Students engaged with circuits, coding, and applied problem-solving, constructing projects like soil moisture alarms, temperature-sensitive lights, and obstacle-detection systems that addressed real challenges within their own communities.",
      "The program was built for continuity. Science teachers were trained through low-bandwidth online modules and structured live walkthroughs. Schools received custom robotics kits alongside bilingual lesson plans in Hindi and English, equipping educators to sustain the program independently, well beyond the initial rollout.",
      "Inclusion remained central to the initiative's design. Approximately 42% of participants were girls, many of whom had previously had no access to technology-based instruction. Internal assessments recorded an average learning gain of 41% in scientific understanding, and over 90% of students successfully completed functional builds on their own.",
      "To date, the J&K chapter has reached 1,000+ students across 15+ government schools, trained 15+ teachers, and distributed 500+ custom STEM kits, all provided free of cost.",
    ],
    lead: {
      name: "Arav Kaul",
      title: "Founder",
      bio: [
        "Arav is an incoming Electrical and Computer Engineering freshman at Duke from Mumbai, interested in how computer vision, robotics, and applied machine learning come together to solve real-world problems. His work ranges from building the MPact Glove, a sensor-driven boxing training glove that measures punch force, velocity, and technique in real time to developing Project Pivot, a computer vision app that delivers personalized coaching feedback to boxers without access to formal training, to engineering perception pipelines for India's first biomimetic humanoid robot at Jio Tesseract. At his core, Arav is someone who gets restless until an idea becomes something you can actually hold or use.",
      ],
      image: aravPortrait,
    },
    stats: [
      { label: "Students", value: "1,000+" },
      { label: "Schools", value: "15+" },
      { label: "Teachers Trained", value: "15+" },
      { label: "STEM Kits Distributed", value: "500+" },
    ],
    featuredVideo: {
      id: "kv-featured",
      title: "Chapter Story — Kashmir",
      description: "The origin story of Project Zūl — how one classroom in J&K sparked a national movement.",
      src: "",
      duration: "5:10",
    },
    videoRow1: {
      sectionTitle: "Impact Reels",
      videos: [
        { id: "kv1", title: "First Workshop", description: "The very first robotics workshop that started it all.", src: "", duration: "2:20" },
        { id: "kv2", title: "Air Quality Monitor", description: "Students build sensors to track air quality near Dal Lake.", src: "", duration: "1:50" },
        { id: "kv3", title: "Earthquake Alert", description: "A prototype earthquake early-warning system built by 9th graders.", src: "", duration: "3:15" },
        { id: "kv4", title: "Solar Tracker", description: "Students design a solar panel orientation tracker.", src: "", duration: "2:00" },
      ],
    },
    videoRow2: {
      sectionTitle: "Community Stories",
      videos: [
        { id: "kv5", title: "Peer Mentors", description: "How older students now lead workshops for younger peers.", src: "", duration: "1:40" },
        { id: "kv6", title: "Teacher Stories", description: "Teachers reflect on three years of the program.", src: "", duration: "2:35" },
        { id: "kv7", title: "Parent Impact", description: "Families describe the change they see at home.", src: "", duration: "1:55" },
        { id: "kv8", title: "Future Builders", description: "Students share their goals after participating in Project Zūl.", src: "", duration: "2:10" },
      ],
    },
    gallery: {
      sectionTitle: "Field Notes from Kashmir",
      images: [],
    },
    awards: [
      {
        id: "ka1",
        title: "Nominated for the Pradhan Mantri Rashtriya Bal Puraskar (Child Excellence — Social Impact)",
        organization: "Government of India",
        year: "2025",
      },
      {
        id: "ka2",
        title: "Letter of Appreciation for Project Zūl",
        organization: "Manoj Sinha, Lieutenant Governor of Jammu & Kashmir",
        year: "2025",
      },
      {
        id: "ka3",
        title: "Letters of Recommendation for the Bal Puraskar Nomination",
        organization: "BJP J&K, Leader of Opposition J&K, and MLA (Jammu East), J&K Legislative Assembly",
        year: "2025",
      },
      {
        id: "ka4",
        title: "Departmental Endorsement of Project Zūl",
        organization: "J&K Dept. of School Education, Higher Education, Health & Medical Education",
        year: "2025",
      },
    ],
    sections: {
      about: true,
      chapterStory: true,
      videoRow1: true,
      videoRow2: true,
      gallery: true,
      events: true,
      awards: true,
    },
  },

  // ── Mumbai ───────────────────────────────────────────────────────────────────
  {
    id: "mumbai",
    name: "Mumbai",
    region: "",
    tagline: "Empowering Mumbai's next generation to build, not just consume",
    description: [
      "The Mumbai chapter of Project Zūl is expanding the initiative's reach into one of India's most dynamic cities. Led by two student innovators with deep roots in STEM and leadership, the chapter focuses on bridging the gap between access and opportunity — ensuring that students across Mumbai can experience hands-on robotics education.",
      "Through Arduino-based workshops, collaborative projects, and community engagement, the Mumbai chapter gives students the tools and mindset to move from passive learners to active creators. Every workshop is designed to be practical, collaborative, and tied to real challenges students see in their own communities.",
      "The chapter aspires to build a self-sustaining ecosystem of student innovators who mentor each other and inspire the next wave of change-makers in Maharashtra.",
    ],
    lead: {
      name: "Kaavya Majumder",
      title: "Project Lead",
      bio: [
        "Kaavya leads Project Zūl's programmes in Mumbai, planning its outreach and partnerships while working with chapter members, teachers and NGOs to bring hands-on robotics learning to students across different communities. She has led sessions in Dharavi and the Mumbai suburbs, helping introduce the programme, understand community needs and establish partnerships with Masoom and Gyanoday, two NGOs now working with Project Zūl.",
      ],
      image: kaavyaPortrait,
    },
    leads: [
      {
        name: "Ved Hariharan",
        title: "Chapter Lead",
        bio: [
          "Ved is a student from Mumbai with a strong interest in mathematics, technology, and problem-solving. He enjoys exploring how logical thinking and innovation can be applied to tackle real-world challenges, from competitive mathematics and computer science to community-driven initiatives.",
          "He looks for ways in which technology can be used to create practical and meaningful impact. He also enjoys sharing knowledge with others and helping students discover new ways to learn, think critically, and approach problems creatively. Alongside his passion for STEM, he is also deeply involved in leadership activities such as Student Council and collaborative student projects.",
          "Through Project Zūl, Ved hopes to encourage students to think creatively, work collaboratively, and view learning as a way to build solutions that can positively influence their communities and the future.",
        ],
        image: vedPortrait,
      },
      {
        name: "Vir Hariharan",
        title: "Chapter Lead",
        bio: [
          "Vir is a student from Mumbai whose interests lie at the intersection of robotics, mathematics, technology, and social impact. He is driven by a curiosity for how ideas evolve into practical solutions and how innovation can empower people far beyond classrooms and competitions.",
          "He enjoys not only the engineering side of things, but is equally passionate about making STEM education more engaging and accessible for students from different backgrounds. Vir believes that technology is most powerful when it inspires people to think independently and enables them to build solutions that improve the world around them.",
          "As part of Project Zūl, Vir hopes to encourage students to move from being passive consumers of technology to active creators — seeing robotics not simply as machines and coding, but as a platform for imagination, leadership, and meaningful change.",
        ],
        image: virPortrait,
      },
    ],
    stats: [
      { label: "Students", value: "200+" },
      { label: "NGOs", value: "2" },
      { label: "Workshops", value: "10+" },
      { label: "Chapter Leads", value: "2" },
    ],
    featuredVideo: {
      id: "mv-featured",
      title: "Chapter Story — Mumbai",
      description: "How two student innovators are bringing hands-on robotics education to Mumbai's classrooms.",
      src: "",
      duration: "3:30",
    },
    videoRow1: {
      sectionTitle: "Impact Reels",
      videos: [
        { id: "mv1", title: "First Workshop", description: "Launching hands-on Arduino sessions in Mumbai schools.", src: "", duration: "1:30" },
        { id: "mv2", title: "Sensor Projects", description: "Students building light and temperature sensors.", src: "", duration: "2:00" },
        { id: "mv3", title: "Student Showcase", description: "Mumbai students present their first robotics projects.", src: "", duration: "1:45" },
        { id: "mv4", title: "Coding Basics", description: "Introducing programming fundamentals through Arduino.", src: "", duration: "2:15" },
      ],
    },
    videoRow2: {
      sectionTitle: "Community Stories",
      videos: [
        { id: "mv5", title: "School Partners", description: "Schools sharing their experience with the program.", src: "", duration: "1:50" },
        { id: "mv6", title: "Teacher Voices", description: "Educators reflect on the impact of hands-on learning.", src: "", duration: "2:00" },
        { id: "mv7", title: "Future Builders", description: "Students share their goals after joining Project Zūl.", src: "", duration: "1:35" },
      ],
    },
    gallery: {
      sectionTitle: "Field Notes from Mumbai",
      images: [],
    },
    awards: [],
    sections: {
      about: true,
      chapterStory: true,
      videoRow1: true,
      videoRow2: true,
      gallery: true,
      events: true,
      awards: false,
    },
  },
];
