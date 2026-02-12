import { Outlet } from "react-router-dom";
import AdminSidebar from "../admin/AdminSidebar";
import AdminHeader from "../admin/AdminHeader";

export default function AdminLayout() {
  return (
    <div className=" bg-gray-100">
      
      {/* SIDEBAR */}
      <div className="fixed inset-y-0 left-0 w-64 z-30">
        <AdminSidebar />
      </div>

      {/* MAIN AREA */}
      <div className="ml-64 flex flex-col ">
        {/* HEADER */}
        <div className="sticky top-0 z-20">
          <AdminHeader />
        </div>

        {/* SCROLLABLE CONTENT */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
}
