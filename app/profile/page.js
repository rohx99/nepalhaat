"use client";
import Image from "next/image";
import { useContext, useState, useEffect } from "react";
import { TbEdit } from "react-icons/tb";
import { MdVerified } from "react-icons/md";
import { AppContext } from "@/context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";

export default function Profile() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    contactNumber: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });
  const [profilePic, setProfilePic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const { user, setUser } = useContext(AppContext);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        address: user.address || "",
        contactNumber: user.contactNumber || "",
        city: user.city || "",
        state: user.state || "",
        country: user.country || "",
        pincode: user.pincode || "",
      }));
      setPreviewUrl(user.profilePicture);
    }
  }, [user]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validate file type and size
  const validateFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, GIF, or WebP)");
      return false;
    }

    if (file.size > maxSize) {
      toast.error("File size must be less than 5MB");
      return false;
    }

    return true;
  };

  // Handle profile picture change with preview
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file
      if (!validateFile(file)) {
        // Reset the input
        e.target.value = '';
        return;
      }

      setIsUploading(true);
      setProfilePic(file);
      
      // Clean up previous preview URL
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
      
      // Create preview URL for immediate display
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
      setIsUploading(false);
    }
  };

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Get the full image URL for display
  const getImageUrl = (url) => {
    if (!url) return "/default-avatar.png";
    
    // Handle blob URLs directly (for file previews)
    if (url.startsWith("blob:")) {
      return url;
    }
    
    // Handle full HTTP/HTTPS URLs
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    // For relative paths, normalize and concatenate with base URL
    const baseUrl = process.env.NEXT_PUBLIC_IMAGE_URL || "";
    if (!baseUrl) {
      // If no base URL is configured, return the relative path as is
      return url.startsWith("/") ? url : `/${url}`;
    }
    
    const cleanBase = baseUrl.replace(/\/$/, "");
    const cleanPath = url.replace(/^\//, "").replace(/\\/g, "/");
    const fullUrl = `${cleanBase}/${cleanPath}`;
    
    return fullUrl;
  };

  // Validate form fields
  const validateForm = () => {
    let newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = "This field is required";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const form = new FormData();
    form.append("firstName", formData.firstName);
    form.append("lastName", formData.lastName);
    form.append("email", formData.email);
    form.append("address", formData.address);
    form.append("contactNumber", formData.contactNumber);
    form.append("city", formData.city);
    form.append("state", formData.state);
    form.append("country", formData.country);
    form.append("pincode", formData.pincode);
    if (profilePic) form.append("profilePicture", profilePic);

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/customers/${user._id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${secureLocalStorage.getItem("token")}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        toast("✅ Profile updated successfully");
        setUser(response.data.data);
        if (previewUrl && previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(response.data.data.profilePicture);
        setProfilePic(null); // Reset the file state
      }
    } catch (error) {
      console.log(error);
      toast.error(`${error.response?.data?.message || 'Failed to update profile'}`);
    }
  };

  const imageUrl = getImageUrl(previewUrl);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-100 px-4 py-6 sm:px-6 sm:py-8">
      <div className="flex flex-col lg:flex-row items-center justify-evenly bg-white rounded-2xl shadow-xl w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 gap-6 lg:gap-10">
        {/* Profile Picture */}
        <div
          className="relative h-64 sm:h-80 lg:h-96 w-full sm:w-64 lg:w-72 rounded-2xl overflow-hidden shadow-md bg-center bg-cover flex justify-center items-center"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(13, 22, 39, 0.67), rgba(13, 22, 39, 0.67)), url(${
              imageUrl || "/default-avatar.png"
            })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="p-4 sm:p-6 text-white/90 flex flex-col gap-3 sm:gap-4">
            <Image
              src={imageUrl}
              alt="Profile Picture"
              width={150}
              height={150}
              className="rounded-full h-40 w-40 sm:h-48 sm:w-48 lg:h-56 lg:w-56 object-cover border p-1 border-white/50"
            />
            <div className="border-b border-white/70" />
            <h4 className="text-center font-semibold text-white text-base sm:text-lg lg:text-xl flex justify-center items-center">
              {formData.firstName} {formData.lastName}
              <MdVerified className="text-sky-500 ms-1 mb-1" />
            </h4>
          </div>
          
          {/* Enhanced Edit Button with better mobile interaction */}
          <div className="absolute bottom-20 sm:bottom-24 lg:bottom-28 right-4 sm:right-6 lg:right-8 z-20">
            <label 
              htmlFor="edit-pp" 
              className="cursor-pointer block"
              title="Update Profile Picture"
            >
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full p-2 sm:p-2.5 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                {isUploading ? (
                  <div className="animate-spin h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  <TbEdit className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                )}
              </div>
            </label>
            <input
              type="file"
              className="hidden"
              id="edit-pp"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={handleProfilePicChange}
            />
          </div>
        </div>

        {/* Form */}
        <div className="w-full max-w-2xl lg:max-w-3xl">
          <form onSubmit={handleSubmit} className="text-black space-y-6 sm:space-y-8">
            <div className="flex flex-col lg:flex-row justify-between gap-4 lg:gap-6">
              {/* Left section */}
              <section className="space-y-4 sm:space-y-6 flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <InputField
                    name="firstName"
                    label="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    error={errors.firstName}
                  />
                  <InputField
                    name="lastName"
                    label="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    error={errors.lastName}
                  />
                </div>
                <InputField
                  name="email"
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                />
                <InputField
                  name="contactNumber"
                  label="Contact Number"
                  type="tel"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  error={errors.contactNumber}
                />
              </section>

              {/* Right section */}
              <section className="space-y-4 sm:space-y-6 flex-1">
                <InputField
                  name="address"
                  label="Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  error={errors.address}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <InputField
                    name="city"
                    label="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    error={errors.city}
                  />
                  <InputField
                    name="state"
                    label="State"
                    value={formData.state}
                    onChange={handleInputChange}
                    error={errors.state}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <InputField
                    name="country"
                    label="Country"
                    value={formData.country}
                    onChange={handleInputChange}
                    error={errors.country}
                    disabled={true}
                  />
                  <InputField
                    name="pincode"
                    label="Pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    error={errors.pincode}
                  />
                </div>
              </section>
            </div>

            {errors.form && (
              <p className="text-red-500 text-xs sm:text-sm text-center">{errors.form}</p>
            )}

            <button
              type="submit"
              className="w-full p-2 sm:p-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 font-semibold text-sm sm:text-base"
            >
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Reusable Input Field Component
function InputField({
  name,
  label,
  value,
  onChange,
  error,
  type = "text",
  disabled = false,
}) {
  return (
    <div>
      <label className="block text-xs sm:text-sm font-semibold text-gray-500 mb-1 sm:mb-2">
        {label} <span className="text-red-600">*</span>
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={label}
        disabled={disabled}
        className="w-full p-2 sm:p-3 border shadow-lg rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition duration-200 outline-none bg-white/10 text-xs sm:text-sm"
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}