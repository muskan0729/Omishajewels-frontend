import { NavLink } from "react-router-dom";

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen">
      <div className="p-4 text-2xl font-bold border-b border-gray-700">Admin Panel</div>
      <nav className="p-4 space-y-2">
        <NavLink to="/admin" className="block p-2 rounded hover:bg-gray-700">Dashboard</NavLink>
        <NavLink to="/admin/categories" className="block p-2 rounded hover:bg-gray-700">Categories</NavLink>
        <NavLink to="/admin/ebooks" className="block p-2 rounded hover:bg-gray-700">Ebooks</NavLink>
        <NavLink to="/admin/images" className="block p-2 rounded hover:bg-gray-700">Images</NavLink>
      </nav>
    </aside>
  );
}
