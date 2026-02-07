import EmptyWishlist from "../../components/wishlist/EmptyWishlist";
import WishlistItem from "../../components/wishlist/WishlistItem";

const wishlistProducts = []; // empty for now

const MyAccountWishlist = () => {
  const isEmpty = wishlistProducts.length === 0;

  return (
    <div className="p-10">

      {/* PAGE TITLE */}
      <div className="border-b pb-4 mb-8">
        <h2 className="text-lg font-semibold">
          YOUR PRODUCTS WISHLIST
        </h2>
      </div>

      {/* CONTENT */}
      {isEmpty ? (
        <EmptyWishlist />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {wishlistProducts.map((product) => (
            <WishlistItem
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAccountWishlist;
