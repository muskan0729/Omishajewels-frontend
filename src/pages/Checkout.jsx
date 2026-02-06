import React from "react";
import { Link } from "react-router-dom";
import Cartprocess from "../components/Cartprocess";



const Checkout = () => {
  // Dummy Order Summary Items
  const orderItems = [
    {
      id: 1,
      qty: 4,
      name: "A A Little History of Economics Little History of Economics (Little Histories)",
      oldPrice: 12000,
      newPrice: 7000,
      total: 28000,
      img: "https://via.placeholder.com/60",
      desc: "A lively, inviting account of the history of economics, told through events from ancient to...",
    },
    {
      id: 2,
      qty: 1,
      name: "Greatest Greek Philosophers (Deluxe Hardcover Edition)",
      oldPrice: 5000,
      newPrice: 4500,
      total: 4500,
      img: "https://via.placeholder.com/60",
      desc: "Explore the intellectual marvels of ancient Greece through the profound insights of its greatest philosophers...",
    },
    {
      id: 3,
      qty: 1,
      name: "Assouline – New York Chic",
      oldPrice: 15000,
      newPrice: 10500,
      total: 10500,
      img: "https://via.placeholder.com/60",
      desc: "A hardcover “coffee-table” book that offers a photographic — and intimate — portrait of New...",
    },
  ];

  const subtotal = orderItems.reduce((sum, item) => sum + item.total, 0);

  return (
    <>
    <Cartprocess/>
    <div className="w-full bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* LEFT SIDE FORM */}
          <div className="lg:col-span-2">
            {/* Terms */}
            <p className="text-sm text-gray-700 mb-8">
              Terms & Conditions – Omisha Jewels{" "}
              <span className="text-gray-400">↗</span>
            </p>

            {/* Contact Info */}
            <h2 className="text-2xl font-semibold mb-2">
              Contact information
            </h2>
            <p className="text-sm text-gray-600 mb-5">
              We'll use this email to send you details and updates about your
              order.
            </p>

            <input
              type="email"
              placeholder="Email address"
              className="w-full border border-gray-400 px-4 py-3 rounded outline-none focus:border-black"
            />

            <p className="text-xs text-gray-600 mt-2">
              You are currently checking out as a guest.
            </p>

            {/* Billing Address */}
            <h2 className="text-2xl font-semibold mt-12 mb-2">
              Billing address
            </h2>
            <p className="text-sm text-gray-600 mb-5">
              Enter the billing address that matches your payment method.
            </p>

            {/* Country */}
            {/* <select className="w-full border border-gray-400 px-4 py-3 rounded outline-none focus:border-black">
              <option>India</option>
              <option>USA</option>
              <option>UK</option>
            </select> */}

            <input
              type="text"
              placeholder="coutry"
              className="w-full border border-gray-400 px-4 py-3 rounded outline-none focus:border-black mt-4"
            />

            {/* First + Last */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <input
                type="text"
                placeholder="First name"
                className="w-full border border-gray-400 px-4 py-3 rounded outline-none focus:border-black"
              />
              <input
                type="text"
                placeholder="Last name"
                className="w-full border border-gray-400 px-4 py-3 rounded outline-none focus:border-black"
              />
            </div>

            {/* Address */}
            <input
              type="text"
              placeholder="Address"
              className="w-full border border-gray-400 px-4 py-3 rounded outline-none focus:border-black mt-4"
            />

            <p className="text-sm text-gray-700 mt-3 cursor-pointer hover:underline">
              + Add apartment, suite, etc.
            </p>

            {/* City + State */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <input
                type="text"
                placeholder="City"
                className="w-full border border-gray-400 px-4 py-3 rounded outline-none focus:border-black"
              />
              {/* <select className="w-full border border-gray-400 px-4 py-3 rounded outline-none focus:border-black">
                <option>Madhya Pradesh</option>
                <option>Maharashtra</option>
                <option>Delhi</option>
              </select> */}
              
                          <input
              type="text"
              placeholder="city"
              className="w-full border border-gray-400 px-4 py-3 rounded outline-none focus:border-black mt-4"
            />
            </div>

            {/* Pin + Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <input
                type="text"
                placeholder="PIN Code"
                className="w-full border border-gray-400 px-4 py-3 rounded outline-none focus:border-black"
              />
              <input
                type="text"
                placeholder="Phone (optional)"
                className="w-full border border-gray-400 px-4 py-3 rounded outline-none focus:border-black"
              />
            </div>

            {/* Payment Options */}
            <h2 className="text-2xl font-semibold mt-12 mb-4">
              Payment options
            </h2>

            <div className="border border-gray-400 rounded p-4">
              <h3 className="font-semibold text-gray-800">Sabpaisa</h3>
              <p className="text-sm text-gray-600 mt-2">
                Pay securely via Sabpaisa.
              </p>
            </div>

            {/* Note checkbox */}
            <div className="flex items-center gap-3 mt-8">
              <input type="checkbox" className="w-4 h-4" />
              <p className="text-sm text-gray-700">Add a note to your order</p>
            </div>

            <p className="text-xs text-gray-600 mt-10 border-t pt-6">
              By proceeding with your purchase you agree to our{" "}
              <span className="underline cursor-pointer">
                Terms and Conditions
              </span>{" "}
              and{" "}
              <span className="underline cursor-pointer">Privacy Policy</span>
            </p>

            {/* Bottom Buttons */}
            <div className="flex flex-col md:flex-row justify-between items-center mt-10 gap-5">
              <button className="text-sm font-medium text-gray-800 flex items-center gap-2 hover:underline">
                ← Return to Cart
              </button>
             <Link to="/order">
              <button className="bg-[#4b2c2c] hover:bg-[#3b2222] text-white font-semibold px-10 py-3 rounded w-full md:w-auto">
                PLACE ORDER
              </button></Link>
            </div>
          </div>

          {/* RIGHT SIDE SUMMARY */}
          <div className="border border-gray-200 rounded-lg p-6 h-fit">
            <h2 className="text-lg font-semibold mb-6">Order summary</h2>

            {/* Items */}
            <div className="space-y-8">
              {orderItems.map((item) => (
                <div key={item.id} className="flex gap-4">
                  {/* Image */}
                  <div className="relative">
                    <img
                      src={item.img}
                      alt="product"
                      className="w-14 h-14 rounded border"
                    />
                    <span className="absolute -top-2 -right-2 bg-gray-200 text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full">
                      {item.qty}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex justify-between gap-4">
                      <h3 className="text-sm font-semibold text-gray-800">
                        {item.name}
                      </h3>
                      <p className="text-sm font-semibold text-orange-600">
                        ₹{item.total.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex gap-3 mt-2">
                      <p className="text-xs line-through text-gray-400">
                        ₹{item.oldPrice.toLocaleString()}
                      </p>
                      <p className="text-xs font-semibold text-orange-600">
                        ₹{item.newPrice.toLocaleString()}
                      </p>
                    </div>

                    <p className="text-xs text-gray-600 mt-3 line-clamp-2">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupons */}
            <div className="border-t mt-8 pt-5 flex justify-between items-center text-sm">
              <p className="text-gray-700">Add coupons</p>
              <span className="text-gray-600">⌄</span>
            </div>

            {/* Subtotal */}
            <div className="border-t mt-5 pt-5 flex justify-between text-sm">
              <p className="text-gray-700">Subtotal</p>
              <p className="font-semibold">₹{subtotal.toLocaleString()}</p>
            </div>

            {/* Total */}
            <div className="border-t mt-5 pt-5 flex justify-between text-lg font-semibold">
              <p>Total</p>
              <p>₹{subtotal.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Checkout;
