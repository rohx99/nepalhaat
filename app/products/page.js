import React, { Suspense } from "react";
import DynamicProducts from "@/components/DynamicProducts";
import ProductSkeletonLoader from "@/components/ProductSkeletonLoader";

export default function ProductsPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <Suspense fallback={<ProductSkeletonLoader />}>
        <DynamicProducts />
      </Suspense>
    </div>
  );
}
