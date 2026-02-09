import EmptyWishlist from "../../components/wishlist/EmptyWishlist";
import WishlistItem from "../../components/wishlist/WishlistItem";
import { useGet } from "../../hooks/useGet";
import { useDelete } from "../../hooks/useDelete";

const MyAccountWishlist = () => {
  const { data, loading, error, refetch } = useGet("wishlist");

  const { executeDelete } = useDelete();

  const wishlist = data?.data || [];

  const handleRemove = async (ebookId) => {
    try {
      await executeDelete(`wishlist/${ebookId}`);
      refetch(); 
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const isEmpty = !loading && wishlist.length === 0;

  if (loading) {
    return (
      <div className="p-10 text-center">
        <p>Loading wishlist...</p>
      </div>
    );
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
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAccountWishlist;
