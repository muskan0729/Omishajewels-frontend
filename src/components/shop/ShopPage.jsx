import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import ShopHero from "./ShopHero";
import "./shop-page.css";
import { useGet } from "../../hooks/useGet";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import QuickViewModal from "../QuickViewModal";
import { FiGrid } from "react-icons/fi";
import { BsGrid1X2Fill, BsGrid3X3GapFill } from "react-icons/bs";
import { FiDownload } from "react-icons/fi";
import ShopPageSkeleton from "./ShopPageSkeleton";
import { useCart } from "./../../context/CartContext";
import { useWishlist } from "./../../context/WishlistContext";

const toLabel = (key) =>
  String(key || "")
    .replace(/-/g, " ")
    .toUpperCase();

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
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const [showQuickModal, setShowQuickModal] = useState(false);
  const [cartLoadingIds, setCartLoadingIds] = useState([]);
  const [purchasedEbooks, setPurchasedEbooks] = useState({});
  const [downloadingIds, setDownloadingIds] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { addToCart, isGuest: isCartGuest } = useCart();
  const { addToWishlist, removeFromWishlist, wishlistItems } = useWishlist();

  const [activeCategory, setActiveCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("default");
  const [priceKey, setPriceKey] = useState("all");
  const [showCount, setShowCount] = useState(9);
  const [gridMode, setGridMode] = useState("grid3");
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);

  const isFirstRender = useRef(true);
  const prevFiltersRef = useRef({ showCount: 9, sortBy: "default", activeCategory: "all" });

  const userId = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");
  const isLoggedIn = !!userId && !!token;

  const { data: purchasedData } = useGet(isLoggedIn ? `my-library` : null);

  useEffect(() => {
    if (purchasedData?.success && purchasedData?.data) {
      const purchasedMap = {};
      purchasedData.data.active.forEach(item => {
        purchasedMap[item.id] = {
          hasAccess: true,
          download_url: item.download_url,
          expiry_date: item.access_expiry,
          days_remaining: item.days_remaining
        };
      });
      setPurchasedEbooks(purchasedMap);
    }
  }, [purchasedData]);

  const buildEndpoint = useCallback(() => {
    let endpoint = activeCategory === "all"
      ? `products`
      : `categories/${activeCategory}/products`;

    const params = new URLSearchParams({
      page: currentPage,
      limit: showCount,
    });

    if (sortBy !== "default") {
      params.append("sort", sortBy);
    }

    return `${endpoint}?${params.toString()}`;
  }, [activeCategory, currentPage, showCount, sortBy]);

  const { data: productsData, loading: productsLoading, error: productsError, refetch } = useGet(buildEndpoint());
  const { data: categoriesData, loading: categoriesLoading, error: categoriesError } = useGet("categories");

  useEffect(() => {
    if (productsData && productsData.success) {
      const fetchedProducts = productsData.data?.data || productsData.data?.products || productsData.data || [];
      setProducts(Array.isArray(fetchedProducts) ? fetchedProducts : []);
      setTotalProducts(productsData.total || productsData.data?.total || fetchedProducts.length);
    }
  }, [productsData]);

  useEffect(() => {
    if (buildEndpoint()) {
      refetch();
    }
  }, [buildEndpoint, refetch]);

  useEffect(() => {
    const prevFilters = prevFiltersRef.current;
    const hasFilterChanged =
      showCount !== prevFilters.showCount ||
      sortBy !== prevFilters.sortBy ||
      activeCategory !== prevFilters.activeCategory;

    if (hasFilterChanged && !isFirstRender.current) {
      setCurrentPage(1);
      prevFiltersRef.current = { showCount, sortBy, activeCategory };
    }
    isFirstRender.current = false;
  }, [showCount, sortBy, activeCategory]);

  const totalPages = Math.ceil(totalProducts / showCount);

  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(Math.min(Math.max(1, newPage), totalPages));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [totalPages]);

  const handleShowCountChange = useCallback((newCount) => {
    setShowCount(newCount);
  }, []);

  const filteredProducts = useMemo(() => {
    let out = [...products];
    const range = priceRanges.find((r) => r.key === priceKey) || priceRanges[0];
    
    out = out.filter((p) => {
      const fp = finalPrice(p.price, p.discountPercentage);
      return fp >= range.min && fp <= range.max;
    });

    if (sortBy === "low-high") {
      out.sort((a, b) =>
        finalPrice(a.price, a.discountPercentage) -
        finalPrice(b.price, b.discountPercentage)
      );
    } else if (sortBy === "high-low") {
      out.sort((a, b) =>
        finalPrice(b.price, b.discountPercentage) -
        finalPrice(a.price, a.discountPercentage)
      );
    }

    return out;
  }, [products, priceKey, sortBy]);

  const topRated = useMemo(() => {
    return [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 3);
  }, [products]);

  const visible = filteredProducts;

  const clearFilters = useCallback(() => {
    setPriceKey("all");
    setSortBy("default");
    setCurrentPage(1);
  }, []);

  const heroBack = useCallback(() => {
    setActiveCategory("all");
    setCurrentPage(1);
  }, []);

  const handleQuickView = useCallback((product) => {
    setSelectedProduct(product);
    setShowQuickModal(true);
  }, []);

  const handleAddToCart = useCallback(async (book, qty = 1) => {
    const productId = book.id;
    if (cartLoadingIds.includes(productId)) return;
    setCartLoadingIds((prev) => [...prev, productId]);

    try {
      const cartItem = {
        id: book.id,
        name: book.title,
        price: book.price,
        quantity: qty,
        image: book.image,
        oldPrice: book.old_price,
        category: book.category
      };

      const success = await addToCart(cartItem);
      toast[success ? "success" : "error"](
        success ? `Added to cart${isCartGuest ? ' (Saved locally)' : ''}` : "Failed to add to cart"
      );
    } catch (err) {
      toast.error("Failed to add to cart");
    } finally {
      setCartLoadingIds(prev => prev.filter(id => id !== productId));
    }
  }, [addToCart, isCartGuest, cartLoadingIds]);

  const handleDownload = useCallback(async (book) => {
    if (!isLoggedIn) {
      toast.error("Please login to download");
      return;
    }

    const purchased = purchasedEbooks[book.id];
    if (!purchased || !purchased.hasAccess) {
      toast.error("Download not available");
      return;
    }

    if (downloadingIds.includes(book.id)) return;

    setDownloadingIds(prev => [...prev, book.id]);

    try {
      const response = await fetch(`${API_BASE_URL}ebook/${book.id}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/pdf',
        },
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${book.title}.pdf`);
      document.body.appendChild(link);
      link.click();

      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Download started");
    } catch (err) {
      toast.error("Failed to download. Please try again.");
    } finally {
      setDownloadingIds(prev => prev.filter(id => id !== book.id));
    }
  }, [isLoggedIn, purchasedEbooks, downloadingIds, API_BASE_URL, token]);

  const isInWishlistCheck = useCallback((productId) => {
    return wishlistItems.some(item => item.id === productId);
  }, [wishlistItems]);

  const handleWishlistToggle = useCallback(async (product) => {
    const isInWishlistNow = isInWishlistCheck(product.id);

    try {
      if (isInWishlistNow) {
        const success = await removeFromWishlist(product.id);
        toast[success ? "success" : "error"](success ? "Removed from wishlist" : "Failed to remove from wishlist");
      } else {
        const wishlistItem = {
          id: product.id,
          name: product.title,
          price: product.price,
          image: product.image,
          oldPrice: product.old_price,
          category: product.category
        };
        const success = await addToWishlist(wishlistItem);
        toast[success ? "success" : "error"](success ? "Added to wishlist" : "Failed to add to wishlist");
      }
    } catch (err) {
      toast.error("Operation failed");
    }
  }, [isInWishlistCheck, removeFromWishlist, addToWishlist]);

  if (productsLoading || categoriesLoading) return <ShopPageSkeleton />;
  if (productsError || categoriesError) return <div className="error center">{productsError || categoriesError}</div>;

  return (
    <>
      <div className="page">
        <ShopHero
          activeCategory={activeCategory}
          onChangeCategory={(category) => {
            setActiveCategory(category);
            setCurrentPage(1);
          }}
          onBack={heroBack}
        />

        <div className="crumbRow">
          <div className="wrap">
            <div className="crumbText">
              Home <span>/</span>{" "}
              <b>{activeCategory === "all" ? "SHOP" : toLabel(activeCategory)}</b>
            </div>
          </div>
        </div>

        <div className="wrap shopWrap">
          <div className="topRow">
            <div className="topRow__left" />
            <div className="topRow__right">
              <div className="showCount">
                <b>Show :</b>
                {[9, 12, 18, 24].map((n, idx) => (
                  <span key={n} className="showCount__item">
                    <button className={showCount === n ? "active" : ""} onClick={() => handleShowCountChange(n)}>
                      {n}
                    </button>
                    {idx !== 3 && <span className="slash">/</span>}
                  </span>
                ))}
              </div>

              <div className="gridBtns">
                <button className={gridMode === "grid2" ? "active" : ""} onClick={() => setGridMode("grid2")}>
                  <BsGrid1X2Fill size={18} />
                </button>
                <button className={gridMode === "grid3" ? "active" : ""} onClick={() => setGridMode("grid3")}>
                  <FiGrid size={18} />
                </button>
                <button className={gridMode === "grid4" ? "active" : ""} onClick={() => setGridMode("grid4")}>
                  <BsGrid3X3GapFill size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="layout">
            <aside className="sidebar">
              <div className="box">
                <h3 className="title">TOP RATED PRODUCTS</h3>
                <div className="toprated">
                  {topRated.map((p) => {
                    const fp = finalPrice(p.price, p.discountPercentage);
                    const imageName = p.image?.split("/").pop();
                    const imageSrc = imageName ? `${IMG_URL}${imageName}` : "/no-image.png";
                    return (
                      <div key={p.id} className="topratedItem">
                        <img src={imageSrc} alt={p.title} />
                        <div>
                          <div className="topratedName">{p.title}</div>
                          <div className="topratedMrp">{money(p.price)}</div>
                          <div className="topratedPrice">{money(fp)}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </aside>

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
                    <button key={s.key} className={`link ${sortBy === s.key ? "active" : ""}`} onClick={() => setSortBy(s.key)}>
                      {s.label}
                    </button>
                  ))}
                </div>

                <div className="filtersCol">
                  <h3 className="title">PRICE FILTER</h3>
                  {priceRanges.map((r) => (
                    <button key={r.key} className={`link ${priceKey === r.key ? "active" : ""}`} onClick={() => setPriceKey(r.key)}>
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="metaRow">
                <button className="clearBtn" onClick={clearFilters}>✕ clear filters</button>
                <span className="pipe">|</span>
                <span className="metaText">
                  Showing: <b>{visible.length}</b> of {totalProducts} products
                  {totalPages > 1 && <> &nbsp;| Page {currentPage} of {totalPages}</>}
                </span>
              </div>

              {visible.length === 0 ? (
                <div className="muted center">No products found</div>
              ) : (
                <>
                  <div className={`products ${gridMode}`}>
                    {visible.map((p) => {
                      const hasDiscount = (p.discountPercentage || 0) > 0;
                      const fp = finalPrice(p.price, p.discountPercentage);
                      const imageName = p.image?.split("/").pop();
                      const imageSrc = imageName ? `${IMG_URL}${imageName}` : "/no-image.png";
                      const isPurchased = isLoggedIn ? purchasedEbooks[p.id] : null;
                      const isDownloading = downloadingIds.includes(p.id);
                      const inWishlist = isLoggedIn && isInWishlistCheck(p.id);

                      return (
                        <div key={p.id} className="card">
                          <div className="media">
                            <Link to={`/products/${p.id}`}>
                              <img src={imageSrc} alt={p.title} />
                            </Link>

                            {hasDiscount && <div className="badge">-{Math.round(p.discountPercentage)}%</div>}
                            {isLoggedIn && isPurchased && isPurchased.days_remaining <= 3 && (
                              <div className="badge expiry-badge">Expires in {isPurchased.days_remaining} days</div>
                            )}

                            {(!isPurchased || !isLoggedIn) && (
                              <div className="iconsBox">
                                <button title="Quick View" onClick={() => handleQuickView(p)}>+</button>
                                {isLoggedIn && (
                                  <button
                                    title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                                    onClick={() => handleWishlistToggle(p)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}
                                  >
                                    <span style={{ color: inWishlist ? '#ff4444' : '#ccc' }}>
                                      {inWishlist ? '♥' : '♡'}
                                    </span>
                                  </button>
                                )}
                              </div>
                            )}

                            {!isLoggedIn ? (
                              <button className="addCart" onClick={() => handleAddToCart(p)} disabled={cartLoadingIds.includes(p.id)}>
                                {cartLoadingIds.includes(p.id) ? "Adding…" : "ADD TO CART"}
                              </button>
                            ) : isPurchased ? (
                              <button
                                className="download-btn-single"
                                onClick={() => handleDownload(p)}
                                disabled={isDownloading}
                                style={{
                                  position: 'absolute', bottom: '10px', left: '10px', right: '10px',
                                  backgroundColor: isDownloading ? '#888' : '#4CAF50', color: 'white',
                                  border: 'none', padding: '10px', borderRadius: '4px',
                                  cursor: isDownloading ? 'not-allowed' : 'pointer', display: 'flex',
                                  alignItems: 'center', justifyContent: 'center', gap: '8px',
                                  fontWeight: '500', zIndex: '5', opacity: isDownloading ? 0.7 : 1
                                }}
                              >
                                <FiDownload size={18} />
                                {isDownloading ? "Downloading..." : "Download PDF"}
                              </button>
                            ) : (
                              <button className="addCart" onClick={() => handleAddToCart(p)} disabled={cartLoadingIds.includes(p.id)}>
                                {cartLoadingIds.includes(p.id) ? "Adding…" : "ADD TO CART"}
                              </button>
                            )}
                          </div>

                          <div className="info">
                            <div className="pTitle">{p.title}</div>
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
                            {isLoggedIn && isPurchased && isPurchased.expiry_date && (
                              <div className="expiry-info">
                                Access until: {new Date(isPurchased.expiry_date).toLocaleDateString()}
                                {isPurchased.days_remaining <= 7 && (
                                  <span className="expiry-warning"> • {isPurchased.days_remaining} days left</span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {totalPages > 1 && (
                    <div className="pagination" style={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '10px',
                      marginTop: '30px',
                      padding: '20px 0',
                      flexWrap: 'wrap'
                    }}>
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: currentPage === 1 ? '#f0f0f0' : '#8B4513',
                          color: currentPage === 1 ? '#999' : 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                        }}
                      >
                        Previous
                      </button>

                      {[...Array(Math.min(5, totalPages))].map((_, i) => {
                        let pageNum;
                        if (totalPages <= 5) pageNum = i + 1;
                        else if (currentPage <= 3) pageNum = i + 1;
                        else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                        else pageNum = currentPage - 2 + i;

                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            style={{
                              padding: '8px 12px',
                              backgroundColor: currentPage === pageNum ? '#8B4513' : '#f0f0f0',
                              color: currentPage === pageNum ? 'white' : '#333',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            {pageNum}
                          </button>
                        );
                      })}

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: currentPage === totalPages ? '#f0f0f0' : '#8B4513',
                          color: currentPage === totalPages ? '#999' : 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                        }}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
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
          isPurchased={isLoggedIn ? purchasedEbooks[selectedProduct?.id] : null}
          onDownload={() => handleDownload(selectedProduct)}
          isLoggedIn={isLoggedIn}
        />
      )}
    </>
  );
}