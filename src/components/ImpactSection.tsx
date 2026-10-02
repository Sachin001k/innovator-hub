import { motion } from "framer-motion";
import { Users, GraduationCap, School, ShieldCheck } from "lucide-react";
import { useHomeContent } from "@/lib/siteContentStore";

const icons = [Users, GraduationCap, School, ShieldCheck];


const ImpactSection = () => {
  const { impactStats } = useHomeContent();

  return (
  <section id="impact" className="py-5 md:py-8 -mt-2">
    <div className="container mx-auto max-w-5xl">
      <motion.div
        className="text-center mb-14"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Our Impact So Far</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Each number represents students introduced to practical STEM learning, teachers empowered
          to lead robotics education, and schools where curiosity for technology has begun to grow.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {impactStats.map((s, i) => {
          const Icon = icons[i % icons.length];
          return (
          <motion.div
            key={i}
            className="bg-card p-6 text-center card-glow border border-border"
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
            <p className="font-heading text-3xl md:text-4xl font-bold text-gradient-gold">{s.value}</p>
            <p className="text-foreground text-sm font-semibold mt-1">{s.label}</p>
            <p className="text-muted-foreground text-xs mt-2 leading-relaxed">{s.desc}</p>
          </motion.div>
          );
        })}
      </div>
    </div>
  </section>
  );
};

export default ImpactSection;
