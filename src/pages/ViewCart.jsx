import React, { useEffect, useState } from "react";
import { useGet } from "../hooks/useGet"; // adjust path
import { Link } from "react-router-dom";
import Cartprocess from "../components/Cartprocess";


const ViewCart = () => {
  
  // Dummy Data for UI Testing
  const dummyCart = [
    {
      id: 1,
      name: "A A Little History of Economics Little History of Economics (Little Histories)",
      oldPrice: 12000,
      newPrice: 7000,
      qty: 2,
      description:
        "A lively, inviting account of the history of economics, told through events from ancient to...",
    },
    {
      id: 2,
      name: "Atomic Habits (James Clear)",
      oldPrice: 1000,
      newPrice: 800,
      qty: 1,
      description: "A practical guide to build good habits and break bad ones.",
    },
  ];

  const { data, loading, error } = useGet("/cart");

  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // if API gives cartItems then use it else dummy
    if (data?.cartItems && data.cartItems.length > 0) {
      setCartItems(data.cartItems);
    } else {
      setCartItems(dummyCart);
    }
  }, [data]);

  // Calculate Total
  const estimatedTotal = cartItems.reduce(
    (total, item) => total + item.newPrice * item.qty,
    0
  );

  if (loading) {
    return (
      <div className="text-center py-20 text-xl font-semibold">
        Loading Cart...
      </div>
    );
  }

  return (
    <>
    <Cartprocess/>
    <div className="w-full bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* LEFT SIDE - CART ITEMS */}
          <div className="lg:col-span-2 border-t border-gray-200 pt-8">
            {/* Table Head */}
            <div className="flex justify-between items-center border-b pb-3 mb-6">
              <h3 className="text-lg font-semibold">Product</h3>
              <h3 className="text-lg font-semibold">Total</h3>
            </div>

            {/* Show API Error message (optional) */}
            {error && (
              <p className="text-sm text-red-500 mb-4">
                API failed, showing dummy data...
              </p>
            )}

            {/* Cart Items */}
            {cartItems.length === 0 ? (
              <p className="text-gray-500 text-center py-10">
                Your cart is empty
              </p>
            ) : (
              cartItems.map((item) => {
                const totalPrice = item.newPrice * item.qty;
                const saveAmount = (item.oldPrice - item.newPrice) * item.qty;

                return (
                  <div key={item.id} className="border-b pb-8 mb-8">
                    <div className="flex justify-between gap-6">
                      {/* Product Details */}
                      <div className="w-[70%]">
                        <h4 className="font-medium text-gray-800 text-sm md:text-base">
                          {item.name}
                        </h4>

                        {/* Prices */}
                        <div className="flex items-center gap-3 mt-2">
                          <p className="text-gray-400 line-through text-sm">
                            ₹{item.oldPrice.toLocaleString()}
                          </p>
                          <p className="text-orange-600 font-semibold text-sm">
                            ₹{item.newPrice.toLocaleString()}
                          </p>
                        </div>

                        {/* Save badge */}
                        <button className="mt-2 border border-black px-3 py-1 text-xs font-semibold">
                          SAVE ₹
                          {(item.oldPrice - item.newPrice).toLocaleString()}
                        </button>

                        {/* Short description */}
                        <p className="text-gray-600 text-sm mt-4">
                          {item.description}
                        </p>

                        {/* Quantity */}
                        <div className="flex items-center mt-6 border w-fit rounded overflow-hidden">
                          <button className="px-4 py-2 text-lg">-</button>

                          <span className="px-6 py-2 border-l border-r font-semibold">
                            {item.qty}
                          </span>

                          <button className="px-4 py-2 text-lg">+</button>
                        </div>

                        {/* Remove */}
                        <button className="mt-4 text-sm underline text-gray-700 hover:text-black">
                          Remove item
                        </button>
                      </div>

                      {/* Total Price */}
                      <div className="w-[30%] text-right">
                        <p className="text-orange-600 font-semibold">
                          ₹{totalPrice.toLocaleString()}
                        </p>

                        <button className="mt-3 border border-black px-3 py-1 text-xs font-semibold">
                          SAVE ₹{saveAmount.toLocaleString()}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* RIGHT SIDE - CART TOTALS */}
          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-sm font-semibold uppercase text-gray-800 border-b pb-3">
              Cart totals
            </h3>

            <div className="mt-6">
              <p className="text-sm text-gray-700">Add coupons</p>

              <h4 className="mt-8 text-lg font-semibold text-gray-800">
                Estimated total
              </h4>

              <p className="text-xl font-bold text-orange-600 mt-2">
                ₹{estimatedTotal.toLocaleString()}
              </p>
              <Link to="/checkout">
              <button className="w-full mt-8 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded">
                Proceed to Checkout
              </button></Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ViewCart;
