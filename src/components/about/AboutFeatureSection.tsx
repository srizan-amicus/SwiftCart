import AboutFeatureCard from "@/components/about/AboutFeatureCard";

interface AboutFeature {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  linkText: string;
  href: string;
}

interface AboutFeatureSectionProps {
  title: string;
  features: AboutFeature[];
  background?: "white" | "gray";
}

export default function AboutFeatureSection({
  title,
  features,
  background = "gray",
}: AboutFeatureSectionProps) {
  const backgroundClass = background === "gray" ? "bg-gray-50" : "bg-white";

  return (
    <section className={`${backgroundClass} py-12 sm:py-16`}>
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-10 text-center text-3xl font-extrabold text-gray-700 sm:mb-12 sm:text-4xl">
          {title}
        </h2>

        <div className="mx-auto grid max-w-6xl grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {features.map((feature) => (
            <AboutFeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
