import { Link } from "react-router-dom";
import { FiHeart } from "react-icons/fi";

const EmptyWishlist = () => {
  return (
    <div className="bg-white rounded-2xl shadow-xl py-20 px-6 flex flex-col items-center text-center">
      <FiHeart className="text-[120px] text-gray-200 mb-6" />

      <h2 className="text-3xl font-medium mb-4">
        Wishlist is empty.
      </h2>

      <p className="text-gray-600 max-w-md mb-8">
        You don’t have any products in the wishlist yet.
        <br />
        You will find a lot of interesting products on our “Shop” page.
      </p>

      <Link
        to="/shop"
        className="
          bg-[#B98B5E]
          hover:bg-[#a7794f]
          text-white
          px-10 py-4
          rounded-full
          font-semibold
          transition
        "
      >
        RETURN TO SHOP
      </Link>
    </div>
  );
};

export default EmptyWishlist;
