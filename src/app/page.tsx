import Hero from "@/components/Hero";
import LandingServices from "@/components/LandingService";
import OpeningHours from "@/components/OpeningHours";
import Testimonials from "@/components/Testimonials";
import IntroSection from "@/components/IntroSection";


export default function HomePage() {
  return (
    <>
      <Hero />
      <IntroSection />
      <OpeningHours />
      <LandingServices />
      <Testimonials />
    </>
  );
}
