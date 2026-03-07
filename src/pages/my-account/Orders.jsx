import { useState } from "react";
import { Link } from "react-router-dom";
import { useGet } from "../../hooks/useGet";
import Loader from "../../components/Loader";
import OrderSummaryModal from "../../components/OrderSummaryModal"; // Create this

export default function Orders() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const userId = localStorage.getItem("user_id");
  const { data, loading } = useGet(userId ? `order-history/${userId}` : null);
  
  const orders = Array.isArray(data?.data) ? data.data : [];

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      {/* TABLE HEADER */}
      <div className="hidden md:grid grid-cols-5 gap-4 border-b pb-3 mb-6 text-sm font-semibold uppercase tracking-wide text-gray-600">
        <div>Order</div>
        <div>Date</div>
        <div>Status</div>
        <div>Total</div>
        <div>Actions</div>
      </div>

      {/* ORDERS */}
      <div className="space-y-8">
        {orders.map((order) => (
          <div
            key={order.id}
            className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start md:items-center border-b pb-6 text-sm"
          >
            {/* ORDER */}
            <div className="font-medium">{order.order_no}</div>

            {/* DATE */}
            <div>{formatDate(order.created_at)}</div>

            {/* STATUS */}
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                order.status === "completed" 
                  ? "bg-green-100 text-green-700"
                  : order.status === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}>
                {order.status}
              </span>
            </div>

            {/* TOTAL */}
            <div className="font-medium text-[#B8964E]">
              ₹{order.bill_amount}
            </div>

            {/* ACTIONS */}
            <div className="flex flex-wrap gap-2">
              {order.canPay && (
                <button className="px-4 py-1.5 rounded-full bg-[#B8964E] text-white text-xs font-medium hover:opacity-90 transition">
                  PAY
                </button>
              )}

              <button
                onClick={() => handleViewOrder(order)}
                className="px-4 py-1.5 rounded-full bg-[#B8964E] text-white text-xs font-medium hover:opacity-90 transition"
              >
                VIEW
              </button>

              {order.canCancel && (
                <button className="px-4 py-1.5 rounded-full bg-[#B8964E] text-white text-xs font-medium hover:opacity-90 transition">
                  CANCEL
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary Modal */}
      <OrderSummaryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
}