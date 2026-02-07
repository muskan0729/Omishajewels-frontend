import { Link } from "react-router-dom";
import { FiHeart } from "react-icons/fi";

const EmptyWishlist = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <FiHeart className="text-gray-300 text-7xl mb-6" />

      <h3 className="text-2xl font-semibold mb-2">
        Wishlist is empty.
      </h3>

      <p className="text-gray-500 mb-8 max-w-md">
        You don’t have any products in the wishlist yet.
        You will find a lot of interesting products on our “Shop” page.
      </p>

      <Link
        to="/shop"
        className="bg-[#B8964E] text-white px-8 py-3 rounded-full hover:opacity-90 transition"
      >
        RETURN TO SHOP
      </Link>
    </div>
  );
};

export default EmptyWishlist;
