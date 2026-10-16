import type { Metadata } from "next";

import AboutHero from "@/components/about/AboutHero";
import AboutFeatureSection from "@/components/about/AboutFeatureSection";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about SwiftCart, our customer-first approach, and our commitment to making online shopping simpler.",
};

const whoWeAreFeatures = [
  {
    title: "Our Story",
    description:
      "SwiftCart was created to make discovering and purchasing products simple. We bring products together in one convenient shopping experience, helping customers find what they need with confidence.",
    image:
      "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=900&q=85",
    imageAlt: "Customer receiving assistance while shopping",
    linkText: "Discover Our Story",
    href: "/products",
  },
  {
    title: "Our Approach",
    description:
      "We focus on a straightforward shopping experience, from browsing products and comparing options to managing your cart and placing an order.",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&q=85",
    imageAlt: "Online shopping and payment experience",
    linkText: "Explore Our Products",
    href: "/products",
  },
  {
    title: "Customer Experience",
    description:
      "We believe shopping should be clear and convenient. Our goal is to make product discovery, order management, and finding your next purchase easier.",
    image:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=900&q=85",
    imageAlt: "Team collaborating to support customers",
    linkText: "Start Shopping",
    href: "/products",
  },
];

const whatWeStandForFeatures = [
  {
    title: "Customer First",
    description:
      "Every shopping journey should feel straightforward. We aim to make browsing, selecting, and ordering products convenient for our customers.",
    image:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=900&q=85",
    imageAlt: "Team working together on a customer-focused project",
    linkText: "Explore Our Products",
    href: "/products",
  },
  {
    title: "Simplicity",
    description:
      "From product listings to checkout, we value clear information, intuitive navigation, and a shopping experience that helps customers make informed choices.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&q=85",
    imageAlt: "Organized and modern workspace",
    linkText: "Browse the Store",
    href: "/products",
  },
  {
    title: "Continuous Improvement",
    description:
      "We believe a good shopping experience keeps getting better. We focus on making the store easier to navigate and the purchasing journey more convenient.",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=900&q=85",
    imageAlt: "Team discussing ideas and improvements",
    linkText: "Discover SwiftCart",
    href: "/",
  },
];

export default function AboutPage() {
  return (
    <main>
      <AboutHero />

      <section className="bg-white py-12 sm:py-14">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-3xl font-extrabold leading-tight text-gray-700 sm:text-4xl lg:text-5xl">
            Making Online Shopping Simpler
          </h2>

          <div className="mt-6 space-y-4 text-base leading-7 text-gray-800">
            <p>
              SwiftCart brings product discovery and online shopping together in
              one convenient place. Our goal is to help customers find products,
              explore available options, and shop with confidence.
            </p>

            <p>
              Whether you are browsing our catalog, discovering something new,
              or returning for a favorite product, we aim to make every step of
              your shopping journey simple and convenient.
            </p>
          </div>

          <a
            href="/products"
            className="mt-6 inline-flex min-h-14 items-center justify-center border-2 border-orange-500 px-8 py-3 font-bold text-gray-700 transition-colors hover:bg-orange-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
          >
            Explore Products
          </a>
        </div>
      </section>

      <AboutFeatureSection
        title="Who We Are"
        features={whoWeAreFeatures}
        background="gray"
      />

      <AboutFeatureSection
        title="What We Stand For"
        features={whatWeStandForFeatures}
        background="white"
      />
    </main>
  );
}
