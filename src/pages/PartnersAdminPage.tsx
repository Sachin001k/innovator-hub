import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import {
  AddButton,
  AdminCard,
  AdminHeader,
  Field,
  IconButton,
  TextArea,
  useSaveStatus,
} from "@/components/admin/AdminUI";
import { defaultPartners, type Partner } from "@/data/partnersData";
import { saveSiteContent, usePartners, type PartnersContent } from "@/lib/siteContentStore";

const PartnersAdminPage = () => {
  const { partners: loadedPartners, loaded } = usePartners();
  const { status, run } = useSaveStatus();

  const [partners, setPartners] = useState<Partner[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!loaded || ready) return;
    setPartners(loadedPartners);
    setReady(true);
  }, [loaded, loadedPartners, ready]);

  const updatePartner = (id: string, fn: (p: Partner) => Partner) =>
    setPartners((prev) => prev.map((p) => (p.id === id ? fn(p) : p)));

  const save = () => {
    const content: PartnersContent = {};
    partners.forEach((p) => {
      content[p.id] = { impactMetrics: p.impactMetrics, feedback: p.feedback };
    });
    return run(() => saveSiteContent("partners", content));
  };

  const restoreDefaults = () => {
    if (!window.confirm("Replace the current values with the original defaults? Click Save to apply.")) return;
    setPartners(defaultPartners);
  };

  return (
    <PageLayout>
      <AdminHeader
        title="Partners"
        description="Update each partner's Impact Metrics and Partner Feedback quotes on the Our Partners page. Changes go live after you click Save."
        previewTo="/community/partners"
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
              {partners.map((partner) => (
                <AdminCard key={partner.id} title={partner.name}>
                  <div className="space-y-6">
                    {/* Impact metrics */}
                    <div className="space-y-3">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Impact Metrics</p>
                      {partner.impactMetrics.map((metric, i) => (
                        <div key={i} className="flex items-end gap-3">
                          <div className="w-32 shrink-0">
                            <Field
                              label="Number"
                              value={metric.value}
                              onChange={(v) =>
                                updatePartner(partner.id, (p) => ({
                                  ...p,
                                  impactMetrics: p.impactMetrics.map((m, j) => (j === i ? { ...m, value: v } : m)),
                                }))
                              }
                              placeholder="3000+"
                            />
                          </div>
                          <div className="flex-1">
                            <Field
                              label="Label"
                              value={metric.label}
                              onChange={(v) =>
                                updatePartner(partner.id, (p) => ({
                                  ...p,
                                  impactMetrics: p.impactMetrics.map((m, j) => (j === i ? { ...m, label: v } : m)),
                                }))
                              }
                              placeholder="Students Reached"
                            />
                          </div>
                          <div className="pb-2">
                            <IconButton
                              label="Remove metric"
                              danger
                              onClick={() =>
                                updatePartner(partner.id, (p) => ({
                                  ...p,
                                  impactMetrics: p.impactMetrics.filter((_, j) => j !== i),
                                }))
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </IconButton>
                          </div>
                        </div>
                      ))}
                      <AddButton
                        label="Add metric"
                        onClick={() =>
                          updatePartner(partner.id, (p) => ({
                            ...p,
                            impactMetrics: [...p.impactMetrics, { label: "", value: "" }],
                          }))
                        }
                      />
                    </div>

                    {/* Feedback */}
                    <div className="space-y-3 border-t border-border pt-5">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Partner Feedback</p>
                      {partner.feedback.map((fb, i) => {
                        const setFb = (delta: Partial<typeof fb>) =>
                          updatePartner(partner.id, (p) => ({
                            ...p,
                            feedback: p.feedback.map((f, j) => (j === i ? { ...f, ...delta } : f)),
                          }));
                        return (
                          <div key={fb.id} className="border border-border bg-background p-4 space-y-3">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <TextArea label="Quote" value={fb.text} onChange={(v) => setFb({ text: v })} />
                              </div>
                              <IconButton
                                label="Remove quote"
                                danger
                                onClick={() =>
                                  updatePartner(partner.id, (p) => ({
                                    ...p,
                                    feedback: p.feedback.filter((_, j) => j !== i),
                                  }))
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </IconButton>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-3">
                              <Field label="Name" value={fb.author} onChange={(v) => setFb({ author: v })} />
                              <Field label="Role / Organisation" value={fb.role ?? ""} onChange={(v) => setFb({ role: v || undefined })} />
                            </div>
                          </div>
                        );
                      })}
                      <AddButton
                        label="Add quote"
                        onClick={() =>
                          updatePartner(partner.id, (p) => ({
                            ...p,
                            feedback: [...p.feedback, { id: `fb_${Date.now()}`, text: "", author: "" }],
                          }))
                        }
                      />
                    </div>
                  </div>
                </AdminCard>
              ))}

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

export default PartnersAdminPage;
