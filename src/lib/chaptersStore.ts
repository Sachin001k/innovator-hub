import {
  defaultChapters,
  type ChapterData,
  type ChapterSections,
  type ChapterVideo,
  type GalleryImageItem,
  type ChapterAward,
} from "@/data/chaptersData";
import { saveChapterData, getChapterDataFromDB, getAllChaptersFromDB } from "./supabase";

const STORAGE_KEY = "projectzul_chapters_v1";
let supabaseCache: Record<string, ChapterOverrides> | null = null;
let supabaseCacheLoaded = false;

// ─── Stored override shape ─────────────────────────────────────────────────────

interface ChapterOverrides {
  sections?: Partial<ChapterSections>;
  featuredVideo?: Partial<ChapterData["featuredVideo"]>;
  videoRow1Videos?: ChapterVideo[];
  videoRow2Videos?: ChapterVideo[];
  galleryImages?: GalleryImageItem[];
  awards?: ChapterAward[];
}

type StoredState = Record<string, ChapterOverrides>;

// ─── localStorage helpers ─────────────────────────────────────────────────────

function load(): StoredState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as StoredState;
  } catch {
    return {};
  }
}

export async function loadFromSupabase(): Promise<StoredState> {
  try {
    const dbData = await getAllChaptersFromDB();
    supabaseCache = dbData;
    supabaseCacheLoaded = true;
    console.log("[chaptersStore] Loaded from Supabase:", Object.keys(dbData).length, "chapters", dbData);
    return dbData;
  } catch (error) {
    console.error("[chaptersStore] Failed to load from Supabase, falling back to localStorage:", error);
    supabaseCacheLoaded = true;
    return load();
  }
}

function save(state: StoredState): void {
  try {
    const json = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, json);
    console.log("[chaptersStore] Saved to localStorage:", { key: STORAGE_KEY, size: json.length });

    // Also save to Supabase for each chapter
    console.log("[chaptersStore] Saving to Supabase for chapters:", Object.keys(state));
    Object.entries(state).forEach(([chapterId, overrides]) => {
      console.log(`[chaptersStore] Attempting to save ${chapterId} to Supabase`, overrides);
      saveChapterData(chapterId, overrides)
        .then(success => console.log(`[chaptersStore] Supabase save ${chapterId}: ${success}`))
        .catch(err => console.error(`[chaptersStore] Failed to save ${chapterId} to Supabase:`, err));
    });
  } catch (error) {
    console.error("[chaptersStore] Failed to save to localStorage:", error);
  }
}

// ─── Merge helpers ────────────────────────────────────────────────────────────

function merge(base: ChapterData, overrides?: ChapterOverrides): ChapterData {
  if (!overrides) return base;
  return {
    ...base,
    sections: { ...base.sections, ...(overrides.sections ?? {}) },
    featuredVideo: { ...base.featuredVideo, ...(overrides.featuredVideo ?? {}) },
    videoRow1: {
      ...base.videoRow1,
      videos: overrides.videoRow1Videos ?? base.videoRow1.videos,
    },
    videoRow2: {
      ...base.videoRow2,
      videos: overrides.videoRow2Videos ?? base.videoRow2.videos,
    },
    gallery: {
      ...base.gallery,
      images: overrides.galleryImages ?? base.gallery.images,
    },
    awards: overrides.awards ?? base.awards,
  };
}

function patch(id: string, delta: Partial<ChapterOverrides>): void {
  const state = load();
  state[id] = { ...state[id], ...delta };
  save(state);
}

// ─── Public API ────────────────────────────────────────────────────────────────

export function getChapters(): ChapterData[] {
  const overrides = load();
  return defaultChapters.map((c) => merge(c, overrides[c.id]));
}

export function getChapter(id: string): ChapterData | undefined {
  const base = defaultChapters.find((c) => c.id === id);
  if (!base) return undefined;
  const overrides = load();
  return merge(base, overrides[id]);
}

// Async versions that load from Supabase
export async function getChaptersAsync(): Promise<ChapterData[]> {
  const overrides = await loadFromSupabase();
  return defaultChapters.map((c) => merge(c, overrides[c.id]));
}

export async function getChapterAsync(id: string): Promise<ChapterData | undefined> {
  const base = defaultChapters.find((c) => c.id === id);
  if (!base) return undefined;
  const overrides = await loadFromSupabase();
  return merge(base, overrides[id]);
}

export function updateSections(id: string, delta: Partial<ChapterSections>): void {
  const state = load();
  state[id] = {
    ...state[id],
    sections: { ...(state[id]?.sections ?? {}), ...delta },
  };
  save(state);
}

export function updateFeaturedVideo(id: string, delta: Partial<ChapterVideo>): void {
  const state = load();
  state[id] = {
    ...state[id],
    featuredVideo: { ...(state[id]?.featuredVideo ?? {}), ...delta },
  };
  save(state);
}

export function addVideo(id: string, row: 1 | 2, video: ChapterVideo): void {
  const chapter = getChapter(id);
  if (!chapter) return;
  if (row === 1) {
    patch(id, { videoRow1Videos: [...chapter.videoRow1.videos, video] });
  } else {
    patch(id, { videoRow2Videos: [...chapter.videoRow2.videos, video] });
  }
}

export function removeVideo(id: string, row: 1 | 2, videoId: string): void {
  const chapter = getChapter(id);
  if (!chapter) return;
  if (row === 1) {
    patch(id, { videoRow1Videos: chapter.videoRow1.videos.filter((v) => v.id !== videoId) });
  } else {
    patch(id, { videoRow2Videos: chapter.videoRow2.videos.filter((v) => v.id !== videoId) });
  }
}

export function addGalleryImage(id: string, image: GalleryImageItem): void {
  const chapter = getChapter(id);
  if (!chapter) return;
  patch(id, { galleryImages: [...chapter.gallery.images, image] });
}

export function removeGalleryImage(id: string, src: string): void {
  const chapter = getChapter(id);
  if (!chapter) return;
  patch(id, { galleryImages: chapter.gallery.images.filter((img) => img.src !== src) });
}

export function addAward(id: string, award: ChapterAward): void {
  const chapter = getChapter(id);
  if (!chapter) return;
  patch(id, { awards: [...chapter.awards, award] });
}

export function removeAward(id: string, awardId: string): void {
  const chapter = getChapter(id);
  if (!chapter) return;
  patch(id, { awards: chapter.awards.filter((a) => a.id !== awardId) });
}

export function resetChapter(id: string): void {
  const state = load();
  delete state[id];
  save(state);
}
