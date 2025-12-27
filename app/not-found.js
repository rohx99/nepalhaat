import Link from "next/link";
import { BiPackage } from "react-icons/bi";
import { FaHome, FaShoppingBag } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] w-full bg-gray-50 flex items-center justify-center px-4 py-16 ">
      <div className="max-w-2xl w-full text-center">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <BiPackage className="w-32 h-32 text-gray-300" strokeWidth={1.5} />
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">!</span>
            </div>
          </div>
        </div>

        {/* Error code */}
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>

        {/* Message */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Sorry, the page you&apos;re looking for doesn&apos;t exist or has been
          moved. Let&apos;s get you back to shopping!
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pb-8 border-b border-gray-200">
          <Link
            href={"/"}
            className="flex items-center gap-2 px-6 py-3 bg-[#0D1627] text-white rounded-lg font-medium hover:bg-gray-800 transition-all duration-200"
          >
            <FaHome className="w-5 h-5" />
            Back to Home
          </Link>

          <Link
            href={"/"}
            className="flex items-center gap-2 px-6 py-3 bg-[#0D1627] text-white rounded-lg font-medium hover:bg-gray-800 transition-all duration-200"
          >
            <FaShoppingBag className="w-5 h-5" />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

// <div className="mt-12 pt-8 border-t border-gray-200">
//   <p className="text-sm text-gray-500 mb-4">
//     Need help? Try these popular pages:
//   </p>
//   <div className="flex flex-wrap justify-center gap-4 text-sm">
//     <a
//       href="/shop"
//       className="text-gray-700 hover:text-black hover:underline transition-colors"
//     >
//       Shop All
//     </a>
//     <span className="text-gray-300">•</span>
//     <a
//       href="/collections"
//       className="text-gray-700 hover:text-black hover:underline transition-colors"
//     >
//       Collections
//     </a>
//     <span className="text-gray-300">•</span>
//     <a
//       href="/support"
//       className="text-gray-700 hover:text-black hover:underline transition-colors"
//     >
//       Help Center
//     </a>
//     <span className="text-gray-300">•</span>
//     <a
//       href="/contact"
//       className="text-gray-700 hover:text-black hover:underline transition-colors"
//     >
//       Contact Us
//     </a>
//   </div>
// </div>
