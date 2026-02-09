import { useState, useEffect } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaHeart,
  FaBalanceScale,
} from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useGet } from "../hooks/useGet";

export default function ProductDetails() {
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("description");
  const { id } = useParams();

  /* ================= PRODUCT API ================= */
  const {
    data,
    isLoading,
    error,
  } = useGet(id ? `products/${id}` : null);

  /* ================= RELATED PRODUCTS API ================= */
  // const {
  //   data: relatedData,
  //   isLoading: relatedLoading,
  //   error: relatedError,
  // } = useGet(id ? `products/${id}/related` : null);

const {
  data: relatedData,
  isLoading: relatedLoading,
  error: relatedError,
} = useGet(id ? `products/${id}/related` : null);

const relatedProducts = relatedData?.data || [];




  /* ================= EXTRACT DATA ================= */
  const product = data?.data || null;



console.log("relatedData:", relatedData);
console.log("relatedProducts:", relatedProducts);

  /* ================= DEBUG ================= */
  useEffect(() => {
    if (data) {
      console.log("Product API response:", data);
    }
  }, [data]);

  useEffect(() => {
    if (relatedData) {
      console.log("Related products API response:", relatedData);
    }
  }, [relatedData]);

  /* ================= GUARDS ================= */
  if (isLoading) {
    return <div className="p-10 text-center">Loading product...</div>;
  }

  if (error) {
    return (
      <div className="p-10 text-center text-red-500">
        Failed to load product
      </div>
    );
  }

  if (!product) {
    return <div className="p-10 text-center">Product not found</div>;
  }

  /* ================= UI ================= */
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
        </div>

        {/* DETAILS */}
        <div>
          <h1 className="text-3xl font-serif mb-4">
            {product.title}
          </h1>

          <div className="flex items-center gap-4 mb-6">
            {product.oldPrice && (
              <span className="line-through text-gray-400">
                ₹{Number(product.oldPrice).toLocaleString()}
              </span>
            )}
            <span className="text-2xl font-semibold text-[#C39A5B]">
              ₹{Number(product.price).toLocaleString()}
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

            <button className="bg-[#C39A5B] text-white px-8 py-3 rounded-full">
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
              <FaFacebookF />
              <FaTwitter />
              <FaInstagram />
            </div>
          </div>
        </div>
      </div>

      {/* ================= TABS ================= */}
      <div className="border-t">
        <div className="max-w-7xl mx-auto px-6">
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

          <div className="py-12 flex justify-center">
            <div className="max-w-3xl w-full text-gray-700">
              {tab === "description" && (
                <p className="leading-relaxed text-center">
                  {product.description}
                </p>
              )}

              {tab === "reviews" && (
                <p className="text-center text-gray-500">
                  No reviews yet.
                </p>
              )}

              {tab === "shipping" && (
                <p className="text-center text-gray-500">
                  Fast & secure delivery.
                </p>
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

        {relatedLoading && (
          <p className="text-gray-500">Loading related products...</p>
        )}

        {relatedError && (
          <p className="text-red-500">
            Failed to load related products
          </p>
        )}

        {relatedProducts.length > 0 && (
  <div className="max-w-7xl mx-auto px-6 py-16">
    <h2 className="text-xl font-serif mb-10">
      Related Products
    </h2>

    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10">
      {relatedProducts.map((p) => (
        <div key={p.id} className="group cursor-pointer">
          <div className="relative overflow-hidden rounded-md">
            <img
              src={p.image}
              alt={p.title}
              className="group-hover:scale-105 transition"
            />
          </div>

          <div className="mt-4 text-center">
            <h3 className="text-sm font-medium">{p.title}</h3>
            <p className="text-xs text-gray-500 mb-1">
              {p.category}
            </p>
            <p className="text-sm text-[#C39A5B] font-medium">
              ₹{Number(p.price).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

      </div>
    </div>
  );
}
