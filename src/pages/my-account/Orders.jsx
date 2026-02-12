import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useGet } from "../../hooks/useGet";
import Loader from "../../components/Loader";




export default function Orders() {
const userId = localStorage.getItem("user_id");
  const {data,loading} = useGet( userId ?`order-history/${userId}` : null);
  // console.log("order datga",data);
  // const orders = data?.data || null;
  const orders = Array.isArray(data?.data) ? data.data: [];
  // console.log("order",orders);
 if(loading){
  return (
  <Loader />
  )
 }

  const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

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
            <div className="capitalize">{order.status}</div>

            {/* TOTAL */}
            <div className="font-medium text-[#B8964E]">
              {order.bill_amount}
            </div>

            {/* ACTIONS */}
            <div className="flex flex-wrap gap-2">
              {order.canPay && (
                <button className="px-4 py-1.5 rounded-full bg-[#B8964E] text-white text-xs font-medium hover:opacity-90 transition">
                  PAY
                </button>
              )}

              <Link
                to="#"
                className="px-4 py-1.5 rounded-full bg-[#B8964E] text-white text-xs font-medium hover:opacity-90 transition"
              >
                VIEW
              </Link>

              {order.canCancel && (
                <button className="px-4 py-1.5 rounded-full bg-[#B8964E] text-white text-xs font-medium hover:opacity-90 transition">
                  CANCEL
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
