import { motion } from "framer-motion";
import { PlayCircle, Trophy, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import ImageViewer, { GalleryImage } from "@/components/ImageViewer";
import VideoModal from "@/components/VideoModal";
import ChapterEventsSection from "@/components/ChapterEventsSection";
import { getChapter, getChapterAsync } from "@/lib/chaptersStore";
import { useVisibleEvents } from "@/lib/siteContentStore";
import type { ChapterData, ChapterVideo } from "@/data/chaptersData";

// ── Reel card ─────────────────────────────────────────────────────────────────
function ReelCard({
  video,
  onClick,
}: {
  video: ChapterVideo;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex w-36 shrink-0 flex-col overflow-hidden border border-border bg-muted focus:outline-none focus-visible:ring focus-visible:ring-primary/50"
      style={{ aspectRatio: "9/16" }}
      aria-label={`Play ${video.title}`}
    >
      {/* Poster or coloured bg */}
      {video.poster ? (
        <img
          src={video.poster}
          alt={video.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-muted to-muted-foreground/20" />
      )}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/30 transition-opacity duration-200 group-hover:bg-black/20" />

      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/20 backdrop-blur-sm transition-transform duration-200 group-hover:scale-110">
          <PlayCircle className="h-6 w-6 text-white" />
        </div>
      </div>

      {/* Bottom meta */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
        <p className="line-clamp-2 text-left text-xs font-semibold leading-tight text-white">
          {video.title}
        </p>
        <p className="mt-0.5 text-left text-[10px] text-white/70">{video.duration}</p>
      </div>
    </button>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
const ChapterDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [chapter, setChapter] = useState(() => (id ? getChapter(id) : undefined));
  const [activeVideo, setActiveVideo] = useState<ChapterVideo | null>(null);
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const chapterEvents = useVisibleEvents(id);

  useEffect(() => {
    if (!id) return;
    getChapterAsync(id).then(ch => setChapter(ch));
  }, [id]);

  if (!chapter) return <Navigate to="/chapters" replace />;

  const { sections } = chapter;

  // Convert to ImageViewer format
  const galleryImages: GalleryImage[] = chapter.gallery.images.map((img) => ({
    src: img.src,
    alt: img.alt,
    caption: img.caption,
  }));

  const openGallery = (i: number) => setGalleryIndex(i);
  const closeGallery = () => setGalleryIndex(null);
  const gotoNext = () =>
    setGalleryIndex((p) => (p === null ? null : (p + 1) % galleryImages.length));
  const gotoPrev = () =>
    setGalleryIndex((p) => (p === null ? null : (p - 1 + galleryImages.length) % galleryImages.length));

  return (
    <PageLayout>
      {/* ── Header / breadcrumb ── */}
      <section className="section-padding pb-8 md:pb-10 border-b border-border">
        <div className="container mx-auto max-w-5xl space-y-6">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] font-semibold text-muted-foreground">
            <Link to="/chapters" className="hover:text-primary transition-colors flex items-center gap-1.5">
              <ArrowLeft className="h-3.5 w-3.5" />
              Chapters
            </Link>
            <span>/</span>
            <span className="text-foreground">{chapter.name}</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <p className="text-primary font-heading text-xs tracking-[0.3em] uppercase font-semibold mb-2">
                  {chapter.region}
                </p>
                <h1 className="font-heading text-4xl md:text-5xl font-bold uppercase tracking-wider">
                  {chapter.name}
                </h1>
              </div>
            </div>
            <p className="text-muted-foreground italic">{chapter.tagline}</p>
          </motion.div>

          {/* Stats */}
          {chapter.stats.length > 0 && (
            <div className="flex flex-wrap gap-x-8 gap-y-3 border-t border-border pt-5">
              {chapter.stats.map((stat) => (
                <div key={stat.label}>
                  <p className="font-heading text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── About ── */}
      {sections.about && (
        <section className="section-padding pt-6 pb-8 border-b border-border">
          <div className="container mx-auto max-w-5xl space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {/* Description + optional single lead, stacked and aligned to the same column */}
              <div className="space-y-8 max-w-3xl">
                <div className="space-y-4 text-muted-foreground">
                  {chapter.description.map((para, i) => (
                    <p key={i} dangerouslySetInnerHTML={{ __html: para }}></p>
                  ))}
                </div>

                {/* Main chapter lead — shown below the story, above any other leads */}
                {chapter.lead && (
                  <div className="flex flex-col sm:flex-row gap-5 sm:gap-8 items-start border-t border-border pt-6">
                    {chapter.lead.image && (
                      <img
                        src={chapter.lead.image}
                        alt={chapter.lead.name}
                        className="w-28 h-28 object-cover object-top rounded-none shadow-lg shrink-0"
                        loading="lazy"
                      />
                    )}
                    <div className="space-y-2">
                      <h3 className="font-heading text-lg font-semibold">
                        {chapter.lead.title ?? "Chapter Lead"}: {chapter.lead.name}
                      </h3>
                      <div className="text-muted-foreground text-sm space-y-2">
                        {chapter.lead.bio.map((para, i) => (
                          <p key={i}>{para}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Multiple chapter leads — full-width two-column grid below description */}
              {chapter.leads && chapter.leads.length > 0 && (
                <div className="mt-8 pt-6 border-t border-border grid md:grid-cols-2 gap-8">
                  {chapter.leads.map((lead) => (
                    <div key={lead.name} className="flex flex-col gap-4 items-start">
                      {lead.image && (
                        <img
                          src={lead.image}
                          alt={lead.name}
                          className="w-28 h-28 object-cover object-top rounded-none shadow-lg shrink-0"
                          loading="lazy"
                        />
                      )}
                      <div className="space-y-2">
                        <h3 className="font-heading text-base font-semibold">
                          {lead.title ?? "Chapter Lead"}: {lead.name}
                        </h3>
                        <div className="text-muted-foreground text-sm space-y-2">
                          {lead.bio.map((para, i) => (
                            <p key={i}>{para}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* ── Chapter Story (featured video) ── */}
      {sections.chapterStory && (
        <section className="section-padding pt-4 border-b border-border">
          <div className="container mx-auto max-w-5xl space-y-5">
            <div className="flex items-center gap-3 text-primary text-xs uppercase tracking-[0.3em] font-semibold">
              <PlayCircle className="w-5 h-5" />
              <span>Video</span>
            </div>
            <div className="space-y-2">
              <h2 className="font-heading text-3xl font-bold">Chapter Story</h2>
              <p className="text-muted-foreground">{chapter.featuredVideo.description}</p>
            </div>

            {chapter.featuredVideo.src ? (
              <div className="aspect-video w-full overflow-hidden border border-border bg-muted">
                <video
                  className="h-full w-full"
                  controls
                  poster={chapter.featuredVideo.poster}
                  playsInline
                  preload="metadata"
                >
                  <source src={chapter.featuredVideo.src} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : (
              /* Placeholder featured video */
              <button
                type="button"
                onClick={() => setActiveVideo(chapter.featuredVideo)}
                className="group relative aspect-video w-full overflow-hidden border border-border bg-muted focus:outline-none focus-visible:ring focus-visible:ring-primary/50"
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border bg-background/60 backdrop-blur-sm transition-transform duration-200 group-hover:scale-110">
                    <PlayCircle className="h-9 w-9 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="font-heading text-sm font-bold text-foreground">
                      {chapter.featuredVideo.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {chapter.featuredVideo.duration} · Click to play
                    </p>
                  </div>
                </div>
              </button>
            )}
          </div>
        </section>
      )}

      {/* ── Video Row 1 ── */}
      {sections.videoRow1 && chapter.videoRow1.videos.length > 0 && (
        <section className="section-padding border-b border-border">
          <div className="container mx-auto max-w-5xl space-y-5">
            <div className="flex items-center gap-3 text-primary text-xs uppercase tracking-[0.3em] font-semibold">
              <PlayCircle className="w-4 h-4" />
              <span>{chapter.videoRow1.sectionTitle}</span>
            </div>
            <div
              className="flex gap-3 overflow-x-auto pb-3"
              style={{ scrollbarWidth: "thin" }}
            >
              {chapter.videoRow1.videos.map((video) => (
                <ReelCard
                  key={video.id}
                  video={video}
                  onClick={() => setActiveVideo(video)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Video Row 2 ── */}
      {sections.videoRow2 && chapter.videoRow2.videos.length > 0 && (
        <section className="section-padding border-b border-border">
          <div className="container mx-auto max-w-5xl space-y-5">
            <div className="flex items-center gap-3 text-primary text-xs uppercase tracking-[0.3em] font-semibold">
              <PlayCircle className="w-4 h-4" />
              <span>{chapter.videoRow2.sectionTitle}</span>
            </div>
            <div
              className="flex gap-3 overflow-x-auto pb-3"
              style={{ scrollbarWidth: "thin" }}
            >
              {chapter.videoRow2.videos.map((video) => (
                <ReelCard
                  key={video.id}
                  video={video}
                  onClick={() => setActiveVideo(video)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Gallery ── */}
      {sections.gallery && galleryImages.length > 0 && (
        <section className="section-padding border-b border-border">
          <div className="container mx-auto max-w-6xl space-y-6">
            <div>
              <p className="text-primary text-xs uppercase tracking-[0.3em] font-semibold mb-2">
                Photos
              </p>
              <h2 className="font-heading text-3xl font-bold">
                {chapter.gallery.sectionTitle}
              </h2>
              <p className="text-muted-foreground mt-1 max-w-2xl">
                Tap any image for a closer view.
              </p>
            </div>
            <div className="bg-blue-accent p-3 md:p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {galleryImages.map((photo, index) => (
                  <button
                    key={photo.src}
                    type="button"
                    onClick={() => openGallery(index)}
                    className="relative w-full overflow-hidden border border-border bg-background shadow-sm focus:outline-none focus-visible:ring focus-visible:ring-primary/50"
                  >
                    <div className="pb-[100%]" />
                    <motion.img
                      src={photo.src}
                      alt={photo.alt}
                      className="absolute inset-0 h-full w-full object-contain p-2"
                      loading="lazy"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <ImageViewer
            images={galleryImages}
            currentIndex={galleryIndex}
            onClose={closeGallery}
            onNext={gotoNext}
            onPrev={gotoPrev}
            showFooter={false}
          />
        </section>
      )}

      {/* ── Events & Initiatives ── */}
      {sections.events !== false && <ChapterEventsSection events={chapterEvents} />}

      {/* ── Awards ── */}
      {sections.awards && chapter.awards.length > 0 && (
        <section className="section-padding border-b border-border">
          <div className="container mx-auto max-w-5xl space-y-6">
            <div className="flex items-center gap-3 text-primary text-xs uppercase tracking-[0.3em] font-semibold">
              <Trophy className="w-4 h-4" />
              <span>Awards &amp; Recognition</span>
            </div>
            <h2 className="font-heading text-3xl font-bold -mt-3">Recognition</h2>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {chapter.awards.map((award, i) => (
                <motion.div
                  key={award.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="border border-border bg-card p-4 space-y-1"
                >
                  <p className="font-heading text-sm font-bold leading-snug">{award.title}</p>
                  <p className="text-xs text-muted-foreground">{award.organization}</p>
                  <p className="text-xs font-semibold text-primary">{award.year}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Footer nav ── */}
      <section className="section-padding">
        <div className="container mx-auto max-w-5xl">
          <Link
            to="/chapters"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            All Chapters
          </Link>
        </div>
      </section>

      {/* ── Modals ── */}
      <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
    </PageLayout>
  );
};

export default ChapterDetailPage;
