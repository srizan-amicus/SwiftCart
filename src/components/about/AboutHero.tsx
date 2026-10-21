import Breadcrumb from "@/components/common/Breadcrumb";

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
        <Breadcrumb
          variant="light"
          items={[{ label: "Home", href: "/" }, { label: "About Us" }]}
        />

        <h1 className="mt-10 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          About SwiftCart
        </h1>
      </div>
    </section>
  );
}
