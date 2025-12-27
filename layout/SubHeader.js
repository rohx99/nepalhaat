"use client";
import { products } from "@/utils/products";
import Link from "next/link";
import React from "react";
import { IoMdArrowDropdown } from "react-icons/io";

const SubHeader = () => {
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

  return (
    <nav className="w-full flex justify-between items-center p-2 z-10 sticky top-0 left-0 bg-[#0D1627]">
      <section className="hidden md:flex flex-row space-x-10 items-center px-4 py-2">
        {/* ✅ First: All Products */}
        <div className="relative">
          <Link
            href="/"
            className="text-sm font-medium text-white hover:text-amber-400 transition"
          >
            New Arrivals
          </Link>
        </div>

        {/* ✅ Then loop categories */}
        {categories.map((item, index) => (
          <div key={index} className="relative group">
            <button className="text-sm font-medium text-white hover:text-amber-400 transition flex items-center gap-1">
              {item.category}
              {item.subcategories?.length > 0 && (
                <IoMdArrowDropdown className="w-4 h-4 text-white group-hover:text-amber-400 transition" />
              )}
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
    </nav>
  );
};

export default SubHeader;
