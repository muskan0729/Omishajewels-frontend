import {
  FiFileText,
  FiDownload,
  FiUser,
  FiHeart,
  FiLogOut,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

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
    label: "Change Password",
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

export default function Dashboard({ openLogin }) {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleCardClick = (path) => {
    if (!isLoggedIn) {
      openLogin(); // ✅ OPEN AUTH SIDEBAR
      return;
    }

    navigate(path);
  };

  return (
    <>

      <p className="mb-10 text-sm">
        From your account dashboard you can view your recent orders, view wishlist,
        and edit your password.
      </p>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <button
            key={card.label}
            onClick={() => handleCardClick(card.path)}
            className="group border rounded-md p-8 flex flex-col items-center justify-center text-center
                       transition-all duration-300 hover:shadow-md hover:-translate-y-1"
          >
            <div className="text-gray-400 group-hover:text-[#B8964E] transition mb-4">
              {card.icon}
            </div>
            <span className="text-sm font-medium tracking-wide">
              {card.label}
            </span>
          </button>
        ))}
      </div>
    </>
  );
}
