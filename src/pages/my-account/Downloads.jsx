import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { FiAlertCircle, FiDownload, FiFileText, FiClock } from "react-icons/fi";
import { useGet } from "../../hooks/useGet";
import Loader from "../../components/Loader";
import { toast } from "sonner";
import axios from "axios";

// Constants
const IMAGE_BASE_URL = 'https://omishajewels.com/Backend/public/uploads/ebook-images/';
const PLACEHOLDER_IMAGE = 'https://placehold.co/200x150/4b2c2c/white?text=No+Cover';
const EXPIRED_PLACEHOLDER = 'https://placehold.co/200x150/cccccc/666666?text=Expired';

const ERROR_MESSAGES = {
  401: "Session expired. Please login again.",
  403: "Your access has expired. Please purchase again.",
  404: "File not found. Please contact support."
};

export default function Downloads() {
  const userId = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");
  const isLoggedIn = !!userId && !!token;
  
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  
  const { data, loading, error } = useGet(isLoggedIn ? `my-library` : null);
  
  const [downloads, setDownloads] = useState([]);
  const [expiredDownloads, setExpiredDownloads] = useState([]);
  const [showExpired, setShowExpired] = useState(false);
  const [downloadingIds, setDownloadingIds] = useState([]);
  
  const downloadTimeoutRef = useRef(null);

  useEffect(() => {
    if (data?.success && data?.data) {
      setDownloads(data.data.active || []);
      setExpiredDownloads(data.data.expired || []);
    }
  }, [data]);

  const getImageUrl = useCallback((imagePath) => {
    if (!imagePath) return null;
    
    if (imagePath.startsWith('http')) {
      const filename = imagePath.split('/').pop();
      return `${IMAGE_BASE_URL}${filename}`;
    }
    
    const filename = imagePath.split('/').pop();
    return `${IMAGE_BASE_URL}${filename}`;
  }, []);

  const handleDownload = useCallback(async (ebook) => {
    if (ebook.days_remaining !== null && ebook.days_remaining <= 0) {
      toast.error("Your access has expired. Please purchase again.");
      return;
    }

    if (downloadingIds.includes(ebook.id)) return;

    setDownloadingIds(prev => [...prev, ebook.id]);

    try {
      const response = await axios.get(`${API_BASE_URL}ebook/${ebook.id}/download`, {
        headers: { 'Authorization': `Bearer ${token}` },
        responseType: 'blob',
        timeout: 30000,
      });

      const responseText = await response.data.text();
      
      // Check if response is HTML error page
      if (responseText.trim().startsWith('<!DOCTYPE') || responseText.trim().startsWith('<html')) {
        throw new Error('Server returned HTML error page');
      }

      // Check if response is JSON error
      try {
        const jsonResponse = JSON.parse(responseText);
        throw new Error(jsonResponse.message || 'Server returned error');
      } catch {
        // Not JSON, proceed with download
      }

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const cleanTitle = ebook.title.replace(/[^\w\s]/gi, '').replace(/\s+/g, ' ');
      link.setAttribute('download', `${cleanTitle}.pdf`);
      
      document.body.appendChild(link);
      link.click();
      
      downloadTimeoutRef.current = setTimeout(() => {
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
      
      toast.success("Download started successfully");
    } catch (err) {
      const errorMessage = ERROR_MESSAGES[err.response?.status] || 
                          (err.message === 'Server returned HTML error page' ? "Server error. Please try again later." : 
                          `Download failed: ${err.message}`);
      toast.error(errorMessage);
    } finally {
      setDownloadingIds(prev => prev.filter(id => id !== ebook.id));
    }
  }, [API_BASE_URL, token, downloadingIds]);

  useEffect(() => {
    return () => {
      if (downloadTimeoutRef.current) {
        clearTimeout(downloadTimeoutRef.current);
      }
    };
  }, []);

  const EmptyState = useMemo(() => (
    <div className="flex items-center gap-3 bg-[#E4B95B] text-white px-6 py-4 rounded-sm max-w-3xl">
      <FiAlertCircle className="text-xl shrink-0" />
      <p className="text-sm font-medium">
        {!isLoggedIn ? "Please login to view your downloads." : "No downloads available yet."}
      </p>
      <Link to={!isLoggedIn ? "/login" : "/shop"} className="ml-auto text-sm font-semibold underline">
        {!isLoggedIn ? "LOGIN" : "BROWSE PRODUCTS"}
      </Link>
    </div>
  ), [isLoggedIn]);

  const DownloadCard = useCallback(({ ebook, isExpired = false }) => {
    const imageUrl = getImageUrl(ebook.image);
    const isExpiringSoon = !isExpired && ebook.days_remaining <= 3 && ebook.days_remaining > 0;
    const isDownloading = downloadingIds.includes(ebook.id);
    
    if (isExpired) {
      return (
        <div className="bg-gray-50 rounded-lg shadow-md overflow-hidden border border-gray-200 relative">
          <div className="absolute inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center pointer-events-none">
            <span className="bg-gray-600 text-white px-3 py-1 rounded-full text-sm transform -rotate-12">
              EXPIRED
            </span>
          </div>
          
          <div className="h-40 bg-gray-200 flex items-center justify-center overflow-hidden">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={ebook.title}
                className="w-full h-full object-cover grayscale"
                loading="lazy"
                onError={(e) => { e.target.src = EXPIRED_PLACEHOLDER; }}
              />
            ) : (
              <FiFileText className="text-gray-400 text-5xl" />
            )}
          </div>

          <div className="p-5">
            <h3 className="font-semibold text-lg mb-2 line-clamp-1 text-gray-600">{ebook.title}</h3>
            <p className="text-sm text-gray-500 mb-4 line-clamp-2">
              {ebook.description || "No description available"}
            </p>

            {ebook.expired_on && (
              <div className="mb-3 text-xs text-red-500">
                Expired on: {new Date(ebook.expired_on).toLocaleDateString()}
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">
                Purchased: {new Date(ebook.purchased_on || ebook.purchased_at).toLocaleDateString()}
              </span>
              <Link to={`/shop?ebook=${ebook.id}`} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition">
                Purchase Again
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition relative">
        {isExpiringSoon && (
          <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 z-10">
            <FiClock /> Expires in {ebook.days_remaining} days
          </div>
        )}
        
        <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={ebook.title}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
            />
          ) : (
            <FiFileText className="text-gray-400 text-5xl" />
          )}
        </div>

        <div className="p-5">
          <h3 className="font-semibold text-lg mb-2 line-clamp-1">{ebook.title}</h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {ebook.description || "No description available"}
          </p>

          {ebook.access_expiry && (
            <div className="mb-3 text-xs">
              <span className="text-gray-500">Access until: </span>
              <span className={isExpiringSoon ? "text-orange-600 font-medium" : "text-gray-700"}>
                {new Date(ebook.access_expiry).toLocaleDateString()}
                {ebook.days_remaining && (
                  <span className="ml-1">({ebook.days_remaining} days left)</span>
                )}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Purchased: {new Date(ebook.purchased_on).toLocaleDateString()}
            </span>

            <button
              onClick={() => handleDownload(ebook)}
              disabled={isDownloading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                isDownloading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-[#B8964E] hover:bg-[#9E7F42] text-white'
              }`}
            >
              <FiDownload size={16} className={isDownloading ? 'animate-pulse' : ''} />
              {isDownloading ? 'Downloading...' : 'Download PDF'}
            </button>
          </div>

          <p className="text-xs text-gray-400 mt-3">Order #{ebook.order_id}</p>
        </div>
      </div>
    );
  }, [getImageUrl, downloadingIds, handleDownload]);

  if (!isLoggedIn) return EmptyState;
  if (loading) return <div className="w-full flex justify-center py-12"><Loader /></div>;
  
  if (error) {
    return (
      <div className="w-full">
        <div className="bg-red-500 text-white px-6 py-4 rounded-sm max-w-3xl">
          <p className="text-sm font-medium">Failed to load downloads. Please try again.</p>
          <p className="text-xs mt-2">Error: {error.message}</p>
        </div>
      </div>
    );
  }

  const hasActiveDownloads = downloads.length > 0;
  const hasExpiredDownloads = expiredDownloads.length > 0;

  if (!hasActiveDownloads && !hasExpiredDownloads) {
    return EmptyState;
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-6">My Downloads</h2>
      
      {/* Active Downloads Section */}
      {hasActiveDownloads && (
        <>
          <h3 className="text-lg font-medium mb-4 text-green-600">Active Downloads</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {downloads.map(ebook => (
              <DownloadCard key={ebook.id} ebook={ebook} isExpired={false} />
            ))}
          </div>
        </>
      )}

      {/* Expired Downloads Section */}
      {hasExpiredDownloads && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-500">Expired Downloads</h3>
            <button 
              onClick={() => setShowExpired(prev => !prev)} 
              className="text-sm text-[#B8964E] hover:underline transition"
            >
              {showExpired ? "Hide" : "Show"} Expired
            </button>
          </div>
          
          {showExpired && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-75">
              {expiredDownloads.map(ebook => (
                <DownloadCard key={ebook.id} ebook={ebook} isExpired={true} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}