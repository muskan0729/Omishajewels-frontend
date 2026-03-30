// AccountSidebar.js
import { NavLink, useNavigate } from "react-router-dom";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { useCart } from "./../../context/CartContext";
import { useWishlist } from "./../../context/WishlistContext";
import { toast } from "sonner";

const links = [
  { to: "/my-account", label: "Dashboard", end: true },
  { to: "/my-account/orders", label: "Orders", auth: true },
  { to: "/my-account/downloads", label: "Downloads", auth: true },
  { to: "/my-account/account-details", label: "Change Password", auth: true },
  { to: "/my-account/wishlist", label: "Wishlist", auth: true },
];

export default function AccountSidebar({ openLogin }) {
  const navigate = useNavigate();
  const { syncGuestCart } = useCart();
  const { syncGuestWishlist } = useWishlist();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = async () => {
    try {
      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("user_id");
      
      // Optional: Clear IndexedDB for guest data
      // We keep it for next guest session
      
      toast.success("Logged out successfully");
      
      // Redirect to home page
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  const handleLogin = () => {
    openLogin();
  };

  return (
    <aside className="w-64 border-r pr-6 static">
      <h2 className="text-lg font-semibold mb-6 tracking-wide">
        MY ACCOUNT
      </h2>

      <ul className="space-y-2">
        {links
          .filter((link) => !link.auth || isLoggedIn)
          .map(({ to, label, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded text-sm transition
                  ${
                    isActive
                      ? "bg-[#F3F0EB] text-[#B8964E] font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}

        {/* AUTH ACTION */}
        <li className="pt-4 mt-4 border-t">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded
              text-sm text-red-600 hover:bg-red-50 transition"
            >
              <FiLogOut />
              Logout
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="w-full flex items-center gap-2 px-3 py-2 rounded
              text-sm text-[#B8964E] hover:bg-[#F3F0EB] transition"
            >
              <FiLogIn />
              Login
            </button>
          )}
        </li>
      </ul>
    </aside>
  );
}