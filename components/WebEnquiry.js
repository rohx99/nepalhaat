"use client";

import EnquiryModal from "@/modals/EnquiryModal";
import React, { useState } from "react";
import { RiCustomerService2Fill } from "react-icons/ri";

const WebEnquiry = () => {
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);

  const openEnquiryModal = () => setIsEnquiryModalOpen(true);
  const closeEnquiryModal = () => setIsEnquiryModalOpen(false);
  const handleEnquiryModal = () => {
    openEnquiryModal();
  };
  return (
    <>
      <button
        className="fixed bottom-20 right-7 hover:text-amber-500 text-amber-400 transition-colors z-50 bg-transparent"
        title="Enquiry"
        onClick={handleEnquiryModal}
      >
        <RiCustomerService2Fill size={48} />

        <EnquiryModal
          isOpen={isEnquiryModalOpen}
          closeModal={closeEnquiryModal}
        />
      </button>
    </>
  );
};

export default WebEnquiry;
