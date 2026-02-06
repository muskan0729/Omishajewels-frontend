import { Link, NavLink } from "react-router-dom";
import { FiUser, FiSearch, FiHeart, FiShoppingCart } from "react-icons/fi";
import logo from "../../images/logo.png";
import { useState } from "react";
import SearchOverlay from "./SearchOverlay";
import CartDrawer from "../cart/CartDrawer";
import Login from "../Login";


const Header = ({ setLoginOpen }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

          {/* LOGO */}
          <Link to="/" className="flex items-center">
            <img
              src={logo}
              alt="Omisha Jewels"
              className="h-16 w-auto object-contain"
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
            
            onClick={() => setLoginOpen(true)}
          >
              <FiUser />
            </button>
          

            {/* WISHLIST */}
            <Link
              to="/wishlist"
              className="hover:text-[#B8964E] transition cursor-pointer"
              aria-label="Wishlist"
            >
              <FiHeart />
            </Link>

            {/* CART (DRAWER OPEN) */}
            <button
              onClick={() => setCartOpen(true)}
              className="flex items-center gap-1 hover:text-[#B8964E] transition cursor-pointer"
              aria-label="Cart"
            >
              <FiShoppingCart />
              <span className="text-sm font-medium">₹0.00</span>
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
      />
    </>
  );
};

export default Header;
