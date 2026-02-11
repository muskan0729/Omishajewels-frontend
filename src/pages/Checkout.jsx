import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Cartprocess from "../components/Cartprocess";
import { useGet } from "../hooks/useGet";
  import Loader from "../components/Loader";


const Checkout = () => {
  const { data, loading, error } = useGet("cart");
  const IMG_URL = import.meta.env.VITE_IMG_URL;

  const [orderItems, setOrderItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);

  // 🔹 Map cart API → checkout UI
  useEffect(() => {
    if (data?.items?.length > 0) {
      const formattedItems = data.items.map((item) => ({
        id: item.id,
        qty: Number(item.quantity),
        name: item.ebook.title,
        oldPrice: Number(item.ebook.price),
        newPrice: Number(item.price),
        total: Number(item.price) * Number(item.quantity),
        desc: item.ebook.description,
        img: item.ebook.image?.split("/").pop(), // replace with real image later
      }));
      setOrderItems(formattedItems);
      setSubtotal(Number(data.subtotal));
    } else {
      setOrderItems([]);
      setSubtotal(0);
    }
  }, [data]);

  // 🔹 Loading state
  if (loading) {
    return (
      <Loader />
    );
  }

  // 🔹 Error state
  if (error) {
    return (
      <div className="text-center py-20 text-red-500">
        Failed to load checkout
      </div>
    );
  }



  return (
    <>
      <Cartprocess />

      <div className="w-full bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* LEFT SIDE FORM */}
            <div className="lg:col-span-2">
              <p className="text-sm text-gray-700 mb-8">
                Terms & Conditions – Omisha Jewels{" "}
                <span className="text-gray-400">↗</span>
              </p>

              {/* Contact Info */}
              <h2 className="text-2xl font-semibold mb-2">
                Contact information
              </h2>
              <p className="text-sm text-gray-600 mb-5">
                We'll use this email to send order updates.
              </p>

              <input
                type="email"
                placeholder="Email address"
                className="w-full border px-4 py-3 rounded outline-none focus:border-black"
              />

              <p className="text-xs text-gray-600 mt-2">
                You are currently checking out as a guest.
              </p>

              {/* Billing Address */}
              <h2 className="text-2xl font-semibold mt-12 mb-2">
                Billing address
              </h2>

              <input
                type="text"
                placeholder="Country"
                className="w-full border px-4 py-3 rounded outline-none focus:border-black mt-4"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <input
                  type="text"
                  placeholder="First name"
                  className="w-full border px-4 py-3 rounded outline-none focus:border-black"
                />
                <input
                  type="text"
                  placeholder="Last name"
                  className="w-full border px-4 py-3 rounded outline-none focus:border-black"
                />
              </div>

              <input
                type="text"
                placeholder="Address"
                className="w-full border px-4 py-3 rounded outline-none focus:border-black mt-4"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <input
                  type="text"
                  placeholder="City"
                  className="w-full border px-4 py-3 rounded outline-none focus:border-black"
                />
                <input
                  type="text"
                  placeholder="State"
                  className="w-full border px-4 py-3 rounded outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <input
                  type="text"
                  placeholder="PIN Code"
                  className="w-full border px-4 py-3 rounded outline-none focus:border-black"
                />
                <input
                  type="text"
                  placeholder="Phone"
                  className="w-full border px-4 py-3 rounded outline-none focus:border-black"
                />
              </div>

              {/* Payment */}
              <h2 className="text-2xl font-semibold mt-12 mb-4">
                Payment options
              </h2>

              <div className="border rounded p-4">
                <h3 className="font-semibold">Sabpaisa</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Pay securely via Sabpaisa.
                </p>
              </div>

              <div className="flex items-center gap-3 mt-8">
                <input type="checkbox" className="w-4 h-4" />
                <p className="text-sm text-gray-700">
                  Add a note to your order
                </p>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-center mt-10 gap-5">
                <Link
                  to="/view-cart"
                  className="text-sm font-medium text-gray-800 hover:underline"
                >
                  ← Return to Cart
                </Link>

                <Link to="/order">
                  <button className="bg-[#4b2c2c] hover:bg-[#3b2222] text-white font-semibold px-10 py-3 rounded w-full md:w-auto">
                    PLACE ORDER
                  </button>
                </Link>
              </div>
            </div>

            {/* RIGHT SIDE SUMMARY */}
            <div className="border rounded-lg p-6 h-fit">
              <h2 className="text-lg font-semibold mb-6">
                Order summary
              </h2>

              {orderItems.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  Your cart is empty
                </p>
              ) : (
                <div className="space-y-8">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative">
                        <img
                          src={`${IMG_URL}/${item.img}`}
                          alt="product"
                          className="w-14 h-14 rounded border"
                        />
                        <span className="absolute -top-2 -right-2 bg-gray-200 text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full">
                          {item.qty}
                        </span>
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between gap-4">
                          <h3 className="text-sm font-semibold">
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
              )}

              {/* Totals */}
              <div className="border-t mt-6 pt-5 flex justify-between text-sm">
                <p>Subtotal</p>
                <p className="font-semibold">
                  ₹{subtotal.toLocaleString()}
                </p>
              </div>

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
