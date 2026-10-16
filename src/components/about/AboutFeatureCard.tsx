interface AboutFeatureCardProps {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  linkText: string;
  href: string;
}

export default function AboutFeatureCard({
  title,
  description,
  image,
  imageAlt,
  linkText,
  href,
}: AboutFeatureCardProps) {
  return (
    <article className="flex h-full flex-col border-b-2 border-gray-700 bg-white">
      <div
        role="img"
        aria-label={imageAlt}
        className="h-56 shrink-0 bg-cover bg-center sm:h-64"
        style={{ backgroundImage: `url('${image}')` }}
      />

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="text-2xl font-bold leading-tight text-gray-700 sm:text-3xl">
          {title}
        </h3>

        <p className="mt-5 flex-1 text-base leading-7 text-gray-700">
          {description}
        </p>

        <a
          href={href}
          className="mt-6 inline-flex w-fit items-center font-bold text-orange-600 transition-colors hover:text-orange-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
        >
          {linkText}
        </a>
      </div>
    </article>
  );
}
