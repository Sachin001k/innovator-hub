import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import {
  AddButton,
  AdminCard,
  AdminHeader,
  Field,
  IconButton,
  MediaField,
  useSaveStatus,
} from "@/components/admin/AdminUI";
import type { GalleryImage } from "@/components/ImageViewer";
import { defaultImpactStats, defaultJourneyImages, type ImpactStat } from "@/data/homeData";
import { saveSiteContent, useHomeContent } from "@/lib/siteContentStore";

const HomeAdminPage = () => {
  const content = useHomeContent();
  const { status, run } = useSaveStatus();

  const [stats, setStats] = useState<ImpactStat[]>([]);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [ready, setReady] = useState(false);

  const [newSrc, setNewSrc] = useState("");
  const [newAlt, setNewAlt] = useState("");

  // Start editing from the saved content once it has loaded
  useEffect(() => {
    if (!content.loaded || ready) return;
    setStats(content.impactStats);
    setImages(content.journeyImages);
    setReady(true);
  }, [content.loaded, content.impactStats, content.journeyImages, ready]);

  const updateStat = (i: number, delta: Partial<ImpactStat>) =>
    setStats((prev) => prev.map((s, j) => (j === i ? { ...s, ...delta } : s)));

  const moveImage = (i: number, dir: -1 | 1) =>
    setImages((prev) => {
      const next = [...prev];
      const [item] = next.splice(i, 1);
      next.splice(i + dir, 0, item);
      return next;
    });

  const addImage = () => {
    if (!newSrc.trim()) return;
    setImages((prev) => [...prev, { src: newSrc.trim(), alt: newAlt.trim() || "Project Zūl moment" }]);
    setNewSrc("");
    setNewAlt("");
  };

  const save = () =>
    run(() => saveSiteContent("home", { impactStats: stats, journeyImages: images }));

  const restoreDefaults = () => {
    if (!window.confirm("Replace the current values with the original defaults? Click Save to apply.")) return;
    setStats(defaultImpactStats);
    setImages(defaultJourneyImages);
  };

  return (
    <PageLayout>
      <AdminHeader
        title="Home Page"
        description="Update the “Our Impact So Far” numbers and the photos in “What the Journey Looks Like”. Changes go live after you click Save."
        previewTo="/"
        status={status}
        onSave={save}
        saveDisabled={!ready}
      />

      <section className="section-padding">
        <div className="container mx-auto max-w-5xl space-y-8">
          {!ready ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : (
            <>
              <AdminCard title="Our Impact So Far">
                <div className="grid md:grid-cols-2 gap-4">
                  {stats.map((stat, i) => (
                    <div key={i} className="border border-border bg-background p-4 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Number" value={stat.value} onChange={(v) => updateStat(i, { value: v })} placeholder="4645+" />
                        <Field label="Label" value={stat.label} onChange={(v) => updateStat(i, { label: v })} placeholder="Students Reached" />
                      </div>
                      <Field label="Description" value={stat.desc} onChange={(v) => updateStat(i, { desc: v })} />
                    </div>
                  ))}
                </div>
              </AdminCard>

              <AdminCard title={`What the Journey Looks Like — ${images.length} photos`}>
                {images.length === 0 && (
                  <p className="text-sm text-muted-foreground italic mb-4">
                    No photos. The section is hidden on the home page until you add one.
                  </p>
                )}
                <div className="space-y-2 mb-4">
                  {images.map((img, i) => (
                    <div key={`${img.src}-${i}`} className="flex items-center gap-3 border border-border bg-background p-2">
                      <img src={img.src} alt={img.alt} className="h-14 w-20 shrink-0 object-cover bg-muted" loading="lazy" />
                      <div className="flex-1 min-w-0">
                        <input
                          value={img.alt}
                          onChange={(e) =>
                            setImages((prev) => prev.map((m, j) => (j === i ? { ...m, alt: e.target.value } : m)))
                          }
                          className="w-full bg-transparent text-sm focus:outline-none"
                          aria-label="Image description"
                        />
                        <p className="text-[11px] text-muted-foreground truncate">{img.src}</p>
                      </div>
                      <IconButton label="Move up" onClick={() => moveImage(i, -1)} disabled={i === 0}>
                        <ArrowUp className="h-4 w-4" />
                      </IconButton>
                      <IconButton label="Move down" onClick={() => moveImage(i, 1)} disabled={i === images.length - 1}>
                        <ArrowDown className="h-4 w-4" />
                      </IconButton>
                      <IconButton label="Remove" danger onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))}>
                        <Trash2 className="h-4 w-4" />
                      </IconButton>
                    </div>
                  ))}
                </div>

                <div className="border border-border bg-muted/20 p-4 space-y-3">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Add Photo</p>
                  <MediaField label="Image *" value={newSrc} onChange={setNewSrc} folder="home" />
                  <Field label="Description" value={newAlt} onChange={setNewAlt} placeholder="Students testing circuits in Haryana" />
                  <AddButton label="Add to carousel" onClick={addImage} />
                </div>
              </AdminCard>

              <div className="flex justify-between gap-3">
                <Button variant="outline" size="sm" onClick={restoreDefaults}>
                  Restore defaults
                </Button>
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

export default HomeAdminPage;
