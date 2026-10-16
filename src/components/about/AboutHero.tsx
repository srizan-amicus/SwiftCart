import Link from "next/link";

export default function AboutHero() {
  return (
    <section
      className="relative min-h-[320px] bg-cover bg-center sm:min-h-[380px] lg:min-h-[410px]"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=85')",
      }}
    >
      <div className="absolute inset-0 bg-black/55" />

      <div className="relative mx-auto min-h-[320px] max-w-7xl px-6 py-7 sm:min-h-[380px] lg:min-h-[410px]">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-3 text-sm text-white"
        >
          <Link href="/" className="font-semibold hover:underline">
            Home
          </Link>

          <span aria-hidden="true">|</span>

          <span aria-current="page">About Us</span>
        </nav>

        <h1 className="mt-10 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          About SwiftCart
        </h1>
      </div>
    </section>
  );
}
