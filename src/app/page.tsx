import { PublicLayout } from "@/components/layout/public-layout";

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