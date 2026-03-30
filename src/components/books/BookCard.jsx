// BookCard.js
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { toast } from "sonner";

const BookCard = ({ book }) => {
  const { addToCart, isGuest: isCartGuest } = useCart();
  const { addToWishlist } = useWishlist();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const product = {
        id: book.id,
        name: book.title,
        price: book.price,
        quantity: 1,
        image: book.image,
        oldPrice: book.oldPrice,
        category: book.category
      };
      
      const success = await addToCart(product);
      
      if (success) {
        toast.success(`Added to cart${isCartGuest ? ' (Saved locally)' : ''}`);
      } else {
        toast.error("Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    }
  };

  const handleAddToWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const product = {
        id: book.id,
        name: book.title,
        price: book.price,
        image: book.image,
        oldPrice: book.oldPrice,
        category: book.category,
        discount: book.discount
      };
      
      const success = await addToWishlist(product);
      
      if (success) {
        toast.success("Added to wishlist");
      } else {
        toast.error("Failed to add to wishlist");
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error("Failed to add to wishlist");
    }
  };

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
        ease-out
        hover:-translate-y-2
        hover:scale-[1.02]
        hover:shadow-[0_18px_40px_rgba(184,150,78,0.25)]
        cursor-pointer
      "
    >
      {/* IMAGE */}
      <div className="relative h-[280px] bg-[#F5F3EF] flex items-center justify-center overflow-hidden">
        {/* DISCOUNT BADGE */}
        {book.discount && (
          <span
            className="
              absolute top-4 left-4
              bg-[#B8964E]
              text-white
              text-xs
              px-3 py-1
              rounded-full
              z-10
            "
          >
            {book.discount}
          </span>
        )}

        <img
          src={book.image}
          alt={book.title}
          className="h-full object-contain"
        />
      </div>

      {/* CONTENT */}
      <div className="p-5 text-center space-y-2">
        <Link
          to={`/books/${book.id}`}
          className="
            block
            text-sm
            font-medium
            text-[#2E2E2E]
            transition-colors
            group-hover:text-[#B8964E]
          "
        >
          {book.title}
        </Link>

        {/* CATEGORY (optional) */}
        {book.category && (
          <p className="text-xs text-[#9B9B9B]">
            {book.category}
          </p>
        )}

        {/* RATING (optional) */}
        {book.rating && (
          <div className="text-sm text-[#B8964E]">
            {"★".repeat(Math.round(book.rating))}
            <span className="text-gray-400 text-xs ml-1">
              ({book.rating})
            </span>
          </div>
        )}

        {/* PRICE */}
        <div className="flex justify-center items-center gap-2 pt-1">
          {book.oldPrice && (
            <span className="text-sm text-gray-400 line-through">
              ₹{book.oldPrice.toLocaleString()}
            </span>
          )}
          <span className="text-lg font-semibold text-[#2E2E2E]">
            ₹{book.price.toLocaleString()}
          </span>
        </div>

        {/* BUTTON */}
        <button
          onClick={handleAddToCart}
          className="
            mt-4 w-full
            py-2 text-sm tracking-wide
            rounded-lg
            bg-[#F6C6C6]
            text-[#A30000]
            transition
            group-hover:bg-[#B8964E]
            group-hover:text-white
          "
        >
          ADD TO CART
        </button>
      </div>
    </div>
  );
};

export default BookCard;