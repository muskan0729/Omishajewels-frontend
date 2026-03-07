import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiAlertCircle, FiDownload, FiFileText, FiClock } from "react-icons/fi";
import { useGet } from "../../hooks/useGet";
import Loader from "../../components/Loader";
import { toast } from "sonner";
import axios from "axios";

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

  const IMAGE_BASE_URL = 'https://omishajewels.com/Backend/public/uploads/ebook-images/';

  useEffect(() => {
    //console.log("API Response:", data);
    //console.log("Error:", error);
    
    if (data?.success && data?.data) {
      setDownloads(data.data.active || []);
      setExpiredDownloads(data.data.expired || []);
    }
  }, [data, error]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    if (imagePath.startsWith('http')) {
      const filename = imagePath.split('/').pop();
      return `${IMAGE_BASE_URL}${filename}`;
    }
    
    const filename = imagePath.split('/').pop();
    return `${IMAGE_BASE_URL}${filename}`;
  };

  // ✅ Fixed download function with better error handling
  const handleDownload = async (ebook) => {
    if (ebook.days_remaining !== null && ebook.days_remaining <= 0) {
      toast.error("Your access has expired. Please purchase again.");
      return;
    }

    if (downloadingIds.includes(ebook.id)) {
      return;
    }

    setDownloadingIds(prev => [...prev, ebook.id]);

    try {
      const downloadEndpoint = `${API_BASE_URL}ebook/${ebook.id}/download`;
      
      //console.log("Downloading from:", downloadEndpoint); // Debug log
      
      const response = await axios.get(downloadEndpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        responseType: 'blob',
        timeout: 30000,
      });

      

      // Check if response is actually an error HTML page
      const responseText = await response.data.text();
      //console.log("First 100 chars of response:", responseText.substring(0, 100));
      
      // If it contains HTML, it's an error page
      if (responseText.trim().startsWith('<!DOCTYPE') || responseText.trim().startsWith('<html')) {
        throw new Error('Server returned HTML error page');
      }

      // Try to parse as JSON to see if it's an error message
      try {
        const jsonResponse = JSON.parse(responseText);
        //console.log("Response is JSON:", jsonResponse);
        throw new Error(jsonResponse.message || 'Server returned error');
      } catch {
        // Not JSON, likely a valid file - proceed
      }

      // Re-create blob from the original response data
      const blob = new Blob([response.data], { type: 'application/pdf' });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Clean filename
      const cleanTitle = ebook.title.replace(/[^\w\s]/gi, '').replace(/\s+/g, ' ');
      link.setAttribute('download', `${cleanTitle}.pdf`);
      
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      setTimeout(() => {
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
      
      toast.success("Download started successfully");
    } catch (err) {
      console.error("Download failed - Full error:", err);
      console.error("Error response:", err.response);
      console.error("Error message:", err.message);
      
      // Handle specific error cases
      if (err.response?.status === 401) {
        toast.error("Session expired. Please login again.");
      } else if (err.response?.status === 403) {
        toast.error("Your access has expired. Please purchase again.");
      } else if (err.response?.status === 404) {
        toast.error("File not found. Please contact support.");
      } else if (err.message === 'Server returned HTML error page') {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error(`Download failed: ${err.message}`);
      }
    } finally {
      setDownloadingIds(prev => prev.filter(id => id !== ebook.id));
    }
  };

  // Rest of your component remains the same...
  if (!isLoggedIn) {
    return (
      <div className="w-full">
        <div className="flex items-center gap-3 bg-[#E4B95B] text-white px-6 py-4 rounded-sm max-w-3xl">
          <FiAlertCircle className="text-xl shrink-0" />
          <p className="text-sm font-medium">Please login to view your downloads.</p>
          <Link to="/login" className="ml-auto text-sm font-semibold underline">
            LOGIN
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full flex justify-center py-12">
        <Loader />
      </div>
    );
  }

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
    return (
      <div className="w-full">
        <div className="flex items-center gap-3 bg-[#E4B95B] text-white px-6 py-4 rounded-sm max-w-3xl">
          <FiAlertCircle className="text-xl shrink-0" />
          <p className="text-sm font-medium">No downloads available yet.</p>
          <Link to="/shop" className="ml-auto text-sm font-semibold underline">
            BROWSE PRODUCTS
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-6">My Downloads</h2>
      
      {/* Active Downloads Section */}
      {hasActiveDownloads && (
        <>
          <h3 className="text-lg font-medium mb-4 text-green-600">Active Downloads</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {downloads.map((ebook) => {
              const imageUrl = getImageUrl(ebook.image);
              const isExpiringSoon = ebook.days_remaining <= 3 && ebook.days_remaining > 0;
              const isDownloading = downloadingIds.includes(ebook.id);
              
              return (
                <div key={ebook.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition relative">
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
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://placehold.co/200x150/4b2c2c/white?text=No+Cover';
                        }}
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
            })}
          </div>
        </>
      )}

      {/* Expired Downloads Section */}
      {hasExpiredDownloads && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-500">Expired Downloads</h3>
            <button onClick={() => setShowExpired(!showExpired)} className="text-sm text-[#B8964E] hover:underline">
              {showExpired ? "Hide" : "Show"} Expired
            </button>
          </div>
          
          {showExpired && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-75">
              {expiredDownloads.map((ebook) => {
                const imageUrl = getImageUrl(ebook.image);
                
                return (
                  <div key={ebook.id} className="bg-gray-50 rounded-lg shadow-md overflow-hidden border border-gray-200 relative">
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
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://placehold.co/200x150/cccccc/666666?text=Expired';
                          }}
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
                        <Link to={`/shop?ebook=${ebook.id}`} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm">
                          Purchase Again
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}