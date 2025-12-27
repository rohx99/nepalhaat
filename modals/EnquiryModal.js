"use client";

import React, { useEffect, useRef, useState } from "react";
import { BsSendFill } from "react-icons/bs";
import { FaInfoCircle } from "react-icons/fa";

const EnquiryModal = ({ isOpen, closeModal }) => {
  const [message, setMessage] = useState("");
  const boxRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        closeModal();
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [closeModal]);

  const handleSubmit = () => {
    if (!message.trim()) {
      alert("Please enter your enquiry.");
      return;
    }

    alert("Thank you! Your enquiry has been submitted.");
    setMessage("");
    closeModal();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={boxRef}
      className="fixed bottom-20 right-6 w-96 bg-[#0D1627] text-white rounded-md shadow-lg p-4 z-50 transition-all duration-300 ease-in-out"
    >
      <div className="flex justify-between items-center mb-2">
        <div className="text-start">
          <h3 className="text-sm font-semibold">Quick Enquiry</h3>
          <h3 className="text-xs font-semibold text-gray-400">
            (Kindly mention your name & contact details as well)
          </h3>
        </div>
        <div>
          <FaInfoCircle size={25} className="mb-2" />
        </div>
      </div>

      <textarea
        className="w-full h-48 px-2 pt-2 pb-10 text-sm border border-gray-300 bg-gray-100 rounded-md resize-none text-black font-medium focus:outline-none focus:ring-1 focus:ring-amber-400 relative"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="absolute right-5 bottom-7 mt-3 bg-amber-400 hover:bg-amber-500 text-white text-sm font-medium py-2 px-3 rounded transition-colors"
        title="Send Enquiry"
      >
        <BsSendFill />
      </button>
    </div>
  );
};

export default EnquiryModal;
