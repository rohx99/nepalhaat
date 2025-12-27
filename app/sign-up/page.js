"use client";

import React, { useContext, useState } from "react";
import { MdVerified } from "react-icons/md";
import CustomerPasswordModal from "../../modals/CustomerPasswordModal";
import { AppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { GoVerified } from "react-icons/go";

export default function SignUp() {
  const { user } = useContext(AppContext);
  const router = useRouter();

  if (Object.keys(user).length > 0) {
    router.push("/");
  }

  const [isCustomerPasswordModalOpen, setIsCustomerPasswordModalOpen] =
    useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    address: "",
    city: "",
    state: "",
    country: "Nepal",
    pincode: "",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = "Valid email is required";
    if (!formData.contactNumber.match(/^\+?\d{10,12}$/))
      newErrors.contactNumber = "Valid contact number is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim())
      newErrors.state = "District / Province is required";
    if (!formData.country.trim()) newErrors.country = "Country is required";
    if (!formData.pincode.match(/^\d{5,6}$/))
      newErrors.pincode = "Valid pincode is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const openCustomerPasswordModal = () => setIsCustomerPasswordModalOpen(true);
  const closeCustomerPasswordModal = () =>
    setIsCustomerPasswordModalOpen(false);

  const handleCustomerPasswordModal = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    openCustomerPasswordModal();
  };

  return (
    <section className="p-2 bg-gradient-to-b from-[#0D1627] via-black to-[#0D1627]">
      <div className="w-full flex flex-col items-center justify-center  p-4 sm:p-6 lg:p-8 border border-white/30 rounded-xl">
        <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
          {/* Testimonial Card */}
          <div
            className="relative h-80 sm:h-96 w-full max-w-sm lg:w-80 xl:w-96 rounded-2xl overflow-hidden shadow-lg bg-cover bg-center bg-no-repeat transition-transform duration-300 hover:scale-105 flex-shrink-0"
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.8)), url('/shopping.jpg')`,
            }}
          >
            <div className="absolute bottom-0 p-4 sm:p-6 text-white/90 flex flex-col gap-3 sm:gap-4">
              <blockquote className="text-xs sm:text-sm italic font-light leading-relaxed">
                &quot;The sign-up process was quick and the selection is
                amazing. Highly recommended for anyone looking for a seamless
                online shopping experience.&quot;
              </blockquote>
              <div className="flex items-center justify-center gap-2 text-sm sm:text-base font-medium">
                <MdVerified className="text-sky-400 text-lg sm:text-xl" />
                <span>Namrata Shah, Nepal</span>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="w-full max-w-4xl flex-1">
            <form
              onSubmit={handleCustomerPasswordModal}
              className="text-white space-y-6 sm:space-y-8"
            >
              {/* Form Fields Container */}
              <div className="flex flex-col xl:flex-row xl:justify-between gap-6 xl:gap-8">
                {/* Left Column */}
                <section className="space-y-5 sm:space-y-6 flex-1">
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="First Name"
                        className="w-full p-3 border border-gray-500 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition duration-200 outline-none bg-white/10 text-white placeholder-gray-400"
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.firstName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Last Name"
                        className="w-full p-3 border border-gray-500 bg-white/10 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition duration-200 outline-none text-white placeholder-gray-400"
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email"
                      className="w-full p-3 border border-gray-500 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition duration-200 outline-none bg-white/10 text-white placeholder-gray-400"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Contact Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      placeholder="Contact Number"
                      className="w-full p-3 border border-gray-500 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition duration-200 outline-none bg-white/10 text-white placeholder-gray-400"
                    />
                    {errors.contactNumber && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.contactNumber}
                      </p>
                    )}
                  </div>
                </section>

                {/* Right Column */}
                <section className="space-y-5 sm:space-y-6 flex-1">
                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Address"
                      className="w-full p-3 border border-gray-500 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition duration-200 outline-none bg-white/10 text-white placeholder-gray-400"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.address}
                      </p>
                    )}
                  </div>

                  {/* City and State */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="City"
                        className="w-full p-3 border border-gray-500 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition duration-200 outline-none bg-white/10 text-white placeholder-gray-400"
                      />
                      {errors.city && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.city}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        District / Province{" "}
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="State"
                        className="w-full p-3 border border-gray-500 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition duration-200 outline-none bg-white/10 text-white placeholder-gray-400"
                      />
                      {errors.state && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.state}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Country and Pincode */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        disabled
                        onChange={handleInputChange}
                        placeholder="Country"
                        className="w-full p-3 border border-gray-500 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition duration-200 outline-none bg-white/10 text-white placeholder-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                      {errors.country && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.country}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Pincode
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        placeholder="Pincode"
                        className="w-full p-3 border border-gray-500 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition duration-200 outline-none bg-white/10 text-white placeholder-gray-400"
                      />
                      {errors.pincode && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.pincode}
                        </p>
                      )}
                    </div>
                  </div>
                </section>
              </div>

              {/* Form Error */}
              {errors.form && (
                <p className="text-red-500 text-sm text-center">
                  {errors.form}
                </p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="flex justify-center items-center w-full p-3 sm:p-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium text-sm sm:text-base focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                <GoVerified className="me-2" />
                <span>Sign Up for Free</span>
              </button>
            </form>
          </div>
        </div>

        <CustomerPasswordModal
          isOpen={isCustomerPasswordModalOpen}
          closeModal={closeCustomerPasswordModal}
          customer={formData}
        />
      </div>
    </section>
  );
}
