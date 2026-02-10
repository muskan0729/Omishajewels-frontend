import { useEffect, useState } from "react";
import LatestBookCard from "../books/LatestBookCard.jsx";
import { useGet } from "../../hooks/useGet";
import { toast } from "sonner";
import { usePost } from "../../hooks/usePost.jsx";
import { addToCartManager, addToWishlistManager } from "../../utils/cartManager.js";



const SectionFive = () => {
  const [activeCategoryId, setActiveCategoryId] = useState(null);
 const { execute: cartExecute } = usePost("cart/add");
  const { execute: wishlistExecute } = usePost("wishlist");

    const userId = localStorage.getItem("user_id");
  // ================== GET CATEGORIES ==================
  const {
    data: categoryRes,
    loading: loadingCategories,
    error: categoryError,
  } = useGet("categories");
  // console.log("category data",categoryRes);

  const categories = categoryRes || [];

  // ================== SET DEFAULT CATEGORY ==================
  useEffect(() => {
    if (categories.length > 0 && !activeCategoryId) {
      setActiveCategoryId(categories[0].id);
    }
  }, [categories, activeCategoryId]);

const latestCategories = categories.slice(-5);

  // ================== GET PRODUCTS BY CATEGORY ==================
  const {
    data: productRes,
    loading: loadingProducts,
    error: productError,
  } = useGet(
    activeCategoryId ? `categories/${activeCategoryId}/products` : null
  );

  console.log("product by cat",productRes);

  const products = productRes?.data.data || [];
  const latestproducts = products.slice(-10);

const handleAddToCart = async (product) => {
  const productData = {
    product_id: product.id,
    title: product.title,
    price: product.price,
    quantity: 1,
  };

  addToCartManager(productData, cartExecute);
  toast.success("Added to cart");
};

const handleAddToWishlist = async (product) => {
  if (!userId) {
    toast.error("Please login to add to wishlist");
    return;
  }

  const productData = {
    product_id: product.id,
    title: product.title,
    price: product.price,
    quantity: 1,
    user_id: userId,
  };

  addToWishlistManager(productData, wishlistExecute);
  toast.success("Added to wishlist");
};


  return (
    <section className="bg-white pt-0 py-28">
      <div className="max-w-7xl mx-auto px-6">
        {/* ================= HEADER ================= */}
        <div className="text-center mb-20">
          <p className="text-sm italic text-[#B8964E] mb-2">
            Discover Great Authors
          </p>

          <h2 className="text-4xl font-['Playfair_Display'] text-[#2E2E2E] mb-4">
            Featured Releases
          </h2>

          <p className="text-sm text-[#6B6B6B] max-w-xl mx-auto">
            Discover 1000’s of New Authors in Hundreds of Categories Fiction and
            Non-Fiction
          </p>
        </div>

        {/* ================= CATEGORY TABS ================= */}
        <div className="flex justify-center gap-10 mb-16 text-sm tracking-widest flex-wrap">
          {loadingCategories ? (
            <p className="text-[#6B6B6B]">Loading categories...</p>
          ) : categoryError ? (
            <p className="text-red-500">Failed to load categories</p>
          ) : (
            latestCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryId(cat.id)}
                className={`
                  pb-2 transition cursor-pointer uppercase
                  ${
                    activeCategoryId === cat.id
                      ? "text-[#B8964E] border-b-2 border-[#B8964E]"
                      : "text-[#6B6B6B] hover:text-[#2E2E2E]"
                  }
                `}
              >
                {cat.name}
              </button>
            ))
          )}
        </div>

        {/* ================= PRODUCTS GRID ================= */}
        {loadingProducts ? (
          <p className="text-center text-[#6B6B6B]">Loading products...</p>
        ) : productError ? (
          <p className="text-center text-red-500">Failed to load products</p>
        ) : (
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              md:grid-cols-[repeat(3,minmax(0,320px))]
              justify-center
              gap-16
            "
          >
            {latestproducts?.slice(0, 15).map((product) => (
              // <LatestBookCard key={product.id} book={product} />
              <LatestBookCard
  key={product.id}
  book={product}
  onAddToCart={handleAddToCart}
  onAddToWishlist={handleAddToWishlist}
/>

            ))}
          </div>
        )}

        {/* ================= EMPTY STATE ================= */}
        {!loadingProducts && products.length === 0 && (
          <p className="text-center text-sm text-[#6B6B6B] mt-10">
            No products available in this category.
          </p>
        )}
      </div>
    </section>
  );
};

export default SectionFive;
