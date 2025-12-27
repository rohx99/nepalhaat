"use client";
// import WebEnquiry from "@/components/WebEnquiry";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import { products } from "@/utils/products";
import Whatsapp from "@/components/Whatsapp";
import axios from "axios";

const Footer = () => {
  const [data, setdata] = useState([]);

  const fetchSocialLinks = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/social/media`
      );
      if (response.data.success) {
        setdata(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  const subcategories = Array.from(
    new Set(
      products
        .map((p) => p.subCategoryName)
        .filter((sub) => sub && sub.trim() !== "")
    )
  );

  return (
    <>
      <footer className="w-full bg-[#0D1627] text-white pt-10 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 pb-10">
          {/* Logo & Description */}
          <div className="flex flex-col justify-center items-center">
            <Image
              src="/footerLogo.svg"
              alt="Company Logo"
              width={150}
              height={50}
            />
            {/* <h1 className="text-xl font-semibold">NepalHaat</h1> */}
            <h3 className="text-sm text-center mt-4 text-gray-300 leading-relaxed">
              NepalHaat is your trusted online marketplace for quality products
              at the best prices. From fashion to electronics, home essentials
              to lifestyle goods, we bring everything you need right to your
              doorstep. Shop with confidence, enjoy secure payments, and
              experience fast delivery across Nepal.
            </h3>
          </div>

          {/* Subcategories instead of Quick Links */}
          <div className="flex flex-col justify-center items-center">
            <h3 className="text-lg font-semibold mb-4">Shop by Category</h3>
            <ul className="space-y-2 text-gray-300 text-sm text-center max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
              {subcategories.map((sub, index) => (
                <li key={index}>
                  <Link
                    href={`/?subcategory=${encodeURIComponent(sub)}`}
                    className="hover:text-white transition"
                  >
                    {sub}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col justify-center items-center text-center">
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="text-sm text-gray-300 space-y-2">
              <li>Email: nepalhaat@gmail.com</li>
              <li>Phone: {data[0]?.value || "+9779705430052"}</li>
              <li>Address: Biratnagar, Nepal</li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="flex flex-col justify-center items-center text-center">
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href={data[1]?.value || "#"}
                target="_blank"
                aria-label="Facebook"
                className="text-gray-300 hover:text-white"
              >
                <FaFacebookF />
              </a>
              <a
                href={data[2]?.value || "#"}
                target="_blank"
                aria-label="TikTok"
                className="text-gray-300 hover:text-white"
              >
                <FaTiktok />
              </a>
              <a
                href={data[3]?.value || "#"}
                target="_blank"
                aria-label="Instagram"
                className="text-gray-300 hover:text-white"
              >
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700"></div>

        {/* Bottom bar */}
        <div className="py-4 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} NepalHaat. All rights reserved.
        </div>
      </footer>

      {/* <WebEnquiry /> */}
      <Whatsapp />

      {/* #58F26E */}
    </>
  );
};

export default Footer;
