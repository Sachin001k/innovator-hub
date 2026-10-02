import { useState } from "react";
import { ArrowLeft, Eye, EyeOff, Trash2, Plus, Save, ExternalLink } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { AdminCard, Field, MediaField } from "@/components/admin/AdminUI";
import {
  getChapter,
  updateSections,
  updateFeaturedVideo,
  addVideo,
  removeVideo,
  addGalleryImage,
  removeGalleryImage,
  addAward,
  removeAward,
  resetChapter,
} from "@/lib/chaptersStore";
import type {
  ChapterData,
  ChapterSections,
  ChapterVideo,
  GalleryImageItem,
  ChapterAward,
} from "@/data/chaptersData";

// ─── Main page ────────────────────────────────────────────────────────────────
const ChapterAdminEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const initial = id ? getChapter(id) : undefined;

  const [chapter, setChapter] = useState<ChapterData | undefined>(initial);
  const [saved, setSaved] = useState(false);

  // Featured video form
  const [fvTitle, setFvTitle] = useState(initial?.featuredVideo.title ?? "");
  const [fvDesc, setFvDesc] = useState(initial?.featuredVideo.description ?? "");
  const [fvSrc, setFvSrc] = useState(initial?.featuredVideo.src ?? "");
  const [fvDuration, setFvDuration] = useState(initial?.featuredVideo.duration ?? "");
  const [fvPoster, setFvPoster] = useState(initial?.featuredVideo.poster ?? "");

  // Add video form
  const [showAddVideo, setShowAddVideo] = useState<1 | 2 | null>(null);
  const [newVTitle, setNewVTitle] = useState("");
  const [newVDesc, setNewVDesc] = useState("");
  const [newVSrc, setNewVSrc] = useState("");
  const [newVDuration, setNewVDuration] = useState("");
  const [newVPoster, setNewVPoster] = useState("");

  // Add image form
  const [showAddImage, setShowAddImage] = useState(false);
  const [newImgSrc, setNewImgSrc] = useState("");
  const [newImgAlt, setNewImgAlt] = useState("");
  const [newImgCaption, setNewImgCaption] = useState("");

  // Add award form
  const [showAddAward, setShowAddAward] = useState(false);
  const [newAwTitle, setNewAwTitle] = useState("");
  const [newAwOrg, setNewAwOrg] = useState("");
  const [newAwYear, setNewAwYear] = useState("2024");

  if (!chapter || !id) return <Navigate to="/admin" replace />;

  const reload = () => setChapter(getChapter(id));

  const flash = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // ── Section toggles ──────────────────────────────────────────────────────────
  const toggleSection = (key: keyof ChapterSections) => {
    const next = chapter.sections[key] === false;
    updateSections(id, { [key]: next });
    setChapter((prev) =>
      prev ? { ...prev, sections: { ...prev.sections, [key]: next } } : prev,
    );
    flash();
  };

  // ── Featured video ────────────────────────────────────────────────────────────
  const saveFeaturedVideo = () => {
    updateFeaturedVideo(id, {
      title: fvTitle,
      description: fvDesc,
      src: fvSrc,
      duration: fvDuration,
      poster: fvPoster || undefined,
    });
    reload();
    flash();
  };

  // ── Add video ─────────────────────────────────────────────────────────────────
  const handleAddVideo = (row: 1 | 2) => {
    if (!newVTitle.trim()) return;
    const video: ChapterVideo = {
      id: `v_${Date.now()}`,
      title: newVTitle.trim(),
      description: newVDesc.trim(),
      src: newVSrc.trim(),
      duration: newVDuration.trim() || "0:00",
      poster: newVPoster.trim() || undefined,
    };
    addVideo(id, row, video);
    reload();
    setNewVTitle("");
    setNewVDesc("");
    setNewVSrc("");
    setNewVDuration("");
    setNewVPoster("");
    setShowAddVideo(null);
    flash();
  };

  // ── Remove video ──────────────────────────────────────────────────────────────
  const handleRemoveVideo = (row: 1 | 2, videoId: string) => {
    if (!window.confirm("Remove this video?")) return;
    removeVideo(id, row, videoId);
    reload();
    flash();
  };

  // ── Add image ─────────────────────────────────────────────────────────────────
  const handleAddImage = () => {
    if (!newImgSrc.trim()) return;
    const image: GalleryImageItem = {
      src: newImgSrc.trim(),
      alt: newImgAlt.trim() || "Gallery photo",
      caption: newImgCaption.trim() || undefined,
    };
    addGalleryImage(id, image);
    reload();
    setNewImgSrc("");
    setNewImgAlt("");
    setNewImgCaption("");
    setShowAddImage(false);
    flash();
  };

  // ── Remove image ──────────────────────────────────────────────────────────────
  const handleRemoveImage = (src: string) => {
    if (!window.confirm("Remove this photo?")) return;
    removeGalleryImage(id, src);
    reload();
    flash();
  };

  // ── Add award ─────────────────────────────────────────────────────────────────
  const handleAddAward = () => {
    if (!newAwTitle.trim()) return;
    const award: ChapterAward = {
      id: `aw_${Date.now()}`,
      title: newAwTitle.trim(),
      organization: newAwOrg.trim() || "EcoChain",
      year: newAwYear.trim() || "2024",
    };
    addAward(id, award);
    reload();
    setNewAwTitle("");
    setNewAwOrg("");
    setNewAwYear("2024");
    setShowAddAward(false);
    flash();
  };

  // ── Remove award ──────────────────────────────────────────────────────────────
  const handleRemoveAward = (awardId: string) => {
    if (!window.confirm("Remove this award?")) return;
    removeAward(id, awardId);
    reload();
    flash();
  };

  // ── Reset to defaults ─────────────────────────────────────────────────────────
  const handleReset = () => {
    if (!window.confirm("Reset all changes for this chapter? This cannot be undone.")) return;
    resetChapter(id);
    reload();
    flash();
  };

  return (
    <PageLayout>
      {/* ── Header ── */}
      <section className="section-padding pb-6 border-b border-border">
        <div className="container mx-auto max-w-5xl space-y-5">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] font-semibold text-muted-foreground">
            <Link to="/admin" className="hover:text-primary transition-colors flex items-center gap-1.5">
              <ArrowLeft className="h-3.5 w-3.5" />
              Admin Panel
            </Link>
            <span>/</span>
            <span className="text-foreground">{chapter.name}</span>
          </div>

          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-primary font-heading text-xs tracking-[0.3em] uppercase font-semibold mb-1">
                {chapter.region}
              </p>
              <h1 className="font-heading text-3xl font-bold uppercase tracking-wider">
                {chapter.name} — Editor
              </h1>
            </div>
            <div className="flex items-center gap-3">
              {saved && (
                <span className="text-xs text-primary font-semibold animate-in fade-in">
                  ✓ Saved
                </span>
              )}
              <Link
                to={`/chapters/${id}`}
                target="_blank"
                className="flex items-center gap-1.5 border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Preview
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto max-w-5xl space-y-8">

          {/* ══ 1. SECTION VISIBILITY ══════════════════════════════════════════ */}
          <AdminCard title="Section Visibility">
            <p className="text-xs text-muted-foreground mb-4">
              Toggle which sections appear on the chapter page. Hiding a section does not delete its content.
            </p>
            <div className="divide-y divide-border">
              {(
                [
                  { key: "about", label: "About — description & chapter lead" },
                  { key: "chapterStory", label: "Chapter Story — featured video" },
                  { key: "videoRow1", label: `Impact Reels — ${chapter.videoRow1.sectionTitle}` },
                  { key: "videoRow2", label: `Community Stories — ${chapter.videoRow2.sectionTitle}` },
                  { key: "gallery", label: `Gallery — ${chapter.gallery.sectionTitle}` },
                  { key: "events", label: "Events & Initiatives (managed in Events admin)" },
                  { key: "awards", label: "Awards & Recognition" },
                ] as { key: keyof ChapterSections; label: string }[]
              ).map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="flex items-center gap-2 text-sm">
                    {chapter.sections[key] !== false ? (
                      <Eye className="h-4 w-4 text-primary shrink-0" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                    <span className={chapter.sections[key] !== false ? "text-foreground" : "text-muted-foreground"}>
                      {label}
                    </span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={chapter.sections[key] !== false}
                    onClick={() => toggleSection(key)}
                    className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors focus:outline-none focus-visible:ring focus-visible:ring-primary/50 ${
                      chapter.sections[key] !== false ? "bg-primary border-primary" : "bg-muted border-border"
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
                        chapter.sections[key] !== false ? "translate-x-4" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </AdminCard>

          {/* ══ 2. FEATURED VIDEO ════════════════════════════════════════════════ */}
          <AdminCard title="Chapter Story — Featured Video">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Title" value={fvTitle} onChange={setFvTitle} placeholder="Chapter Story — Haryana" />
              <Field label="Duration" value={fvDuration} onChange={setFvDuration} placeholder="4:32" />
              <div className="sm:col-span-2 space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Description
                </label>
                <textarea
                  value={fvDesc}
                  onChange={(e) => setFvDesc(e.target.value)}
                  placeholder="Short description of the chapter story video"
                  rows={2}
                  className="w-full border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none resize-none"
                />
              </div>
              <div className="sm:col-span-2">
                <MediaField
                  label="Video URL (MP4)"
                  value={fvSrc}
                  onChange={setFvSrc}
                  accept="video/mp4,video/*"
                  folder={`chapters/${id}`}
                  placeholder="https://example.com/video.mp4 or upload"
                />
              </div>
              <div className="sm:col-span-2">
                <MediaField
                  label="Poster / Thumbnail URL"
                  value={fvPoster}
                  onChange={setFvPoster}
                  folder={`chapters/${id}`}
                  placeholder="https://example.com/thumb.jpg or upload"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button size="sm" onClick={saveFeaturedVideo} className="flex items-center gap-2">
                <Save className="h-3.5 w-3.5" />
                Save Video
              </Button>
            </div>
          </AdminCard>

          {/* ══ 3. IMPACT REELS (Row 1) ══════════════════════════════════════════ */}
          <AdminCard title={`Impact Reels — ${chapter.videoRow1.sectionTitle}`}>
            {/* Video list */}
            <div className="space-y-2 mb-4">
              {chapter.videoRow1.videos.length === 0 && (
                <p className="text-sm text-muted-foreground italic">
                  No videos yet. Add one below.
                </p>
              )}
              {chapter.videoRow1.videos.map((v) => (
                <div
                  key={v.id}
                  className="flex items-start gap-3 border border-border bg-background p-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{v.title}</p>
                    <p className="text-xs text-muted-foreground">{v.duration}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveVideo(1, v.id)}
                    className="shrink-0 p-1 text-muted-foreground hover:text-destructive transition-colors"
                    aria-label="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add form */}
            {showAddVideo === 1 ? (
              <div className="border border-border bg-muted/20 p-4 space-y-3">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Add Video to Impact Reels
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="Title *" value={newVTitle} onChange={setNewVTitle} placeholder="Solar Fields" />
                  <Field label="Duration" value={newVDuration} onChange={setNewVDuration} placeholder="1:30" />
                  <div className="sm:col-span-2 space-y-1">
                    <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      Description
                    </label>
                    <textarea
                      value={newVDesc}
                      onChange={(e) => setNewVDesc(e.target.value)}
                      placeholder="Brief description"
                      rows={2}
                      className="w-full border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none resize-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <MediaField label="Video URL (MP4)" value={newVSrc} onChange={setNewVSrc} accept="video/mp4,video/*" folder={`chapters/${id}`} placeholder="https://... or upload (leave blank for placeholder)" />
                  </div>
                  <div className="sm:col-span-2">
                    <MediaField label="Thumbnail URL" value={newVPoster} onChange={setNewVPoster} folder={`chapters/${id}`} />
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <Button size="sm" variant="outline" onClick={() => setShowAddVideo(null)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={() => handleAddVideo(1)} disabled={!newVTitle.trim()}>
                    Add Video
                  </Button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowAddVideo(1)}
                className="flex items-center gap-2 border border-dashed border-border px-4 py-2 text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors w-full justify-center"
              >
                <Plus className="h-4 w-4" />
                Add Video
              </button>
            )}
          </AdminCard>

          {/* ══ 4. COMMUNITY STORIES (Row 2) ════════════════════════════════════ */}
          <AdminCard title={`Community Stories — ${chapter.videoRow2.sectionTitle}`}>
            <div className="space-y-2 mb-4">
              {chapter.videoRow2.videos.length === 0 && (
                <p className="text-sm text-muted-foreground italic">No videos yet. Add one below.</p>
              )}
              {chapter.videoRow2.videos.map((v) => (
                <div key={v.id} className="flex items-start gap-3 border border-border bg-background p-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{v.title}</p>
                    <p className="text-xs text-muted-foreground">{v.duration}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveVideo(2, v.id)}
                    className="shrink-0 p-1 text-muted-foreground hover:text-destructive transition-colors"
                    aria-label="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {showAddVideo === 2 ? (
              <div className="border border-border bg-muted/20 p-4 space-y-3">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Add Video to Community Stories
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="Title *" value={newVTitle} onChange={setNewVTitle} placeholder="Peer Mentors" />
                  <Field label="Duration" value={newVDuration} onChange={setNewVDuration} placeholder="1:40" />
                  <div className="sm:col-span-2 space-y-1">
                    <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      Description
                    </label>
                    <textarea
                      value={newVDesc}
                      onChange={(e) => setNewVDesc(e.target.value)}
                      placeholder="Brief description"
                      rows={2}
                      className="w-full border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none resize-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <MediaField label="Video URL (MP4)" value={newVSrc} onChange={setNewVSrc} accept="video/mp4,video/*" folder={`chapters/${id}`} placeholder="https://... or upload (leave blank for placeholder)" />
                  </div>
                  <div className="sm:col-span-2">
                    <MediaField label="Thumbnail URL" value={newVPoster} onChange={setNewVPoster} folder={`chapters/${id}`} />
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <Button size="sm" variant="outline" onClick={() => setShowAddVideo(null)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={() => handleAddVideo(2)} disabled={!newVTitle.trim()}>
                    Add Video
                  </Button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowAddVideo(2)}
                className="flex items-center gap-2 border border-dashed border-border px-4 py-2 text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors w-full justify-center"
              >
                <Plus className="h-4 w-4" />
                Add Video
              </button>
            )}
          </AdminCard>

          {/* ══ 5. PHOTO GALLERY ════════════════════════════════════════════════ */}
          <AdminCard title={`Gallery — ${chapter.gallery.sectionTitle}`}>
            {/* Image grid */}
            {chapter.gallery.images.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                {chapter.gallery.images.map((img) => (
                  <div key={img.src} className="group relative border border-border bg-muted overflow-hidden">
                    <div className="pb-[75%]" />
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(img.src)}
                      className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 bg-background/80 p-1 border border-border hover:text-destructive transition-all"
                      aria-label="Remove"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    {img.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-2 py-1">
                        <p className="text-[10px] text-white truncate">{img.caption}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic mb-4">
                No photos yet. Add image URLs below.
              </p>
            )}

            {showAddImage ? (
              <div className="border border-border bg-muted/20 p-4 space-y-3">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Add Photo
                </p>
                <MediaField label="Image URL *" value={newImgSrc} onChange={setNewImgSrc} folder={`chapters/${id}`} />
                <Field label="Alt Text" value={newImgAlt} onChange={setNewImgAlt} placeholder="Description for accessibility" />
                <Field label="Caption (optional)" value={newImgCaption} onChange={setNewImgCaption} placeholder="Tree Plantation Drive — March 2024" />
                <div className="flex gap-2 pt-1">
                  <Button size="sm" variant="outline" onClick={() => setShowAddImage(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleAddImage} disabled={!newImgSrc.trim()}>
                    Add Photo
                  </Button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowAddImage(true)}
                className="flex items-center gap-2 border border-dashed border-border px-4 py-2 text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors w-full justify-center"
              >
                <Plus className="h-4 w-4" />
                Add Photo
              </button>
            )}
          </AdminCard>

          {/* ══ 6. AWARDS ════════════════════════════════════════════════════════ */}
          <AdminCard title="Awards & Recognition">
            <div className="space-y-2 mb-4">
              {chapter.awards.length === 0 && (
                <p className="text-sm text-muted-foreground italic">No awards yet. Add one below.</p>
              )}
              {chapter.awards.map((award) => (
                <div key={award.id} className="flex items-start gap-3 border border-border bg-background p-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{award.title}</p>
                    <p className="text-xs text-muted-foreground">{award.organization} · {award.year}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveAward(award.id)}
                    className="shrink-0 p-1 text-muted-foreground hover:text-destructive transition-colors"
                    aria-label="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {showAddAward ? (
              <div className="border border-border bg-muted/20 p-4 space-y-3">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Add Award
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <Field label="Award Title *" value={newAwTitle} onChange={setNewAwTitle} placeholder="Best Green Chapter Award" />
                  </div>
                  <Field label="Organization" value={newAwOrg} onChange={setNewAwOrg} placeholder="Project Zūl National" />
                  <Field label="Year" value={newAwYear} onChange={setNewAwYear} placeholder="2024" />
                </div>
                <div className="flex gap-2 pt-1">
                  <Button size="sm" variant="outline" onClick={() => setShowAddAward(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleAddAward} disabled={!newAwTitle.trim()}>
                    Add Award
                  </Button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowAddAward(true)}
                className="flex items-center gap-2 border border-dashed border-border px-4 py-2 text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors w-full justify-center"
              >
                <Plus className="h-4 w-4" />
                Add Award
              </button>
            )}
          </AdminCard>

          {/* ══ DANGER ZONE ══════════════════════════════════════════════════════ */}
          <AdminCard title="Danger Zone">
            <p className="text-sm text-muted-foreground mb-4">
              Resetting will remove all customisations for this chapter and restore the default data.
            </p>
            <Button variant="destructive" size="sm" onClick={handleReset}>
              Reset to defaults
            </Button>
          </AdminCard>

        </div>
      </section>
    </PageLayout>
  );
};

export default ChapterAdminEditPage;
