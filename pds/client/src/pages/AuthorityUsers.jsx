import React, { useState } from 'react';
import Navbar from "../components/Navbar";
import { Users, Search, Eye, Building2 } from 'lucide-react';

const ALL_USERS = [
  { id: 1, name: 'Rajesh Kumar', rationId: 'RAT123456', phone: '9876543210', assignedShop: 'SHP001', shopName: 'Sunita Provisions', familySize: 4, registrationDate: '2020-03-15' },
  { id: 2, name: 'Priya Sharma', rationId: 'RAT123457', phone: '9876543211', assignedShop: 'SHP001', shopName: 'Sunita Provisions', familySize: 3, registrationDate: '2019-08-22' },
  { id: 3, name: 'Amit Patel', rationId: 'RAT123458', phone: '9876543212', assignedShop: 'SHP002', shopName: 'Ganesh Store', familySize: 5, registrationDate: '2021-01-10' },
  { id: 4, name: 'Sunita Devi', rationId: 'RAT123459', phone: '9876543213', assignedShop: 'SHP001', shopName: 'Sunita Provisions', familySize: 4, registrationDate: '2018-11-05' },
  { id: 5, name: 'Ramesh Gupta', rationId: 'RAT123460', phone: '9876543214', assignedShop: 'SHP003', shopName: 'Krishna Stores', familySize: 6, registrationDate: '2020-07-18' },
  { id: 6, name: 'Meera Singh', rationId: 'RAT123461', phone: '9876543215', assignedShop: 'SHP002', shopName: 'Ganesh Store', familySize: 3, registrationDate: '2022-02-28' },
];

export default function AuthorityUsers({ user, onLogout }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterShop, setFilterShop] = useState('all');

  const filteredUsers = ALL_USERS.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.rationId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesShop = filterShop === 'all' || u.assignedShop === filterShop;

    return matchesSearch && matchesShop;
  });

  const uniqueShops = Array.from(new Set(ALL_USERS.map(u => u.assignedShop))).sort();

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar userName={user?.name || "Authority"} role="authority" onLogout={onLogout} />

      {/* FULL WIDTH CONTAINER (LIKE NAVBAR) WITH SMALL MARGIN */}
      <div className="w-full px-6 py-6">

        {/* HEADER - Same as AuthorityDashboard */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-400 rounded-xl p-6 mb-6 shadow-lg w-full">
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8 text-white" />
            <div>
              <h1 className="text-2xl font-bold text-white">Registered Users</h1>
              <p className="text-white/90">Manage all ration card holders in your district</p>
            </div>
          </div>
        </div>

        {/* ONLY ONE CARD - TOTAL USERS (FULLY VISIBLE AND CLEAN) */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 border-l-4 border-purple-500 w-[320px]">
          <p className="text-sm text-gray-600">Total Users</p>
          <p className="text-3xl font-bold text-gray-900">{ALL_USERS.length}</p>
        </div>

        {/* FILTER PANEL - NO STATUS FILTER */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Users
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Name or Ration ID..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Shop Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Shop
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={filterShop}
                  onChange={(e) => setFilterShop(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Shops</option>
                  {uniqueShops.map(shop => (
                    <option key={shop} value={shop}>{shop}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* USERS TABLE - FULL WIDTH AND CLEAN */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden w-full">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-blue-900 uppercase">User Details</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-blue-900 uppercase">Ration ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-blue-900 uppercase">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-blue-900 uppercase">Assigned Shop</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-blue-900 uppercase">Family Size</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-blue-900 uppercase">Action</th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{u.name}</div>
                          <div className="text-xs text-gray-500">
                            Reg: {new Date(u.registrationDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm font-mono text-gray-900">{u.rationId}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">+91 {u.phone}</td>

                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{u.assignedShop}</div>
                      <div className="text-xs text-gray-500">{u.shopName}</div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-900">{u.familySize} members</td>

                    <td className="px-6 py-4 text-sm">
                      <button className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 font-medium">
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No users found</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
