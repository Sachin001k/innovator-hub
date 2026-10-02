import type { GalleryImage } from "@/components/ImageViewer";
import wb1 from "@/assets/wb-photo-1.jpg";
import wb2 from "@/assets/wb-photo-2.jpg";
import wb3 from "@/assets/wb-photo-3.jpg";
import wb4 from "@/assets/wb-photo-4.jpg";
import kaavyaSasmo from "@/assets/kaavya-sasmo.jpg";
import homeImagesRaw from "@/assets/home_images.txt?raw";
import { parseUrlList } from "@/lib/parseUrlList";

// ─── "Our Impact So Far" ──────────────────────────────────────────────────────

export interface ImpactStat {
  value: string;
  label: string;
  desc: string;
}

export const defaultImpactStats: ImpactStat[] = [
  {
    value: "4645+",
    label: "Students Reached",
    desc: "Students introduced to hands-on robotics and electronics.",
  },
  {
    value: "61+",
    label: "Teachers Trained",
    desc: "Teachers equipped to continue STEM sessions in their schools.",
  },
  {
    value: "29+",
    label: "Schools Engaged",
    desc: "Schools where Project ZŪL workshops and programs have been conducted.",
  },
  {
    value: "100%",
    label: "Free Access",
    desc: "All kits, curriculum, and training are provided at no cost to students.",
  },
];

// ─── "What the Journey Looks Like" carousel ──────────────────────────────────

const chapterPhotoModules = import.meta.glob("/src/assets/chapters/*.{jpg,jpeg,png,webp}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const chapterCarouselImages: GalleryImage[] = Object.entries(chapterPhotoModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .slice(0, 8)
  .map(([, src], index) => ({ src, alt: `Chapter moment ${index + 1}` }));

const remoteHomeCarouselImages: GalleryImage[] = parseUrlList(homeImagesRaw).map((src, index) => ({
  src,
  alt: `Home carousel image ${index + 1}`,
}));

const fallbackCarouselImages: GalleryImage[] = [
  ...chapterCarouselImages,
  { src: wb1, alt: "Regional chapter workshop in West Bengal" },
  { src: wb2, alt: "Teacher training focused on robotics" },
  { src: wb3, alt: "Students presenting their creative robots" },
  { src: wb4, alt: "Large-scale community engagement event" },
  { src: kaavyaSasmo, alt: "Chapter lead Kaavya at SASMO conference" },
];

export const defaultJourneyImages: GalleryImage[] = remoteHomeCarouselImages.length
  ? remoteHomeCarouselImages
  : fallbackCarouselImages;
