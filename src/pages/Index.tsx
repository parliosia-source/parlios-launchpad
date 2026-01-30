import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import PersonaSelector from "@/components/home/PersonaSelector";
import DemoSteps from "@/components/home/DemoSteps";
import SocialProof from "@/components/home/SocialProof";
import MobileStickyCTA from "@/components/home/MobileStickyCTA";

const Index = () => {
  return (
    <Layout>
      {/* Add padding bottom on mobile for sticky CTA */}
      <div className="pb-28 md:pb-0">
        <HeroSection />
        <PersonaSelector />
        <DemoSteps />
        <SocialProof />
      </div>
      <MobileStickyCTA />
    </Layout>
  );
};

export default Index;
