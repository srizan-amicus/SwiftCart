"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import SearchBar from "@/components/common/SearchBar";

export default function Hero() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  function handleSearch() {
    const query = search.trim();

    if (!query) {
      router.push("/products");
      return;
    }

    router.push(`/products?search=${encodeURIComponent(query)}`);
  }

  return (
    <section
      className="relative h-60 bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1600')",
      }}
    >
      {/* Dark overlay to keep the white text readable */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Hero content */}
      <div className="relative flex h-full flex-col items-center justify-center px-4 text-center">
        <h1 className="text-3xl font-black tracking-wide text-white md:text-4xl">
          FIND PRODUCTS, PARTS &amp; ACCESSORIES
        </h1>

        <p className="mt-3 text-sm text-white md:text-base">
          Find the right parts and accessories for your equipment.
        </p>

        <SearchBar
          value={search}
          onChange={setSearch}
          onSearch={handleSearch}
          placeholder="Search"
          className="mt-5 w-full max-w-md"
        />
      </div>
    </section>
  );
}
