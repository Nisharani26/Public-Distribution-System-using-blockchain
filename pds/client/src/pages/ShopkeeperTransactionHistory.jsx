import React, { useEffect, useState } from 'react';
import Navbar from "../components/Navbar";
import { History, Search } from 'lucide-react';

export default function ShopkeeperTransactionHistory({ user, onLogout }) {
  const [transactions, setTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMonth, setFilterMonth] = useState('all');
  const [filterItem, setFilterItem] = useState('all');

  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user?.shopNo) return;

      const token = localStorage.getItem("token");

      try {
        const res = await fetch(`http://localhost:5000/api/transactions/shop/${user.shopNo}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setTransactions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setTransactions([]);
      }
    };

    fetchTransactions();
  }, [user]);

  // Prepare month-year string helper
  const getMonthYear = (dateStr) => {
    const d = new Date(dateStr);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const year = d.getFullYear();
    return `${year}-${month}`; // e.g., "2025-01"
  };

  // Filtered transactions
  const filteredTransactions = transactions.filter(t => {
    const matchesSearch =
      (t.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (t.rationId?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

    const tMonth = getMonthYear(t.transactionDate);
    const matchesMonth = filterMonth === 'all' || tMonth === filterMonth;

    const matchesItem =
      filterItem === 'all' ||
      (t.items?.some(i => i.itemName === filterItem) ?? false);

    return matchesSearch && matchesMonth && matchesItem;
  });

  // Unique months & items for filters
  const uniqueMonths = Array.from(
    new Set(transactions.map(t => getMonthYear(t.transactionDate)))
  ).sort().reverse();

  const uniqueItems = Array.from(
    new Set(transactions.flatMap(t => t.items ? t.items.map(i => i.itemName) : []))
  ).sort();

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

        {/* Total Transactions */}
        <div className="mb-6">
          <div className="bg-white rounded-lg shadow p-6 w-64">
            <p className="text-sm text-gray-600 mb-1">Total Transactions</p>
            <p className="text-2xl font-bold text-gray-900">{filteredTransactions.length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
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
                placeholder="Search ration ID..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Month-Year Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Month</label>
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Months</option>
              {uniqueMonths.map(month => {
                const [year, m] = month.split("-");
                const monthName = new Date(year, m - 1).toLocaleString('en-IN', { month: 'short' });
                return <option key={month} value={month}>{monthName} {year}</option>
              })}
            </select>
          </div>

          {/* Item Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Item</label>
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

        {/* Transactions Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map(transaction => (
                <tr key={transaction._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(transaction.transactionDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {transaction.userName && <div className="font-medium text-gray-900">{transaction.userName}</div>}
                    <div className="text-xs text-gray-500 font-mono">{transaction.rationId}</div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {transaction.items && transaction.items.length > 0 ? (
                      transaction.items.map(i => (
                        <div key={i.stockId}>{i.itemName} - {i.quantity} kg</div>
                      ))
                    ) : (
                      <div>No items</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12 text-gray-600">
              <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              No transactions found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
