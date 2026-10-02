import HeroSection from "@/components/HeroSection";
import VisionSection from "@/components/VisionSection";
import ImpactSection from "@/components/ImpactSection";
import QuoteSection from "@/components/QuoteSection";
import WhyMattersSection from "@/components/WhyMattersSection";
import CoreComponentsSection from "@/components/CoreComponentsSection";
import StudentProjectsSection from "@/components/StudentProjectsSection";
import FounderSection from "@/components/FounderSection";
import TestimonialSection from "@/components/TestimonialSection";
import PartnersSection from "@/components/PartnersSection";
import EventsSection from "@/components/EventsSection";
import MediaLogosSection from "@/components/MediaLogosSection";
import AwardsSection from "@/components/AwardsSection";
import CTASection from "@/components/CTASection";
import PageLayout from "@/components/PageLayout";
import HomeCarouselSection from "@/components/HomeCarouselSection";

const Index = () => (
  <PageLayout>
    <HeroSection />
    <VisionSection />
    <ImpactSection />
    <HomeCarouselSection />
    <QuoteSection />
    <WhyMattersSection />
    <CoreComponentsSection />
    <StudentProjectsSection />
    <FounderSection />
    <TestimonialSection />
    <PartnersSection />
    <EventsSection />
    <AwardsSection />
    <MediaLogosSection />
    <CTASection />
  </PageLayout>
);

export default Index;
