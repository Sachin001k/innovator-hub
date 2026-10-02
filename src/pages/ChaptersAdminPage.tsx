import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { getChapters } from "@/lib/chaptersStore";

const ChaptersAdminPage = () => {
  const [chapters] = useState(() => getChapters());

  return (
    <PageLayout>
      {/* ── Header ── */}
      <section className="section-padding pb-8 border-b border-border">
        <div className="container mx-auto max-w-5xl space-y-6">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] font-semibold text-muted-foreground">
            <Link to="/chapters" className="hover:text-primary transition-colors flex items-center gap-1.5">
              <ArrowLeft className="h-3.5 w-3.5" />
              Chapters
            </Link>
            <span>/</span>
            <span className="text-foreground">Admin Panel</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-3"
          >
            <p className="text-primary font-heading text-xs tracking-[0.3em] uppercase font-semibold">
              Admin
            </p>
            <h1 className="font-heading text-3xl md:text-4xl font-bold uppercase tracking-wider">
              Chapter Admin Panel
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Select a chapter to edit its content, toggle section visibility, and manage
              videos, photos, and awards. Images and videos can be uploaded directly or added by URL.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Site content ── */}
      <section className="section-padding pb-0">
        <div className="container mx-auto max-w-5xl space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] font-semibold text-muted-foreground">
            Site Content
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { to: "/admin/home", title: "Home Page", desc: "Impact numbers and journey carousel photos." },
              { to: "/admin/partners", title: "Partners", desc: "Impact metrics and feedback quotes." },
              { to: "/admin/events", title: "Events", desc: "Hackathons and initiatives — show or hide." },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="group flex items-center gap-3 border border-border bg-card p-5 hover:border-primary/40 transition-colors"
              >
                <div className="flex-1 space-y-1">
                  <p className="font-heading text-lg font-bold uppercase tracking-wide">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-primary transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Chapter list ── */}
      <section className="section-padding border-b border-border">
        <div className="container mx-auto max-w-5xl space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] font-semibold text-muted-foreground">
            Select Chapter to Edit
          </p>

          {chapters.map((chapter, i) => {
            const visibleCount = Object.values(chapter.sections).filter(Boolean).length;
            const totalCount = Object.values(chapter.sections).length;
            const allVisible = visibleCount === totalCount;
            const totalVideos =
              chapter.videoRow1.videos.length + chapter.videoRow2.videos.length;

            return (
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  to={`/admin/${chapter.id}`}
                  className="group flex items-center gap-5 border border-border bg-card p-5 hover:border-primary/40 transition-colors"
                >
                  {/* Name + region */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-heading text-xl font-bold uppercase tracking-wide">
                        {chapter.name}
                      </span>
                      <span className="text-xs text-muted-foreground border border-border px-2 py-0.5 uppercase tracking-wide">
                        {chapter.region}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{chapter.tagline}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-0.5 pt-1 text-xs text-muted-foreground">
                      <span>{totalVideos} videos</span>
                      <span>{chapter.gallery.images.length} photos</span>
                      <span>{chapter.awards.length} awards</span>
                    </div>
                  </div>

                  {/* Visibility status */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div
                      className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-1 border ${
                        allVisible
                          ? "border-primary/30 text-primary bg-primary/5"
                          : "border-amber-500/30 text-amber-500 bg-amber-500/5"
                      }`}
                    >
                      {allVisible ? (
                        <Eye className="h-3.5 w-3.5" />
                      ) : (
                        <EyeOff className="h-3.5 w-3.5" />
                      )}
                      {visibleCount}/{totalCount} sections
                    </div>
                    <ArrowRight className="h-5 w-5 text-primary transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Capabilities card ── */}
      <section className="section-padding">
        <div className="container mx-auto max-w-5xl">
          <p className="text-xs uppercase tracking-[0.3em] font-semibold text-muted-foreground mb-4">
            What You Can Do
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                icon: "👁️",
                title: "Section Visibility",
                desc: "Show or hide any section on a chapter page — About, Chapter Story, Video Rows, Gallery, Events, Awards.",
              },
              {
                icon: "🎬",
                title: "Media Management",
                desc: "Add or remove videos in either reel row, manage the photo gallery, and edit featured video details.",
              },
              {
                icon: "🏆",
                title: "Awards",
                desc: "Add new awards and recognition entries, or remove outdated ones from any chapter.",
              },
            ].map((item) => (
              <div key={item.title} className="border border-border bg-card p-4 space-y-2">
                <span className="text-2xl">{item.icon}</span>
                <p className="font-heading text-sm font-bold">{item.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default ChaptersAdminPage;
