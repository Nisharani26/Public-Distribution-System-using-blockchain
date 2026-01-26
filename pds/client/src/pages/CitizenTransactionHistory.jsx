import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { History, Search, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function CitizenTransactionHistory({ user, onLogout }) {
  const [transactions, setTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.rationId) return;

    async function fetchTransactions() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://localhost:5000/api/transactions/${user.rationId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) {
          const text = await res.text();
          console.error("Failed to fetch transactions:", text);
          toast.error("Failed to fetch transactions");
          setLoading(false);
          return;
        }

        const data = await res.json();

        // Flatten transactions: each item becomes a separate row
        const formatted = data.flatMap((t) =>
          t.items.map((i) => ({
            id: t._id + i.stockId, // unique per item
            date: new Date(t.transactionDate).toLocaleDateString(),
            itemName: i.itemName,
            quantity: i.quantity,
            weight: i.quantity, // same as quantity in kg
            smsStatus: "Sent", // placeholder
          }))
        );

        setTransactions(formatted);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        toast.error("Server error while fetching transactions");
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, [user?.rationId]);

  const filteredTransactions = transactions.filter((t) =>
    t.date.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={user.name} role="citizen" onLogout={onLogout} />

      <div className="w-full px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center space-x-3">
          <History className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Transaction History</h1>
        </div>

        {/* Search */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by date..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Transactions Table */}
        {loading ? (
          <p className="text-gray-500">Loading transactions...</p>
        ) : filteredTransactions.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 text-lg font-medium mb-2">No Transactions Found</p>
            <p className="text-sm text-gray-500">No transactions available for this date</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item Purchased
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SMS Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {t.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {t.itemName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {t.quantity} kg
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {t.smsStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
