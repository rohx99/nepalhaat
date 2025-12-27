"use client";

import { AppContext } from "@/context/AppContext";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { BsTrash } from "react-icons/bs";
import { MdLocalOffer } from "react-icons/md";
import { TbRosetteDiscountFilled } from "react-icons/tb";
import { toast } from "react-toastify";

export default function Wishlist() {
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const { user } = useContext(AppContext);

  async function fetchWishlist() {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/wishlist/${user._id}`
      );
      if (response.data.success) {
        setWishlistProducts(response.data.customerWishlist.productIds || []);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch wishlist");
    }
  }

  async function removeFromWishlist(productId) {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/wishlist/${user._id}`,
        {
          productId,
        }
      );
      if (response.data.success) {
        toast.success("Removed from wishlist");
        fetchWishlist();
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to remove from wishlist");
    }
  }

  useEffect(() => {
    if (user?._id) {
      fetchWishlist();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 sm:py-8">
      {/* Page Header */}
      <div className="bg-white shadow-sm py-4 sm:py-6 mb-4 sm:mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
            Your Wishlist ❤️
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
            All the items you’ve saved in one place.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {wishlistProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {wishlistProducts.map((product, index) => {
              const averageRating = product.reviews.length
                ? (product.starsCount / product.reviews.length).toFixed(1)
                : "N/A";

              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-1"
                >
                  <Link href={`/products/${product.slug}`} className="group">
                    {/* Image */}
                    <div className="relative h-48 sm:h-56 md:h-64 w-full">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${product.productImageOne}`}
                        alt={product.productName}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        priority={index < 4}
                      />

                      {/* Rating */}
                      <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 bg-gray-900/70 text-white text-xs sm:text-sm font-medium px-2 sm:px-2.5 py-1 rounded-full flex items-center space-x-1">
                        <span>⭐</span>
                        <span>{averageRating}</span>
                      </div>

                      {/* Wishlist Icon */}
                      <div className="absolute top-2 sm:top-3 left-2 sm:left-3 text-base sm:text-xl p-1.5 sm:p-2 bg-white/70 backdrop-blur-sm rounded-full shadow">
                        <FaHeart className="text-red-600" size={16} />
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          removeFromWishlist(product._id);
                        }}
                        className="absolute top-2 sm:top-3 right-2 sm:right-3 text-base sm:text-xl p-1.5 sm:p-2 bg-red-600 backdrop-blur-sm rounded-full shadow hover:scale-110 transition"
                        title="Remove from Wishlist"
                      >
                        <BsTrash className="text-white" size={16} />
                      </button>
                    </div>

                    {/* Info */}
                    <div className="p-3 sm:p-4">
                      <p className="text-sm text-gray-500 truncate">
                        {product.categoryName} / {product.subCategoryName}
                      </p>
                      <h3 className="text-lg font-semibold text-gray-800 truncate mt-1">
                        {product.productName}
                      </h3>

                      {/* Price */}
                      <div className="mt-2 flex flex-row items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            <span className="text-lg md:text-xl font-bold text-gray-900">
                              ₹{product.price}
                            </span>
                            <span className="text-xs sm:text-sm text-gray-400 line-through">
                              ₹
                              {Math.round(
                                product.price / (1 - product.discount / 100)
                              )}
                            </span>
                          </div>
                          <span className="text-xs text-emerald-600 flex items-center font-semibold mt-1">
                            <MdLocalOffer
                              size={12}
                              className="sm:text-sm mr-1"
                            />
                            Special Offer
                          </span>
                        </div>
                        <span className="text-sm text-red-500 flex items-center font-semibold">
                          <TbRosetteDiscountFilled className="mr-1 text-sm sm:text-base" />
                          {product.discount}% OFF
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          // Empty State
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 md:py-20">
            <Image
              src="/empty-wishlist.png"
              alt="Empty Wishlist"
              width={150}
              height={150}
              className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48"
            />
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-700 mt-3 sm:mt-4">
              Your wishlist is empty
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2 text-center">
              Start adding items you love!
            </p>
            <Link
              href="/"
              className="mt-3 sm:mt-4 bg-red-600 hover:bg-red-700 text-white px-4 sm:px-5 py-2 rounded-lg shadow text-xs sm:text-sm transition"
            >
              Browse Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
