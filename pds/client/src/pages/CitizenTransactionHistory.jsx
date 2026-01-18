import React, { useState } from 'react';
import Navbar from "../components/Navbar";
import { History, Download, Search, CheckCircle, Shield } from 'lucide-react';

const ALL_TRANSACTIONS = [
  { id: 1, date: '2026-01-05', item: 'Rice', weight: 3, amount: 10, smsStatus: 'Sent', blockchainHash: '0xa3f8b2...4c9d' },
  { id: 2, date: '2026-01-03', item: 'Wheat', weight: 2, amount: 8, smsStatus: 'Sent', blockchainHash: '0x7b4e9a...2f1c' },
  { id: 3, date: '2025-12-28', item: 'Sugar', weight: 1, amount: 5, smsStatus: 'Sent', blockchainHash: '0x9c2d5f...8a7b' },
  { id: 4, date: '2025-12-20', item: 'Rice', weight: 3, amount: 10, smsStatus: 'Sent', blockchainHash: '0x1f6e3b...9d4a' },
  { id: 5, date: '2025-12-15', item: 'Cooking Oil', weight: 0.5, amount: 12, smsStatus: 'Sent', blockchainHash: '0x4a8c7d...5e2f' },
  { id: 6, date: '2025-12-10', item: 'Wheat', weight: 3, amount: 12, smsStatus: 'Sent', blockchainHash: '0x8e1f9c...3b6a' },
  { id: 7, date: '2025-11-28', item: 'Rice', weight: 3, amount: 10, smsStatus: 'Sent', blockchainHash: '0x2d9a4e...7c1f' },
  { id: 8, date: '2025-11-22', item: 'Sugar', weight: 1, amount: 5, smsStatus: 'Sent', blockchainHash: '0x5c7b2f...9e8d' },
];

export default function CitizenTransactionHistory({ user, onLogout }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('all');

  const filteredTransactions = ALL_TRANSACTIONS.filter((transaction) => {
    const matchesSearch = transaction.item.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMonth = selectedMonth === 'all' || transaction.date.startsWith(selectedMonth);
    return matchesSearch && matchesMonth;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={user.name} role="user" onLogout={onLogout} />

      <div className="max-w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <History className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Transaction History</h1>
          </div>
          <p className="text-gray-600">Complete record of your PDS distributions</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search by Item
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for rice, wheat, sugar..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Month Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Month
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Months</option>
                <option value="2026-01">January 2026</option>
                <option value="2025-12">December 2025</option>
                <option value="2025-11">November 2025</option>
              </select>
            </div>
          </div>

          {/* Export Button */}
          <div className="mt-4 flex justify-end">
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export to PDF</span>
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Weight
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount Paid
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SMS Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Blockchain
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(transaction.date).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-gray-900">{transaction.item}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.weight} kg
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₹{transaction.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {transaction.smsStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4 text-blue-600" />
                        <span className="text-xs text-gray-500 font-mono">
                          {transaction.blockchainHash}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No transactions found</p>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">Total Transactions</p>
            <p className="text-2xl font-bold text-gray-900">{filteredTransactions.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">Total Weight Received</p>
            <p className="text-2xl font-bold text-gray-900">
              {filteredTransactions.reduce((sum, t) => sum + t.weight, 0).toFixed(1)} kg
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">Total Amount Paid</p>
            <p className="text-2xl font-bold text-gray-900">
              ₹{filteredTransactions.reduce((sum, t) => sum + t.amount, 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}