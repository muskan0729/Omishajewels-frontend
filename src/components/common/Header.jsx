// import { Link, NavLink } from "react-router-dom";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiUser, FiSearch, FiHeart, FiShoppingCart } from "react-icons/fi";
// import logo from "../../../images/logo.jpeg";
import { useState } from "react";
import SearchOverlay from "./SearchOverlay";
import CartDrawer from "../cart/CartDrawer";
import { useGet } from "../../hooks/useGet";
// import useAutoFetch from "../../hooks/useAutoFetch";

// import Login from "../Login";


const Header = ({ openLogin }) => {
  // const { data} = useAutoFetch("wishlist",2000);
  // const total_wishlist_count = data?.total_count || 0;

//  const {data: cartData} = useAutoFetch("cart",2000);

// const subtotal = cartData?.subtotal || 0;
  

  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleWishlistClick = () => {
    if (!isLoggedIn) {
      // just redirect OR show message — no login popup
      navigate("/my-account");
      return;
    }
    navigate("/my-account/wishlist");
  };
  

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

          {/* LOGO */}
          <Link to="/" className="flex items-center">
            <img
              src="/assets/images/logo.png"
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
                  ${
                    isActive
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

              {1 > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] 
                                font-semibold rounded-full h-4 w-4 flex items-center justify-center">
                  {/* {total_wishlist_count} */}
                </span>
              )}
            </button>



            {/* CART (DRAWER OPEN) */}
            <button
                onClick={() => setCartOpen(true)}
                className="flex items-center gap-1 hover:text-[#B8964E] transition cursor-pointer"
                aria-label="Cart"
              >
                <FiShoppingCart />

                {/* SUBTOTAL */}
                <span className="text-sm font-medium">
                  {/* ₹{subtotal} */}
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
        // onClose={() => setCartOpen(false)}
          onClose={() => setCartOpen(false)}
  openLogin={openLogin}
      />
    </>
  );
};

export default Header;
