"use client";

import { AppContext } from "@/context/AppContext";
import moment from "moment";
import Image from "next/image";
import React, { useContext, useEffect } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";
import { MdVerified } from "react-icons/md";

const ViewReviews = ({ product }) => {
  const { productReviews, setproductReviews } = useContext(AppContext);

  useEffect(() => {
    setproductReviews(product.reviews);
  }, [product.reviews, setproductReviews]);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className="text-amber-400">
        {i < rating ? (
          <FaStar className="w-3 h-3 sm:w-4 sm:h-4" />
        ) : (
          <FaRegStar className="w-3 h-3 sm:w-4 sm:h-4" />
        )}
      </span>
    ));
  };

  const formatDate = (date) => {
    return moment(date).fromNow();
  };

  return (
    <div className="w-full">
      {/* Reviews List */}
      <div className="space-y-4 max-h-[320px] sm:max-h-[400px] lg:max-h-[500px] overflow-y-auto pb-4 custom-scrollbar">
        {productReviews && productReviews.length > 0 ? (
          productReviews.map((review, index) => (
            <div
              key={index}
              className="bg-gradient-to-b from-gray-100 to-gray-50 rounded-xl p-4 sm:p-5 border border-gray-200 shadow-md transition-all duration-300"
            >
              {/* Review Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                <div className="flex items-center space-x-3">
                  {/* Avatar */}
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 shadow-sm flex-shrink-0">
                    <Image
                      src={
                        review.customer.profilePicture
                          ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${review.customer.profilePicture}`
                          : "/default-avatar.png"
                      }
                      alt={review.customer.firstName || "Anonymous"}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* User Info */}
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-900 text-base">
                        {review.customer.firstName ? (
                          <span className="flex items-center">
                            {`${review.customer.firstName} ${review.customer.lastName}`}
                            <MdVerified className="text-sky-500 ml-1.5 w-4 h-4" />
                          </span>
                        ) : (
                          "Anonymous User"
                        )}
                      </span>
                    </div>
                    <span className="text-xs sm:text-sm text-gray-500 mt-0.5">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center justify-between sm:justify-end">
                  <div className="flex items-center space-x-1 bg-amber-50 px-2.5 py-1 rounded-full">
                    {renderStars(review.stars)}
                    <span className="text-xs font-medium text-amber-700 ml-1">
                      {review.stars}/5
                    </span>
                  </div>
                </div>
              </div>

              {/* Review Content */}
              <div className="pl-0 sm:pl-15">
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  {review.message}
                </p>
              </div>
            </div>
          ))
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <FaRegStar className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              No Reviews Yet
            </h4>
            <p className="text-gray-500 text-sm sm:text-base max-w-sm mx-auto">
              Be the first to share your experience with this product!
            </p>
          </div>
        )}
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default ViewReviews;
