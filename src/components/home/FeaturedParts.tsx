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
import type { Product } from "@/types/product";

interface FeaturedPartsProps {
  initialProducts: Product[];
}

export default function FeaturedParts({ initialProducts }: FeaturedPartsProps) {
  const swiperRef = useRef<SwiperType | null>(null);

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
            {initialProducts.length === 0 ? (
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
                loop={initialProducts.length > 4}
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
                {initialProducts.map((product) => (
                  <SwiperSlide key={product.id}>
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
