import { Ovo } from "next/font/google";
import "./globals.css";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppProvider from "@/context/AppContext";

const ovo = Ovo({
  subsets: ["latin"],
  weight: "400",
});

export const metadata = {
  title: "NepalHaat",
  description:
    "NepalHaat is your trusted online marketplace for quality products at the best prices. From fashion to electronics, home essentials to lifestyle goods, we bring everything you need right to your doorstep. Shop with confidence, enjoy secure payments, and experience fast delivery across Nepal.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${ovo.className} antialiased bg-[#fafafa] bg-cover min-h-screen w-full`}
      >
        <AppProvider>
          <section className="max-w-[1400px] mx-auto">
            <Header />
            {children}
            <Footer />
            <ToastContainer
              position="top-right"
              autoClose={2000}
              hideProgressBar={false}
              newestOnTop={true}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </section>
        </AppProvider>
      </body>
    </html>
  );
}
