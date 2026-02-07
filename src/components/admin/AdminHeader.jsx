import { useNavigate } from "react-router-dom";

export default function AdminHeader() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header
      className="
        h-20
        bg-[#FEFCF9]
        border-b border-[#E9E4DA]
        flex items-center justify-between
        px-8
      "
    >
      {/* LEFT : TITLE */}
      <div>
      </div>

      {/* RIGHT : ACTIONS */}
      <div className="flex items-center gap-8">

        {/* ADMIN INFO */}
        <div className="text-right">
          <p className="text-sm font-medium text-[#2E2E2E]">
            Admin User
          </p>
          <p className="text-sm text-[#6B6B6B] mt-0.5">
            Manage books, orders & users
          </p>
        </div>

        {/* LOGOUT BUTTON */}
        <button
          onClick={handleLogout}
          className="
            px-6 py-2.5
            rounded-full
            border border-[#B8964E]
            text-[#B8964E]
            text-sm tracking-wide
            transition-all duration-200
            hover:bg-[#B8964E]
            hover:text-white
            cursor-pointer
          "
        >
          Logout
        </button>

      </div>
    </header>
  );
}
