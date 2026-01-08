"use client";
import { products } from "@/utils/products";
import Link from "next/link";
import React, { useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { HiMenuAlt3 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import Image from "next/image";
import arrivalImg from "../public/arrivalCategory.webp";
import beautyImg from "../public/beautyCategory.webp";
import electronicsImg from "../public/electronicsCategory.webp";
import fashionImg from "../public/fashionCategory.webp";
import { BiSolidCategory } from "react-icons/bi";

const SubHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);

  const categoryImages = {
    "Beauty & Personal Care": beautyImg,
    Electronics: electronicsImg,
    Fashion: fashionImg,
  };

  // Build categories with subcategories dynamically
  const categories = products.reduce((acc, product) => {
    const { categoryName, subCategoryName } = product;
    let category = acc.find((c) => c.category === categoryName);

    if (!category) {
      category = { category: categoryName, subcategories: [] };
      acc.push(category);
    }

    if (subCategoryName && !category.subcategories.includes(subCategoryName)) {
      category.subcategories.push(subCategoryName);
    }

    return acc;
  }, []);

  const toggleCategory = (index) => {
    setExpandedCategory(expandedCategory === index ? null : index);
  };

  return (
    <nav className="w-full flex justify-between items-center p-2 z-10 sticky top-0 left-0 bg-[#0D1627]">
      {/* Desktop & Tablet Navigation (Original - md and up) */}
      <section className="hidden md:flex flex-row space-x-10 items-center px-4 py-2">
        {/* ✅ First: All Products */}
        <div className="relative">
          <Link
            href="/"
            className="text-sm font-medium text-white hover:text-amber-400 transition flex flex-col items-center justify-center space-y-2"
          >
            <Image
              src={arrivalImg}
              alt={"Arrival Img"}
              width={50}
              height={50}
              className="object-contain"
            />
            <span>New Arrivals</span>
          </Link>
        </div>

        {/* ✅ Then loop categories */}
        {categories.map((item, index) => (
          <div key={index} className="relative group">
            <button className="text-sm font-medium text-white hover:text-amber-400 transition  flex flex-col items-center justify-center gap-2">
              {categoryImages[item.category] && (
                <Image
                  src={categoryImages[item.category]}
                  alt={item.category}
                  width={50}
                  height={50}
                  className="object-contain"
                />
              )}
              <div className="flex items-center justify-between">
                <span>{item.category}</span>
                {item.subcategories?.length > 0 && (
                  <IoMdArrowDropdown className="w-4 h-4 text-white group-hover:text-amber-400 transition" />
                )}
              </div>
            </button>

            {item.subcategories?.length > 0 && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-md border border-gray-200 rounded opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 z-20">
                <ul className="flex flex-col p-2">
                  {item.subcategories.map((sub, subIndex) => (
                    <div key={subIndex}>
                      <Link href={`/?subcategory=${encodeURIComponent(sub)}`}>
                        <li className="px-4 py-2 text-sm hover:bg-gray-100 text-gray-700 cursor-pointer">
                          {sub}
                        </li>
                      </Link>
                    </div>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </section>

      {/* Mobile Navigation Header */}
      <section className="md:hidden flex items-center justify-between w-full px-2">
        <h3
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-white font-semibold text-lg flex items-center space-x-2"
        >
          <BiSolidCategory className="w-6 h-6" />
          <span>Categories</span>
        </h3>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-white p-2 hover:text-amber-400 transition"
        >
          {mobileMenuOpen ? (
            <IoClose className="w-6 h-6" />
          ) : (
            <HiMenuAlt3 className="w-6 h-6" />
          )}
        </button>
      </section>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#0D1627] border-t border-gray-700 max-h-[70vh] overflow-y-auto shadow-lg">
          {/* New Arrivals */}
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-white hover:bg-gray-800 transition border-b border-gray-700"
          >
            <Image
              src={arrivalImg}
              alt={"Arrival Img"}
              width={40}
              height={40}
              className="object-contain"
            />
            <span className="text-sm font-medium">New Arrivals</span>
          </Link>

          {/* Categories */}
          {categories.map((item, index) => (
            <div key={index} className="border-b border-gray-700">
              <button
                onClick={() => toggleCategory(index)}
                className="w-full flex items-center justify-between px-4 py-3 text-white hover:bg-gray-800 transition"
              >
                <div className="flex items-center gap-3">
                  {categoryImages[item.category] && (
                    <Image
                      src={categoryImages[item.category]}
                      alt={item.category}
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  )}
                  <span className="text-sm font-medium">{item.category}</span>
                </div>
                {item.subcategories?.length > 0 && (
                  <IoMdArrowDropdown
                    className={`w-5 h-5 transition-transform ${
                      expandedCategory === index ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>

              {/* Subcategories */}
              {expandedCategory === index && item.subcategories?.length > 0 && (
                <div className="bg-gray-800">
                  {item.subcategories.map((sub, subIndex) => (
                    <Link
                      key={subIndex}
                      href={`/?subcategory=${encodeURIComponent(sub)}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="px-4 py-2.5 pl-16 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition">
                        {sub}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </nav>
  );
};

export default SubHeader;
