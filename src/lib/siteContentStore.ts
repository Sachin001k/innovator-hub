import { useEffect, useState } from "react";
import type { GalleryImage } from "@/components/ImageViewer";
import { defaultImpactStats, defaultJourneyImages, type ImpactStat } from "@/data/homeData";
import {
  defaultPartners,
  type Partner,
  type PartnerFeedback,
  type PartnerImpactMetric,
} from "@/data/partnersData";
import { defaultEvents, type EventData } from "@/data/eventsData";
import { getAllSiteContentFromDB, saveSiteContentToDB } from "./supabase";

// Editable site content lives in the Supabase `site_content` table, one row per
// key. Each row stores only what admins changed; anything missing falls back to
// the defaults bundled in src/data.

// ─── Stored shapes ────────────────────────────────────────────────────────────

export interface HomeContent {
  impactStats?: ImpactStat[];
  journeyImages?: GalleryImage[];
}

export type PartnersContent = Record<
  string,
  { impactMetrics?: PartnerImpactMetric[]; feedback?: PartnerFeedback[] }
>;

export interface EventsContent {
  events?: EventData[];
}

interface SiteContent {
  home?: HomeContent;
  partners?: PartnersContent;
  events?: EventsContent;
}

type SiteContentKey = keyof SiteContent;

// ─── Shared cache ─────────────────────────────────────────────────────────────

let cache: SiteContent | null = null;
let pending: Promise<SiteContent> | null = null;
const listeners = new Set<() => void>();

function fetchAll(): Promise<SiteContent> {
  if (!pending) {
    pending = getAllSiteContentFromDB().then((rows) => {
      cache = rows as SiteContent;
      listeners.forEach((l) => l());
      return cache;
    });
  }
  return pending;
}

function useStored<K extends SiteContentKey>(key: K): { stored: SiteContent[K]; loaded: boolean } {
  const [, rerender] = useState(0);

  useEffect(() => {
    const listener = () => rerender((n) => n + 1);
    listeners.add(listener);
    fetchAll();
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return { stored: cache?.[key], loaded: cache !== null };
}

export async function saveSiteContent<K extends SiteContentKey>(
  key: K,
  data: NonNullable<SiteContent[K]>,
): Promise<boolean> {
  const ok = await saveSiteContentToDB(key, data);
  if (ok) {
    cache = { ...(cache ?? {}), [key]: data };
    listeners.forEach((l) => l());
  }
  return ok;
}

// ─── Resolvers (stored overrides + defaults) ──────────────────────────────────

export function resolveHome(stored?: HomeContent) {
  return {
    impactStats: stored?.impactStats ?? defaultImpactStats,
    journeyImages: stored?.journeyImages ?? defaultJourneyImages,
  };
}

export function resolvePartners(stored?: PartnersContent): Partner[] {
  return defaultPartners.map((p) => ({
    ...p,
    impactMetrics: stored?.[p.id]?.impactMetrics ?? p.impactMetrics,
    feedback: stored?.[p.id]?.feedback ?? p.feedback,
  }));
}

export function resolveEvents(stored?: EventsContent): EventData[] {
  return stored?.events ?? defaultEvents;
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useHomeContent() {
  const { stored, loaded } = useStored("home");
  return { ...resolveHome(stored), loaded };
}

export function usePartners() {
  const { stored, loaded } = useStored("partners");
  return { partners: resolvePartners(stored), loaded };
}

export function useEvents() {
  const { stored, loaded } = useStored("events");
  return { events: resolveEvents(stored), loaded };
}

/** Visible events, optionally limited to one chapter. */
export function useVisibleEvents(chapterId?: string): EventData[] {
  const { events } = useEvents();
  return events.filter((e) => e.visible && (!chapterId || e.chapterId === chapterId));
}
