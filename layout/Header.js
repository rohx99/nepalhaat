"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import HeaderLogo from "../public/headerLogo.svg";
import { GiRoundStar } from "react-icons/gi";
import { GoSearch } from "react-icons/go";
import {
  FaHeart,
  FaUser,
  FaUserShield,
  FaShoppingCart,
  FaFacebookF,
  FaTiktok,
  FaInstagram,
  FaBars,
  FaTimes,
  FaShoppingBag,
} from "react-icons/fa";
import SubHeader from "./SubHeader";
import LoginModal from "@/modals/LoginModal";
import { products } from "@/utils/products";
import { MdArrowDropDown } from "react-icons/md";
import { TbLogout } from "react-icons/tb";
import { useContext } from "react";
import { AppContext } from "@/context/AppContext";
import axios from "axios";

const Header = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useContext(AppContext);

  // Dropdown state
  const [isOpen, setIsOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchRef = useRef(null);
  const memberRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const timeoutRef = useRef(null);

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

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.length > 0) {
      const lowerTerm = term.toLowerCase();
      const filtered = products.filter((p) =>
        [p.productName, p.categoryName, p.subCategoryName]
          .join(" ")
          .toLowerCase()
          .includes(lowerTerm)
      );
      setFilteredSuggestions(filtered.slice(0, 6));
      setShowSuggestions(true);
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Close mobile menu and search when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        !event.target.closest("a")
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Click outside for member dropdown
  useEffect(() => {
    function handleDocClick(event) {
      if (memberRef.current && !memberRef.current.contains(event.target)) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleDocClick);
    return () => document.removeEventListener("mousedown", handleDocClick);
  }, []);

  // Close mobile menu when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSelectSuggestion = () => {
    setSearchTerm("");
    setShowSuggestions(false);
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
    setIsMobileMenuOpen(false);
  };
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const handleLoginModal = () => {
    openLoginModal();
  };

  // Dropdown control helpers
  const openDropdown = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const closeDropdownWithDelay = (delay = 100) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      timeoutRef.current = null;
    }, delay);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleMobileLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="w-full sticky z-50 top-0 left-0 bg-[#0D1627] shadow-lg">
      {/* Top Header - Logo and Actions */}
      <section className="w-full flex justify-between items-center p-3 lg:p-4 ">
        {/* Logo */}
        <Link href="/" onClick={closeMobileMenu} className="flex-shrink-0">
          <Image
            src={HeaderLogo}
            alt="logo"
            width={120}
            height={50}
            className="w-32 sm:w-32 lg:w-32 xl:w-36 h-auto"
            title="NepalHaat Logo"
            loading="eager"
            priority
          />
        </Link>

        {/* Desktop Search */}
        <section
          ref={searchRef}
          className="hidden lg:flex flex-col w-2/5 xl:w-1/2 relative mx-6"
        >
          <div className="flex items-center bg-white border-2 border-amber-500 rounded-lg shadow-sm">
            <GoSearch className="ms-3 text-xl xl:text-2xl text-gray-600" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full focus:outline-none p-2 xl:p-3 font-medium text-gray-700 text-sm xl:text-base rounded-r-lg"
              placeholder="Search for products, brands and more..."
            />
          </div>

          {showSuggestions && (
            <ul className="absolute top-full mt-2 w-full bg-white border border-gray-200 shadow-xl z-50 max-h-60 overflow-y-auto rounded-lg">
              {filteredSuggestions.length > 0 ? (
                filteredSuggestions.map((item, index) => (
                  <li key={item.slug}>
                    <Link
                      href={`/products/${item.slug}`}
                      onClick={handleSelectSuggestion}
                      className="flex items-center px-4 py-3 hover:bg-gray-50 text-gray-800 space-x-3 border-b last:border-b-0 transition-colors"
                    >
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${item.productImageOne}`}
                        alt={item.productName}
                        width={40}
                        height={40}
                        className="object-cover rounded-md border"
                        priority={index < 4}
                      />
                      <div className="flex flex-col">
                        <strong className="text-sm font-semibold">
                          {item.productName}
                        </strong>
                        <p className="text-xs text-gray-500">
                          in {item.categoryName} › {item.subCategoryName}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))
              ) : (
                <li className="px-4 py-3 text-sm text-gray-500 text-center">
                  No products found
                </li>
              )}
            </ul>
          )}
        </section>

        {/* Desktop Actions */}
        <section className="hidden lg:flex flex-row justify-end items-center space-x-4 xl:space-x-6">
          {Object.keys(user).length === 0 && (
            <>
              <Link
                className="flex items-center space-x-1 text-amber-400 hover:text-amber-300 font-semibold transition-colors"
                href="/sign-up"
                title="Create New Account"
              >
                <GiRoundStar className="text-lg" />
                <span className="text-sm xl:text-base">Create New Account</span>
              </Link>

              <button
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold px-4 xl:px-6 py-2 xl:py-3 rounded-lg active:scale-95 transition-all duration-200 shadow-md"
                onClick={handleLoginModal}
                title="Login"
              >
                <span className="flex items-center text-sm xl:text-base">
                  <FaUserShield className="me-2" />
                  Login
                </span>
              </button>
            </>
          )}

          {Object.keys(user).length > 0 && (
            <>
              <Link
                href="/wishlist"
                className="flex items-center space-x-2 text-white hover:text-amber-400 transition-colors p-2 rounded-lg hover:bg-white/10"
              >
                <FaHeart className="text-red-500 text-lg" />
                <span className="text-sm xl:text-base xl:block">Wishlist</span>
              </Link>

              <Link
                href="/orders"
                className="flex items-center space-x-2 text-white hover:text-amber-400 transition-colors p-2 rounded-lg hover:bg-white/10"
              >
                <FaShoppingCart className="text-lg" />
                <span className="text-sm xl:text-base xl:block">Orders</span>
              </Link>

              {/* Desktop Member Area */}
              <div
                ref={memberRef}
                className="relative flex items-center text-white space-x-2 xl:space-x-3 cursor-pointer"
                onPointerEnter={openDropdown}
                onPointerLeave={() => closeDropdownWithDelay(100)}
              >
                <Image
                  src={`${
                    user.profilePicture
                      ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${user.profilePicture}`
                      : "/default-avatar.png"
                  }`}
                  alt=""
                  width={40}
                  height={40}
                  className="w-8 h-8 xl:w-10 xl:h-10 rounded-full object-cover border-2 border-amber-500"
                />
                <div className="hidden xl:flex flex-col">
                  <h2 className="text-sm font-semibold">
                    {user.firstName} {user.lastName}
                  </h2>
                  <h3 className="text-xs text-gray-300 flex items-center">
                    Member <MdArrowDropDown />
                  </h3>
                </div>

                {isOpen && (
                  <div
                    className="absolute right-0 top-full mt-3 w-44 bg-white text-gray-800 rounded-lg shadow-xl border border-gray-100 z-50"
                    onPointerEnter={openDropdown}
                    onPointerLeave={() => closeDropdownWithDelay(300)}
                  >
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-2 text-sm hover:bg-gray-50 rounded-t-lg transition-colors"
                    >
                      <FaUser className="me-3 text-gray-600" /> My Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="flex items-center px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                    >
                      <FaShoppingCart className="me-3 text-gray-600" /> My
                      Orders
                    </Link>
                    <Link
                      href="/wishlist"
                      className="flex items-center px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                    >
                      <FaHeart className="me-3 text-gray-600" /> My Wishlist
                    </Link>
                    <hr className="my-1" />
                    <Link
                      href="/"
                      onClick={logout}
                      className="flex items-center px-4 py-2 text-sm hover:bg-red-50 text-red-600 font-semibold rounded-b-lg transition-colors"
                    >
                      <TbLogout className="me-3" /> Logout
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}
        </section>

        {/* Mobile Actions */}
        <div className="flex lg:hidden items-center space-x-3">
          {/* Mobile Cart/Wishlist for logged-in users */}
          {Object.keys(user).length > 0 && (
            <>
              <Link
                href="/wishlist"
                className="p-2 text-white hover:text-amber-400 transition-colors"
              >
                <FaHeart className="text-lg text-red-500" />
              </Link>
              <Link
                href="/orders"
                className="p-2 text-white hover:text-amber-400 transition-colors relative"
              >
                <FaShoppingCart className="text-lg" />
                {/* Cart badge - you can add cart count here */}
                {/* <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  3
                </span> */}
              </Link>
            </>
          )}

          {Object.keys(user).length === 0 && (
            <button
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold px-4 xl:px-6 py-2 xl:py-3 rounded-lg active:scale-95 transition-all duration-200 shadow-md"
              onClick={handleLoginModal}
              title="Login"
            >
              <span className="flex items-center text-sm xl:text-base">
                <FaUserShield className="me-2" />
                Login
              </span>
            </button>
          )}

          <button
            title={isMobileMenuOpen ? "Close Menu" : "Open Menu"}
            onClick={toggleMobileMenu}
            className="p-2 text-white hover:text-amber-400 transition-colors"
          >
            {isMobileMenuOpen ? (
              <FaTimes className="text-xl" />
            ) : (
              <FaBars className="text-xl" />
            )}
          </button>
        </div>
      </section>

      {/* Mobile Search Bar */}
      <section ref={searchRef} className="lg:hidden px-3 pb-3 relative">
        <div className="flex items-center bg-white border-2 border-amber-500 rounded-lg shadow-sm">
          <GoSearch className="ms-3 text-lg text-gray-600" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full focus:outline-none p-3 font-medium text-gray-700 text-sm rounded-r-lg"
            placeholder="Search for products..."
          />
        </div>

        {showSuggestions && (
          <ul className="absolute top-full mt-1 sm:w-full bg-white border border-gray-200 shadow-xl z-50 max-h-48 overflow-y-auto rounded-lg sm:mx-3 right-3 left-3">
            {filteredSuggestions.length > 0 ? (
              filteredSuggestions.map((item, index) => (
                <li key={item.slug} onClick={handleSelectSuggestion}>
                  <Link
                    href={`/products/${item.slug}`}
                    className="flex items-center px-3 py-2.5 hover:bg-gray-50 text-gray-800 space-x-3 border-b last:border-b-0 transition-colors"
                  >
                    <Image
                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${item.productImageOne}`}
                      alt={item.productName}
                      width={32}
                      height={32}
                      className="object-cover rounded border flex-shrink-0"
                    />
                    <div className="flex flex-col min-w-0 flex-1">
                      <strong className="text-sm font-semibold truncate">
                        {item.productName}
                      </strong>
                      <p className="text-xs text-gray-500 truncate">
                        {item.categoryName}
                      </p>
                    </div>
                  </Link>
                </li>
              ))
            ) : (
              <li className="px-3 py-3 text-sm text-gray-500 text-center">
                No products found
              </li>
            )}
          </ul>
        )}
      </section>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Slide Menu */}
      <div
        ref={mobileMenuRef}
        className={`fixed top-0 right-0 h-full w-80 bg-[#0D1627] border-l-2 border-amber-500/30 z-40 transform transition-transform duration-300 ease-out lg:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full overflow-y-auto bg-gradient-to-b from-[#0D1627] to-[#1a2332]">
          {/* Mobile Menu Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-700/50">
            <h2 className="text-white text-lg font-bold flex items-center space-x-2">
              <span>
                <FaBars />{" "}
              </span>
              <span>Menu</span>
            </h2>
            <button
              onClick={closeMobileMenu}
              aria-label="Close menu"
              className="text-white hover:text-amber-400 transition-colors p-2 hover:bg-white/10 rounded-lg"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>

          <div className="px-4 py-6">
            {/* User Section */}
            {Object.keys(user).length > 0 ? (
              <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center space-x-3 mb-4">
                  <Image
                    src={`${
                      user.profilePicture
                        ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${user.profilePicture}`
                        : "/default-avatar.png"
                    }`}
                    alt=""
                    width={50}
                    height={50}
                    className="w-12 h-12 rounded-full object-cover border-2 border-amber-500"
                  />
                  <div>
                    <h3 className="text-white font-semibold text-base">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-amber-400 text-sm">Member</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  <Link
                    href="/orders"
                    onClick={closeMobileMenu}
                    className="flex flex-col items-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <FaShoppingCart className="text-amber-400 text-lg mb-1" />
                    <span className="text-white text-xs">Orders</span>
                  </Link>
                  <Link
                    href="/wishlist"
                    onClick={closeMobileMenu}
                    className="flex flex-col items-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <FaHeart className="text-red-500 text-lg mb-1" />
                    <span className="text-white text-xs">Wishlist</span>
                  </Link>
                </div>

                <div className="space-y-2">
                  <Link
                    href="/profile"
                    onClick={closeMobileMenu}
                    className="flex items-center px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <FaUser className="me-3 text-amber-400" />
                    <span className="font-medium">My Profile</span>
                  </Link>

                  <button
                    onClick={handleMobileLogout}
                    className="w-full flex items-center px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <TbLogout className="me-3" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-10 space-y-5">
                <button
                  onClick={handleLoginModal}
                  className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  <FaUserShield className="me-2" />
                  Login to Your Account
                </button>

                <Link
                  href="/sign-up"
                  onClick={closeMobileMenu}
                  className="w-full flex items-center justify-center px-4 py-3 border-2 border-amber-500 text-amber-400 font-semibold rounded-lg hover:bg-amber-500/10 transition-colors"
                >
                  <GiRoundStar className="me-2" />
                  Create New Account
                </Link>
              </div>
            )}

            {/* Quick Links */}
            <div className="space-y-3">
              <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider border-b pb-5 border-white/30">
                Quick Links
              </h3>

              <Link
                href="/"
                onClick={closeMobileMenu}
                className="flex items-center px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <FaShoppingBag className="me-3 text-amber-400" />
                <span>All Categories</span>
              </Link>

              <Link
                href="#"
                onClick={closeMobileMenu}
                className="flex items-center px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <FaUser className="me-3 text-amber-400" />
                <span>Customer Support</span>
              </Link>
            </div>

            {/* Social Media */}
            <div className="flex flex-col justify-center items-center text-center mt-10">
              <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-7">
                Follow Us
              </h3>
              <div className="flex space-x-6">
                <a
                  href={data[1]?.value || "#"}
                  target="_blank"
                  className="text-gray-300 hover:text-white"
                >
                  <FaFacebookF size={28} />
                </a>
                <a
                  href={data[2]?.value || "#"}
                  target="_blank"
                  className="text-gray-300 hover:text-white"
                >
                  <FaTiktok size={28} />
                </a>
                <a
                  href={data[3]?.value || "#"}
                  target="_blank"
                  className="text-gray-300 hover:text-white"
                >
                  <FaInstagram size={28} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SubHeader />
      <LoginModal isOpen={isLoginModalOpen} closeModal={closeLoginModal} />
    </nav>
  );
};

export default Header;
