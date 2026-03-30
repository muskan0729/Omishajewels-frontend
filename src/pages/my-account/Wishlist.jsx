// MyAccountWishlist.js
import { useState, useEffect, useRef } from "react";
import EmptyWishlist from "../../components/wishlist/EmptyWishlist";
import WishlistItem from "../../components/wishlist/WishlistItem";
import { useWishlist } from "../../context/WishlistContext";
import { useGet } from "./../../hooks/useGet";
import Loader from "../../components/Loader";

const MyAccountWishlist = () => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("user_id");
  const isLoggedIn = !!userId && !!token;

  const [purchasedEbooks, setPurchasedEbooks] = useState({});
  const hasRefreshed = useRef(false);

  const { 
    wishlistItems, 
    wishlistCount, 
    isLoading: wishlistLoading, 
    isGuest,
    refreshWishlist
  } = useWishlist();
  
  const { data: purchasedData, loading: purchasedLoading } = useGet(
    isLoggedIn ? "my-library" : null
  );

  useEffect(() => {
    if (purchasedData?.success && purchasedData?.data) {
      const purchasedMap = {};
      
      if (purchasedData.data.active) {
        purchasedData.data.active.forEach(item => {
          purchasedMap[item.id] = {
            hasAccess: true,
            download_url: item.download_url,
            expiry_date: item.access_expiry,
            days_remaining: item.days_remaining
          };
        });
      }
      
      if (purchasedData.data.expired) {
        purchasedData.data.expired.forEach(item => {
          purchasedMap[item.id] = {
            hasAccess: false,
            expired: true,
            expiry_date: item.access_expiry,
            days_remaining: 0
          };
        });
      }
      
      setPurchasedEbooks(purchasedMap);
    }
  }, [purchasedData]);

  useEffect(() => {
    if (isLoggedIn && !hasRefreshed.current) {
      hasRefreshed.current = true;
      refreshWishlist();
    }
  }, [isLoggedIn, refreshWishlist]);

  const isEmpty = !wishlistLoading && wishlistItems.length === 0;

  if (!token) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-lg font-semibold mb-2">Please Login</h2>
        <p className="text-gray-500">Please login to view your wishlist.</p>
      </div>
    );
  }

  if (wishlistLoading || purchasedLoading) {
    return <Loader />;
  }

  if (!wishlistItems && !wishlistLoading) {
    return <div className="p-10 text-center text-red-500">Failed to load wishlist</div>;
  }

  return (
    <div className="p-10">
      <div className="border-b pb-4 mb-8">
        <h2 className="text-lg font-semibold">
          YOUR PRODUCTS WISHLIST ({wishlistCount} {wishlistCount === 1 ? 'item' : 'items'})
        </h2>
        {isGuest && wishlistCount > 0 && (
          <p className="text-xs text-gray-500 mt-2">
            💡 Your wishlist is saved locally. Login to sync with your account.
          </p>
        )}
      </div>

      {isEmpty ? (
        <EmptyWishlist />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {wishlistItems.map((item) => (
            <WishlistItem
              key={item.id}
              product={item}
              wishlistId={item.id}
              isPurchased={purchasedEbooks[item.id]}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAccountWishlist;