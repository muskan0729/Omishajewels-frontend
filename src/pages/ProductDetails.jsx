import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaPinterest,
  FaLinkedin,
  FaHeart,
  FaBalanceScale,
  FaDownload,
  FaClock,
} from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { useGet } from "../hooks/useGet";
import { toast } from "sonner";
import Loader from "../components/Loader";
import axios from "axios";
import { useCart } from "./../context/CartContext";
import { useWishlist } from "./../context/WishlistContext";

export default function ProductDetails() {
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("description");
  const [purchaseStatus, setPurchaseStatus] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const { id } = useParams();
  const downloadTimeoutRef = useRef(null);
  
  const { addToCart, isGuest: isCartGuest } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist, wishlistItems } = useWishlist();

  const userId = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");
  const isLoggedIn = !!userId && !!token;

  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const IMG_URL = import.meta.env.VITE_IMG_URL;

  const { data, isLoading, error } = useGet(id ? `products/${id}` : null);
  const { data: relatedData, isLoading: relatedLoading, error: relatedError } = 
    useGet(id ? `products/${id}/related` : null);
  const { data: accessData, isLoading: accessLoading } = 
    useGet(isLoggedIn && id ? `ebook/${id}/check-access` : null);

  useEffect(() => {
    if (accessData?.success) {
      setPurchaseStatus(accessData.data);
    }
  }, [accessData]);

  const product = data?.data || null;
  const relatedProducts = relatedData?.data || [];
  const imageName = product?.image?.split("/").pop();
  
  const inWishlist = useMemo(() => 
    isLoggedIn && wishlistItems?.some(item => item.id === product?.id),
    [isLoggedIn, wishlistItems, product?.id]
  );

  const formatPrice = useCallback((price) => 
    `₹${Number(price).toLocaleString()}`,
    []
  );

  const handleAddToCart = useCallback(async () => {
    if (!isLoggedIn) {
      toast.error("Please login to add to cart");
      return;
    }
    
    const success = await addToCart({
      id: product.id,
      name: product.title,
      price: product.price,
      quantity: qty,
      image: product.image,
      oldPrice: product.oldPrice,
      category: product.category
    });
    
    toast[success ? "success" : "error"](
      success ? `Added to cart${isCartGuest ? ' (Saved locally)' : ''}` : "Failed to add to cart"
    );
  }, [isLoggedIn, product, qty, addToCart, isCartGuest]);

  const handleWishlistToggle = useCallback(async () => {
    if (!isLoggedIn) {
      toast.error("Please login to add to wishlist");
      return;
    }
    
    const wishlistItem = {
      id: product.id,
      name: product.title,
      price: product.price,
      image: product.image,
      oldPrice: product.oldPrice,
      category: product.category
    };
    
    const success = inWishlist 
      ? await removeFromWishlist(product.id)
      : await addToWishlist(wishlistItem);
    
    if (success) {
      toast.success(inWishlist ? "Removed from wishlist" : "Added to wishlist");
    } else {
      toast.error("Failed to update wishlist");
    }
  }, [isLoggedIn, product, inWishlist, addToWishlist, removeFromWishlist]);

  const handleDownload = useCallback(async () => {
    if (!isLoggedIn) {
      toast.error("Please login to download");
      return;
    }
    
    if (!purchaseStatus?.has_access) {
      toast.error("You don't have access to download this ebook");
      return;
    }

    if (purchaseStatus.days_remaining !== null && purchaseStatus.days_remaining <= 0) {
      toast.error("Your access has expired. Please purchase again.");
      return;
    }

    if (isDownloading) return;

    setIsDownloading(true);

    try {
      const response = await axios.get(`${API_BASE_URL}ebook/${id}/download`, {
        headers: { 'Authorization': `Bearer ${token}` },
        responseType: 'blob',
        timeout: 30000,
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const cleanTitle = product.title.replace(/[^\w\s]/gi, '').replace(/\s+/g, ' ');
      link.setAttribute('download', `${cleanTitle}.pdf`);
      
      document.body.appendChild(link);
      link.click();
      
      downloadTimeoutRef.current = setTimeout(() => {
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
      
      toast.success("Download started");
    } catch (err) {
      const errorMessages = {
        401: "Session expired. Please login again.",
        403: "Your access has expired. Please purchase again.",
        404: "File not found. Please contact support."
      };
      toast.error(errorMessages[err.response?.status] || "Failed to download. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  }, [isLoggedIn, purchaseStatus, isDownloading, API_BASE_URL, id, token, product?.title]);

  useEffect(() => {
    return () => {
      if (downloadTimeoutRef.current) {
        clearTimeout(downloadTimeoutRef.current);
      }
    };
  }, []);

  const handleQuantityChange = useCallback((delta) => {
    setQty(prev => Math.max(1, prev + delta));
  }, []);

  const shareLinks = useMemo(() => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(product?.title || '');
    const media = encodeURIComponent(`${IMG_URL}${imageName || ''}`);
    
    return {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://x.com/share?url=${url}`,
      pinterest: `https://www.pinterest.com/pin/create/button/?url=${url}&media=${media}&description=${title}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${url}`
    };
  }, [product?.title, imageName, IMG_URL]);

  const AccessInfo = useMemo(() => {
    if (!isLoggedIn || !purchaseStatus?.has_access) return null;
    
    return (
      <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <h3 className="font-medium text-green-800 mb-2">You own this ebook!</h3>
        
        {purchaseStatus.expiry_date && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <FaClock className="text-green-600" />
            <span>
              Access until: {new Date(purchaseStatus.expiry_date).toLocaleDateString()}
              {purchaseStatus.days_remaining && (
                <span className="ml-1 font-medium">
                  ({purchaseStatus.days_remaining} days remaining)
                </span>
              )}
            </span>
          </div>
        )}
        
        <div className="mt-3">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              isDownloading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            <FaDownload className={isDownloading ? 'animate-pulse' : ''} />
            {isDownloading ? 'Downloading...' : 'Download PDF'}
          </button>
        </div>
      </div>
    );
  }, [isLoggedIn, purchaseStatus, isDownloading, handleDownload]);

  const ExpiryWarning = useMemo(() => {
    if (!isLoggedIn || !purchaseStatus?.has_access || purchaseStatus.days_remaining > 3 || purchaseStatus.days_remaining <= 0) {
      return null;
    }
    
    return (
      <div className="mb-6 p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-center gap-2">
        <FaClock className="text-orange-500" />
        <p className="text-sm text-orange-700">
          Your access will expire in {purchaseStatus.days_remaining} days. 
          Please download the ebook to keep it permanently.
        </p>
      </div>
    );
  }, [isLoggedIn, purchaseStatus]);

  const ProductActions = useMemo(() => {
    const hasAccess = purchaseStatus?.has_access;
    
    if (hasAccess) return null;
    
    return (
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2 border rounded-md">
          <button
            onClick={() => handleQuantityChange(-1)}
            className="px-3 py-2 hover:bg-gray-100 transition"
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span className="w-12 text-center">{qty}</span>
          <button
            onClick={() => handleQuantityChange(1)}
            className="px-3 py-2 hover:bg-gray-100 transition"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        
        <button
          className="bg-[#C39A5B] text-white px-8 py-3 rounded-full hover:bg-[#A87B45] transition"
          onClick={handleAddToCart}
        >
          ADD TO CART
        </button>
      </div>
    );
  }, [purchaseStatus?.has_access, qty, handleQuantityChange, handleAddToCart]);

  const Badges = useMemo(() => {
    if (!isLoggedIn || !purchaseStatus?.has_access) return null;
    
    return (
      <>
        <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
          ✓ Purchased
        </div>
        {purchaseStatus.days_remaining <= 3 && purchaseStatus.days_remaining > 0 && (
          <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Expires in {purchaseStatus.days_remaining}d
          </div>
        )}
      </>
    );
  }, [isLoggedIn, purchaseStatus]);

  if (isLoading || accessLoading || !data) {
    return <Loader />;
  }

  if (error) {
    return <div className="p-10 text-center text-red-500">Failed to load product</div>;
  }

  if (!product) {
    return <div className="p-10 text-center">Product not found</div>;
  }

  return (
    <div className="bg-white">
      {/* BREADCRUMB */}
      <div className="max-w-7xl mx-auto px-6 pt-8 text-sm text-gray-500">
        Home / {product.category} / <span className="text-gray-800">{product.title}</span>
      </div>

      {/* PRODUCT */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-2 gap-16">
        {/* IMAGE SECTION */}
        <div className="relative">
          <img
            src={`${IMG_URL}${imageName}`}
            alt={product.title}
            className="w-full rounded-md"
            style={{ width: "auto", height: "500px", paddingLeft: "100px" }}
            loading="eager"
          />
          {Badges}
        </div>

        {/* DETAILS SECTION */}
        <div>
          <h1 className="text-3xl font-serif mb-4">{product.title}</h1>

          <div className="flex items-center gap-4 mb-6">
            {product.oldPrice && !purchaseStatus?.has_access && (
              <span className="line-through text-gray-400">{formatPrice(product.oldPrice)}</span>
            )}
            <span className="text-2xl font-semibold text-[#C39A5B]">{formatPrice(product.price)}</span>
          </div>

          <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>

          {AccessInfo}
          {ExpiryWarning}
          {ProductActions}

          {/* ACTIONS */}
          <div className="flex gap-6 items-center text-sm text-gray-600 mb-6">
            <button className="flex items-center gap-2 hover:text-[#C39A5B] transition">
              <FaBalanceScale /> Compare
            </button>
            <button
              className="flex items-center gap-2 hover:text-[#C39A5B] transition"
              onClick={handleWishlistToggle}
            >
              <FaHeart className={inWishlist ? "text-red-500" : ""} /> 
              {inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            </button>
          </div>

          {/* META */}
          <div className="border-t pt-4 text-sm text-gray-600">
            <p><strong>Category:</strong> {product.category}</p>

            <div className="flex items-center gap-4 mt-3">
              <strong>Share:</strong>
              {Object.entries(shareLinks).map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-800 transition"
                  aria-label={`Share on ${platform}`}
                >
                  {platform === 'facebook' && <FaFacebookF />}
                  {platform === 'twitter' && <FaTwitter />}
                  {platform === 'pinterest' && <FaPinterest />}
                  {platform === 'linkedin' && <FaLinkedin />}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-xl font-serif mb-10">Related Products</h2>

        {relatedLoading && <p className="text-gray-500">Loading related products...</p>}
        {relatedError && <p className="text-red-500">Failed to load related products</p>}

        {relatedProducts.length > 0 && (
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10">
            {relatedProducts.map((p) => {
              const relatedImageName = p.image?.split("/").pop();
              return (
                <Link to={`/products/${p.id}`} key={p.id} className="group cursor-pointer block">
                  <div className="relative overflow-hidden rounded-md">
                    <img
                      src={relatedImageName ? `${IMG_URL}${relatedImageName}` : "/images/placeholder.png"}
                      alt={p.title}
                      className="group-hover:scale-105 transition w-full h-48 object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <h3 className="text-sm font-medium line-clamp-1">{p.title}</h3>
                    <p className="text-xs text-gray-500 mb-1">{p.category}</p>
                    <p className="text-sm text-[#C39A5B] font-medium">{formatPrice(p.price)}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}