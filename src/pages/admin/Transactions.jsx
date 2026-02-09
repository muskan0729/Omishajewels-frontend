import { useState } from "react";

export default function Transactions() {
  // ================= STATIC DATA =================
  const [transactions, setTransactions] = useState([
    {
      id: 1001,
      name: "Aarav Sharma",
      email: "aarav@gmail.com",
      amount: 1299,
      method: "UPI",
      status: "completed",
      created_at: "2024-03-15",
    },
    {
      id: 1002,
      name: "Priya Patel",
      email: "priya@gmail.com",
      amount: 899,
      method: "Card",
      status: "pending",
      created_at: "2024-03-14",
    },
    {
      id: 1003,
      name: "Rohan Kumar",
      email: "rohan@gmail.com",
      amount: 2499,
      method: "Net Banking",
      status: "completed",
      created_at: "2024-03-14",
    },
    {
      id: 1004,
      name: "Sneha Singh",
      email: "sneha@gmail.com",
      amount: 599,
      method: "Wallet",
      status: "failed",
      created_at: "2024-03-13",
    },
  ]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const totalAmount = transactions.reduce(
    (sum, t) => sum + Number(t.amount),
    0
  );

  return (
    <div className="min-h-screen bg-[#F7F6F3]">
      {/* ================= PAGE CONTAINER ================= */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        {/* ================= HEADER ================= */}
        <div className="mb-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold text-[#2E2E2E]">
              Transactions
            </h1>
            <p className="text-sm text-[#6B6B6B] mt-2 max-w-xl">
              View and manage all payment transactions made by customers.
            </p>
          </div>

          {/* STATS */}
          <div className="bg-white border border-[#E9E4DA] rounded-2xl px-6 py-4 flex gap-8 shadow-sm">
            <div>
              <p className="text-xs uppercase tracking-wide text-[#6B6B6B]">
                Total Transactions
              </p>
              <p className="text-2xl font-semibold text-[#2E2E2E]">
                {transactions.length}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-[#6B6B6B]">
                Total Amount
              </p>
              <p className="text-2xl font-semibold text-[#2E2E2E]">
                ₹{totalAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* ================= TRANSACTIONS TABLE ================= */}
        <div className="bg-white border border-[#E9E4DA] rounded-3xl shadow-sm overflow-hidden">
          {/* TABLE HEADER */}
          <div className="px-8 py-6 border-b border-[#E9E4DA]">
            <h2 className="text-xl font-semibold text-[#2E2E2E]">
              All Transactions
            </h2>
            <p className="text-xs text-[#6B6B6B] mt-1">
              Detailed list of all payment records
            </p>
          </div>

          {/* TABLE CONTENT */}
          <div className="overflow-x-auto">
            {transactions.length === 0 ? (
              <div className="py-20 text-center text-sm text-[#6B6B6B]">
                No transactions found
              </div>
            ) : (
              <table className="min-w-full text-sm">
                <thead className="bg-[#FAF9F7] border-b border-[#E9E4DA]">
                  <tr>
                    <th className="px-6 py-4 text-left font-medium text-[#6B6B6B]">
                      Transaction ID
                    </th>
                    <th className="px-6 py-4 text-left font-medium text-[#6B6B6B]">
                      User
                    </th>
                    <th className="px-6 py-4 text-left font-medium text-[#6B6B6B]">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left font-medium text-[#6B6B6B]">
                      Method
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
                  {transactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="border-b border-[#E9E4DA] hover:bg-[#FAF9F7]"
                    >
                      <td className="px-6 py-5 font-medium text-[#2E2E2E]">
                        #{tx.id}
                      </td>

                      <td className="px-6 py-5">
                        <p className="font-medium text-[#2E2E2E]">
                          {tx.name}
                        </p>
                        <p className="text-xs text-[#6B6B6B]">
                          {tx.email}
                        </p>
                      </td>

                      <td className="px-6 py-5 font-semibold text-[#2E2E2E]">
                        ₹{tx.amount}
                      </td>

                      <td className="px-6 py-5">
                        <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                          {tx.method}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-medium ${
                            tx.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : tx.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-xs text-[#6B6B6B]">
                        {tx.created_at}
                      </td>

                      <td className="px-6 py-5 text-right">
                        <button
                          onClick={() => handleDelete(tx.id)}
                          className="text-xs text-red-500 hover:underline"
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
          {transactions.length > 0 && (
            <div className="px-8 py-4 border-t border-[#E9E4DA] bg-[#FAF9F7] text-sm text-[#6B6B6B]">
              Showing{" "}
              <span className="font-medium">
                {transactions.length}
              </span>{" "}
              transactions
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
