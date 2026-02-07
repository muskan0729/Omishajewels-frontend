import {
  FiFileText,
  FiDownload,
  FiMapPin,
  FiUser,
  FiHeart,
  FiLogOut,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const cards = [
  {
    label: "ORDERS",
    icon: <FiFileText size={28} />,
    path: "/my-account/orders",
  },
  {
    label: "DOWNLOADS",
    icon: <FiDownload size={28} />,
    path: "/my-account/downloads",
  },
  {
    label: "ADDRESSES",
    icon: <FiMapPin size={28} />,
    path: "/my-account/addresses",
  },
  {
    label: "ACCOUNT DETAILS",
    icon: <FiUser size={28} />,
    path: "/my-account/account-details",
  },
  {
    label: "WISHLIST",
    icon: <FiHeart size={28} />,
    path: "/my-account/wishlist",
  },
  {
    label: "LOGOUT",
    icon: <FiLogOut size={28} />,
    path: "/my-account/logout",
  },
];

export default function Dashboard() {
  return (
    <>
      <p className="mb-8 text-sm">
        Hello <strong>admin</strong> (not admin?{" "}
        <Link to="/my-account/logout" className="text-[#B8964E]">
          Log out
        </Link>
        )
      </p>

      <p className="mb-10 text-sm">
        From your account dashboard you can view your recent orders, manage
        your shipping and billing addresses, and edit your password and
        account details.
      </p>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.path}
            className="group border rounded-md p-8 flex flex-col items-center justify-center text-center
                       transition-all duration-300 hover:shadow-md hover:-translate-y-1"
          >
            <div className="text-gray-400 group-hover:text-[#B8964E] transition mb-4">
              {card.icon}
            </div>
            <span className="text-sm font-medium tracking-wide">
              {card.label}
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
 