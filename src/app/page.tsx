import { HeroSection } from "@/components/landing/HeroSection";
import { Header } from "@/components/landing/Header";
import { UserPanelSection } from "@/components/landing/UserPanelSection";
import { FeaturesListSection } from "@/components/landing/FeaturesListSection";
import { AdminPanelSection } from "@/components/landing/AdminPanelSection";
import { ReadyToStartSection } from "@/components/landing/ReadyToStartSection";
import { Footer } from "@/components/landing/Footer";

export default async function Home() {
  return (
    <>
      <Header />
      <main className="relative flex-1 overflow-hidden bg-background text-foreground">
        <HeroSection />
        <UserPanelSection />
        <FeaturesListSection />
        <AdminPanelSection />
        <ReadyToStartSection />
        <Footer />
      </main>
    </>
  );
}
