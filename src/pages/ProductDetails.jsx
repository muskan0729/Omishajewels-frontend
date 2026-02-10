import { useState, useEffect } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaHeart,
  FaBalanceScale,
  FaPinterest,
  FaLinkedin,
} from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { useGet } from "../hooks/useGet";
import { addToCartManager, addToWishlistManager } from "../utils/cartManager";
import { usePost } from "../hooks/usePost";
import { toast } from "sonner";


export default function ProductDetails() {
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("description");
  const { id } = useParams();
  const { execute: cartExecute } = usePost("cart/add");
  const { execute: wishlistExecute } = usePost("wishlist");

  const userId = localStorage.getItem("user_id");

  /* ================= PRODUCT API ================= */
  const { data, isLoading, error } = useGet(id ? `products/${id}` : null);


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

  const productData = {
    id: product.id,  
    product_id: product.id,
    title: product.title,
    price: product.price,
    quantity: qty,
  };
    const IMG_URL = import.meta.env.VITE_IMG_URL;
    const imageName = product.image?.split("/").pop();
    
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
            src={`${IMG_URL}${imageName}`}  
            alt={product.title}
            className="w-full rounded-md"
            style={{width:"auto", height:"500px",paddingLeft:"100px"}}
          />
        </div>

        {/* DETAILS */}
        <div>
          <h1 className="text-3xl font-serif mb-4">{product.title}</h1>

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

            <button
              className="bg-[#C39A5B] text-white px-8 py-3 rounded-full"
              onClick={() => addToCartManager(productData, cartExecute)}
            >
              ADD TO CART
            </button>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-6 items-center text-sm text-gray-600 mb-6">
            <button className="flex items-center gap-2">
              <FaBalanceScale /> Compare
            </button>
            <button
              className="flex items-center gap-2"
              onClick={() => {
                if (!userId) {
                  toast.error("Please login to add to wishlist");
                  return;
                }
                addToWishlistManager(
                  { ...productData, user_id: userId },
                  wishlistExecute,
                );
              }}
            >
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
              <a
                href="https://www.facebook.com/sharer/sharer.php?u=https://omishajewels.com/index.php/product/a-a-little-history-of-economics-little-history-of-economics-little-histories/"
                target="_blank"
                rel="noopener noreferrer"
                className=" hover:text-blue-800"
              >
                <FaFacebookF /> </a>
                <a
    href="https://x.com/share?url=https://omishajewels.com/index.php/product/a-a-little-history-of-economics-little-history-of-economics-little-histories/"
    target="_blank"
    rel="noopener noreferrer"
    className=" hover:text-blue-800"
  ><FaTwitter /></a>
                  <a
    href="https://www.pinterest.com/pin/create/button/?url=https://omishajewels.com/index.php/product/a-a-little-history-of-economics-little-history-of-economics-little-histories/&media=https://omishajewels.com/wp-content/uploads/2025/11/712NMyLHxmL._SY466_.jpg&description=A+A+Little+History+of+Economics+Little+History+of+Economics+%28Little+Histories%29"
    target="_blank"
    rel="noopener noreferrer"
    className=" hover:text-blue-800"
  >
   <FaPinterest /></a>
                   <a
    href="https://www.linkedin.com/uas/login?session_redirect=https%3A%2F%2Fwww.linkedin.com%2FshareArticle%3Fmini%3Dtrue%26url%3Dhttps%3A%2F%2Fomishajewels.com%2Findex.php%2Fproduct%2Fa-a-little-history-of-economics-little-history-of-economics-little-histories%2F"
    target="_blank"
    rel="noopener noreferrer"
    className=" hover:text-blue-800"
  >
   <FaLinkedin /></a>
            </div>
          </div>
        </div>
      </div>

      {/* ================= RELATED PRODUCTS ================= */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-xl font-serif mb-10">Related Products</h2>

        {relatedLoading && (
          <p className="text-gray-500">Loading related products...</p>
        )}

        {relatedError && (
          <p className="text-red-500">Failed to load related products</p>
        )}

        {relatedProducts.length > 0 && (
          <div className="max-w-7xl mx-auto px-6 py-16">
            {/* <h2 className="text-xl font-serif mb-10">
      Related Products
    </h2> */}

            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10">
  {relatedProducts.map((p) => {
  const relatedImageName = p.image?.split("/").pop();
  const relatedImageSrc = relatedImageName
    ? `${IMG_URL}${relatedImageName}`
    : "/images/placeholder.png";

  return (
    // <div key={p.id} className="group cursor-pointer">
    <Link to={`/products/${p.id}`} key={p.id} className="group cursor-pointer block">

      <div className="relative overflow-hidden rounded-md">
        <img
          src={relatedImageSrc}
          alt={p.title}
          className="group-hover:scale-105 transition"
        />
      </div>

      <div className="mt-4 text-center">
        <h3 className="text-sm font-medium">{p.title}</h3>
        <p className="text-xs text-gray-500 mb-1">{p.category}</p>
        <p className="text-sm text-[#C39A5B] font-medium">
          ₹{Number(p.price).toLocaleString()}
        </p>
      </div>
    {/* </div> */}
    </Link>
  );
})}

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
