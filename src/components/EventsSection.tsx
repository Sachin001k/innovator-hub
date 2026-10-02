import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useVisibleEvents } from "@/lib/siteContentStore";

/** Home page "Beyond the Classroom" section. Hidden when no events are visible. */
const EventsSection = () => {
  const events = useVisibleEvents();
  if (events.length === 0) return null;

  return (
    <section className="section-padding border-b border-border">
      <div className="container mx-auto max-w-5xl space-y-12">
        <motion.div
          className="text-center space-y-3"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-primary font-heading text-xs tracking-[0.3em] uppercase font-semibold">
            Beyond the Classroom
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold uppercase tracking-wider">
            Taking Learning Further
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Project Zūl creates opportunities for students to take what they learn beyond individual
            sessions — to collaborate, experiment, build and solve problems together. Through
            hackathons, innovation challenges and community events, students get a platform to put
            their ideas into action.
          </p>
        </motion.div>

        <div className="space-y-8">
          {events.map((event, i) => (
            <motion.article
              key={event.id}
              className="border border-border bg-card overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              {event.heroImage ? (
                <img
                  src={event.heroImage}
                  alt={event.title}
                  className="w-full aspect-[16/9] md:aspect-[21/9] object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full aspect-[16/9] md:aspect-[21/9] bg-gradient-to-br from-primary/20 to-primary/5" />
              )}

              <div className="p-6 md:p-8 space-y-4">
                <div className="space-y-2">
                  <h3 className="font-heading text-2xl md:text-3xl font-bold uppercase tracking-wide">
                    {event.title}
                  </h3>
                  <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-primary" />
                      {event.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="w-4 h-4 text-primary" />
                      {event.date}
                    </span>
                  </p>
                  {event.partner && (
                    <p className="text-sm font-semibold text-foreground">
                      In partnership with {event.partner}
                    </p>
                  )}
                </div>

                {event.summary && (
                  <p className="text-muted-foreground leading-relaxed max-w-3xl">{event.summary}</p>
                )}

                {event.stats.length > 0 && (
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-4">
                    {event.stats.map((stat, j) => (
                      <div key={j} className="flex items-baseline gap-1.5">
                        <span className="font-heading text-xl font-bold text-primary">{stat.value}</span>
                        <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground font-semibold">
                          {stat.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <Link
                  to={`/chapters/${event.chapterId}#event-${event.id}`}
                  className="group inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                  Explore the Event
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
