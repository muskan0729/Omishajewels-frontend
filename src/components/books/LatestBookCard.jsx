import { Link } from "react-router-dom";
import { FaSearch, FaHeart, FaExchangeAlt } from "react-icons/fa";
import QuickViewModal from "../QuickViewModal";
import { useState } from "react";

const LatestBookCard = ({ book, onAddToCart,onAddToWishlist  }) => {
    const [showQuickModal, setShowQuickModal] = useState(false);
    const IMG_URL = import.meta.env.VITE_IMG_URL;

const imageName = book.image?.split("/").pop();
  return (
    <>
    <div
      className="
        group
        bg-white
        rounded-2xl
        border border-[#E9E4DA]
        shadow-[0_8px_20px_rgba(0,0,0,0.06)]
        overflow-hidden
        transition-all
        duration-300
        hover:shadow-[0_16px_36px_rgba(184,150,78,0.25)]
      "
    >
      {/* IMAGE SECTION */}
      <div className="relative h-[260px] bg-[#F5F3EF] flex items-center justify-center overflow-hidden">

        {/* DISCOUNT BADGE */}
        {book.discount && (
          <span className="absolute top-3 left-3 bg-[#B8964E] text-white text-xs font-semibold px-3 py-2 rounded-full z-10">
            {book.discount}
          </span>
        )}

        {/* ICONS RIGHT */}
        <div
          className="
            absolute
            top-4
            right-3
            flex
            flex-col
            gap-3
            opacity-0
            translate-x-6
            group-hover:opacity-100
            group-hover:translate-x-0
            transition-all
            duration-300
            z-20
          "
        >
          {/* <button className="w-9 h-9 bg-white shadow-md rounded-full flex items-center justify-center hover:bg-[#B8964E] hover:text-white transition">
            <FaExchangeAlt size={14} />
          </button> */}

          <button 
          className="w-9 h-9 bg-white shadow-md rounded-full flex items-center justify-center hover:bg-[#B8964E] hover:text-white transition"
          onClick={() => setShowQuickModal(true)}>
            {/* <FaSearch size={14} /> */}
            <b>+</b>
          </button>

          <button className="w-9 h-9 bg-white shadow-md rounded-full flex items-center justify-center hover:bg-[#B8964E] hover:text-white transition"
          onClick={() => onAddToWishlist(book)}>
            <FaHeart size={14} />
          </button>
        </div>
  <Link to={`/products/${book.id}`}>
        {/* BOOK IMAGE */}
        <img
          src={`${IMG_URL}${imageName}`}
          alt={book.title}
          className="
            h-full
            object-contain
            transition-transform
            duration-300
            group-hover:scale-105
          "
        />
</Link>
        {/* ADD TO CART STRIP */}
        <button
            onClick={() => onAddToCart(book)}
          className="
            absolute
            bottom-0
            left-0
            w-full
            bg-[#B8964E]
            text-white
            font-semibold
            py-3
            text-sm
            tracking-wide
            opacity-0
            translate-y-6
            group-hover:opacity-100
            group-hover:translate-y-0
            transition-all
            duration-300
          "
        >
          ADD TO CART
        </button>
      </div>

      {/* CONTENT */}
      <div className="p-5 text-center space-y-2">
        <Link
          to={`/books/${book.id}`}
          className="
            block
            text-base
            font-medium
            text-[#2E2E2E]
            truncate
            group-hover:text-[#B8964E]
            transition-colors
          "
        >
          {book.title}
        </Link>

        <p className="text-sm text-[#9B9B9B]">{book.category}</p>

        <div className="text-base pt-1">
          {book.oldPrice && (
            <span className="text-sm text-gray-400 line-through mr-2">
              ₹{book.oldPrice.toLocaleString()}
            </span>
          )}

          <span className="text-[#B8964E] font-semibold">
            ₹{book.price.toLocaleString()}
          </span>
        </div>
      </div>
    </div>

    {showQuickModal && (
  <QuickViewModal
    book={book}
    onClose={() => setShowQuickModal(false)}
    onAddToCart={onAddToCart}
    onAddToWishlist={onAddToWishlist}
  />
)}

    </>
  );
};

export default LatestBookCard;
