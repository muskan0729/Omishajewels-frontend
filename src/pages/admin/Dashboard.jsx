import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  ShoppingCart,
  IndianRupee,
  Users,
} from "lucide-react";
import { useGet } from "../../hooks/useGet";

export default function Dashboard() {
  // 👈 pass API response data as prop
const {data:dashboardData}=useGet("/admin/summary");
  const overview = dashboardData?.data?.overview || {};
  const recentOrders = dashboardData?.data?.recent_orders || [];
  const topSelling = dashboardData?.data?.top_selling_ebooks || [];

  // ✅ Dynamic Order Status Count
  const orderStatus = useMemo(() => {
    const statusCount = {};
    recentOrders.forEach((order) => {
      statusCount[order.status] =
        (statusCount[order.status] || 0) + 1;
    });

    return Object.keys(statusCount).map((key) => ({
      label: key.charAt(0).toUpperCase() + key.slice(1),
      count: statusCount[key],
      color:
        key === "completed"
          ? "bg-green-500"
          : key === "pending"
          ? "bg-amber-500"
          : "bg-red-500",
    }));
  }, [recentOrders]);

  // ✅ Stats Cards
  const cards = useMemo(
    () => [
      {
        label: "Total Ebooks",
        value: overview.total_ebooks?.toLocaleString() || 0,
        icon: BookOpen,
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
      },
      {
        label: "Total Orders",
        value: overview.total_orders?.toLocaleString() || 0,
        icon: ShoppingCart,
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
      },
      {
        label: "Total Revenue",
        value: `₹${Number(
          overview.total_revenue || 0
        ).toLocaleString()}`,
        icon: IndianRupee,
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600",
      },
      {
        label: "Total Users",
        value: overview.total_users?.toLocaleString() || 0,
        icon: Users,
        iconBg: "bg-orange-100",
        iconColor: "text-orange-600",
      },
    ],
    [overview]
  );

 return (
  <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-gray-50 min-h-screen">
    
    {/* Header */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Admin Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back 👋 Here’s what’s happening today.
        </p>
      </div>
    </div>

    {/* ================= STATS CARDS ================= */}
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((c) => (
        <div
          key={c.label}
          className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">
                {c.label}
              </p>
              <p className="text-2xl sm:text-3xl font-bold mt-3 text-gray-900">
                {c.value}
              </p>
            </div>

            <div
              className={`p-3 rounded-xl ${c.iconBg} group-hover:scale-110 transition-transform duration-300`}
            >
              <c.icon className={`w-6 h-6 ${c.iconColor}`} />
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* ================= MIDDLE SECTION ================= */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Top Selling Ebooks */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition">
        <h3 className="font-semibold text-lg mb-5">
          🔥 Top Selling Ebooks
        </h3>

        <div className="space-y-5">
          {topSelling.map((book, index) => (
            <div key={book.id} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-semibold">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-gray-800">
                    {book.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {book.orders_count} Orders
                  </p>
                </div>
              </div>

              <span className="font-semibold text-indigo-600">
                ₹{Number(book.price).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Order Status */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition">
        <h3 className="font-semibold text-lg mb-5">
          📦 Order Status Overview
        </h3>

        <div className="space-y-4">
          {orderStatus.map((o) => (
            <div
              key={o.label}
              className="flex justify-between items-center"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-3 h-3 rounded-full ${o.color}`}
                />
                <span className="text-sm font-medium text-gray-700">
                  {o.label}
                </span>
              </div>

              <span className="text-lg font-semibold text-gray-900">
                {o.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* ================= RECENT ORDERS ================= */}
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition">
      
      <div className="p-6 border-b flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h3 className="font-semibold text-lg">
          🧾 Recent Orders
        </h3>
        <Link
          to="/admin/orders"
          className="text-sm font-medium text-indigo-600 hover:underline"
        >
          View All →
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
            <tr>
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-center">Date</th>
              <th className="p-4 text-center">Amount</th>
              <th className="p-4 text-center">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {recentOrders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-gray-50 transition"
              >
                <td className="p-4 font-medium text-gray-800">
                  {order.user?.name}
                </td>

                <td className="p-4 text-center text-gray-600">
                  {new Date(order.created_at).toLocaleDateString(
                    "en-IN",
                    { day: "numeric", month: "short", year: "numeric" }
                  )}
                </td>

                <td className="p-4 text-center font-semibold text-gray-900">
                  ₹{Number(order.bill_amount).toLocaleString()}
                </td>

                <td className="p-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium capitalize
                      ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : order.status === "pending"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                      }
                    `}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

}
