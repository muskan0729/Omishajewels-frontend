import { Outlet } from "react-router-dom";
import AccountSidebar from "../../components/my-account/AccountSidebar";

export default function MyAccountLayout() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12 flex gap-10">
      <AccountSidebar />
      <div className="flex-1">
        <Outlet />
      </div>
    </section>
  );
}
