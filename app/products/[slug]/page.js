import { fetchProductBySlug } from "@/utils/products";
import { notFound } from "next/navigation";
import { FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import { TbRosetteDiscountFilled } from "react-icons/tb";
import { MdLocalOffer } from "react-icons/md";
import Varients from "@/components/Varients";
import ProductSwiper from "@/components/ProductSwiper";
import ViewReviews from "@/components/ViewReviews";
import AddReview from "@/components/AddReview";
import { cache } from "react";

const fetchProduct = cache(async (slug) => {
  const product = await fetchProductBySlug(slug);
  return product;
});

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await fetchProduct(slug);
  return {
    title: product.productName ?? "Page Not Found",
    description:
      product.description ??
      "The page is you are looking for is not available at this particular moment.",
    openGraph: {
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_IMAGE_URL}/${product.productImageOne}`,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  let product = {};
  try {
    product = await fetchProduct(slug);
  } catch (error) {
    console.error("Error in Product Detail Page:", error);
  }

  if (Object.keys(product).length === 0) {
    notFound();
  }

  const media = [
    product.productImageOne,
    product.productImageTwo,
    product.productImageThree,
    product.productImageFour,
    product.productImageFive,
    product.productVideo,
  ]
    .filter(Boolean)
    .map((item) => `${process.env.NEXT_PUBLIC_IMAGE_URL}/${item}`);

  return (
    <>
      <div className="bg-gray-50 px-2 py-2 sm:px-4 sm:py-4">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6">
            {/* Product Image Carousel */}
            <div className="w-full">
              <ProductSwiper media={media} productName={product.productName} />
            </div>

            {/* Product Details */}
            <div className="flex flex-col justify-between space-y-4 sm:space-y-6">
              <div>
                <p className="text-xs sm:text-sm text-gray-800 uppercase tracking-wide">
                  {product.categoryName} / {product.subCategoryName}
                  {product.gender && ` / ${product.gender}`}
                </p>
                <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight mt-1 sm:mt-2 capitalize">
                  {product.productName}
                </h1>

                {/* Rating */}
                <div className="mt-3 sm:mt-4 flex items-center space-x-2 sm:space-x-3">
                  <div className="flex space-x-1 text-amber-500 text-base sm:text-lg">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i}>
                        {i < Math.round(product.starsCount) ? (
                          <FaStar />
                        ) : (
                          <FaRegStar />
                        )}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600 mt-1">
                    ({product.reviews.length} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="mt-3 sm:mt-4 flex items-end space-x-2 sm:space-x-3">
                  <span className="text-xl md:text-2xl font-bold text-gray-900 flex flex-col">
                    <span className="text-xs text-emerald-600 flex items-center py-1">
                      <MdLocalOffer size={14} className="sm:text-base" />{" "}
                      Special Offer Price
                    </span>
                    <span>₹{product.price}</span>
                  </span>
                  <span className="text-lg md:text-xl text-gray-400 line-through">
                    ₹{Math.round(product.price / (1 - product.discount / 100))}
                  </span>
                  <span className="text-sm pb-1 font-semibold text-red-600 flex items-center">
                    <TbRosetteDiscountFilled
                      size={16}
                      className="me-1 sm:text-lg"
                    />
                    {product.discount}% OFF
                  </span>
                </div>

                {/* Description */}
                <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600 leading-relaxed">
                  {product.description}
                </p>

                <Varients product={product} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="px-2 py-2 sm:px-4 sm:py-4">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6">
            {/* Left Column: Overall Rating + Add Review */}
            <AddReview product={product} />
            {/* Right Column: Reviews List */}
            <ViewReviews product={product} />
          </div>
        </div>
      </div>
    </>
  );
}
