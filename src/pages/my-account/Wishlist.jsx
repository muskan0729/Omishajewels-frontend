import { useCallback, useMemo } from "react";
import EmptyWishlist from "../../components/wishlist/EmptyWishlist";
import WishlistItem from "../../components/wishlist/WishlistItem";
import { useGet } from "../../hooks/useGet";
import { useDelete } from "../../hooks/useDelete";
import Loader from "../../components/Loader";

const MyAccountWishlist = () => {
  const token = localStorage.getItem("token");

  // Stable endpoint


  const { data, loading, error } = useGet("wishlist");
  const { executeDelete } = useDelete("wishlist");

  const wishlist = useMemo(() => {
    return data?.data || [];
  }, [data]);

  const handleRemove = useCallback(
    async (wishlistId) => {
      try {
        await executeDelete(wishlistId);
        ; // ✅ clean refetch
      } catch (err) {
        console.error("Delete failed", err);
      }
    },
    [executeDelete,]
  );

  if (!token) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-lg font-semibold mb-2">Please Login</h2>
        <p className="text-gray-500">
          Please login to view your wishlist.
        </p>
      </div>
    );
  }

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="p-10 text-center text-red-500">
        {error}
      </div>
    );
  }

  const isEmpty = wishlist.length === 0;

  return (
    <div className="p-10">
      <div className="border-b pb-4 mb-8">
        <h2 className="text-lg font-semibold">
          YOUR PRODUCTS WISHLIST
        </h2>
      </div>

      {isEmpty ? (
        <EmptyWishlist />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {wishlist.map((item) =>
            item?.ebook ? (
              <WishlistItem
                key={item.id}
                product={item.ebook}
                wishlistId={item.id}
                onRemove={() => handleRemove(item.id)}
              />
            ) : null
          )}
        </div>
      )}
    </div>
  );
};

export default MyAccountWishlist;
