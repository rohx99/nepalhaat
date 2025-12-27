"use client";

import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const Whatsapp = () => {
  const [phoneNumber, setphoneNumber] = useState("9634227118");

  const type = 1; // For Whatsapp type is 1

  const fetchWhatsappNumber = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/social/media/${type}`
      );
      if (response.data.success) {
        setphoneNumber(response.data.data.value);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchWhatsappNumber();
  }, []);

  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}`;
    window.open(url, "_blank");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50"
      title={phoneNumber}
      aria-label="Chat on WhatsApp"
    >
      <Image
        src="/whatsapp.svg"
        alt="WhatsApp"
        className="bg-transparent"
        width={52}
        height={52}
      />
    </button>
  );
};

export default Whatsapp;
