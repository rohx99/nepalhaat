"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { products } from "@/utils/products";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BsArrowDownCircleFill, BsStarFill } from "react-icons/bs";
import { BiFilter, BiX } from "react-icons/bi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

function ProductCard({ product, index }) {
  const averageRating = product.starsCount.toFixed(1);

  return (
    <Link key={index} href={`/products/${product.slug}`} className="group">
      <div
        className={`bg-white rounded shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl`}
      >
        <div className="relative h-48 sm:h-64 w-full">
          <Swiper
            modules={[Autoplay]}
            className="h-full"
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
          >
            {[
              product.productImageOne,
              product.productImageTwo,
              product.productImageThree,
              product.productImageFour,
              product.productImageFive,
            ]
              .filter(Boolean)
              .map((img, i) => (
                <SwiperSlide key={i}>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${img}`}
                    alt={product.productName}
                    fill
                    className="object-cover"
                    priority={index < 4 && i === 0}
                  />
                </SwiperSlide>
              ))}
          </Swiper>

          {!product.status && (
            <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full z-10">
              Out of Stock
            </div>
          )}

          <div className="absolute bottom-2 left-2 bg-white/70 text-black text-xs font-medium p-1 rounded-md flex items-center gap-1 z-10">
            <span>{averageRating}</span>
            <BsStarFill className="text-amber-400" />
          </div>

          {product.color?.length > 0 && (
            <div className="absolute bottom-2 right-2 flex items-center gap-1 z-10">
              {product.color.slice(0, 3).map((color, i) => (
                <span
                  key={i}
                  className="w-4 sm:w-5 h-4 sm:h-5 rounded-full border border-white shadow"
                  style={{ backgroundColor: color.toLowerCase() }}
                />
              ))}
              {product.color.length > 3 && (
                <span className="text-[12px] bg-white/80 text-gray-700 rounded-full px-1 font-semibold">
                  +{product.color.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="sm:px-5 sm:py-5 px-1 py-2">
          <h3 className="text-sm sm:text-base font-semibold text-gray-800 truncate capitalize">
            {product.productName}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500">
            {product.categoryName} / {product.subCategoryName}
          </p>

          <div className="mt-1 flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <span className="text-xs sm:text-sm text-green-600 flex items-center font-semibold">
                  <BsArrowDownCircleFill className="mr-1" />
                  {product.discount}%
                </span>
                <span className="text-sm sm:text-base text-gray-500 line-through">
                  ₹{Math.round(product.price / (1 - product.discount / 100))}
                </span>
                <span className="text-sm sm:text-base font-extrabold text-gray-900">
                  ₹{product.price}/-
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function DynamicProducts() {
  const searchParams = useSearchParams();
  const selectedSubcategory = searchParams.get("subcategory");
  const router = useRouter();
  const pathname = usePathname();

  const clearFilter = () => {
    router.push(pathname);
  };

  const filteredProducts = selectedSubcategory
    ? products.filter((p) => p.subCategoryName === selectedSubcategory)
    : products;

  return (
    <>
      {selectedSubcategory && (
        <div className="inline-flex items-center gap-2 text-white bg-amber-500 px-3 py-1 rounded-md text-sm sm:mb-4 mb-2">
          <BiFilter size={20} />
          <span>{selectedSubcategory}</span>
          <BiX
            size={20}
            className="cursor-pointer hover:text-red-500"
            onClick={clearFilter}
          />
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
        {filteredProducts.map((product, index) => (
          <ProductCard key={index} product={product} index={index} />
        ))}
      </div>
    </>
  );
}
