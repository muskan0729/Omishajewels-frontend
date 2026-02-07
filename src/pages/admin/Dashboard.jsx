import { useMemo } from "react";
import {
  BookOpen,
  ShoppingCart,
  IndianRupee,
  Users,
} from "lucide-react";

export default function Dashboard() {
  const stats = {
    totalEbooks: 15678,
    totalOrders: 48765,
    totalRevenue: 2845000,
    activeUsers: 12435,
  };

  const categories = [
    { name: "Technology", value: 42 },
    { name: "Business", value: 28 },
    { name: "Self-Help", value: 18 },
    { name: "Health", value: 12 },
  ];

  const orderStatus = [
    { label: "Completed", count: 342, color: "bg-green-500" },
    { label: "Pending", count: 98, color: "bg-amber-500" },
    { label: "Failed", count: 47, color: "bg-red-500" },
  ];

  const transactions = [
    { name: "Aarav Sharma", order: "#1001", date: "2024-03-15", amount: 1299, status: "completed" },
    { name: "Priya Patel", order: "#2001", date: "2024-03-14", amount: 899, status: "pending" },
    { name: "Rohan Kumar", order: "#3001", date: "2024-03-14", amount: 2499, status: "completed" },
    { name: "Sneha Singh", order: "#4001", date: "2024-03-13", amount: 599, status: "failed" },
  ];

  const getAvatarColor = (name) => {
    const colors = [
      "bg-blue-100 text-blue-700",
      "bg-emerald-100 text-emerald-700",
      "bg-violet-100 text-violet-700",
      "bg-amber-100 text-amber-700",
      "bg-rose-100 text-rose-700",
    ];
    return colors[name.charCodeAt(0) % colors.length];
  };

  const cards = useMemo(
    () => [
      {
        label: "Total Ebooks",
        value: stats.totalEbooks.toLocaleString(),
        icon: BookOpen,
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
      },
      {
        label: "Total Orders",
        value: stats.totalOrders.toLocaleString(),
        icon: ShoppingCart,
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
      },
      {
        label: "Total Revenue",
        value: `₹${stats.totalRevenue.toLocaleString()}`,
        icon: IndianRupee,
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600",
      },
      {
        label: "Active Users",
        value: stats.activeUsers.toLocaleString(),
        icon: Users,
        iconBg: "bg-orange-100",
        iconColor: "text-orange-600",
      },
    ],
    [stats]
  );

  return (
    <div className="p-4 sm:p-6 space-y-6 sm:space-y-10 animate-slideUp">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">Last updated: Today</p>
      </div>

      {/* Stats Cards - Enhanced Responsiveness */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {cards.map((c) => (
          <div
            key={c.label}
            className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{c.label}</p>
                <p className="text-2xl sm:text-3xl font-bold font-tabular-nums text-gray-900 mt-2">
                  {c.value}
                </p>
              </div>
              <div className={`p-2 sm:p-3 rounded-xl ${c.iconBg} flex-shrink-0 ml-2 sm:ml-4`}>
                <c.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${c.iconColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Middle Section - Enhanced Responsiveness */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Top Categories */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-all duration-300">
          <h3 className="font-semibold text-base sm:text-lg mb-4 sm:mb-5">Top Categories</h3>
          <div className="space-y-4 sm:space-y-5">
            {categories.map((cat, i) => {
              const barColors = ["bg-blue-500", "bg-emerald-500", "bg-violet-500", "bg-amber-500"];
              return (
                <div key={cat.name}>
                  <div className="flex justify-between text-xs sm:text-sm mb-2">
                    <span className="font-medium text-gray-700 truncate">{cat.name}</span>
                    <span className="text-gray-500">{cat.value}%</span>
                  </div>
                  <div className="h-2 sm:h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-2 sm:h-3 rounded-full transition-all duration-700 ${barColors[i]}`}
                      style={{ width: `${cat.value}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Status */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-all duration-300">
          <h3 className="font-semibold text-base sm:text-lg mb-4 sm:mb-5">Order Status Overview</h3>
          <div className="space-y-4 sm:space-y-5">
            {orderStatus.map((o) => (
              <div key={o.label} className="flex items-center justify-between">
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full ${o.color}`} />
                  <span className="text-xs sm:text-sm font-medium text-gray-700 truncate">{o.label}</span>
                </div>
                <span className="font-semibold text-base sm:text-lg text-gray-900">{o.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions - Mobile-Optimized */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
        <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-semibold text-base sm:text-lg">Recent Transactions</h3>
          <button className="text-xs sm:text-sm font-medium text-blue-600 hover:underline">View All →</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] sm:min-w-[800px] text-xs sm:text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 sm:p-4 text-left font-semibold text-gray-700 hidden sm:table-cell">Customer</th>
                <th className="p-3 sm:p-4 text-center font-semibold text-gray-700">Date</th>
                <th className="p-3 sm:p-4 text-center font-semibold text-gray-700">Amount</th>
                <th className="p-3 sm:p-4 text-center font-semibold text-gray-700 hidden sm:table-cell">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.map((t) => (
                <tr key={t.order} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3 sm:p-4 flex items-center gap-2 sm:gap-3 w-full sm:min-w-[220px]">
                    <div className={`avatar flex-shrink-0 ${getAvatarColor(t.name)}`}>
                      {t.name[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-gray-900 truncate">{t.name}</div>
                      <div className="text-xs text-gray-500 truncate">{t.order}</div>
                    </div>
                  </td>
                  <td className="p-3 sm:p-4 text-center text-gray-600 whitespace-nowrap">
                    {new Date(t.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="p-3 sm:p-4 text-center font-semibold text-gray-900 whitespace-nowrap">
                    ₹{t.amount.toLocaleString()}
                  </td>
                  <td className="p-3 sm:p-4 text-center hidden sm:table-cell">
                    <span
                      className={`status ${t.status} inline-block px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs font-medium`}
                    >
                      {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
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