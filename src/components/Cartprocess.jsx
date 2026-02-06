import React from "react";
import { Link } from "react-router-dom";
import pageImage from "../assets/images/books-page-title.jpg";

const Cartprocess = ({ step = "cart" }) => {
  const steps = [
    { key: "cart", label: "Shopping Cart", path: "/cart" },
    { key: "checkout", label: "Checkout", path: "/checkout" },
    { key: "complete", label: "Order Complete" },
  ];

  const isActive = (key) => key === step;

  const isCompleted = (key) =>
    steps.findIndex((s) => s.key === key) <
    steps.findIndex((s) => s.key === step);

  return (
    <div className="relative w-full h-56 md:h-64 overflow-hidden">
      
      {/* Background Image */}
      <img
        src={pageImage}
        alt="Page title"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Steps */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <ul className="flex items-center gap-6 text-xl md:text-2xl font-semibold tracking-wide text-white">
          {steps.map((item, index) => (
            <li key={item.key} className="flex items-center gap-6">
              {item.path && !isActive(item.key) ? (
                <Link
                  to={item.path}
                  className={`transition-colors ${
                    isCompleted(item.key)
                      ? "text-[#B8964E] hover:underline"
                      : "text-gray-300"
                  }`}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={
                    isActive(item.key)
                      ? "text-[#B8964E]"
                      : "text-gray-300"
                  }
                >
                  {item.label}
                </span>
              )}

              {index < steps.length - 1 && (
                <span className="text-gray-300 text-2xl">→</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Cartprocess;
