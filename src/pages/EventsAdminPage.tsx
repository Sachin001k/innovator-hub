import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, ChevronDown, ChevronUp, Eye, EyeOff, Trash2 } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import {
  AddButton,
  AdminCard,
  AdminHeader,
  Field,
  IconButton,
  MediaField,
  Switch,
  TextArea,
  useSaveStatus,
} from "@/components/admin/AdminUI";
import { defaultChapters } from "@/data/chaptersData";
import type { EventData, EventMedia } from "@/data/eventsData";
import { saveSiteContent, useEvents } from "@/lib/siteContentStore";

const selectClass =
  "w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none";
const labelClass = "block text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground";

const newEvent = (): EventData => ({
  id: `ev_${Date.now()}`,
  chapterId: defaultChapters[0].id,
  visible: false,
  title: "New Event",
  location: "",
  date: "",
  partner: "",
  role: "Organiser & Principal Sponsor",
  summary: "",
  description: [],
  heroImage: "",
  stats: [
    { value: "", label: "Schools" },
    { value: "", label: "Students" },
    { value: "", label: "Teams" },
    { value: "", label: "Projects built" },
  ],
  media: [],
});

// ─── One event editor ─────────────────────────────────────────────────────────
function EventEditor({
  event,
  onChange,
  onDelete,
}: {
  event: EventData;
  onChange: (e: EventData) => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(!event.title || event.title === "New Event");
  const set = (delta: Partial<EventData>) => onChange({ ...event, ...delta });
  const setMedia = (i: number, delta: Partial<EventMedia>) =>
    set({ media: event.media.map((m, j) => (j === i ? { ...m, ...delta } : m)) });
  const moveMedia = (i: number, dir: -1 | 1) => {
    const next = [...event.media];
    const [item] = next.splice(i, 1);
    next.splice(i + dir, 0, item);
    set({ media: next });
  };
  const folder = `events/${event.id}`;
  const chapterName = defaultChapters.find((c) => c.id === event.chapterId)?.name ?? event.chapterId;

  return (
    <div className="border border-border bg-card">
      {/* Summary row */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-border bg-muted/30">
        {event.visible ? (
          <Eye className="h-4 w-4 text-primary shrink-0" />
        ) : (
          <EyeOff className="h-4 w-4 text-muted-foreground shrink-0" />
        )}
        <button type="button" onClick={() => setOpen((o) => !o)} className="flex-1 min-w-0 text-left">
          <p className="text-sm font-bold truncate">{event.title || "Untitled event"}</p>
          <p className="text-xs text-muted-foreground">
            {chapterName} · {event.date || "No date"} · {event.visible ? "Visible" : "Hidden"}
          </p>
        </button>
        <Switch checked={event.visible} onChange={(v) => set({ visible: v })} label="Show this event" />
        <IconButton label={open ? "Collapse" : "Expand"} onClick={() => setOpen((o) => !o)}>
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </IconButton>
      </div>

      {open && (
        <div className="p-5 space-y-6">
          {/* Basics */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Field label="Event Name" value={event.title} onChange={(v) => set({ title: v })} placeholder="Project Zūl Haryana Hackathon" />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Chapter Page</label>
              <select value={event.chapterId} onChange={(e) => set({ chapterId: e.target.value })} className={selectClass}>
                {defaultChapters.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <Field label="Location" value={event.location} onChange={(v) => set({ location: v })} placeholder="Haryana" />
            <Field label="Date" value={event.date} onChange={(v) => set({ date: v })} placeholder="December 2027" />
            <Field label="Partner / NGO" value={event.partner} onChange={(v) => set({ partner: v })} placeholder="Indigo Knowledge Prism Foundation (IKP)" />
            <div className="sm:col-span-2">
              <Field label="Project Zūl's Role" value={event.role} onChange={(v) => set({ role: v })} placeholder="Organiser & Principal Sponsor" />
            </div>
            <div className="sm:col-span-2">
              <MediaField label="Hero Image" value={event.heroImage} onChange={(v) => set({ heroImage: v })} folder={folder} />
            </div>
            <div className="sm:col-span-2">
              <TextArea
                label="Short description (home page card)"
                value={event.summary}
                onChange={(v) => set({ summary: v })}
                rows={2}
              />
            </div>
            <div className="sm:col-span-2">
              <TextArea
                label="Event description (chapter page). Leave a blank line between paragraphs"
                value={event.description.join("\n\n")}
                onChange={(v) => set({ description: v.split(/\n\s*\n/) })}
                rows={6}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-3 border-t border-border pt-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Impact Cards</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {event.stats.map((stat, i) => (
                <div key={i} className="flex items-end gap-2 border border-border bg-background p-3">
                  <div className="w-24 shrink-0">
                    <Field
                      label="Number"
                      value={stat.value}
                      onChange={(v) => set({ stats: event.stats.map((s, j) => (j === i ? { ...s, value: v } : s)) })}
                    />
                  </div>
                  <div className="flex-1">
                    <Field
                      label="Label"
                      value={stat.label}
                      onChange={(v) => set({ stats: event.stats.map((s, j) => (j === i ? { ...s, label: v } : s)) })}
                    />
                  </div>
                  <div className="pb-2">
                    <IconButton label="Remove" danger onClick={() => set({ stats: event.stats.filter((_, j) => j !== i) })}>
                      <Trash2 className="h-4 w-4" />
                    </IconButton>
                  </div>
                </div>
              ))}
            </div>
            <AddButton label="Add impact card" onClick={() => set({ stats: [...event.stats, { value: "", label: "" }] })} />
          </div>

          {/* Media */}
          <div className="space-y-3 border-t border-border pt-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">From the Event — Photos &amp; Videos</p>
            {event.media.length === 0 && (
              <p className="text-sm text-muted-foreground italic">No photos or videos yet.</p>
            )}
            {event.media.map((item, i) => (
              <div key={item.id} className="border border-border bg-background p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <select
                    value={item.type}
                    onChange={(e) => setMedia(i, { type: e.target.value as EventMedia["type"] })}
                    className="w-28 shrink-0 border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                    aria-label="Media type"
                  >
                    <option value="image">Photo</option>
                    <option value="video">Video</option>
                  </select>
                  <div className="flex-1 min-w-0">
                    <input
                      value={item.caption}
                      onChange={(e) => setMedia(i, { caption: e.target.value })}
                      placeholder="Short caption"
                      className={selectClass}
                      aria-label="Caption"
                    />
                  </div>
                  <IconButton label="Move up" onClick={() => moveMedia(i, -1)} disabled={i === 0}>
                    <ArrowUp className="h-4 w-4" />
                  </IconButton>
                  <IconButton label="Move down" onClick={() => moveMedia(i, 1)} disabled={i === event.media.length - 1}>
                    <ArrowDown className="h-4 w-4" />
                  </IconButton>
                  <IconButton label="Remove" danger onClick={() => set({ media: event.media.filter((_, j) => j !== i) })}>
                    <Trash2 className="h-4 w-4" />
                  </IconButton>
                </div>
                {item.type === "image" ? (
                  <MediaField label="Photo" value={item.src} onChange={(v) => setMedia(i, { src: v })} folder={folder} />
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3">
                    <MediaField
                      label="Video (MP4)"
                      value={item.src}
                      onChange={(v) => setMedia(i, { src: v })}
                      accept="video/mp4,video/*"
                      folder={folder}
                    />
                    <MediaField label="Thumbnail" value={item.poster ?? ""} onChange={(v) => setMedia(i, { poster: v || undefined })} folder={folder} />
                  </div>
                )}
              </div>
            ))}
            <div className="grid sm:grid-cols-2 gap-3">
              <AddButton
                label="Add photo"
                onClick={() => set({ media: [...event.media, { id: `m_${Date.now()}`, type: "image", src: "", caption: "" }] })}
              />
              <AddButton
                label="Add video"
                onClick={() => set({ media: [...event.media, { id: `m_${Date.now()}`, type: "video", src: "", caption: "" }] })}
              />
            </div>
          </div>

          <div className="border-t border-border pt-5">
            <Button variant="destructive" size="sm" onClick={onDelete}>
              Delete event
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
const EventsAdminPage = () => {
  const { events: loadedEvents, loaded } = useEvents();
  const { status, run } = useSaveStatus();

  const [events, setEvents] = useState<EventData[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!loaded || ready) return;
    setEvents(loadedEvents);
    setReady(true);
  }, [loaded, loadedEvents, ready]);

  const save = () =>
    run(() =>
      saveSiteContent("events", {
        events: events.map((e) => ({
          ...e,
          description: e.description.map((p) => p.trim()).filter(Boolean),
          media: e.media.filter((m) => m.src.trim()),
        })),
      }),
    );

  const visibleCount = events.filter((e) => e.visible).length;

  return (
    <PageLayout>
      <AdminHeader
        title="Events"
        description="Events appear in “Beyond the Classroom” on the home page and in the Events & Initiatives section of their chapter page. Only events switched on are shown; with none switched on, both sections are hidden."
        previewTo="/"
        status={status}
        onSave={save}
        saveDisabled={!ready}
      />

      <section className="section-padding">
        <div className="container mx-auto max-w-5xl space-y-6">
          {!ready ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : (
            <>
              <AdminCard title={`${events.length} events · ${visibleCount} visible`}>
                <p className="text-sm text-muted-foreground">
                  Use the switch on each event to show or hide it. Photos and videos without a file are skipped when saving.
                </p>
              </AdminCard>

              {events.map((event, i) => (
                <EventEditor
                  key={event.id}
                  event={event}
                  onChange={(e) => setEvents((prev) => prev.map((x, j) => (j === i ? e : x)))}
                  onDelete={() => {
                    if (!window.confirm(`Delete “${event.title}”? Click Save to apply.`)) return;
                    setEvents((prev) => prev.filter((_, j) => j !== i));
                  }}
                />
              ))}

              <AddButton label="Add event" onClick={() => setEvents((prev) => [...prev, newEvent()])} />

              <div className="flex justify-end">
                <Button size="sm" onClick={save} disabled={status === "saving"}>
                  Save Changes
                </Button>
              </div>
            </>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default EventsAdminPage;
