import { motion } from "framer-motion";
import { Quote, MapPin, ExternalLink } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import type { Partner } from "@/data/partnersData";
import { usePartners } from "@/lib/siteContentStore";

const PartnerCard = ({ partner, index }: { partner: Partner; index: number }) => (
  <motion.div
    className="border border-border bg-card"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.08 }}
  >
    {/* Header */}
    <div className="p-6 border-b border-border">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-primary border border-primary/30 px-2 py-0.5">
              {partner.type}
            </span>
            {partner.location && (
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <MapPin className="w-3 h-3" />
                {partner.location}
              </span>
            )}
          </div>
          <h3 className="font-heading text-xl font-bold mt-2">{partner.name}</h3>
          {partner.website && (
            <a
              href={partner.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              {partner.website.replace(/^https?:\/\//, "")}
            </a>
          )}
        </div>
        {partner.logo && (
          <img
            src={partner.logo}
            alt={partner.name}
            className="w-16 h-16 object-contain bg-white rounded p-1 shrink-0"
          />
        )}
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed mt-4">{partner.description}</p>
    </div>

    {/* Impact Metrics */}
    {partner.impactMetrics.length > 0 && (
      <div className="p-6 border-b border-border">
        <p className="text-[10px] uppercase tracking-[0.25em] font-semibold text-primary mb-4">
          Impact Metrics
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {partner.impactMetrics.map((metric, i) => (
            <div key={i} className="bg-background border border-border p-3 text-center">
              <p className="font-heading text-xl font-bold text-primary">{metric.value}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">
                {metric.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Feedback */}
    {partner.feedback.length > 0 && (
      <div className="p-6">
        <p className="text-[10px] uppercase tracking-[0.25em] font-semibold text-primary mb-4">
          Partner Feedback
        </p>
        <div className="space-y-4">
          {partner.feedback.map((fb) => (
            <div key={fb.id} className="bg-background border border-border p-4">
              <Quote className="w-4 h-4 text-primary mb-3 rotate-180" />
              <p className="text-sm text-foreground leading-relaxed mb-4">"{fb.text}"</p>
              <div className="w-6 h-px bg-border mb-2" />
              <p className="text-xs font-semibold text-primary uppercase tracking-wider">
                {fb.author}
              </p>
              {fb.role && (
                <p className="text-[11px] text-muted-foreground mt-0.5">{fb.role}</p>
              )}
              {fb.date && (
                <p className="text-[11px] text-muted-foreground mt-0.5">{fb.date}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    )}
  </motion.div>
);

const PartnersPage = () => {
  const { partners } = usePartners();

  return (
  <PageLayout>
    {/* Hero */}
    <section className="section-padding border-b border-border">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-primary text-xs uppercase tracking-[0.3em] font-semibold mb-3">
            Community
          </p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">Our Partners</h1>
          <p className="text-muted-foreground max-w-2xl leading-relaxed">
            Project Zūl works alongside schools, institutions, and organisations who share the belief that every student — regardless of geography — deserves access to hands-on STEM education.
          </p>
        </motion.div>
      </div>
    </section>

    {/* Partner list */}
    <section className="section-padding">
      <div className="container mx-auto max-w-5xl space-y-8">
        {partners.map((partner, i) => (
          <PartnerCard key={partner.id} partner={partner} index={i} />
        ))}
      </div>
    </section>
  </PageLayout>
  );
};

export default PartnersPage;
