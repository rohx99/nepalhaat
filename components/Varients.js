"use client";

import CheckoutModal from "@/modals/CheckoutModal";
import { AppContext } from "@/context/AppContext";
import React, { useContext, useEffect, useState } from "react";
import { BsBagCheckFill } from "react-icons/bs";
import { FaHeart } from "react-icons/fa6";
import { toast } from "react-toastify";
import axios from "axios";

const Varients = ({ product }) => {
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [userWishlist, setuserWishlist] = useState([]);

  const { user } = useContext(AppContext);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  const sizeOptions = product.sizes;
  const colorOptions = product.color;

  const incrementQuantity = () =>
    setQuantity((prev) => (prev < 5 ? prev + 1 : prev));
  const decrementQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const openCheckoutModal = () => setIsCheckoutModalOpen(true);
  const closeCheckoutModal = () => setIsCheckoutModalOpen(false);

  const handleCheckoutModal = () => {
    if (!user._id) {
      return toast.warning("Please login to checkout");
    }
    if (product.sizes.length && !selectedSize) {
      return toast.warn("Please select size to proceed");
    }
    if (product.color.length && !selectedColor) {
      return toast.warn("Please select color to proceed");
    }
    openCheckoutModal();
  };

  const handleAddToWishlist = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/wishlist/${user._id}`,
        {
          productId: product._id,
        }
      );

      if (response.data.success) {
        toast.success("Product added to wishlist");
        setuserWishlist((prev) => [...prev, product]);
      }
    } catch (error) {
      console.log(error);
      toast.error(`${error.response.data.message}`);
    }
  };

  const handleRemoveFromWishlist = async () => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/wishlist/${user._id}`,
        {
          productId: product._id,
        }
      );

      if (response.data.success) {
        toast.success("Product removed from wishlist");
        setuserWishlist((prev) =>
          prev.filter((p) => String(p._id) !== String(product._id))
        );
      }
    } catch (error) {
      console.log(error);
      toast.error(`${error.response.data.message}`);
    }
  };

  async function fetchWishlist() {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/wishlist/${user._id}`
      );
      if (response.data.success) {
        setuserWishlist(response.data.customerWishlist.productIds || []);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (user?._id) {
      fetchWishlist();
    }
  }, [user]);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-evenly gap-4 sm:gap-6">
        {/* Size Selector */}
        {product.sizes.length > 0 && (
          <div className="mt-4 sm:mt-6">
            <label className="block mb-2 text-sm  text-center font-semibold text-gray-700">
              Select Size
            </label>
            <div className="flex flex-wrap gap-2 justify-center">
              {sizeOptions.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-3 border rounded-lg text-sm font-semibold transition ${
                    selectedSize === size
                      ? "bg-amber-500 text-white border-amber-500"
                      : "bg-white text-gray-700 border-gray-300 hover:border-amber-400"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Color Selector */}
        {product.color.length > 0 && (
          <div className="mt-4 sm:mt-6">
            <label className="block mb-2 text-sm  text-center font-semibold text-gray-700">
              Select Color
            </label>
            <div className="flex flex-wrap gap-2 justify-center">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 transition ${
                    selectedColor === color
                      ? "ring-2 ring-amber-500 border-amber-500"
                      : "border-gray-300"
                  }`}
                  style={{ backgroundColor: color.toLowerCase() }}
                ></button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quantity Selector */}
      <div className="flex justify-center">
        <div className="mt-4 sm:mt-6">
          <label className="block mb-3 text-sm  text-center font-semibold text-gray-700">
            Select Quantity
          </label>
          <div className="flex items-center justify-center space-x-4 sm:space-x-4">
            <button
              onClick={decrementQuantity}
              className="w-8 h-8 rounded-full bg-gray-200 text-xl font-bold text-gray-800 hover:bg-gray-300"
            >
              −
            </button>
            <span className="text-lg font-semibold">{quantity}</span>
            <button
              onClick={incrementQuantity}
              className="w-8 h-8 rounded-full bg-gray-200 text-xl font-bold text-gray-700 hover:bg-gray-300"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mt-4 sm:mt-6">
        <button
          className={`flex-1 py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 font-semibold text-base shadow-md
          ${
            product.status
              ? "bg-gradient-to-br from-amber-400 to-amber-500 text-white hover:shadow-lg"
              : "bg-gray-300 text-red-500 cursor-not-allowed"
          }`}
          onClick={handleCheckoutModal}
          disabled={!product.status}
        >
          <span className="flex items-center justify-center">
            <BsBagCheckFill
              size={18}
              className={`sm:text-xl ms-[-15px] sm:ms-[-20px] me-1 ${
                product.status ? "text-white" : "text-red-500"
              }`}
            />
            <span>
              {product.status
                ? "Proceed to Checkout"
                : "Currently Out of Stock"}
            </span>
          </span>
        </button>
        <button
          className={`flex-1 py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold text-base shadow-md transition-all duration-200 flex items-center justify-center
            ${
              userWishlist.some((p) => String(p._id) === String(product._id))
                ? "bg-red-100 text-red-600 hover:bg-red-200"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          onClick={() => {
            if (!user?._id) {
              toast.warning("Please login to manage wishlist");
              return;
            }
            if (
              userWishlist.some((p) => String(p._id) === String(product._id))
            ) {
              handleRemoveFromWishlist();
            } else {
              handleAddToWishlist();
            }
          }}
        >
          {userWishlist.some((p) => String(p._id) === String(product._id)) ? (
            <>
              <FaHeart size={18} className="me-2 text-red-600" />
              Remove from Wishlist
            </>
          ) : (
            <>
              <FaHeart size={18} className="me-2 text-gray-400" />
              Add to Wishlist
            </>
          )}
        </button>
      </div>

      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        closeModal={closeCheckoutModal}
        product={product}
        selectedSize={selectedSize}
        selectedColor={selectedColor}
        quantity={quantity}
      />
    </>
  );
};

export default Varients;
