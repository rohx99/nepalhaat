import React, { useContext, useState } from "react";
import Modal from "react-modal";
import { IoMdClose } from "react-icons/io";
import Image from "next/image";
import "./Modal.css";
import { FaShoppingCart } from "react-icons/fa";
import { AppContext } from "@/context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import Swal from "sweetalert2";
import { FaCircleCheck } from "react-icons/fa6";

function CheckoutModal({
  isOpen,
  closeModal,
  product,
  selectedSize,
  selectedColor,
  quantity,
}) {
  const [addressType, setAddressType] = useState("saved");
  const [couponCode, setCouponCode] = useState("");
  const [couponId, setCouponId] = useState("");
  const [successText, setSuccessText] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const { user } = useContext(AppContext);
  const [customAddress, setCustomAddress] = useState({
    address: "",
    city: "",
    state: "",
    country: "Nepal",
    pincode: "",
  });

  const handleCustomAddressChange = (e) => {
    const { name, value } = e.target;
    setCustomAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const savedAddress = `${user.address} ${user.city} ${user.state} ${user.country} - ${user.pincode}`;
    const customAdd = `${customAddress.address} ${customAddress.city} ${customAddress.state} Nepal - ${customAddress.pincode}`;

    const shippingAddress = addressType === "saved" ? savedAddress : customAdd;
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/orders`,
        {
          customerId: user._id,
          productId: product._id,
          quantity,
          color: selectedColor,
          size: selectedSize,
          finalPrice: discountedPrice === 0 ? product.price : discountedPrice,
          deliveryAddress: shippingAddress,
          couponId: couponId ?? "",
        }
      );

      if (response.data.success) {
        // toast.success(`${response.data.message}`);
        Swal.fire({
          icon: "success",
          text: `${response.data.message}`,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(`${error.response.data.message}`);
    }

    setCustomAddress({
      address: "",
      city: "",
      state: "",
      pincode: "",
    });
    setCouponCode("");
    setCouponId("");
    setSuccessText("");
    setDiscountedPrice(0);
    closeModal();
  };

  const handleCouponCode = async () => {
    try {
      if (!couponCode) {
        return toast.warn("Please enter coupon code");
      }
      if (successText) {
        return toast.success("Coupon already applied");
      }
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/coupon/validate/code`,
        {
          code: couponCode.trim(),
          price: product?.price,
        }
      );
      if (response.data.success) {
        setDiscountedPrice(response.data.discountedPrice);
        setCouponId(response.data.couponId);
        setSuccessText("Coupon Applied");
      }
    } catch (error) {
      console.log(error);
      toast.warn(`${error.response.data.message}`);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      className="modalContent w-full max-w-md sm:max-w-lg md:max-w-xl mx-auto no-scrollbar"
      overlayClassName="modalOverlay"
      shouldCloseOnOverlayClick={true}
      closeTimeoutMS={200}
      contentLabel="Checkout Modal"
    >
      <div className="text-white py-2 relative rounded-lg">
        {/* Close Button */}
        <button
          onClick={() => {
            closeModal();
            setCustomAddress({
              address: "",
              city: "",
              state: "",
              pincode: "",
            });
            setCouponCode("");
            setCouponId("");
            setSuccessText("");
            setDiscountedPrice(0);
          }}
          className="absolute top-[-10px] sm:top-[-15px] right-[-10px] sm:right-[-15px] text-white/70 hover:text-amber-500 transition-colors duration-200"
          title="Close"
        >
          <IoMdClose size={20} className="sm:text-2xl" />
        </button>

        {/* Header */}
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-2xl font-bold text-white">Secure Checkout</h2>
          <p className="text-sm text-gray-400 mt-1 sm:mt-2 text-nowrap">
            Confirm your order details before placing it
          </p>
        </div>

        {/* Product Summary */}
        <div className="flex gap-4 sm:gap-6 items-center border border-gray-700 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 bg-black/20">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded overflow-hidden">
            <Image
              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${product.productImageOne}`}
              alt={product.productName}
              fill
              className="object-cover rounded"
            />
          </div>
          <div className="space-y-2 flex flex-col w-full">
            <p className="text-md sm:text-lg font-semibold">
              {product.productName}
            </p>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm sm:text-base mt-1">
              {product.categoryName === "Fashion" && (
                <p>Size: {selectedSize}</p>
              )}
              {product.categoryName === "Fashion" && (
                <p>Color: {selectedColor}</p>
              )}
              <p>Qty: {quantity}</p>
            </div>
            <p className="text-lg sm:text-xl font-semibold text-green-600 font-sans">
              ₹{discountedPrice === 0 ? product.price : discountedPrice}{" "}
              {discountedPrice !== 0 ? (
                <span className="line-through text-white/70 text-base me-2">
                  {product.price}
                </span>
              ) : (
                <></>
              )}
              <span className="text-xs text-gray-400">
                (inclusive of all taxes)
              </span>
            </p>
          </div>
        </div>

        {/* Coupon Code */}
        <div className="mb-4">
          <p className="text-sm font-medium mb-3 text-white flex">
            Have Coupon ?{" "}
            <span className="text-green-500 flex ms-2 items-center font-semibold">
              {successText && <FaCircleCheck />}
              <span className="ms-1">{successText}</span>
            </span>
          </p>
          <div className="flex gap-2 sm:gap-4 items-start">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Coupon Code"
              className="bg-black/20 border border-gray-700 rounded-lg p-3 sm:p-4 text-sm space-y-1 mb-4 w-3/4  focus:outline-none focus:outline-amber-500"
            />
            <div className="w-1/4">
              <button
                className="bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 rounded py-1 sm:py-2 text-black font-semibold text-md w-full mt-2 active:scale-95 transition-all duration-200 ease-in-out"
                onClick={handleCouponCode}
              >
                {successText ? "Applied" : "Apply"}
              </button>
            </div>
          </div>
        </div>

        {/* Address Type Switch */}
        <div className="mb-4">
          <p className="text-sm font-medium mb-2 text-white">
            Delivery Address
          </p>
          <div className="flex flex-wrap gap-2 sm:gap-4">
            {["saved", "custom"].map((type) => (
              <label
                key={type}
                className={`
                  cursor-pointer px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm font-medium border 
                  transition-all duration-200
                  ${
                    addressType === type
                      ? "bg-amber-500 text-black border-amber-500 font-semibold"
                      : "bg-gray-800 text-gray-300 border-gray-600 hover:border-gray-400"
                  }
                `}
              >
                <input
                  type="radio"
                  name="addressType"
                  value={type}
                  checked={addressType === type}
                  onChange={() => setAddressType(type)}
                  className="hidden"
                />
                {type === "saved" ? "Saved Address" : "Custom Address"}
              </label>
            ))}
          </div>
        </div>

        {/* Address Display / Form */}
        {addressType === "saved" ? (
          <div className="bg-black/20 border border-gray-700 rounded-lg p-3 sm:p-4 text-sm space-y-1 mb-4">
            <p>
              {user.address}, {user.city}, {user.state}, {user.country} -{" "}
              {user.pincode}
            </p>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3 mb-4">
            {["address", "city", "state", "pincode"].map((field) => (
              <div key={field}>
                <input
                  type="text"
                  name={field}
                  placeholder={
                    field !== "state"
                      ? field[0].toUpperCase() + field.slice(1)
                      : "Province / District"
                  }
                  value={customAddress[field]}
                  onChange={handleCustomAddressChange}
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded bg-black/20 text-white border-none focus:outline-none focus:outline-amber-500 text-sm"
                />
              </div>
            ))}
          </div>
        )}

        {/* Place Order Button */}
        <button
          onClick={handleSubmit}
          className="w-full mt-2 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-md py-2 sm:py-3 font-bold text-base sm:text-lg text-black active:scale-95 transition ease-in-out duration-300"
        >
          <span className="flex items-center justify-center gap-2">
            <FaShoppingCart size={18} className="sm:text-xl" />
            <span className="pt-0.5">Place Order</span>
          </span>
        </button>
      </div>
    </Modal>
  );
}

export default CheckoutModal;
