import React, { useState } from "react";
import Modal from "react-modal";
import { IoMdClose } from "react-icons/io";
import Image from "next/image";
import "./Modal.css";
import { FaShoppingCart } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import Swal from "sweetalert2";
import { FaCircleCheck } from "react-icons/fa6";

function CheckoutWithoutLoginModal({
  isOpen,
  closeModal,
  product,
  selectedSize,
  selectedColor,
  quantity,
}) {
  const [couponCode, setCouponCode] = useState("");
  const [couponId, setCouponId] = useState("");
  const [successText, setSuccessText] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [customAddress, setCustomAddress] = useState({
    address: "",
    city: "",
    state: "",
    country: "Nepal",
    pincode: "",
  });
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
  });

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = "Valid email is required";
    if (!formData.contactNumber.trim())
      newErrors.contactNumber = "Contact number is required";
    else if (!formData.contactNumber.match(/^\+?\d{10,12}$/))
      newErrors.contactNumber = "Valid contact number is required";
    if (!customAddress.address.trim())
      newErrors.address = "Address is required";
    if (!customAddress.city.trim()) newErrors.city = "City is required";
    if (!customAddress.state.trim())
      newErrors.state = "District / Province is required";
    if (!customAddress.country.trim())
      newErrors.country = "Country is required";
    if (!customAddress.pincode.trim())
      newErrors.pincode = "Pincode is required";
    else if (!customAddress.pincode.match(/^\d{5,6}$/))
      newErrors.pincode = "Valid pincode is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormDataChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCustomAddressChange = (e) => {
    const { name, value } = e.target;
    setCustomAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const customAdd = `${customAddress.address} ${customAddress.city} ${customAddress.state} Nepal - ${customAddress.pincode}`;

    try {
      const submitFormData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        contactNumber: formData.contactNumber,
        address: customAddress.address,
        city: customAddress.city,
        state: customAddress.state,
        country: customAddress.country,
        pincode: customAddress.pincode,
      };

      // First create customer
      const responseFirst = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/customers/create/for/order`,
        submitFormData
      );

      if (responseFirst.data.success) {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/orders`,
          {
            customerId: responseFirst.data.data._id,
            productId: product._id,
            quantity,
            color: selectedColor,
            size: selectedSize,
            finalPrice: discountedPrice === 0 ? product.price : discountedPrice,
            deliveryAddress: customAdd,
            couponId: couponId ?? "",
          }
        );

        if (response.data.success) {
          Swal.fire({
            icon: "success",
            text: `${response.data.message}`,
          });

          // Reset states on success
          setCustomAddress({
            address: "",
            city: "",
            state: "",
            pincode: "",
            country: "Nepal",
          });
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            contactNumber: "",
          });
          setCouponCode("");
          setCouponId("");
          setSuccessText("");
          setDiscountedPrice(0);
          setErrors({});
          closeModal();
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(`${error.response.data.message}`);
    }
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
              country: "Nepal",
            });
            setFormData({
              firstName: "",
              lastName: "",
              email: "",
              contactNumber: "",
            });
            setCouponCode("");
            setCouponId("");
            setSuccessText("");
            setDiscountedPrice(0);
            setErrors({});
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
          <div className="relative w-24 h-24 rounded overflow-hidden me-3">
            <Image
              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${product.productImageOne}`}
              alt={product.productName}
              fill
              className="object-cover rounded"
            />
          </div>
          <div className="space-y-2 flex flex-col w-full">
            <p className="text-md sm:text-lg font-semibold text-wrap">
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
            <p className="text-lg sm:text-xl font-semibold text-green-600 font-sans text-nowrap">
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

        {/* Customer Information */}
        <div className="mb-4">
          <p className="text-sm font-medium mb-2 text-white">
            Customer Information <span className="text-red-600">*</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-2">
            <div className="space-y-1">
              <input
                type="text"
                name="firstName"
                placeholder="First Name *"
                value={formData.firstName}
                onChange={handleFormDataChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded bg-black/20 text-white border-none focus:outline-none focus:outline-amber-500 text-sm"
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs">{errors.firstName}</p>
              )}
            </div>
            <div className="space-y-1">
              <input
                type="text"
                name="lastName"
                placeholder="Last Name *"
                value={formData.lastName}
                onChange={handleFormDataChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded bg-black/20 text-white border-none focus:outline-none focus:outline-amber-500 text-sm"
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs">{errors.lastName}</p>
              )}
            </div>
          </div>
          <div className="space-y-1">
            <input
              type="email"
              name="email"
              placeholder="Email *"
              value={formData.email}
              onChange={handleFormDataChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded bg-black/20 text-white border-none focus:outline-none focus:outline-amber-500 text-sm"
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email}</p>
            )}
          </div>
          <div className="space-y-1 mt-2">
            <input
              type="tel"
              name="contactNumber"
              placeholder="Contact Number *"
              value={formData.contactNumber}
              onChange={handleFormDataChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded bg-black/20 text-white border-none focus:outline-none focus:outline-amber-500 text-sm"
            />
            {errors.contactNumber && (
              <p className="text-red-500 text-xs">{errors.contactNumber}</p>
            )}
          </div>
        </div>

        {/* Delivery Address */}
        <div className="mb-4">
          <p className="text-sm font-medium mb-2 text-white">
            Delivery Address <span className="text-red-600">*</span>
          </p>
          <div className="space-y-2 sm:space-y-3">
            {["address", "city", "state", "pincode"].map((field) => (
              <div key={field} className="space-y-1">
                <input
                  type="text"
                  name={field}
                  placeholder={
                    field === "address"
                      ? "Street Address *"
                      : field === "city"
                      ? "City *"
                      : field === "state"
                      ? "Province / District *"
                      : "Pincode *"
                  }
                  value={customAddress[field]}
                  onChange={handleCustomAddressChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded bg-black/20 text-white border-none focus:outline-none focus:outline-amber-500 text-sm"
                />
                {errors[field] && (
                  <p className="text-red-500 text-xs">{errors[field]}</p>
                )}
              </div>
            ))}
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

export default CheckoutWithoutLoginModal;
