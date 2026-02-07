import { useState } from "react";
import { useGet } from "../../hooks/useGet";
import { useDelete } from "../../hooks/useDelete";

export default function Orders() {
  const { data, loading, refetch } = useGet("/admin/orders");
  const { execute: remove, loading: deleting } = useDelete();

  // 🛡️ SAFETY: never allow blank page
  const orders = Array.isArray(data) ? data : [];

  const [statusFilter, setStatusFilter] = useState("all");

  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((o) => o.status === statusFilter);

  const handleDelete = async (order) => {
    if (
      window.confirm(
        `Are you sure you want to delete Order #${order.id}?`,
      )
    ) {
      await remove(`/admin/orders/${order.id}`, {
        onSuccess: refetch,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F6F3]">
      {/* ================= PAGE CONTAINER ================= */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        {/* ================= HEADER ================= */}
        <div className="mb-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold text-[#2E2E2E]">
              Orders
            </h1>
            <p className="text-sm text-[#6B6B6B] mt-2 max-w-xl">
              View and manage all customer orders, payments and statuses.
            </p>
          </div>

          {/* STATS */}
          <div className="bg-white border border-[#E9E4DA] rounded-2xl px-6 py-4 flex gap-8 shadow-sm">
            <div>
              <p className="text-xs uppercase tracking-wide text-[#6B6B6B]">
                Total Orders
              </p>
              <p className="text-2xl font-semibold text-[#2E2E2E]">
                {orders.length}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-[#6B6B6B]">
                Revenue
              </p>
              <p className="text-2xl font-semibold text-[#2E2E2E]">
                ₹
                {orders.reduce(
                  (sum, o) => sum + Number(o.total_amount || 0),
                  0,
                )}
              </p>
            </div>
          </div>
        </div>

        {/* ================= FILTERS ================= */}
        <div className="bg-white border border-[#E9E4DA] rounded-2xl p-6 mb-8 shadow-sm flex flex-col sm:flex-row gap-6 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-[#2E2E2E]">
              Filter by Status
            </p>
            <p className="text-xs text-[#6B6B6B] mt-1">
              Quickly filter orders based on status
            </p>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="
              px-5 py-3 rounded-xl
              border border-[#E9E4DA]
              text-sm
              focus:ring-1 focus:ring-yellow-500
              focus:outline-none
            "
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* ================= ORDERS TABLE ================= */}
        <div className="bg-white border border-[#E9E4DA] rounded-3xl shadow-sm overflow-hidden">
          {/* TABLE HEADER */}
          <div className="px-8 py-6 border-b border-[#E9E4DA] flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-[#2E2E2E]">
                All Orders
              </h2>
              <p className="text-xs text-[#6B6B6B] mt-1">
                Detailed list of customer orders
              </p>
            </div>

            <button
              onClick={refetch}
              className="text-sm text-blue-600 hover:underline"
            >
              Refresh
            </button>
          </div>

          {/* TABLE CONTENT */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-20 text-center text-sm text-[#6B6B6B]">
                Loading orders...
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="py-20 text-center text-sm text-[#6B6B6B]">
                No orders found
              </div>
            ) : (
              <table className="min-w-full text-sm">
                <thead className="bg-[#FAF9F7] border-b border-[#E9E4DA]">
                  <tr>
                    <th className="px-6 py-4 text-left font-medium text-[#6B6B6B]">
                      Order ID
                    </th>
                    <th className="px-6 py-4 text-left font-medium text-[#6B6B6B]">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left font-medium text-[#6B6B6B]">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left font-medium text-[#6B6B6B]">
                      Payment
                    </th>
                    <th className="px-6 py-4 text-left font-medium text-[#6B6B6B]">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left font-medium text-[#6B6B6B]">
                      Date
                    </th>
                    <th className="px-6 py-4 text-right font-medium text-[#6B6B6B]">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-[#E9E4DA] hover:bg-[#FAF9F7]"
                    >
                      <td className="px-6 py-5 font-medium text-[#2E2E2E]">
                        #{order.id}
                      </td>

                      <td className="px-6 py-5">
                        <p className="font-medium text-[#2E2E2E]">
                          {order.customer_name || "Guest"}
                        </p>
                        <p className="text-xs text-[#6B6B6B]">
                          {order.customer_email || "-"}
                        </p>
                      </td>

                      <td className="px-6 py-5 font-semibold text-[#2E2E2E]">
                        ₹{order.total_amount}
                      </td>

                      <td className="px-6 py-5">
                        <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                          {order.payment_method || "Online"}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-medium ${
                            order.status === "paid"
                              ? "bg-green-100 text-green-700"
                              : order.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : order.status === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-xs text-[#6B6B6B]">
                        {order.created_at}
                      </td>

                      <td className="px-6 py-5 text-right">
                        <button
                          onClick={() => handleDelete(order)}
                          disabled={deleting}
                          className="text-xs text-red-500 hover:underline disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* FOOTER */}
          {filteredOrders.length > 0 && (
            <div className="px-8 py-4 border-t border-[#E9E4DA] bg-[#FAF9F7] text-sm text-[#6B6B6B]">
              Showing{" "}
              <span className="font-medium">
                {filteredOrders.length}
              </span>{" "}
              orders
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
