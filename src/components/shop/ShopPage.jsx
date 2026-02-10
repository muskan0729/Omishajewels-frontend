import { useEffect, useMemo, useState } from "react";
import ShopHero from "./ShopHero";
import "./shop-page.css";
import { usePost } from "../../hooks/usePost";
import { addToCartManager, addToWishlistManager } from "../../utils/cartManager";
import { useGet } from "../../hooks/useGet";
import { toast } from "sonner";
import { Link } from 'react-router-dom';
import QuickViewModal from "../QuickViewModal";


// const API = "https://dummyjson.com/products?limit=100";

const toLabel = (key) => String(key || "").replace(/-/g, " ").toUpperCase();

const money = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number.isFinite(Number(n)) ? Number(n) : 0);

const finalPrice = (price, discountPercentage = 0) => {
  const p = Number(price || 0);
  const d = Number(discountPercentage || 0);
  return Math.max(0, p - (p * d) / 100);
};

const priceRanges = [
  { key: "all", label: "All", min: -Infinity, max: Infinity },
  { key: "0-3500", label: "₹0.00 - ₹3,500.00", min: 0, max: 3500 },
  { key: "3500-7000", label: "₹3,500.00 - ₹7,000.00", min: 3500, max: 7000 },
  { key: "7000-10500", label: "₹7,000.00 - ₹10,500.00", min: 7000, max: 10500 },
  { key: "10500-14000", label: "₹10,500.00 - ₹14,000.00", min: 10500, max: 14000 },
];

export default function ShopPage() {
 const IMG_URL = import.meta.env.VITE_IMG_URL;

    const [showQuickModal, setShowQuickModal] = useState(false);
const [cartLoadingIds, setCartLoadingIds] = useState([]);
const [wishlistLoadingIds, setWishlistLoadingIds] = useState([]);

  //api call
  const { execute: cartExecute } = usePost("cart/add");
  const { execute: wishlistExecute } = usePost("wishlist");

  const [wishlistIds, setWishlistIds] = useState([]);

  const userId = localStorage.getItem("user_id");

  // hero category
  const [activeCategory, setActiveCategory] = useState("all");

  // filters
  const [onSale, setOnSale] = useState(false);
  const [inStock, setInStock] = useState(false);
  const [sortBy, setSortBy] = useState("default");
  const [priceKey, setPriceKey] = useState("all");

  // top show + grid buttons
  const [showCount, setShowCount] = useState(9);
  const [gridMode, setGridMode] = useState("grid3"); // grid2 | grid3 | grid4

  // data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleQuickView = (product) => {
  setSelectedProduct(product);
  setShowQuickModal(true);
};


    const productsEndpoint = 
    activeCategory === "all"
      ? "products"                              // all products
      : `categories/${activeCategory}/products`;
      const { data, isLoading, error: error_product } = useGet(productsEndpoint);

useEffect(() => {
    setLoading(isLoading);

    if (isLoading) return;

    if (error_product) {
      setError("Failed to load products");
      setProducts([]);
      return;
    }

    // Safely extract the products array — adjust nesting if needed
    const rawProducts = data?.data?.data          // very common Laravel-style
                     ?? data?.data?.products
                     ?? data?.products
                     ?? data?.data
                     ?? data
                     ?? [];

    setProducts(Array.isArray(rawProducts) ? rawProducts : []);

  }, [data, isLoading, error_product, activeCategory]);

  // categories + counts
  const categories = useMemo(() => {
    const map = new Map();
    for (const p of products) {
      const k = p.categories || "other";
      map.set(k, (map.get(k) || 0) + 1);
    }
    // keep stable order like your screenshot (by count desc)
    return Array.from(map.entries())
      .map(([key, count]) => ({ key, count }))
      .sort((a, b) => b.count - a.count);
  }, [products]);

  // top rated left list
  const topRated = useMemo(() => {
    return [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 3);
  }, [products]);


  const filtered = useMemo(() => {
    let out = [...products];

    const range = priceRanges.find(r => r.key === priceKey) || priceRanges[0];
    out = out.filter(p => {
      const fp = finalPrice(p.price, p.discountPercentage);
      return fp >= range.min && fp <= range.max;
    });

    // Your existing sorting logic
    switch (sortBy) {
      case "popularity":
        out.sort((a, b) => (b.stock || 0) - (a.stock || 0));
        break;
      case "rating":
        out.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
    case "newness":
        out.sort((a, b) => (b.id || 0) - (a.id || 0));
        break;
      case "low-high":
        out.sort(
          (a, b) =>
            finalPrice(a.price, a.discountPercentage) -
            finalPrice(b.price, b.discountPercentage)
        );
        break;
      case "high-low":
        out.sort(
          (a, b) =>
            finalPrice(b.price, b.discountPercentage) -
            finalPrice(a.price, a.discountPercentage)
        );
        break;
      default:
        out.sort((a, b) => (a.id || 0) - (b.id || 0));
        break;
    }
    // }

    return out;
  }, [products, onSale, inStock, priceKey, sortBy]);

  const visible = filtered.slice(0, showCount);

  const clearFilters = () => {
    setOnSale(false);
    setInStock(false);
    setPriceKey("all");
    setSortBy("default");
  };

  const heroBack = () => {
    // go back to "Shop" view
    setActiveCategory("all");
  };
const handleAddToCart = async (book, qty = 1) => {
  const productId = book.id;

  if (cartLoadingIds.includes(productId)) return; // prevent double click
  setCartLoadingIds((prev) => [...prev, productId]);

  const cartItem = {
    product_id: book.id,
    title: book.title,
    price: book.price,
    quantity: qty,
    image: book.image,
  };

  try {
    // Assuming addToCartManager returns a Promise
    await addToCartManager(cartItem, cartExecute);
    toast.success("Added to cart");
  } catch (err) {
    toast.error("Failed to add to cart");
  } finally {
    // Remove loader after API finishes
    setCartLoadingIds((prev) => prev.filter((id) => id !== productId));
  }
};




  return (
    <>
    <div className="page">
      {/* HERO */}
      <ShopHero
        // categories={categories}
        activeCategory={activeCategory}
        onChangeCategory={setActiveCategory}
        // pageTitle={activeCategory === "all" ? "SHOP" : toLabel(activeCategory)}
        onBack={heroBack}
      />

      {/* breadcrumb row below hero (like screenshot) */}
      <div className="crumbRow">
        <div className="wrap">
          <div className="crumbText">
            Home <span>/</span> <b>{activeCategory === "all" ? "SHOP" : toLabel(activeCategory)}</b>
          </div>
        </div>
      </div>

      {/* SHOP BODY */}
      <div className="wrap shopWrap">
        {/* top row (Show: 9/12/18/24 + grid icons) */}
        <div className="topRow">
          <div className="topRow__left" />

          <div className="topRow__right">
            <div className="showCount">
              <b>Show :</b>
              {[9, 12, 18, 24].map((n, idx) => (
                <span key={n} className="showCount__item">
                  <button
                    className={showCount === n ? "active" : ""}
                    onClick={() => setShowCount(n)}
                  >
                    {n}
                  </button>
                  {idx !== 3 ? <span className="slash">/</span> : null}
                </span>
              ))}
            </div>

            <div className="gridBtns">
              <button className={gridMode === "grid2" ? "active" : ""} onClick={() => setGridMode("grid2")}>
                ▦
              </button>
              <button className={gridMode === "grid3" ? "active" : ""} onClick={() => setGridMode("grid3")}>
                ▦
              </button>
              <button className={gridMode === "grid4" ? "active" : ""} onClick={() => setGridMode("grid4")}>
                ▦
              </button>
            </div>
          </div>
        </div>

        <div className="layout">
          {/* LEFT SIDEBAR */}
          <aside className="sidebar">
            <div className="box">
              <h3 className="title">TOP RATED PRODUCTS</h3>
              {loading ? (
                <div className="muted">Loading…</div>
              ) : (
                <div className="toprated">
                  {topRated.map((p) => {
                    const fp = finalPrice(p.price, p.discountPercentage);
                     const imageName = p.image?.split("/").pop();
               const imageSrc = imageName ? `${IMG_URL}${imageName}` : "/no-image.png";
                    return (
                      <div key={p.id} className="topratedItem">
                        <img 
 src={imageSrc}                        // src={p.ebook_file} 
                        alt={p.title} />
                        <div>
                          <div className="topratedName">{p.title}</div>
                          <div className="topratedMrp">{money(p.price)}</div>
                          <div className="topratedPrice">{money(fp)}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </aside>

          {/* MAIN */}
          <main className="main">
            <div className="filtersRow">
              <div className="filtersCol">
                <h3 className="title">SORT BY</h3>
                {[
                  { key: "default", label: "Default" },
                  { key: "popularity", label: "Popularity" },
                  { key: "rating", label: "Average rating" },
                  { key: "newness", label: "Newness" },
                  { key: "low-high", label: "Price: low to high" },
                  { key: "high-low", label: "Price: high to low" },
                ].map((s) => (
                  <button
                    key={s.key}
                    className={`link ${sortBy === s.key ? "active" : ""}`}
                    onClick={() => setSortBy(s.key)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <div className="filtersCol">
                <h3 className="title">PRICE FILTER</h3>
                {priceRanges.map((r) => (
                  <button
                    key={r.key}
                    className={`link ${priceKey === r.key ? "active" : ""}`}
                    onClick={() => setPriceKey(r.key)}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="metaRow">
              <button className="clearBtn" onClick={clearFilters}>
                ✕ clear filters
              </button>
              <span className="pipe">|</span>
              <span className="metaText">
                Showing: <b>{visible.length}</b> / {filtered.length}
              </span>
            </div>

  {loading ? (
          <div className="muted center">Loading products...</div>
        ) : error ? (
          <div className="error center">{error}</div>
        ) : visible.length === 0 ? (
          <div className="muted center">No products found in this category</div>
        ) : (
          <div className={`products ${gridMode}`}>
                {visible.map((p) =>   {
                  const productData = {
  product_id: p.id,
  id:p.id,
  name: p.title,
  price: finalPrice(p.price, p.discountPercentage),
  // image: p.ebook_file,
  // image:""
  quantity: 1,
};

                  const hasDiscount = (p.discountPercentage || 0) > 0;
                  const fp = finalPrice(p.price, p.discountPercentage);
 const imageName = p.image?.split("/").pop();
  const imageSrc = imageName ? `${IMG_URL}${imageName}` : "/no-image.png";
                  return (
                    <div key={p.id} className="card">
                      <div className="media">
                        <Link to={`/products/${p.id}`}>
                        <img
 src={imageSrc}                      //  src={p.ebook_file} 
                         alt={p.title} />
                        </Link>
                        {hasDiscount ? (
                          <div className="badge">-{Math.round(p.discountPercentage)}%</div>
                        ) : null}

                        <div className="iconsBox">
                          <button title="Compare">⇄</button>
                          <button title="Search"
                          onClick={() => handleQuickView(p)}>
                            ⌕
                            </button>
       <button
  title="Wishlist"
  onClick={() => {
    if (!userId) {
      toast.error("Please login to add to wishlist");
      return;
    }

    if (wishlistIds.includes(p.id)) {
      // remove from wishlist UI
      setWishlistIds((prev) => prev.filter((id) => id !== p.id));
      toast.success("Removed from wishlist");
    } else {
      // add wishlist
      addToWishlistManager(
        { ...productData, user_id: userId },
        wishlistExecute
      );

      setWishlistIds((prev) => [...prev, p.id]);
      toast.success("Added to wishlist");
    }
  }}
  className="text-xl"
>
  {wishlistIds.includes(p.id) ? ( 
    <span className="text-black">♥</span>
  ) : (
    <span className="text-gray-800">♡</span>
  )}
</button>

                        </div>

                        {/* shows only on hover like your image */}
<button
  className="addCart"
  onClick={() => handleAddToCart(productData)}
  disabled={cartLoadingIds.includes(p.id)}
>
  {cartLoadingIds.includes(p.id) ? "Adding…" : "ADD TO CART"}
</button>


                        {/* <button className="addCart"
                        onClick={() => addToCartManager(productData, cartExecute)}>ADD TO CART</button> */}
                      </div>

                      <div className="info">
                        <div className="pTitle">{p.title}</div>
                        {/* category shown below product */}
                        <div className="pCat">{p.category}</div>

                        <div className="pPrice">
                          {hasDiscount ? (
                            <>
                              <span className="mrp">{money(p.price)}</span>
                              <span className="sale">{money(fp)}</span>
                            </>
                          ) : (
                            <span className="sale">{money(p.price)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
   {showQuickModal && selectedProduct && (
  <QuickViewModal
    book={selectedProduct} 
    onClose={() => {
      setShowQuickModal(false);
      setSelectedProduct(null);
    }}
    onAddToCart={handleAddToCart}
  />
)}

</>
  );
}