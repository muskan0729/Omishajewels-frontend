import EmptyWishlist from "../components/wishlist/EmptyWishlist";
import WishlistItem from "../components/wishlist/WishlistItem";

const wishlistProducts = []; // EMPTY FOR NOW

const Wishlist = () => {
  const isEmpty = wishlistProducts.length === 0;

  return (
    <div className="bg-[#F6F6F6] min-h-screen py-16">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg flex">

        {/* LEFT SIDEBAR */}
        <aside className="w-64 border-r p-8">
          <h3 className="text-sm font-semibold mb-6">
            MY ACCOUNT
          </h3>

          <ul className="space-y-4 text-sm">
            {[
              "Dashboard",
              "Orders",
              "Downloads",
              "Addresses",
              "Account details",
              "Wishlist",
              "Logout",
            ].map((item) => (
              <li
                key={item}
                className={`cursor-pointer ${
                  item === "Wishlist"
                    ? "font-semibold text-black bg-gray-100 px-3 py-2 rounded"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                {item}
              </li>
            ))}
          </ul>
        </aside>

        {/* RIGHT CONTENT */}
        <main className="flex-1 p-10">

          {/* HEADER */}
          <div className="border-b pb-4 mb-8">
            <h2 className="text-lg font-semibold">
              YOUR PRODUCTS WISHLIST
            </h2>
          </div>

          {/* EMPTY OR ITEMS */}
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

        </main>
      </div>
    </div>
  );
};

export default Wishlist;
