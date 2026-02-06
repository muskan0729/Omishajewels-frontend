import { Link } from "react-router-dom";

const LatestBookCard = ({ book }) => {
  return (
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
      {/* IMAGE */}
      <div className="h-[240px] bg-[#F5F3EF] flex items-center justify-center overflow-hidden">
        <img
          src={book.image}
          alt={book.title}
          className="
            h-full
            object-contain
            transition-transform
            duration-300
            group-hover:scale-105
          "
        />
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

        <p className="text-sm text-[#9B9B9B]">
          {book.category}
        </p>

        <div className="text-base pt-1">
          <span className="text-[#B8964E] font-semibold">
            ₹{book.price.toLocaleString()}
          </span>
          {book.oldPrice && (
            <span className="ml-2 text-sm text-gray-400 line-through">
              ₹{book.oldPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default LatestBookCard;
