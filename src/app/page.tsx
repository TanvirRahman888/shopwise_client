import { PublicLayout } from "@/components/layout/public-layout";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

import { HeroSlider } from "@/components/home/hero-slider";
import { FeaturedProducts } from "@/components/home/featured-products";

export default function HomePage() {
  return (
    <PublicLayout>
      <main>
        <HeroSlider key="home-hero-slider" />
        <FeaturedProducts />
      </main>
    </PublicLayout>
  );
}