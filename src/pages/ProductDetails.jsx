import { useState, useEffect } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaHeart,
  FaBalanceScale,
  FaPinterest,
  FaLinkedin,
  FaDownload,
  FaClock,
} from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { useGet } from "../hooks/useGet";
import { addToCartManager, addToWishlistManager } from "../utils/cartManager";
import { usePost } from "../hooks/usePost";
import { toast } from "sonner";
import Loader from "../components/Loader";
import axios from "axios";

export default function ProductDetails() {
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("description");
  const [purchaseStatus, setPurchaseStatus] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const { id } = useParams();
  const { execute: cartExecute } = usePost("cart/add");
  const { execute: wishlistExecute } = usePost("wishlist");

  const userId = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");
  const isLoggedIn = !!userId && !!token;

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  /* ================= PRODUCT API ================= */
  const { data, isLoading, error } = useGet(id ? `products/${id}` : null);

  /* ================= RELATED PRODUCTS API ================= */
  const {
    data: relatedData,
    isLoading: relatedLoading,
    error: relatedError,
  } = useGet(id ? `products/${id}/related` : null);

  /* ================= PURCHASE STATUS API ================= */
  // ✅ Using useGet hook for purchase status
  const { 
    data: accessData, 
    isLoading: accessLoading,
    error: accessError 
  } = useGet(isLoggedIn && id ? `ebook/${id}/check-access` : null);

  // Process purchase status when data arrives
  useEffect(() => {
    if (accessData?.success) {
      setPurchaseStatus(accessData.data);
    } else if (accessError) {
      console.error("Failed to check purchase status:", accessError);
      setPurchaseStatus(null);
    }
  }, [accessData, accessError]);

  const relatedProducts = relatedData?.data || [];
  const product = data?.data || null;

  const IMG_URL = import.meta.env.VITE_IMG_URL;
  const imageName = product?.image?.split("/").pop();
  
  /* ================= HANDLERS ================= */
  const handleAddToCart = () => {
    if (!isLoggedIn) {
      toast.error("Please login to add to cart");
      return;
    }
    
    const productData = {
      id: product.id,  
      product_id: product.id,
      title: product.title,
      price: product.price,
      quantity: qty,
    };
    
    addToCartManager(productData, cartExecute);
    toast.success("Added to cart");
  };

  // Secure download function
  const handleDownload = async () => {
    if (!isLoggedIn) {
      toast.error("Please login to download");
      return;
    }
    
    if (!purchaseStatus?.has_access) {
      toast.error("You don't have access to download this ebook");
      return;
    }

    // Check if access is expired
    if (purchaseStatus.days_remaining !== null && purchaseStatus.days_remaining <= 0) {
      toast.error("Your access has expired. Please purchase again.");
      return;
    }

    if (isDownloading) return;

    setIsDownloading(true);

    try {
      const downloadEndpoint = `${API_BASE_URL}ebook/${id}/download`;
      
      //console.log("Downloading from:", downloadEndpoint);
      
      const response = await axios.get(downloadEndpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        responseType: 'blob',
        timeout: 30000,
      });

      // Create blob and trigger download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Clean filename
      const cleanTitle = product.title.replace(/[^\w\s]/gi, '').replace(/\s+/g, ' ');
      link.setAttribute('download', `${cleanTitle}.pdf`);
      
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      setTimeout(() => {
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
      
      toast.success("Download started");
    } catch (err) {
      console.error("Download failed:", err);
      
      if (err.response?.status === 401) {
        toast.error("Session expired. Please login again.");
      } else if (err.response?.status === 403) {
        toast.error("Your access has expired. Please purchase again.");
      } else if (err.response?.status === 404) {
        toast.error("File not found. Please contact support.");
      } else {
        toast.error("Failed to download. Please try again.");
      }
    } finally {
      setIsDownloading(false);
    }
  };

  /* ================= LOADING STATES ================= */
  const isLoadingAny = isLoading || accessLoading;

  if (isLoadingAny || !data) {
    return <Loader />;
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
            src={`${IMG_URL}${imageName}`}  
            alt={product.title}
            className="w-full rounded-md"
            style={{width:"auto", height:"500px",paddingLeft:"100px"}}
          />
          
          {/* Purchase badge */}
          {isLoggedIn && purchaseStatus?.has_access && (
            <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              ✓ Purchased
            </div>
          )}

          {/* Expiring soon badge */}
          {isLoggedIn && purchaseStatus?.has_access && 
           purchaseStatus.days_remaining <= 3 && 
           purchaseStatus.days_remaining > 0 && (
            <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Expires in {purchaseStatus.days_remaining}d
            </div>
          )}
        </div>

        {/* DETAILS */}
        <div>
          <h1 className="text-3xl font-serif mb-4">{product.title}</h1>

          <div className="flex items-center gap-4 mb-6">
            {/* Only show old price if not purchased */}
            {product.oldPrice && !purchaseStatus?.has_access && (
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

          {/* ACCESS INFO - Only for logged-in users with purchase */}
          {isLoggedIn && purchaseStatus?.has_access && (
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
              
              {/* Download button only */}
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
          )}

          {/* EXPIRING SOON WARNING */}
          {isLoggedIn && purchaseStatus?.has_access && 
           purchaseStatus.days_remaining <= 3 && 
           purchaseStatus.days_remaining > 0 && (
            <div className="mb-6 p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-center gap-2">
              <FaClock className="text-orange-500" />
              <p className="text-sm text-orange-700">
                Your access will expire in {purchaseStatus.days_remaining} days. 
                Please download the ebook to keep it permanently.
              </p>
            </div>
          )}

          {/* QTY and ADD TO CART - Only show if not purchased or not logged in */}
          {(!isLoggedIn || !purchaseStatus?.has_access) && (
            <div className="flex items-center gap-4 mb-6">
              <button
                className="bg-[#C39A5B] text-white px-8 py-3 rounded-full hover:bg-[#A87B45] transition"
                onClick={handleAddToCart}
                disabled={accessLoading}
              >
                {accessLoading ? "Checking..." : "ADD TO CART"}
              </button>
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex gap-6 items-center text-sm text-gray-600 mb-6">
            <button className="flex items-center gap-2 hover:text-[#C39A5B] transition">
              <FaBalanceScale /> Compare
            </button>
            <button
              className="flex items-center gap-2 hover:text-[#C39A5B] transition"
              onClick={() => {
                if (!userId) {
                  toast.error("Please login to add to wishlist");
                  return;
                }
                
                const productData = {
                  id: product.id,  
                  product_id: product.id,
                  title: product.title,
                  price: product.price,
                  quantity: qty,
                };
                
                addToWishlistManager(
                  { ...productData, user_id: userId },
                  wishlistExecute,
                );
                toast.success("Added to wishlist");
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
                href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-800"
              >
                <FaFacebookF />
              </a>
              <a
                href={`https://x.com/share?url=${window.location.href}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-800"
              >
                <FaTwitter />
              </a>
              <a
                href={`https://www.pinterest.com/pin/create/button/?url=${window.location.href}&media=${IMG_URL}${imageName}&description=${product.title}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-800"
              >
                <FaPinterest />
              </a>
              <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${window.location.href}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-800"
              >
                <FaLinkedin />
              </a>
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
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10">
            {relatedProducts.map((p) => {
              const relatedImageName = p.image?.split("/").pop();
              const relatedImageSrc = relatedImageName
                ? `${IMG_URL}${relatedImageName}`
                : "/images/placeholder.png";

              return (
                <Link to={`/products/${p.id}`} key={p.id} className="group cursor-pointer block">
                  <div className="relative overflow-hidden rounded-md">
                    <img
                      src={relatedImageSrc}
                      alt={p.title}
                      className="group-hover:scale-105 transition w-full h-48 object-cover"
                    />
                  </div>

                  <div className="mt-4 text-center">
                    <h3 className="text-sm font-medium line-clamp-1">{p.title}</h3>
                    <p className="text-xs text-gray-500 mb-1">{p.category}</p>
                    <p className="text-sm text-[#C39A5B] font-medium">
                      ₹{Number(p.price).toLocaleString()}
                    </p>
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