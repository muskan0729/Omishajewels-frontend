import { Link, NavLink } from "react-router-dom";
import { FiUser, FiSearch, FiHeart, FiShoppingCart } from "react-icons/fi";
import logo from "../../images/logo.png";
import Login from "../Login";


const Header = ({ setLoginOpen }) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="flex items-center">
        <img
            src={logo}
            alt="Logo"
            className="h-16 w-auto object-contain"
        />
        </Link>

        {/* NAV LINKS */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide text-[#2E2E2E]">
          {["/", "/shop", "/about", "/contact"].map((path, i) => {
            const labels = ["HOME", "SHOP", "ABOUT US", "CONTACT US"];
            return (
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
                {labels[i]}
              </NavLink>
            );
          })}
        </nav>

        {/* ICONS */}
        <div className="flex items-center gap-5 text-xl text-[#2E2E2E]">
          <button className="hover:text-[#B8964E] transition cursor-pointer">
            <FiSearch />
          </button>
           
          <button
            className="hover:text-[#B8964E] transition cursor-pointer"
            onClick={() => setLoginOpen(true)}
          >
            <FiUser />
          </button>
          
          <button className="hover:text-[#B8964E] transition cursor-pointer">
            <FiHeart />
          </button>

          <Link
            to="/cart"
            className="flex items-center gap-1 hover:text-[#B8964E] transition"
          >
            <FiShoppingCart />
            <span className="text-sm font-medium">₹0.00</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
