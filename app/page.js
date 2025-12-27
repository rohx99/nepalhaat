"use client";

import React, { Suspense } from "react";
import ProductsPage from "./products/page";
import ProductSkeletonLoader from "@/components/ProductSkeletonLoader";
// import OfferSection from "@/components/OfferSection";
// import OfferSwiper from "@/components/OfferSwiper";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 px-2 py-2 sm:px-4 sm:py-4">
      <Suspense fallback={<ProductSkeletonLoader />}>
        {/* <OfferSwiper />
        <OfferSection /> */}
        <ProductsPage />
      </Suspense>
    </div>
  );
}
