import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import ImageViewer from "@/components/ImageViewer";
import { useHomeContent } from "@/lib/siteContentStore";

const HomeCarouselSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const { journeyImages: carouselImages } = useHomeContent();

  const activeSlide = carouselImages[activeIndex % Math.max(carouselImages.length, 1)];

  useEffect(() => {
    if (carouselImages.length < 2) return;
    const timer = setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % carouselImages.length);
    }, 4500);
    return () => clearTimeout(timer);
  }, [activeIndex, carouselImages.length]);

  // Keep the index in range if the admin removes images
  useEffect(() => {
    if (activeIndex >= carouselImages.length) setActiveIndex(0);
  }, [activeIndex, carouselImages.length]);

  if (!activeSlide) return null;

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % carouselImages.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const lightboxNext = () => {
    setLightboxIndex((prev) => (prev === null ? null : (prev + 1) % carouselImages.length));
  };

  const lightboxPrev = () => {
    setLightboxIndex((prev) =>
      prev === null ? null : (prev - 1 + carouselImages.length) % carouselImages.length
    );
  };

  return (
    <section className="section-padding pt-10">
      <div className="container mx-auto max-w-5xl space-y-8">
        <div>
          <p className="text-primary text-xs uppercase tracking-[0.3em] font-semibold mb-2">Moments</p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold">
            What the Journey Looks Like
          </h2>
          <p className="text-muted-foreground max-w-3xl">
            We capture learning, experimentation, and celebration across chapters. Tap any image to
            see the full story.
          </p>
        </div>
      </div>

      <div className="mt-6 md:mt-8 w-full border-y border-border bg-card shadow-lg">
        <div className="relative mx-auto w-full max-w-none overflow-hidden">
          <div className="relative w-full bg-background h-[clamp(360px,64vh,780px)]">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeSlide.src}
                src={activeSlide.src}
                alt={activeSlide.alt}
                className="absolute inset-0 h-full w-full cursor-pointer object-contain"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.6 }}
                onClick={() => openLightbox(activeIndex % carouselImages.length)}
              />
            </AnimatePresence>
          </div>

          <button
            aria-label="Previous carousel image"
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-border bg-background/70 p-2 shadow-lg backdrop-blur focus:outline-none focus-visible:ring focus-visible:ring-primary/50"
          >
            <ArrowLeft className="w-5 h-5 text-primary" />
          </button>

          <button
            aria-label="Next carousel image"
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-border bg-background/70 p-2 shadow-lg backdrop-blur focus:outline-none focus-visible:ring focus-visible:ring-primary/50"
          >
            <ArrowRight className="w-5 h-5 text-primary" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <div className="md:hidden rounded-full border border-border bg-background/70 px-3 py-1 text-[11px] font-semibold text-foreground backdrop-blur">
              {(activeIndex % carouselImages.length) + 1} / {carouselImages.length}
            </div>
            <div className="hidden md:flex max-w-[90vw] items-center gap-2 overflow-x-auto px-2">
              {carouselImages.map((_, index) => (
                <span
                  key={index}
                  className={`h-2 w-8 shrink-0 rounded-full transition-all ${
                    index === activeIndex % carouselImages.length ? "bg-primary" : "bg-border/80"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <ImageViewer
        images={carouselImages}
        currentIndex={lightboxIndex}
        onClose={closeLightbox}
        onNext={lightboxNext}
        onPrev={lightboxPrev}
      />
    </section>
  );
};

export default HomeCarouselSection;
