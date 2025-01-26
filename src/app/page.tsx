"use client";

import Footer from "@/components/landing-page/Footer";
import Features from "@/components/landing-page/Features";
import Hero from "@/components/landing-page/Hero";
import Nav from "@/components/landing-page/Nav";
import Pricing from "@/components/landing-page/Pricing";
import DotPattern from "@/components/ui/dot-pattern";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center gap-20 overflow-hidden bg-background">
      <Nav />
      <Hero />
      <section id="features">
        <Features />
      </section>
      <section id="pricing">
        <Pricing />
      </section>
      <footer className="w-full" id="footer">
        <Footer />
      </footer>

      <DotPattern
        width={50}
        height={50}
        cx={1}
        cy={1}
        cr={1}
        className={cn(
          "[mask-image:radial-gradient(1300px_circle_at_center,white,transparent)]",
        )}
      />
    </main>
  );
}
