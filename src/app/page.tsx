import { HeroSection } from "@/components/landing/HeroSection";
import { Header } from "@/components/landing/Header";

export default async function Home() {
  return (
    <>
      <Header />
      <main className="relative flex-1 overflow-hidden bg-background text-foreground">
        <HeroSection />
      </main>
    </>
  );
}
