import React, { useState } from 'react';
import Navbar from "../components/Navbar";
import { History, Download, Search, Filter, CheckCircle, Shield } from 'lucide-react';

const ALL_TRANSACTIONS = [
  { id: 1, date: '2026-01-08', userName: 'Rajesh Kumar', rationId: 'RAT123456', item: 'Rice', weight: 3, amount: 10.5, smsStatus: 'Sent', blockchainHash: '0xa3f8b2...4c9d' },
  { id: 2, date: '2026-01-08', userName: 'Priya Sharma', rationId: 'RAT123457', item: 'Wheat', weight: 2.5, amount: 10, smsStatus: 'Sent', blockchainHash: '0x7b4e9a...2f1c' },
  { id: 3, date: '2026-01-07', userName: 'Amit Patel', rationId: 'RAT123458', item: 'Sugar', weight: 1, amount: 5, smsStatus: 'Sent', blockchainHash: '0x9c2d5f...8a7b' },
  { id: 4, date: '2026-01-07', userName: 'Sunita Devi', rationId: 'RAT123459', item: 'Rice', weight: 3, amount: 10.5, smsStatus: 'Sent', blockchainHash: '0x1f6e3b...9d4a' },
  { id: 5, date: '2026-01-06', userName: 'Ramesh Gupta', rationId: 'RAT123460', item: 'Cooking Oil', weight: 0.5, amount: 6, smsStatus: 'Sent', blockchainHash: '0x4a8c7d...5e2f' },
  { id: 6, date: '2026-01-06', userName: 'Rajesh Kumar', rationId: 'RAT123456', item: 'Wheat', weight: 3, amount: 12, smsStatus: 'Sent', blockchainHash: '0x8e1f9c...3b6a' },
  { id: 7, date: '2026-01-05', userName: 'Priya Sharma', rationId: 'RAT123457', item: 'Rice', weight: 2, amount: 7, smsStatus: 'Sent', blockchainHash: '0x2d9a4e...7c1f' },
  { id: 8, date: '2026-01-05', userName: 'Amit Patel', rationId: 'RAT123458', item: 'Sugar', weight: 1, amount: 5, smsStatus: 'Sent', blockchainHash: '0x5c7b2f...9e8d' },
  { id: 9, date: '2026-01-04', userName: 'Sunita Devi', rationId: 'RAT123459', item: 'Wheat', weight: 4, amount: 16, smsStatus: 'Sent', blockchainHash: '0x6d3e1a...4f7c' },
  { id: 10, date: '2026-01-04', userName: 'Ramesh Gupta', rationId: 'RAT123460', item: 'Rice', weight: 2.5, amount: 8.75, smsStatus: 'Sent', blockchainHash: '0x9a7f2b...8e1d' },
];

export default function ShopkeeperTransactionHistory({ user, onLogout }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState('all');
  const [filterItem, setFilterItem] = useState('all');

  const filteredTransactions = ALL_TRANSACTIONS.filter((transaction) => {
    const matchesSearch = 
      transaction.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.rationId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = filterDate === 'all' || transaction.date === filterDate;
    const matchesItem = filterItem === 'all' || transaction.item === filterItem;
    return matchesSearch && matchesDate && matchesItem;
  });

  const uniqueDates = Array.from(new Set(ALL_TRANSACTIONS.map(t => t.date))).sort().reverse();
  const uniqueItems = Array.from(new Set(ALL_TRANSACTIONS.map(t => t.item))).sort();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={user.name} role="shopkeeper" onLogout={onLogout} />

      <div className="max-w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <History className="w-8 h-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">Transaction History</h1>
          </div>
          <p className="text-gray-600">All distributions made through your shop</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search by User or Ration ID
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for user name or ration ID..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Date
              </label>
              <select
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Dates</option>
                {uniqueDates.map(date => (
                  <option key={date} value={date}>
                    {new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </option>
                ))}
              </select>
            </div>

            {/* Item Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Item
              </label>
              <select
                value={filterItem}
                onChange={(e) => setFilterItem(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Items</option>
                {uniqueItems.map(item => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Export Button */}
          <div className="mt-4 flex justify-end">
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export to Excel</span>
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
                    User Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Weight
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SMS
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
                      <div className="font-medium text-gray-900">{transaction.userName}</div>
                      <div className="text-xs text-gray-500 font-mono">{transaction.rationId}</div>
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
                        <Shield className="w-4 h-4 text-green-600" />
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
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">Total Transactions</p>
            <p className="text-2xl font-bold text-gray-900">{filteredTransactions.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">Total Weight Distributed</p>
            <p className="text-2xl font-bold text-gray-900">
              {filteredTransactions.reduce((sum, t) => sum + t.weight, 0).toFixed(1)} kg
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">
              ₹{filteredTransactions.reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">Unique Users Served</p>
            <p className="text-2xl font-bold text-gray-900">
              {new Set(filteredTransactions.map(t => t.rationId)).size}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}