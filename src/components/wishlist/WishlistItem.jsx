import { FiX } from "react-icons/fi";

const WishlistItem = ({ product }) => {
  return (
    <div className="relative text-center group">

      {/* REMOVE */}
      <button className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm text-gray-500 hover:text-black flex items-center gap-1">
        <FiX /> Remove
      </button>

      {/* IMAGE */}
      <div className="relative">
        <span className="absolute top-2 left-2 bg-[#B98B5E] text-white text-xs px-2 py-1 rounded-full">
          {product.discount}
        </span>

        <img
          src={product.image}
          alt={product.title}
          className="mx-auto h-52 object-contain"
        />
      </div>

      {/* TITLE */}
      <h3 className="mt-4 font-medium text-sm">
        {product.title}
      </h3>

      {/* CATEGORY */}
      <p className="text-xs text-gray-400 mt-1">
        {product.category}
      </p>

      {/* PRICE */}
      <div className="mt-2 text-sm">
        <span className="line-through text-gray-400 mr-2">
          {product.oldPrice}
        </span>
        <span className="text-[#B98B5E] font-semibold">
          {product.price}
        </span>
      </div>
    </div>
  );
};

export default WishlistItem;
