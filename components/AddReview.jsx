"use client";

import { AppContext } from "@/context/AppContext";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";
import secureLocalStorage from "react-secure-storage";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const AddReview = ({ product }) => {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const [stars, setStars] = useState(4);

  const { user, setproductReviews } = useContext(AppContext);

  async function fetchOrders() {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/customer/${user._id}`
      );

      if (response.data.success) {
        const refactoredOrders = response.data.orders.map((order) => ({
          id: order._id,
          productId: order.productId._id,
        }));
        setOrders(refactoredOrders);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (user?._id) {
      fetchOrders();
    }
  }, [user]);

  const handleAddReview = async (e) => {
    e.preventDefault();
    const purchased = orders.some(
      (order) => String(order.productId) === String(product._id)
    );
    if (!purchased) {
      toast.warning("Please purchase this product first");
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/review/${product._id}`,
        {
          customerId: user._id,
          message,
          stars,
        },
        {
          headers: {
            Authorization: `Bearer ${secureLocalStorage.getItem("token")}`,
          },
        }
      );
      Swal.fire({
        icon: "success",
        text: `${response.data.message || "Review added successfully"}`,
      });
      if (response.data.reviews) {
        setproductReviews(response.data.reviews);
      }
      setMessage("");
      setStars(4);
    } catch (error) {
      console.log(error);
      if (
        error.response.data.message === "You have already reviewed this product"
      ) {
        Swal.fire({
          icon: "warning",
          text: "You have already reviewed this product",
        });
      } else {
        Swal.fire({
          icon: "error",
          text: `${error.response.data.message || "Something went wrong"}`,
        });
      }
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Existing Review Summary */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          Customer Reviews
        </h2>
        <div className="flex items-center mt-2 sm:mt-3 space-x-2">
          <div className="flex space-x-1 text-amber-500 text-base sm:text-xl">
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
          <span className="ml-1 sm:ml-2 text-xs sm:text-sm text-gray-600">
            {product.starsCount} out of 5
          </span>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Based on {product.numberOfReviews} reviews
        </p>
      </div>

      {/* Write Review Form */}
      {Object.keys(user).length ? (
        <div className="mt-4 sm:mt-6 border-t border-gray-200 pt-4 sm:pt-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
            Write a Review
          </h3>
          <form className="space-y-3 sm:space-y-4" onSubmit={handleAddReview}>
            {/* Star Selector */}
            <div className="flex mt-1 space-x-1 sm:space-x-2 text-xl sm:text-2xl text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  className="cursor-pointer"
                  key={i}
                  onClick={() => setStars(i + 1)}
                >
                  {i < stars ? <FaStar /> : <FaRegStar />}
                </span>
              ))}
            </div>

            {/* Review Text */}
            <div>
              <textarea
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full mt-1 rounded-lg border border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500 text-xs sm:text-sm resize-none p-2 sm:p-3"
                placeholder="Share your thoughts about this product..."
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg shadow text-sm sm:text-base"
            >
              Submit Review
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
};

export default AddReview;
