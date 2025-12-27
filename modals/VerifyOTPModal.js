import React, { useState, useEffect, useRef } from "react";
import Modal from "react-modal";
import "./Modal.css";
import { IoMdClose } from "react-icons/io";

function VerifyOTPModal({ isOpen, closeModal }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendEnabled, setResendEnabled] = useState(false);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take the last character
    setOtp(newOtp);

    // Move to next input if a digit is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace when current is empty
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendOTP = () => {
    if (resendEnabled) {
      // Logic to resend OTP (e.g., API call) would go here
      console.log("OTP resent");
      setResendEnabled(false);
      setTimer(60);
    }
  };

  useEffect(() => {
    // Focus on the first input when modal opens, with a small delay to ensure refs are ready
    if (isOpen && inputRefs.current[0]) {
      const timer = setTimeout(() => {
        inputRefs.current[0].focus();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    let countdown;
    if (!resendEnabled && timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setResendEnabled(true);
      clearInterval(countdown);
    }
    return () => clearInterval(countdown);
  }, [resendEnabled, timer]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      className="modalContent"
      overlayClassName="modalOverlay"
      shouldCloseOnOverlayClick={true}
      closeTimeoutMS={200}
      contentLabel="Verify OTP Modal"
    >
      <div className="text-white px-8 py-4 relative">
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-[-15px] right-[-15px] text-white/60 hover:text-yellow-600 transition-colors duration-100"
          title="Close"
        >
          <IoMdClose size={24} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            One tiny code away <br /> from shopping paradise!
          </h2>
          <p className="text-sm text-gray-400 mt-5">
            Enter the OTP sent to your phone.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-7">
          <div className="relative">
            <label htmlFor="otp" className="block text-sm mb-1 text-gray-300">
              OTP <span className="text-red-500">*</span>
            </label>
            <div className="flex justify-between mt-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className="w-12 h-12 rounded-md border border-gray-600 bg-[#1e293b] text-center text-md focus:outline-none focus:ring-2 focus:ring-yellow-600 placeholder:text-gray-400"
                  placeholder="-"
                  required
                />
              ))}
            </div>
          </div>

          <div className="text-sm w-full text-end">
            <button
              onClick={handleResendOTP}
              disabled={!resendEnabled}
              className={`text-amber-500 hover:text-yellow-500 transition-colors duration-100 ${
                !resendEnabled ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              {resendEnabled ? "Resend OTP" : `Resend OTP in ${timer}s`}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-br from-yellow-500 to-amber-500 rounded-sm py-3 font-bold text-lg text-black active:scale-95 transition ease-in-out duration-300"
          >
            Verify
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-6">
          © 2025 Rohit Kumar Yadav. All rights reserved.
        </p>
      </div>
    </Modal>
  );
}

export default VerifyOTPModal;

//   {isSubmitting ? (
//     <span className="flex items-center justify-center">
//       <svg
//         className="animate-spin h-5 w-5 mr-2 text-white"
//         viewBox="0 0 24 24"
//       >
//         <circle
//           className="opacity-25"
//           cx="12"
//           cy="12"
//           r="10"
//           stroke="currentColor"
//           strokeWidth="4"
//         />
//         <path
//           className="opacity-75"
//           fill="currentColor"
//           d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//         />
//       </svg>
//       Submitting...
//     </span>
//   ) : (
//     "Become a Member"
//   )}
