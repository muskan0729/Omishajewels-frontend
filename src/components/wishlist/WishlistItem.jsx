import { FiX } from "react-icons/fi";

// const IMAGE_BASE_URL =
//   "https://omishajewels.com/Backend/public";

const WishlistItem = ({ product, onRemove }) => {
  if (!product) return null;
  const IMG_URL = import.meta.env.VITE_IMG_URL;
  const imageName = product.image?.split("/").pop();
  // console.log("Full Image URL:", `${IMG_URL}/${imageName}`);


  // // ✅ correct image path
  // const imageUrl =
  //   product?.images?.length > 0
  //     ? `${IMAGE_BASE_URL}/${product.images[0].image_path}`
  //     : "/images/placeholder.png";

  return (
    <div className="relative bg-white border border-gray-200 rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group">

      {/* REMOVE BUTTON */}
      <button
        onClick={() => onRemove(product.id)}
        className="cursor-pointer absolute top-3 right-3 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-300 transition"
        title="Remove from wishlist"
      >
        <FiX size={14} />
      </button>

      {/* IMAGE SECTION */}
      <div className="relative flex items-center justify-center h-60 bg-[#F8F6F3] rounded-xl overflow-hidden">

        {/* DISCOUNT BADGE */}
        {product?.discount && (
          <span className="absolute top-3 left-3 bg-[#B98B5E] text-white text-[11px] px-2 py-1 rounded-full tracking-wide z-10">
            {product.discount}
          </span>
        )}

        <img
          // src={imageUrl}
          src={`${IMG_URL}/${imageName}`}
          alt={product.title}
          className="h-40 object-contain transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      {/* CONTENT */}
      <div className="mt-4 text-center">
        <h3 className="font-medium text-sm text-gray-800 leading-snug line-clamp-2">
          {product.title}
        </h3>

        {product.category && (
          <p className="text-xs text-gray-400 mt-1">
            {product.category}
          </p>
        )}

        <div className="mt-3 flex items-center justify-center gap-2 text-sm">
          {product.old_price && (
            <span className="line-through text-gray-400">
              ₹{product.old_price}
            </span>
          )}
          <span className="text-[#B98B5E] font-semibold">
            ₹{product.price}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WishlistItem;
