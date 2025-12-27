import React, { useState } from "react";
import Modal from "react-modal";
import "./Modal.css";
import { IoMdClose } from "react-icons/io";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

function CustomerPasswordModal({ isOpen, closeModal, customer }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!password || !confirmPassword) {
      setError("Both fields are required.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();

      formData.append("firstName", customer.firstName);
      formData.append("lastName", customer.lastName);
      formData.append("email", customer.email);
      formData.append("password", password);
      formData.append("contactNumber", customer.contactNumber);
      formData.append("address", customer.address);
      formData.append("city", customer.city);
      formData.append("state", customer.state);
      formData.append("country", customer.country);
      formData.append("pincode", customer.pincode);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/customers`,
        formData
      );

      if (response.data.success) {
        toast.success("Account Created Successfully");
        closeModal();
        router.push("/");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      className="modalContent w-full max-w-md sm:max-w-lg md:max-w-xl mx-auto"
      overlayClassName="modalOverlay"
      shouldCloseOnOverlayClick={true}
      closeTimeoutMS={200}
      contentLabel="Setup Password Modal"
    >
      <div className="text-white px-4 py-4 sm:px-6 sm:py-6 relative">
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-[-10px] sm:top-[-15px] right-[-10px] sm:right-[-15px] text-white/60 hover:text-yellow-600 transition-colors duration-200"
          title="Close"
        >
          <IoMdClose size={20} className="sm:text-2xl" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white leading-snug">
            🎉 Congratulations !
          </h2>
          <p className="text-sm text-gray-400 mt-2 sm:mt-3">
            Set your new password and enjoy shopping
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="password"
              className="block text-sm mb-1 text-gray-300"
            >
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 sm:h-12 rounded-md border border-gray-600 bg-[#1e293b] px-3 sm:px-4 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-600 placeholder:text-gray-400"
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-600"
              >
                {showPassword ? <FaEye size={18} className="text-amber-400" /> : <FaEyeSlash size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm mb-1 text-gray-300"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-10 sm:h-12 rounded-md border border-gray-600 bg-[#1e293b] px-3 sm:px-4 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-600 placeholder:text-gray-400"
                placeholder="Confirm password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-600"
              >
                {showConfirmPassword ? (
                  <FaEye size={18} className="text-amber-400" />
                ) : (
                  <FaEyeSlash size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center bg-gradient-to-br from-yellow-500 to-amber-500 rounded-md py-2 sm:py-3 font-bold text-base sm:text-lg text-black active:scale-95 transition ease-in-out duration-300 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin h-4 sm:h-5 w-4 sm:w-5 mr-2 text-black"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 
                    1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Submitting...
              </span>
            ) : (
              "Submit"
            )}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-4 sm:mt-6">
          © {new Date().getFullYear()} NepalHaat. All rights reserved.
        </p>
      </div>
    </Modal>
  );
}

export default CustomerPasswordModal;
