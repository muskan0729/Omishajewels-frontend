// Cartprocess.js
import React from "react";
import { Link, useLocation } from "react-router-dom";
import pageImage from "../assets/images/books-page-title.jpg";
import { useCart } from "../context/CartContext";

const Cartprocess = () => {
  const location = useLocation();
  const { cartCount } = useCart(); // Optional: to show cart count in process

  const steps = [
    { key: "cart", label: "Shopping Cart", path: "/view-cart" },
    { key: "checkout", label: "Checkout", path: "/checkout" },
    { key: "complete", label: "Order Complete", path: "/order" },
  ];

  // Check if cart is empty to disable checkout step (optional)
  const isCheckoutDisabled = steps[1].path === location.pathname && cartCount === 0;

  return (
    <div className="relative w-full h-56 md:h-64 overflow-hidden">
      {/* Background image */}
      <img
        src={pageImage}
        alt="Page title"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Steps */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <ul className="flex items-center gap-6 text-xl md:text-2xl font-semibold tracking-wide">
          {steps.map((item, index) => {
            const isActive = location.pathname === item.path;
            const isCompleted = location.pathname.includes('checkout') && item.key === 'cart';

            return (
              <li key={item.key} className="flex items-center gap-6">
                <Link
                  to={item.path}
                  className={`transition-colors duration-200 ${
                    isActive
                      ? "text-[#B8964E]"
                      : isCompleted
                      ? "text-green-400 hover:text-[#B8964E]/80"
                      : "text-white hover:text-[#B8964E]/80"
                  }`}
                >
                  {item.label}
                </Link>

                {index < steps.length - 1 && (
                  <span className="text-white text-2xl">→</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Cartprocess;