import { NavLink } from "react-router-dom";

const links = [
  { to: "/my-account", label: "Dashboard", end: true },
  { to: "/my-account/orders", label: "Orders" },
  { to: "/my-account/downloads", label: "Downloads" },
  { to: "/my-account/addresses", label: "Addresses" },
  { to: "/my-account/account-details", label: "Account details" },
  { to: "/my-account/wishlist", label: "Wishlist" },
  { to: "/my-account/logout", label: "Logout" },
];

export default function AccountSidebar() {
  return (
    <aside className="w-64 border-r pr-6">
      <h2 className="text-lg font-semibold mb-6">MY ACCOUNT</h2>

      <ul className="space-y-2">
        {links.map(({ to, label, end }) => (
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
      </ul>
    </aside>
  );
}
