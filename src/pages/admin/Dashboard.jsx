import { useGet } from "../../hooks/useGet";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const { data: apiData, loading } = useGet("/admin/transactions");
  
  // Dummy data for development
  const dummyTransactions = [
    { id: 1, user: "Aarav Sharma", amount: "₹1,299", status: "completed", date: "2024-03-15" },
    { id: 2, user: "Priya Patel", amount: "₹899", status: "pending", date: "2024-03-14" },
    { id: 3, user: "Rohan Kumar", amount: "₹2,499", status: "completed", date: "2024-03-14" },
    { id: 4, user: "Sneha Singh", amount: "₹599", status: "failed", date: "2024-03-13" },
    { id: 5, user: "Vikram Joshi", amount: "₹1,799", status: "completed", date: "2024-03-12" },
    { id: 6, user: "Ananya Reddy", amount: "₹1,099", status: "pending", date: "2024-03-12" },
    { id: 7, user: "Karthik Nair", amount: "₹3,299", status: "completed", date: "2024-03-11" },
  ];

  // Use dummy data if API returns nothing or empty
  const transactions = apiData && Array.isArray(apiData) && apiData.length > 0 
    ? apiData 
    : dummyTransactions;

  // Dummy stats data
  const stats = {
    totalEbooks: 156,
    totalOrders: 487,
    totalRevenue: "₹2,84,500",
    activeUsers: 1243,
    conversionRate: "3.2%",
    avgOrderValue: "₹584"
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <div className="p-4 bg-white rounded-lg shadow border border-gray-100">
          <div className="text-gray-500 text-sm font-medium">Total Ebooks</div>
          <div className="text-2xl font-bold mt-2">{stats.totalEbooks}</div>
          <div className="text-green-600 text-sm mt-1">↑ 12% from last month</div>
        </div>
        
        <div className="p-4 bg-white rounded-lg shadow border border-gray-100">
          <div className="text-gray-500 text-sm font-medium">Total Orders</div>
          <div className="text-2xl font-bold mt-2">{stats.totalOrders}</div>
          <div className="text-green-600 text-sm mt-1">↑ 8% from last month</div>
        </div>
        
        <div className="p-4 bg-white rounded-lg shadow border border-gray-100">
          <div className="text-gray-500 text-sm font-medium">Total Revenue</div>
          <div className="text-2xl font-bold mt-2">{stats.totalRevenue}</div>
          <div className="text-green-600 text-sm mt-1">↑ 15% from last month</div>
        </div>
        
        <div className="p-4 bg-white rounded-lg shadow border border-gray-100">
          <div className="text-gray-500 text-sm font-medium">Active Users</div>
          <div className="text-2xl font-bold mt-2">{stats.activeUsers}</div>
          <div className="text-green-600 text-sm mt-1">↑ 5% from last month</div>
        </div>
        
        <div className="p-4 bg-white rounded-lg shadow border border-gray-100">
          <div className="text-gray-500 text-sm font-medium">Conversion Rate</div>
          <div className="text-2xl font-bold mt-2">{stats.conversionRate}</div>
          <div className="text-green-600 text-sm mt-1">↑ 0.4% from last month</div>
        </div>
        
        <div className="p-4 bg-white rounded-lg shadow border border-gray-100">
          <div className="text-gray-500 text-sm font-medium">Avg Order Value</div>
          <div className="text-2xl font-bold mt-2">{stats.avgOrderValue}</div>
          <div className="text-green-600 text-sm mt-1">↑ 7% from last month</div>
        </div>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart (Placeholder) */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <h3 className="text-lg font-bold mb-4">Revenue Trends</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
            <div className="text-center text-gray-500">
              <div className="text-3xl mb-2">📈</div>
              <p>Revenue chart will appear here</p>
              <p className="text-sm">(Interactive chart integration)</p>
            </div>
          </div>
        </div>
        
        {/* Top Categories (Placeholder) */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <h3 className="text-lg font-bold mb-4">Top Categories</h3>
          <div className="space-y-4">
            {["Fiction", "Technology", "Business", "Self-Help", "Health"].map((category, index) => (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    index === 0 ? "bg-blue-500" :
                    index === 1 ? "bg-green-500" :
                    index === 2 ? "bg-purple-500" :
                    index === 3 ? "bg-yellow-500" :
                    "bg-pink-500"
                  }`}></div>
                  <span>{category}</span>
                </div>
                <div className="font-medium">{Math.floor(Math.random() * 100) + 50} sales</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold">Recent Transactions</h3>
          <p className="text-gray-500 text-sm">Latest 7 transactions from your store</p>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading transactions...</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-bold">{tx.user.charAt(0)}</span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{tx.user}</div>
                          <div className="text-sm text-gray-500">Order #{tx.id}001</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {tx.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">{tx.amount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        tx.status === "completed" 
                          ? "bg-green-100 text-green-800" 
                          : tx.status === "pending" 
                          ? "bg-yellow-100 text-yellow-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {["Credit Card", "UPI", "Net Banking", "Wallet"][tx.id % 4]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Showing {transactions.length} of {transactions.length} transactions
            </div>
            <button className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg">
              View All Transactions →
            </button>
          </div>
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-100">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg mr-4">
              <span className="text-blue-600 text-2xl">📚</span>
            </div>
            <div>
              <div className="text-gray-600 text-sm">Most Popular Ebook</div>
              <div className="font-bold text-lg">React Mastery Guide</div>
              <div className="text-blue-600 font-medium">42 sales this week</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg mr-4">
              <span className="text-green-600 text-2xl">⭐</span>
            </div>
            <div>
              <div className="text-gray-600 text-sm">Customer Satisfaction</div>
              <div className="font-bold text-lg">4.8/5.0</div>
              <div className="text-green-600 font-medium">Based on 234 reviews</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg mr-4">
              <span className="text-purple-600 text-2xl">⚡</span>
            </div>
            <div>
              <div className="text-gray-600 text-sm">Pending Actions</div>
              <div className="font-bold text-lg">3 items</div>
              <div className="text-purple-600 font-medium">2 refunds, 1 support ticket</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}