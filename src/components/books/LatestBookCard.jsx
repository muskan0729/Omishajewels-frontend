import { Link } from "react-router-dom";
import { FaSearch, FaHeart, FaExchangeAlt, FaDownload } from "react-icons/fa"; // Added FaDownload
import QuickViewModal from "../QuickViewModal";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useGet } from "../../hooks/useGet";

const LatestBookCard = ({ book, onAddToCart, onAddToWishlist }) => {
    const [showQuickModal, setShowQuickModal] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isPurchased, setIsPurchased] = useState(false);
    const [purchaseInfo, setPurchaseInfo] = useState(null);
    
    const IMG_URL = import.meta.env.VITE_IMG_URL;
    const API_BASE_URL = import.meta.env.VITE_API_URL;
    
    const userId = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");
    const isLoggedIn = !!userId && !!token;

    const imageName = book.image?.split("/").pop();

    // Check if book is purchased
    useEffect(() => {
        const checkPurchaseStatus = async () => {
            if (!isLoggedIn || !book?.id) return;
            
            try {
                const response = await axios.get(`${API_BASE_URL}ebook/${book.id}/check-access`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                
                if (response.data?.success && response.data?.data?.has_access) {
                    setIsPurchased(true);
                    setPurchaseInfo(response.data.data);
                }
            } catch (error) {
                console.error("Failed to check purchase status:", error);
            }
        };

        checkPurchaseStatus();
    }, [book?.id, isLoggedIn, token, API_BASE_URL]);

    // Secure download function
    const handleDownload = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isLoggedIn) {
            toast.error("Please login to download");
            return;
        }

        if (!isPurchased) {
            toast.error("You haven't purchased this ebook");
            return;
        }

        if (isDownloading) return;

        setIsDownloading(true);

        try {
            const downloadEndpoint = `${API_BASE_URL}ebook/${book.id}/download`;
            
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
            const cleanTitle = book.title.replace(/[^\w\s]/gi, '').replace(/\s+/g, ' ');
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

    return (
        <>
            <div
                className="
                    group
                    bg-white
                    rounded-2xl
                    border border-[#E9E4DA]
                    shadow-[0_8px_20px_rgba(0,0,0,0.06)]
                    overflow-hidden
                    transition-all
                    duration-300
                    hover:shadow-[0_16px_36px_rgba(184,150,78,0.25)]
                    relative
                "
            >
                {/* IMAGE SECTION */}
                <div className="relative h-[260px] bg-[#F5F3EF] flex items-center justify-center overflow-hidden">

                    {/* DISCOUNT BADGE - only show if not purchased */}
                    {book.discount && !isPurchased && (
                        <span className="absolute top-3 left-3 bg-[#B8964E] text-white text-xs font-semibold px-3 py-2 rounded-full z-10">
                            {book.discount}
                        </span>
                    )}

                    {/* PURCHASED BADGE */}
                    {isPurchased && (
                        <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-semibold px-3 py-2 rounded-full z-10">
                            ✓ Owned
                        </span>
                    )}

                    {/* EXPIRY BADGE - if expiring soon */}
                    {isPurchased && purchaseInfo?.days_remaining <= 3 && purchaseInfo?.days_remaining > 0 && (
                        <span className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-semibold px-3 py-2 rounded-full z-10">
                            Expires in {purchaseInfo.days_remaining}d
                        </span>
                    )}

                    {/* ICONS RIGHT - only show if not purchased */}
                    {!isPurchased && (
                        <div
                            className="
                                absolute
                                top-4
                                right-3
                                flex
                                flex-col
                                gap-3
                                opacity-0
                                translate-x-6
                                group-hover:opacity-100
                                group-hover:translate-x-0
                                transition-all
                                duration-300
                                z-20
                            "
                        >
                            <button 
                                className="w-9 h-9 bg-white shadow-md rounded-full flex items-center justify-center hover:bg-[#B8964E] hover:text-white transition"
                                onClick={() => setShowQuickModal(true)}
                            >
                                <b>+</b>
                            </button>

                            <button 
                                className="w-9 h-9 bg-white shadow-md rounded-full flex items-center justify-center hover:bg-[#B8964E] hover:text-white transition"
                                onClick={() => onAddToWishlist(book)}
                            >
                                <FaHeart size={14} />
                            </button>
                        </div>
                    )}

                    <Link to={`/products/${book.id}`}>
                        {/* BOOK IMAGE */}
                        <img
                            src={`${IMG_URL}${imageName}`}
                            alt={book.title}
                            className="
                                h-full
                                object-contain
                                transition-transform
                                duration-300
                                group-hover:scale-105
                            "
                        />
                    </Link>

                    {/* BOTTOM BUTTON - Conditional based on purchase status */}
                    {isPurchased ? (
                        // Download button for purchased books
                        <button
                            onClick={handleDownload}
                            disabled={isDownloading}
                            className="
                                absolute
                                bottom-0
                                left-0
                                w-full
                                bg-green-500
                                hover:bg-green-600
                                text-white
                                font-semibold
                                py-3
                                text-sm
                                tracking-wide
                                flex
                                items-center
                                justify-center
                                gap-2
                                opacity-0
                                translate-y-6
                                group-hover:opacity-100
                                group-hover:translate-y-0
                                transition-all
                                duration-300
                                disabled:bg-gray-400
                                disabled:cursor-not-allowed
                            "
                        >
                            <FaDownload className={isDownloading ? 'animate-pulse' : ''} />
                            {isDownloading ? 'Downloading...' : 'Download PDF'}
                        </button>
                    ) : (
                        // Add to cart button for non-purchased books
                        <button
                            onClick={() => onAddToCart(book)}
                            className="
                                absolute
                                bottom-0
                                left-0
                                w-full
                                bg-[#B8964E]
                                text-white
                                font-semibold
                                py-3
                                text-sm
                                tracking-wide
                                opacity-0
                                translate-y-6
                                group-hover:opacity-100
                                group-hover:translate-y-0
                                transition-all
                                duration-300
                            "
                        >
                            ADD TO CART
                        </button>
                    )}
                </div>

                {/* CONTENT */}
                <div className="p-5 text-center space-y-2">
                    <Link
                        to={`/products/${book.id}`}
                        className="
                            block
                            text-base
                            font-medium
                            text-[#2E2E2E]
                            truncate
                            group-hover:text-[#B8964E]
                            transition-colors
                        "
                    >
                        {book.title}
                    </Link>

                    <p className="text-sm text-[#9B9B9B]">{book.category}</p>

                    <div className="text-base pt-1">
                        {book.oldPrice && !isPurchased && (
                            <span className="text-sm text-gray-400 line-through mr-2">
                                ₹{book.oldPrice.toLocaleString()}
                            </span>
                        )}

                        <span className="text-[#B8964E] font-semibold">
                            ₹{book.price.toLocaleString()}
                        </span>
                    </div>

                    {/* Expiry info for purchased books */}
                    {isPurchased && purchaseInfo?.expiry_date && (
                        <div className="text-xs text-gray-500 mt-1">
                            Access until: {new Date(purchaseInfo.expiry_date).toLocaleDateString()}
                            {purchaseInfo.days_remaining <= 7 && (
                                <span className="text-orange-500 ml-1">
                                    • {purchaseInfo.days_remaining} days left
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {showQuickModal && (
                <QuickViewModal
                    book={book}
                    onClose={() => setShowQuickModal(false)}
                    onAddToCart={onAddToCart}
                    onAddToWishlist={onAddToWishlist}
                    isPurchased={isPurchased}
                    onDownload={handleDownload}
                    isLoggedIn={isLoggedIn}
                />
            )}
        </>
    );
};

export default LatestBookCard;