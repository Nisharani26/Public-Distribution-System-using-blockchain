import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { History, Search, Download, CheckCircle, Shield } from "lucide-react";

// Mock transactions
const ALL_TRANSACTIONS = [
  { id: 1, date: "2026-01-05", weight: 3, amount: 10, smsStatus: "Sent", blockchainHash: "0xa3f8b2...4c9d" },
  { id: 2, date: "2026-01-03", weight: 2, amount: 8, smsStatus: "Sent", blockchainHash: "0x7b4e9a...2f1c" },
];

export default function CitizenTransactionHistory({ user, onLogout }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTransactions = ALL_TRANSACTIONS.filter((t) =>
    t.date.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={user.name} role="citizen" onLogout={onLogout} />

      <div className="w-full px-6 py-8">
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
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Paid</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SMS Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blockchain</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{t.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{t.weight} kg</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{t.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {t.smsStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-gray-500 flex items-center space-x-1">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span>{t.blockchainHash}</span>
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
