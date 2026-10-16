"use client";

import { useRef } from "react";
import Link from "next/link";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";

import ProductCard from "@/components/ui/ProductCard";
import Button from "@/components/ui/Button";
import { ButtonVariant } from "@/constants/button-variants";
import useProducts from "@/hooks/useProducts";

export default function FeaturedParts() {
  const swiperRef = useRef<SwiperType | null>(null);

  const { products, loading, error, fetchProducts } = useProducts({
    page: 1,
    pageSize: 8,
  });

  return (
    <section className="bg-gray-50 py-10">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section heading */}
        <div className="mb-6 flex items-center justify-center">
          <h2 className="text-2xl font-bold text-gray-800">Featured Parts</h2>
        </div>

        {/* Carousel and navigation arrows */}
        <div className="flex items-center gap-3 sm:gap-6">
          <Button
            type="button"
            variant={ButtonVariant.Compact}
            ariaLabel="Previous products"
            onClick={() => swiperRef.current?.slidePrev()}
            className="!h-10 !min-h-10 !w-10 !min-w-0 !shrink-0 !rounded-full !px-0 !py-0 text-3xl font-bold text-orange-600 hover:bg-orange-50 hover:text-orange-700 sm:!h-12 sm:!min-h-12 sm:!w-12"
          >
            ‹
          </Button>

          <div className="min-w-0 flex-1">
            {loading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 4 }, (_, index) => (
                  <div
                    key={index}
                    className="h-80 animate-pulse rounded-lg border border-gray-200 bg-white p-4"
                  >
                    <div className="h-44 rounded bg-gray-200" />
                    <div className="mt-4 h-4 rounded bg-gray-200" />
                    <div className="mt-3 h-4 w-1/2 rounded bg-gray-200" />
                    <div className="mt-5 h-10 rounded bg-gray-200" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div
                className="rounded-lg border border-red-200 bg-white p-8 text-center"
                role="alert"
              >
                <p className="text-sm text-red-600">{error}</p>

                <Button
                  variant={ButtonVariant.Outline}
                  onClick={fetchProducts}
                  className="mx-auto mt-4 !w-auto"
                >
                  Try Again
                </Button>
              </div>
            ) : products.length === 0 ? (
              <p className="rounded-lg bg-white p-8 text-center text-gray-600">
                No featured products are available right now.
              </p>
            ) : (
              <Swiper
                modules={[Navigation]}
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                }}
                spaceBetween={16}
                slidesPerView={4}
                loop={products.length > 4}
                breakpoints={{
                  0: {
                    slidesPerView: 1,
                  },
                  640: {
                    slidesPerView: 2,
                  },
                  768: {
                    slidesPerView: 3,
                  },
                  1024: {
                    slidesPerView: 4,
                  },
                }}
              >
                {products.map((product) => (
                  <SwiperSlide key={`${product.id}-${product.name}`}>
                    <ProductCard product={product} />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>

          <Button
            type="button"
            variant={ButtonVariant.Compact}
            ariaLabel="Next products"
            onClick={() => swiperRef.current?.slideNext()}
            className="!h-10 !min-h-10 !w-10 !min-w-0 !shrink-0 !rounded-full !px-0 !py-0 text-3xl font-bold text-orange-600 hover:bg-orange-50 hover:text-orange-700 sm:!h-12 sm:!min-h-12 sm:!w-12"
          >
            ›
          </Button>
        </div>

        {/* View all products */}
        <div className="mt-6 text-center">
          <Link
            href="/products"
            className="font-semibold text-orange-600 transition-colors hover:text-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2"
          >
            View All Products →
          </Link>
        </div>
      </div>
    </section>
  );
}
