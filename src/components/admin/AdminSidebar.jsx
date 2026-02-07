import { NavLink } from "react-router-dom";

export default function AdminSidebar() {
  return (
    <aside className="w-72 min-h-screen bg-[#FEFCF9] text-[#2E2E2E] flex flex-col border-r border-[#E9E4DA]">

      {/* HEADER */}
      <div className="px-8 py-6 border-b border-[#E9E4DA]">
        <h2 className="text-2xl font-['Playfair_Display'] tracking-wide">
          <span className="text-[#B8964E]">Admin</span> Panel
        </h2>
        <p className="text-sm text-[#6B6B6B] mt-1">
          Manage your bookstore
        </p>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-6 py-8 space-y-3 text-base">

        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `
              flex items-center gap-4 px-6 py-4 rounded-2xl
              transition-all duration-200
              ${
                isActive
                  ? "bg-[#B8964E]/15 text-[#B8964E] shadow-[inset_4px_0_0_#B8964E]"
                  : "text-[#2E2E2E] hover:bg-[#F5F3EF]"
              }
            `
          }
        >
          <span className="text-lg">📊</span>
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/categories"
          className={({ isActive }) =>
            `
              flex items-center gap-4 px-6 py-4 rounded-2xl
              transition-all duration-200
              ${
                isActive
                  ? "bg-[#B8964E]/15 text-[#B8964E] shadow-[inset_4px_0_0_#B8964E]"
                  : "text-[#2E2E2E] hover:bg-[#F5F3EF]"
              }
            `
          }
        >
          <span className="text-lg">🗂</span>
          Categories
        </NavLink>

        <NavLink
          to="/admin/ebooks"
          className={({ isActive }) =>
            `
              flex items-center gap-4 px-6 py-4 rounded-2xl
              transition-all duration-200
              ${
                isActive
                  ? "bg-[#B8964E]/15 text-[#B8964E] shadow-[inset_4px_0_0_#B8964E]"
                  : "text-[#2E2E2E] hover:bg-[#F5F3EF]"
              }
            `
          }
        >
          <span className="text-lg">📚</span>
          E-Books
        </NavLink>

        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            `
              flex items-center gap-4 px-6 py-4 rounded-2xl
              transition-all duration-200
              ${
                isActive
                  ? "bg-[#B8964E]/15 text-[#B8964E] shadow-[inset_4px_0_0_#B8964E]"
                  : "text-[#2E2E2E] hover:bg-[#F5F3EF]"
              }
            `
          }
        >
          <span className="text-lg">🧾</span>
          Orders
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `
              flex items-center gap-4 px-6 py-4 rounded-2xl
              transition-all duration-200
              ${
                isActive
                  ? "bg-[#B8964E]/15 text-[#B8964E] shadow-[inset_4px_0_0_#B8964E]"
                  : "text-[#2E2E2E] hover:bg-[#F5F3EF]"
              }
            `
          }
        >
          <span className="text-lg">👤</span>
          Users
        </NavLink>

      </nav>

      {/* FOOTER */}
      <div className="px-8 py-5 border-t border-[#E9E4DA]">
        <p className="text-xs text-[#9B9B9B]">
          © {new Date().getFullYear()} Omisha Books
        </p>
      </div>

    </aside>
  );
}
