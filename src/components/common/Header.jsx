// Header.js (simplified version)
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiUser, FiSearch, FiHeart, FiShoppingCart } from "react-icons/fi";
import { useState, useEffect } from "react";
import SearchOverlay from "./SearchOverlay";
import CartDrawer from "../cart/CartDrawer";
import { useCart } from "./../../context/CartContext";
import { useWishlist } from "./../../context/WishlistContext";
import logo from "../../assets/images/logo.png";

const Header = ({ openLogin }) => {
  const { wishlistCount, refreshWishlist } = useWishlist();
  const { cartCount, cartSubtotal, refreshCart, isGuest } = useCart();

  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  // Only fetch when needed (no auto-polling)
  useEffect(() => {
    if (isLoggedIn) {
      refreshCart();
      refreshWishlist();
    }
  }, [isLoggedIn, refreshCart, refreshWishlist]);

  // Refresh data when tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        if (isLoggedIn) {
          refreshCart();
          refreshWishlist();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isLoggedIn, refreshCart, refreshWishlist]);

  const handleWishlistClick = () => {
    if (!isLoggedIn) {
      navigate("/my-account");
      return;
    }
    navigate("/my-account/wishlist");
  };

  const formatPrice = (price) => {
    return Number(price).toFixed(2);
  };



  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

          {/* LOGO */}
          <Link to="/" className="flex items-center">
            <img
              src={logo}
              alt="Omisha Jewels"
              className="h-25 w-auto object-contain"
            />
          </Link>

          {/* NAV LINKS */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide text-[#2E2E2E]">
            {[
              { path: "/", label: "HOME" },
              { path: "/shop", label: "SHOP" },
              { path: "/about", label: "ABOUT US" },
              { path: "/contact", label: "CONTACT US" },
            ].map(({ path, label }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `relative pb-1 transition-all
                  ${isActive
                    ? "text-[#B8964E] after:w-full"
                    : "after:w-0 hover:after:w-full"
                  }
                  after:absolute after:left-0 after:-bottom-1
                  after:h-[1px] after:bg-[#B8964E]
                  after:transition-all after:duration-300`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* ICONS */}
          <div className="flex items-center gap-5 text-xl text-[#2E2E2E]">

            {/* SEARCH */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hover:text-[#B8964E] transition cursor-pointer"
              aria-label="Search"
            >
              <FiSearch />
            </button>

            {/* USER */}
            <button
              className="hover:text-[#B8964E] transition cursor-pointer"
              aria-label="User"
              onClick={openLogin}
            >
              <FiUser />
            </button>

            {/* WISHLIST */}
            <button
              onClick={handleWishlistClick}
              className="relative hover:text-[#B8964E] transition cursor-pointer"
              aria-label="Wishlist"
            >
              <FiHeart size={22} />

              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] 
                                font-semibold rounded-full h-4 w-4 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* CART (DRAWER OPEN) - WITH COUNT BADGE */}
            <button
              onClick={() => setCartOpen(true)}
              className="flex items-center gap-1 hover:text-[#B8964E] transition cursor-pointer relative"
              aria-label="Cart"
            >
              <div className="relative">
                <FiShoppingCart size={22} />

                {/* CART COUNT BADGE */}
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] 
                                  font-semibold rounded-full h-4 w-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>

              {/* SUBTOTAL - Formatted with 2 decimal places */}
              <span className="text-sm font-medium ml-1">
                ₹{formatPrice(cartSubtotal)}
              </span>
            </button>

          </div>

        </div>
      </header>

      {/* SEARCH OVERLAY */}
      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />

      {/* CART DRAWER */}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        openLogin={openLogin}
      />
    </>
  );
};

export default Header;