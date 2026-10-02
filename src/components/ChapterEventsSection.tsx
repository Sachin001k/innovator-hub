import { motion } from "framer-motion";
import { CalendarDays, Image as ImageIcon, Play, Sparkles } from "lucide-react";
import { useState } from "react";
import ImageViewer, { type GalleryImage } from "@/components/ImageViewer";
import VideoModal from "@/components/VideoModal";
import type { ChapterVideo } from "@/data/chaptersData";
import type { EventData, EventMedia } from "@/data/eventsData";

// ── Media card (same 9:16 format as the chapter reels) ────────────────────────
function EventMediaCard({ item, onClick }: { item: EventMedia; onClick: () => void }) {
  const thumb = item.type === "video" ? item.poster : item.src;
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex w-40 shrink-0 flex-col overflow-hidden border border-border bg-muted focus:outline-none focus-visible:ring focus-visible:ring-primary/50"
      style={{ aspectRatio: "9/16" }}
      aria-label={item.type === "video" ? `Play ${item.caption}` : `View ${item.caption}`}
    >
      {thumb ? (
        <img
          src={thumb}
          alt={item.caption}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
      )}
      {item.type === "video" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/40 backdrop-blur-sm transition-transform duration-200 group-hover:scale-110">
            <Play className="h-4 w-4 translate-x-0.5 text-white" />
          </div>
        </div>
      )}
      {item.caption && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
          <p className="line-clamp-2 text-left text-xs font-semibold leading-tight text-white">
            {item.caption}
          </p>
        </div>
      )}
    </button>
  );
}

// ── One event ─────────────────────────────────────────────────────────────────
function EventBlock({ event }: { event: EventData }) {
  const [activeVideo, setActiveVideo] = useState<ChapterVideo | null>(null);
  const [imageIndex, setImageIndex] = useState<number | null>(null);

  const images: GalleryImage[] = event.media
    .filter((m) => m.type === "image")
    .map((m) => ({ src: m.src, alt: m.caption || event.title, caption: m.caption }));

  const openMedia = (item: EventMedia) => {
    if (item.type === "video") {
      setActiveVideo({
        id: item.id,
        title: item.caption || event.title,
        description: "",
        src: item.src,
        poster: item.poster,
        duration: "",
      });
    } else {
      setImageIndex(images.findIndex((img) => img.src === item.src));
    }
  };

  return (
    <article id={`event-${event.id}`} className="scroll-mt-24 space-y-8">
      {event.heroImage && (
        <img
          src={event.heroImage}
          alt={event.title}
          className="w-full aspect-[16/9] md:aspect-[21/9] object-cover border border-border"
          loading="lazy"
        />
      )}

      {/* Title + partner */}
      <div className="space-y-2">
        <h2 className="font-heading text-3xl font-bold">{event.title}</h2>
        {event.partner && (
          <p className="font-semibold text-foreground">In partnership with {event.partner}</p>
        )}
        <p className="flex items-center gap-1.5 text-sm italic text-muted-foreground">
          <CalendarDays className="h-4 w-4 not-italic text-primary" />
          {[event.location, event.date].filter(Boolean).join(" · ")}
        </p>
        {event.role && (
          <span className="inline-block mt-1 text-[10px] uppercase tracking-[0.25em] font-semibold text-primary border border-primary/30 px-2 py-0.5">
            Project Zūl · {event.role}
          </span>
        )}
      </div>

      {/* Description */}
      {event.description.length > 0 && (
        <div className="space-y-3 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.25em] font-semibold text-foreground">
            Event Description
          </p>
          <div className="space-y-4 text-muted-foreground">
            {event.description.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
      )}

      {/* Impact cards */}
      {event.stats.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {event.stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="border border-border bg-card p-4 text-center"
            >
              <p className="font-heading text-3xl font-bold text-primary">{stat.value}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold mt-1">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      )}

      {/* From the event */}
      {event.media.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-primary text-xs uppercase tracking-[0.3em] font-semibold">
            <ImageIcon className="w-4 h-4" />
            <span>From the Event</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-3" style={{ scrollbarWidth: "thin" }}>
            {event.media.map((item) => (
              <EventMediaCard key={item.id} item={item} onClick={() => openMedia(item)} />
            ))}
          </div>
        </div>
      )}

      <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
      <ImageViewer
        images={images}
        currentIndex={imageIndex}
        onClose={() => setImageIndex(null)}
        onNext={() => setImageIndex((p) => (p === null ? null : (p + 1) % images.length))}
        onPrev={() => setImageIndex((p) => (p === null ? null : (p - 1 + images.length) % images.length))}
      />
    </article>
  );
}

// ── Chapter page section ──────────────────────────────────────────────────────
const ChapterEventsSection = ({ events }: { events: EventData[] }) => {
  if (events.length === 0) return null;

  return (
    <section className="section-padding border-b border-border">
      <div className="container mx-auto max-w-5xl space-y-6">
        <div className="flex items-center gap-3 text-primary text-xs uppercase tracking-[0.3em] font-semibold">
          <Sparkles className="w-4 h-4" />
          <span>Beyond the Classroom / Events &amp; Initiatives</span>
        </div>
        <div className="space-y-16">
          {events.map((event) => (
            <EventBlock key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChapterEventsSection;
