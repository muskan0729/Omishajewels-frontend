import { useState } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaHeart,
  FaBalanceScale,
} from "react-icons/fa";

const product = {
  title: "Zero to One",
  author: "Peter Thiel",
  category: "Business",
  price: 14000,
  oldPrice: 21000,
  description:
    "Zero to One by Peter Thiel is a powerful and eye-opening guide for entrepreneurs, creators, and thinkers who want to build the future rather than compete in the present.",
  image:
    "https://omishajewels.com/wp-content/uploads/2024/01/zero-to-one.jpg",
};

const relatedProducts = [
  {
    id: 1,
    title: "Psycho-Cybernetics",
    price: 9800,
    oldPrice: 12000,
    image:
      "https://omishajewels.com/wp-content/uploads/2024/01/psycho-cybernetics.jpg",
    category: "Business",
  },
];

export default function ProductDetails() {
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("description");

  return (
    <div className="bg-white">
      {/* ================= BREADCRUMB ================= */}
      <div className="max-w-7xl mx-auto px-6 pt-8 text-sm text-gray-500">
        Home / {product.category} /{" "}
        <span className="text-gray-800">{product.title}</span>
      </div>

      {/* ================= PRODUCT ================= */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-2 gap-16">
        {/* IMAGE */}
        <div className="relative">
          <img
            src={product.image}
            alt={product.title}
            className="w-full rounded-md"
          />
          <span className="absolute top-4 right-4 bg-[#C39A5B] text-white text-xs px-3 py-1 rounded-full">
            -33%
          </span>
        </div>

        {/* DETAILS */}
        <div>
          <h1 className="text-3xl font-serif mb-4">
            {product.title}
          </h1>

          <div className="flex items-center gap-4 mb-6">
            <span className="line-through text-gray-400">
              ₹{product.oldPrice.toLocaleString()}
            </span>
            <span className="text-2xl font-semibold text-[#C39A5B]">
              ₹{product.price.toLocaleString()}
            </span>
          </div>

          <p className="text-gray-700 leading-relaxed mb-6">
            {product.description}
          </p>

          {/* QTY */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex border rounded-full overflow-hidden">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-4 py-2"
              >
                -
              </button>
              <span className="px-6 py-2">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="px-4 py-2"
              >
                +
              </button>
            </div>

            <button className="bg-[#C39A5B] text-white px-8 py-3 rounded-full hover:opacity-90">
              ADD TO CART
            </button>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-6 items-center text-sm text-gray-600 mb-6">
            <button className="flex items-center gap-2">
              <FaBalanceScale /> Compare
            </button>
            <button className="flex items-center gap-2">
              <FaHeart /> Add to wishlist
            </button>
          </div>

          {/* META */}
          <div className="border-t pt-4 text-sm text-gray-600">
            <p>
              <strong>Category:</strong> {product.category}
            </p>

            <div className="flex items-center gap-4 mt-3">
              <strong>Share:</strong>
              <FaFacebookF className="cursor-pointer hover:text-[#C39A5B]" />
              <FaTwitter className="cursor-pointer hover:text-[#C39A5B]" />
              <FaInstagram className="cursor-pointer hover:text-[#C39A5B]" />
            </div>
          </div>
        </div>
      </div>

      {/* ================= TABS ================= */}
      <div className="border-t">
        <div className="max-w-7xl mx-auto px-6">
          {/* TAB HEADERS */}
          <div className="flex justify-center gap-12 border-b text-sm">
            {["description", "reviews", "shipping"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`py-4 uppercase tracking-wide ${
                  tab === t
                    ? "border-b-2 border-[#C39A5B] text-black"
                    : "text-gray-400"
                }`}
              >
                {t === "reviews"
                  ? "Reviews (0)"
                  : t.replace("-", " & ")}
              </button>
            ))}
          </div>

          {/* TAB CONTENT */}
          <div className="py-12 flex justify-center">
            <div className="max-w-3xl w-full text-gray-700">
              {tab === "description" && (
                <p className="leading-relaxed text-center">
                  This book challenges traditional business ideas and
                  teaches you how to create something truly new — to go
                  from 0 to 1, not from 1 to many.
                </p>
              )}

              {tab === "reviews" && (
                <div className="grid md:grid-cols-2 gap-12">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Reviews
                    </h3>
                    <p className="text-sm text-gray-500">
                      There are no reviews yet.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">
                      Be the first to review “{product.title}”
                    </h3>
                    <textarea
                      className="w-full border rounded-xl p-4 mb-4"
                      rows={5}
                      placeholder="Your review"
                    />
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <input
                        className="border rounded-full px-4 py-2"
                        placeholder="Name"
                      />
                      <input
                        className="border rounded-full px-4 py-2"
                        placeholder="Email"
                      />
                    </div>
                    <button className="bg-[#C39A5B] text-white px-6 py-2 rounded-full">
                      SUBMIT
                    </button>
                  </div>
                </div>
              )}

              {tab === "shipping" && (
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <img
                    src="https://omishajewels.com/wp-content/uploads/2024/01/shipping.jpg"
                    alt="Shipping"
                    className="rounded-md"
                  />
                  <ul className="list-disc ml-6 space-y-2 text-sm">
                    <li>Fast digital delivery</li>
                    <li>Instant access after purchase</li>
                    <li>Secure checkout</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= RELATED PRODUCTS ================= */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-xl font-serif mb-10">
          Related Products
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10">
          {relatedProducts.map((p) => (
            <div
              key={p.id}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-md">
                <img
                  src={p.image}
                  alt={p.title}
                  className="group-hover:scale-105 transition"
                />
                <span className="absolute top-3 left-3 bg-[#C39A5B] text-white text-xs px-2 py-1 rounded-full">
                  -18%
                </span>
              </div>

              <div className="mt-4 text-center">
                <h3 className="text-sm font-medium">
                  {p.title}
                </h3>
                <p className="text-xs text-gray-500 mb-1">
                  {p.category}
                </p>
                <p className="text-sm">
                  <span className="line-through text-gray-400 mr-2">
                    ₹{p.oldPrice}
                  </span>
                  <span className="text-[#C39A5B] font-medium">
                    ₹{p.price}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
