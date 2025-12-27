import React, { useContext, useState } from "react";
import Modal from "react-modal";
import "./Modal.css";
import { IoMdClose } from "react-icons/io";
import { IoMail } from "react-icons/io5";
import { FaLock } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import { toast } from "react-toastify";
import { AppContext } from "@/context/AppContext";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";

function LoginModal({ isOpen, closeModal }) {
  const [emailOrPhone, setemailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useContext(AppContext);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/customers/login`,
        {
          emailOrPhone,
          password,
        }
      );
      if (response.data.success) {
        setUser(response.data.customer);
        toast.success(`${response.data.message}`);
        secureLocalStorage.setItem("token", response.data.token);
        closeModal();
        setemailOrPhone("");
        setPassword("");
        setShowPassword(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(`${error.response.data.message}`);
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
      contentLabel="Login Modal"
    >
      <div className="text-white py-6 sm:px-8 sm:py-6 relative">
        {/* Close Button */}
        <button
          onClick={() => {
            closeModal();
            setemailOrPhone("");
            setPassword("");
            setShowPassword(false);
          }}
          className="absolute top-[-10px] sm:top-[-15px] right-[-10px] sm:right-[-15px] text-white/60 hover:text-yellow-600 transition-colors duration-100"
          title="Close"
        >
          <IoMdClose size={20} className="sm:text-2xl" />
        </button>

        {/* Header */}
        <div className="text-center mb-6 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Login to Your Account
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Secure access with your email and password.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
          <div className="relative">
            <label
              htmlFor="email"
              className="block text-xs sm:text-sm mb-1 text-gray-300"
            >
              Email / Phone <span className="text-red-500">*</span>
            </label>
            <span className="absolute top-8 sm:top-10 left-3">
              <IoMail size={20} className="sm:text-2xl text-amber-400" />
            </span>
            <input
              type="text"
              id="email"
              value={emailOrPhone}
              onChange={(e) => setemailOrPhone(e.target.value)}
              className="w-full rounded-md border border-gray-600 bg-[#1e293b] pl-10 sm:pl-12 py-3 sm:py-4 text-sm sm:text-md focus:outline-none focus:ring-2 focus:ring-yellow-600 placeholder:text-gray-400 tracking-wide"
              placeholder="Enter your email or phone no."
              required
            />
          </div>

          <div className="relative">
            <label
              htmlFor="password"
              className="block text-xs sm:text-sm mb-1 text-gray-300"
            >
              Password <span className="text-red-500">*</span>
            </label>
            <span className="absolute top-8 sm:top-10 left-3">
              <FaLock size={18} className="sm:text-xl text-amber-400" />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-gray-600 bg-[#1e293b] pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 text-sm sm:text-md focus:outline-none focus:ring-2 focus:ring-yellow-600 placeholder:text-gray-400 tracking-wide"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute top-9 sm:top-11 right-3 text-gray-400 hover:text-yellow-500"
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <FaEye size={18} className="sm:text-xl" />
              ) : (
                <FaEyeSlash size={18} className="sm:text-xl" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between space-y-0">
            <div className="flex space-x-2 items-center">
              <input
                type="checkbox"
                id="rememberMe"
                defaultChecked
                className="w-4 h-4 accent-yellow-500 cursor-pointer"
              />
              <label
                htmlFor="rememberMe"
                className="cursor-pointer text-xs sm:text-sm"
              >
                Remember Me
              </label>
            </div>
            <Link
              href="#"
              className="text-amber-500 hover:text-yellow-500 text-xs sm:text-sm transition-colors duration-100"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-br from-yellow-500 to-amber-500 rounded-sm py-2 sm:py-3 font-bold text-base sm:text-lg text-black active:scale-95 transition ease-in-out duration-300"
          >
            Login
          </button>
        </form>

        <p className="text-xs sm:text-sm text-center text-gray-300 mt-4 sm:mt-6">
          Don&apos;t have an account?{" "}
          <span>
            <Link
              href="/sign-up"
              className="text-amber-400"
              onClick={() => {
                closeModal();
              }}
            >
              {" "}
              Create New Account
            </Link>
          </span>
        </p>

        <p className="text-xs sm:text-sm text-center text-gray-400 mt-4 sm:mt-6">
          © {new Date().getFullYear()} NepalHaat. All rights reserved.
        </p>
      </div>
    </Modal>
  );
}

export default LoginModal;
