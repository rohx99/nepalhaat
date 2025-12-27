"use client";

import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { GiReturnArrow } from "react-icons/gi";
import { TiCancel } from "react-icons/ti";
import { IoBagCheckOutline } from "react-icons/io5";
import { TbTruckLoading } from "react-icons/tb";
import { CgSandClock } from "react-icons/cg";
import { GoVerified } from "react-icons/go";
import { IoReceiptOutline } from "react-icons/io5";
import { LuCalendarClock } from "react-icons/lu";
import { ImCloudDownload } from "react-icons/im";
import moment from "moment";
import axios from "axios";
import { AppContext } from "@/context/AppContext";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const router = useRouter();
  const { user } = useContext(AppContext);

  useEffect(() => {
    if (user && Object.keys(user).length < 1) {
      router.push("/");
    }
  }, [user, router]);

  async function fetchOrders() {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/customer/${user._id}`
      );

      if (response.data.success) {
        const refactoredOrders = response.data.orders.map((order) => ({
          id: order._id,
          date: order.createdAt,
          status: order.status,
          total: order.finalPrice,
          items: [
            {
              name: order.productId.productName,
              image: `${process.env.NEXT_PUBLIC_IMAGE_URL}/${order.productId.productImageOne}`,
              qty: Number(order.quantity),
              price: Number(order.finalPrice),
              size: order.size,
              color: order.color,
              deliveryAddress: order.deliveryAddress,
            },
          ],
        }));
        setOrders(refactoredOrders);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOrderCancelStatus = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you really want to cancel this order?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, cancel it!",
        cancelButtonText: "No, keep it",
      });

      if (result.isConfirmed) {
        const response = await axios.patch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/${id}`,
          { status: "Cancelled" }
        );

        if (response.data.success) {
          Swal.fire({
            icon: "success",
            title: "Cancelled!",
            text: "Your order has been cancelled successfully.",
            timer: 3000,
          });
          fetchOrders();
        }
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong while cancelling the order!",
      });
    }
  };

  const statusColors = {
    Pending: "bg-amber-500 text-white",
    Confirmed: "bg-emerald-600 text-white",
    Shipped: "bg-sky-600 text-white",
    Delivered: "bg-teal-600 text-white",
    Cancelled: "bg-rose-500 text-white",
    Returned: "bg-slate-600 text-white",
  };

  const statusIcons = {
    Pending: <CgSandClock />,
    Confirmed: <GoVerified />,
    Shipped: <TbTruckLoading />,
    Delivered: <IoBagCheckOutline />,
    Cancelled: <TiCancel />,
    Returned: <GiReturnArrow />,
  };

  const statusBgColors = {
    Pending: "bg-gradient-to-tr from-amber-50 via-amber-100 to-amber-200",
    Confirmed:
      "bg-gradient-to-tr from-emerald-50 via-emerald-100 to-emerald-200",
    Shipped: "bg-gradient-to-tr from-sky-50 via-sky-100 to-sky-200",
    Delivered: "bg-gradient-to-tr from-teal-50 via-teal-100 to-teal-200",
    Cancelled: "bg-gradient-to-tr from-rose-50 via-rose-100 to-rose-200",
    Returned: "bg-gradient-to-tr from-slate-50 via-slate-100 to-slate-200",
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 sm:py-8">
      {/* Header */}
      <div className="bg-white shadow-sm py-4 sm:py-6 mb-4 sm:mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
            My Orders 📦
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
            View and track all your past orders.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-white shadow-md rounded-2xl border border-gray-100 hover:shadow-xl hover:-translate-y-1 transform transition-all duration-200 flex flex-col h-full"
            >
              {/* Order Header */}
              <div
                className={`px-4 py-3 sm:px-5 sm:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between border-b rounded-t-2xl ${
                  statusBgColors[order.status] || "bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <IoReceiptOutline className="text-lg sm:text-xl text-amber-700" />
                  <div>
                    <p className="text-xs text-amber-700 tracking-wide uppercase font-semibold">
                      Order ID
                    </p>
                    <p className="font-semibold text-xs sm:text-sm text-gray-800">
                      {order.id}
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:mt-0 flex items-center gap-2 py-1 text-xs sm:text-sm font-medium text-end">
                  <LuCalendarClock className="text-base sm:text-lg text-amber-700" />
                  <p className="font-semibold text-gray-800">
                    {moment(order.date).format("DD MMM YYYY | hh:mm A")}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div className="flex-1 px-4 py-3 sm:px-5 sm:py-4 space-y-3 sm:space-y-4">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 sm:gap-4 border-b pb-3 sm:pb-4 last:border-b-0 last:pb-0"
                  >
                    <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-xl overflow-hidden border border-gray-200">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="text-gray-800 font-semibold text-sm sm:text-base truncate text-wrap">
                        {item.name}
                      </h3>
                      <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
                        {item.size && (
                          <p>
                            <span className="text-gray-700 font-medium">
                              Size:
                            </span>{" "}
                            {item.size}
                          </p>
                        )}
                        {item.color && (
                          <p>
                            <span className="text-gray-700 font-medium">
                              Color:
                            </span>{" "}
                            {item.color}
                          </p>
                        )}
                        <p>
                          <span className="text-gray-700 font-medium">
                            Qty:
                          </span>{" "}
                          {item.qty}
                        </p>
                      </div>
                      <div className="bg-gray-100 p-2 text-xs sm:text-sm rounded-md">
                        {item.deliveryAddress}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 sm:px-5 sm:py-4 bg-gray-50 border-t rounded-b-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                <p className="font-semibold text-sm sm:text-base text-gray-800">
                  Total Amount:{" "}
                  <span className="text-green-700 tracking-wider text-base sm:text-lg">
                    ₹{order.total}.00
                  </span>
                </p>
                <div className="flex justify-end flex-wrap gap-2 sm:gap-3">
                  <div
                    className={`flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm gap-1 ${
                      statusColors[order.status]
                    }`}
                  >
                    <span>{statusIcons[order.status]}</span>
                    <span>{order.status}</span>
                  </div>
                  {order.status === "Pending" && (
                    <button
                      onClick={() => handleOrderCancelStatus(order.id)}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-100 hover:bg-red-200 rounded-lg text-xs sm:text-sm transition text-red-600"
                    >
                      Cancel Order
                    </button>
                  )}
                  {order.status !== "Pending" &&
                    order.status !== "Cancelled" && (
                      <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-indigo-500 to-teal-400 rounded-lg text-xs sm:text-sm text-white flex items-center gap-1 sm:gap-2">
                        <ImCloudDownload /> <span>Invoice</span>
                      </button>
                    )}
                </div>
              </div>
            </div>
          ))
        ) : (
          // Empty State
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex flex-col items-center justify-center py-12 sm:py-16 md:py-20">
            <Image
              src="/empty-orders.svg"
              alt="No Orders"
              width={150}
              height={150}
              className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48"
            />
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-700 mt-3 sm:mt-4">
              You haven’t placed any orders yet
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2 text-center">
              Start shopping and your orders will appear here.
            </p>
            <Link
              href="/"
              className="mt-3 sm:mt-4 bg-red-600 hover:bg-red-700 text-white px-4 sm:px-5 py-2 rounded-lg shadow text-xs sm:text-sm transition"
            >
              Browse Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
