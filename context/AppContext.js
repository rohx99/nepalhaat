"use client";

import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";

export const AppContext = createContext();

export default function AppProvider({ children }) {
  // Load initial state from localStorage
  const [user, setUser] = useState({});
  const [productReviews, setproductReviews] = useState([]);

  const router = useRouter();

  // Load user from secureLocalStorage on mount
  useEffect(() => {
    const storedUser = secureLocalStorage.getItem("user");
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  // Save user to secureLocalStorage whenever it changes
  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      secureLocalStorage.setItem("user", user);
    } else {
      secureLocalStorage.removeItem("user");
    }
  }, [user]);

  // Handle logout
  const logout = () => {
    secureLocalStorage.clear();
    router.push("/");
    setUser({});
  };

  //   // Add item to cart
  //   const addToCart = (item) => {
  //     setCart((prev) => {
  //       const updatedCart = [...prev, item];
  //       return updatedCart;
  //     });
  //   };

  //   // Remove item from cart
  //   const removeFromCart = (id) => {
  //     setCart((prev) => prev.filter((item) => item.id !== id));
  //   };

  //   // Clear cart
  //   const clearCart = () => {
  //     setCart([]);
  //   };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        logout,
        productReviews,
        setproductReviews,
        // cart,
        // setCart,
        // addToCart,
        // removeFromCart,
        // clearCart,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
