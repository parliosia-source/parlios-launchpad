import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import PersonaSelector from "@/components/home/PersonaSelector";
import DemoSteps from "@/components/home/DemoSteps";
import SocialProof from "@/components/home/SocialProof";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <PersonaSelector />
      <DemoSteps />
      <SocialProof />
    </Layout>
  );
};

export default Index;
