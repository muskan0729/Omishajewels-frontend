import { Link } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";

const EmptyCart = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6">
      <FiShoppingCart className="text-[90px] text-gray-200 mb-6" />

      <p className="text-sm font-medium mb-6">
        NO PRODUCTS IN THE CART.
      </p>

      <Link
        to="/shop"
        className="bg-[#B98B5E] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#a7794f] transition"
      >
        RETURN TO SHOP
      </Link>
    </div>
  );
};

export default EmptyCart;
