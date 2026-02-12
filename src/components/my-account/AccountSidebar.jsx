import { NavLink, useNavigate } from "react-router-dom";
import { FiLogIn, FiLogOut } from "react-icons/fi";

const links = [
  { to: "/my-account", label: "Dashboard", end: true},
  { to: "/my-account/orders", label: "Orders", auth: true },
  { to: "/my-account/downloads", label: "Downloads", auth: true },
  { to: "/my-account/account-details", label: "Change Password", auth: true },
  { to: "/my-account/wishlist", label: "Wishlist", auth: true },
];

export default function AccountSidebar({ openLogin }) {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/";
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
              onClick={openLogin}
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
