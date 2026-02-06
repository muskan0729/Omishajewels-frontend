import React from "react";
import { Link } from "react-router-dom";

const OrderComplete = () => {
  // Dummy order details (for UI testing)
  const orderDetails = {
    orderId: "OMI-10234",
    date: "06 Feb 2026",
    email: "guest@gmail.com",
    paymentMethod: "Sabpaisa",
    total: 43000,
  };

  const orderItems = [
    {
      id: 1,
      name: "A A Little History of Economics (Little Histories)",
      qty: 4,
      price: 7000,
      img: "https://via.placeholder.com/70",
    },
    {
      id: 2,
      name: "Greatest Greek Philosophers (Deluxe Hardcover Edition)",
      qty: 1,
      price: 4500,
      img: "https://via.placeholder.com/70",
    },
    {
      id: 3,
      name: "Assouline – New York Chic",
      qty: 1,
      price: 10500,
      img: "https://via.placeholder.com/70",
    },
  ];

  return (
    <div className="w-full bg-gray-50 py-16">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        {/* Success Box */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-green-600 text-3xl">✓</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mt-5">
            Thank you for your order!
          </h1>

          <p className="text-gray-600 mt-3 text-sm md:text-base">
            Your order has been placed successfully. A confirmation email will be
            sent to you shortly.
          </p>

          <div className="mt-6 flex flex-col md:flex-row justify-center gap-4">
            <Link to="/shop">
            <button className="bg-[#4b2c2c] hover:bg-[#3b2222] text-white font-semibold px-8 py-3 rounded">
              Continue Shopping
            </button></Link>
             {/* <Link to="/shop">
            <button className="border border-gray-400 hover:border-black text-gray-800 font-semibold px-8 py-3 rounded">
              View Order
            </button></Link> */}
          </div>
        </div>

        {/* Order Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {/* Left - Order Details */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Order Details
            </h2>

            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex justify-between">
                <span className="font-medium">Order ID</span>
                <span>{orderDetails.orderId}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">Date</span>
                <span>{orderDetails.date}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">Email</span>
                <span>{orderDetails.email}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">Payment Method</span>
                <span>{orderDetails.paymentMethod}</span>
              </div>

              <div className="flex justify-between border-t pt-3 mt-3">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="font-semibold text-orange-600">
                  ₹{orderDetails.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Right - Shipping Info */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Shipping Address
            </h2>

            <div className="text-sm text-gray-700 leading-6">
              <p className="font-medium">Muskan Sharma</p>
              <p>123, Main Street</p>
              <p>Bhopal, Madhya Pradesh</p>
              <p>India - 462001</p>
              <p className="mt-2">
                <span className="font-medium">Phone:</span> +91 9876543210
              </p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mt-12">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            Order Summary
          </h2>

          <div className="space-y-6">
            {orderItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5"
              >
                {/* Product */}
                <div className="flex items-center gap-4">
                  <img
                    src={item.img}
                    alt="product"
                    className="w-16 h-16 rounded border"
                  />

                  <div>
                    <h3 className="text-sm font-semibold text-gray-800">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Quantity: {item.qty}
                    </p>
                  </div>
                </div>

                {/* Price */}
                <div className="text-right">
                  <p className="text-sm font-semibold text-orange-600">
                    ₹{(item.price * item.qty).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    ₹{item.price.toLocaleString()} each
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Total Section */}
          <div className="flex justify-between text-lg font-semibold mt-6">
            <span>Total</span>
            <span className="text-orange-600">
              ₹{orderDetails.total.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-gray-500 mt-10">
          If you have any questions, contact us at{" "}
          <span className="font-medium text-gray-700 underline cursor-pointer">
            support@omishajewels.com
          </span>
        </p>
      </div>
    </div>
  );
};

export default OrderComplete;
