import React, { useState, useCallback, useMemo } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaPinterest,
  FaLinkedin,
  FaHeart,
} from "react-icons/fa";
import { useCart } from "./../context/CartContext";
import { useWishlist } from "./../context/WishlistContext";
import { toast } from "sonner";

const QuickViewModal = ({ book, onClose, isPurchased, onDownload, isLoggedIn, inWishlist, onWishlistToggle }) => {
  const [qty, setQty] = useState(1);
  const [imgError, setImgError] = useState(false);
  
  const { addToCart, isGuest: isCartGuest } = useCart();
  const { addToWishlist, removeFromWishlist, wishlistItems } = useWishlist();
  
  const IMG_BASE_URL = import.meta.env.VITE_IMG_URL;
  const placeholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400' viewBox='0 0 300 400'%3E%3Crect width='300' height='400' fill='%23f0f0f0'/%3E%3Ctext x='150' y='200' font-family='Arial' font-size='14' text-anchor='middle' fill='%23999999'%3ENo Image%3C/text%3E%3C/svg%3E";

  // Check if product is in wishlist (either from prop or context)
  const isInWishlist = useMemo(() => {
    if (inWishlist !== undefined) return inWishlist;
    return wishlistItems.some(item => item.id === book?.id);
  }, [inWishlist, wishlistItems, book?.id]);

  // Convert image path
  const convertImagePath = useCallback((imagePath) => {
    if (!imagePath) return '';
    
    if (imagePath.includes('/public/uploads/')) return imagePath;
    if (imagePath.includes('/storage/uploads/')) {
      return imagePath.replace('/storage/uploads/', '/public/uploads/');
    }
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    const filename = imagePath.split('/').pop();
    return `${IMG_BASE_URL}${filename}`;
  }, [IMG_BASE_URL]);

  const imageUrl = useMemo(() => convertImagePath(book?.image), [book?.image, convertImagePath]);

  // Handle quantity change
  const handleQuantityChange = useCallback((delta) => {
    setQty(prev => Math.max(1, prev + delta));
  }, []);

  // Handle add to cart
  const handleAddToCart = useCallback(async () => {
    try {
      const product = {
        id: book.id,
        name: book.title,
        price: book.price,
        quantity: qty,
        image: book.image,
        oldPrice: book.oldPrice,
        category: book.category
      };
      
      const success = await addToCart(product);
      
      if (success) {
        toast.success(`Added ${qty} item(s) to cart${isCartGuest ? ' (Saved locally)' : ''}`);
        onClose();
      }
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  }, [book, qty, addToCart, isCartGuest, onClose]);

  // Handle wishlist toggle
  const handleWishlistToggle = useCallback(async () => {
    try {
      if (isInWishlist) {
        const success = await removeFromWishlist(book.id);
        toast[success ? "success" : "error"](success ? "Removed from wishlist" : "Failed to remove from wishlist");
      } else {
        const product = {
          id: book.id,
          name: book.title,
          price: book.price,
          image: book.image,
          oldPrice: book.oldPrice,
          category: book.category
        };
        const success = await addToWishlist(product);
        toast[success ? "success" : "error"](success ? "Added to wishlist" : "Failed to add to wishlist");
      }
      // Call parent toggle if provided
      if (onWishlistToggle) onWishlistToggle();
    } catch (error) {
      toast.error("Operation failed");
    }
  }, [book, isInWishlist, addToWishlist, removeFromWishlist, onWishlistToggle]);

  // Share URLs
  const shareUrls = useMemo(() => ({
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
    twitter: `https://twitter.com/share?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(book?.title || '')}`,
    pinterest: `https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}&media=${encodeURIComponent(imageUrl)}&description=${encodeURIComponent(book?.title || '')}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(book?.title || '')}`
  }), [book?.title, imageUrl]);

  if (!book) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 px-4">
      <div className="bg-white w-full max-w-5xl rounded-sm shadow-lg relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl z-10 transition-colors"
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          {/* LEFT IMAGE */}
          <div className="flex justify-center items-center bg-white">
            <img
              src={imgError ? placeholderImage : imageUrl}
              alt={book.title}
              className="w-[300px] h-[400px] object-contain"
              loading="lazy"
              onError={(e) => {
                if (imageUrl.includes('/storage/')) {
                  e.target.src = imageUrl.replace('/storage/', '/public/');
                } else {
                  setImgError(true);
                }
              }}
            />
          </div>

          {/* RIGHT CONTENT */}
          <div>
            <h2 className="text-2xl font-serif text-gray-800 mb-3">
              {book.title}
            </h2>

            {/* PRICE */}
            <div className="flex items-center gap-3 mb-6">
              {book.oldPrice && (
                <span className="text-gray-400 line-through text-lg">
                  ₹{Number(book.oldPrice).toLocaleString()}
                </span>
              )}
              <span className="text-[#B5854D] font-semibold text-xl">
                ₹{Number(book.price).toLocaleString()}
              </span>
            </div>

            {/* QUANTITY SELECTOR - Only show if not purchased */}
            {(!isPurchased || !isLoggedIn) && (
              <div className="mb-6">
                <label className="block text-sm text-gray-600 mb-2">Quantity:</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100 transition"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="w-12 text-center">{qty}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100 transition"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* ACTION BUTTONS */}
            <div className="flex items-center gap-4 mb-6 flex-wrap">
              {(!isPurchased || !isLoggedIn) && (
                <button
                  onClick={handleAddToCart}
                  className="bg-[#B5854D] hover:bg-[#9d6f3c] text-white font-semibold px-10 py-3 rounded-full text-sm uppercase transition-colors"
                >
                  Add to cart
                </button>
              )}
              
              {isLoggedIn && !isPurchased && (
                <button
                  onClick={handleWishlistToggle}
                  className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-full text-sm uppercase transition-colors"
                >
                  <FaHeart 
                    className={`transition-colors ${
                      isInWishlist ? 'text-red-500' : 'text-gray-400'
                    }`}
                  />
                  {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                </button>
              )}

              {isPurchased && (
                <button
                  onClick={onDownload}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-full text-sm uppercase transition-colors"
                >
                  Download PDF
                </button>
              )}
            </div>

            <hr className="my-6" />

            {/* CATEGORY */}
            <p className="text-sm text-gray-700 mb-5">
              <strong>Category:</strong>{" "}
              <span className="text-gray-500">{book.category}</span>
            </p>

            {/* SHARE */}
            <div className="flex items-center gap-4 text-sm text-gray-700">
              <strong>Share:</strong>
              <div className="flex items-center gap-4 text-gray-500">
                {Object.entries(shareUrls).map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-800 transition-colors"
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
      </div>
    </div>
  );
};

export default QuickViewModal;