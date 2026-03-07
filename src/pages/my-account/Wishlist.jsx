import { useState, useEffect } from "react";
import EmptyWishlist from "../../components/wishlist/EmptyWishlist";
import WishlistItem from "../../components/wishlist/WishlistItem";
import { useGet } from "../../hooks/useGet";
import { useDelete } from "../../hooks/useDelete";
import Loader from "../../components/Loader";
import { toast } from "sonner"; // ✅ ADD THIS IMPORT

const MyAccountWishlist = () => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("user_id");
  const isLoggedIn = !!userId && !!token;

  const [purchasedEbooks, setPurchasedEbooks] = useState({});

  // ✅ Use useGet for wishlist
  const { data, loading, error, refetch } = useGet("wishlist");
  
  // ✅ Use useGet for purchased ebooks (instead of manual fetch)
  const { data: purchasedData } = useGet(isLoggedIn ? "my-library" : null);
  
  // ✅ UseDelete hook
  const { executeDelete } = useDelete();

  // ✅ Process purchased ebooks when data arrives
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

  const wishlist = data?.data || [];

const handleRemove = async (wishlistId) => {
  try {
    // ✅ Pass the full endpoint with ID
    await executeDelete(`wishlist/${wishlistId}`);
    refetch(); 
    toast.success("Removed from wishlist");
  } catch (err) {
    console.error("Delete failed", err);
    toast.error("Failed to remove from wishlist");
  }
};

  const isEmpty = !loading && wishlist.length === 0;

  if (!token) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-lg font-semibold mb-2">Please Login</h2>
        <p className="text-gray-500">Please login to view your wishlist.</p>
      </div>
    );
  }

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="p-10 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-10">
      {/* PAGE TITLE */}
      <div className="border-b pb-4 mb-8">
        <h2 className="text-lg font-semibold">YOUR PRODUCTS WISHLIST</h2>
      </div>

      {/* CONTENT */}
      {isEmpty ? (
        <EmptyWishlist />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {wishlist.map((item) => (
            <WishlistItem
              key={item.id}
              product={item.ebook}
              wishlistId={item.id}
              onRemove={handleRemove}
              isPurchased={purchasedEbooks[item.ebook?.id]}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAccountWishlist;