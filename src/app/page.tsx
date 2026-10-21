import type { Metadata } from "next";

import Hero from "@/components/home/Hero";
import QuickLinks from "@/components/home/QuickLinks";
import FeaturedParts from "@/components/home/FeaturedParts";
import PopularCategories from "@/components/home/PopularCategories";


export const metadata: Metadata = {
  title: "Shop Smarter",
  description:
    "Discover products, explore categories, and shop your favorites with SwiftCart.",
};

export default function Home() {
  return (
    <main className="flex-1 bg-white">
      <Hero />
      <QuickLinks />
      <FeaturedParts />
      <PopularCategories />
    </main>
  );
}
