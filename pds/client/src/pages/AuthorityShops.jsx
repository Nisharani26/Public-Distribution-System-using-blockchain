import React, { useState } from 'react';
import Navbar from "../components/Navbar";
import { Building2, Search, Eye, MapPin, Phone, Users, Package } from 'lucide-react';

interface AuthorityShopsProps {
  user: any;
  onLogout: () => void;
}

const ALL_SHOPS = [
  { 
    id: 1, 
    shopId: 'SHP001', 
    name: 'Sunita Provisions', 
    location: 'Sector 15, Rohini', 
    phone: '9123456789', 
    assignedUsers: 125, 
    currentStock: 843, 
    status: 'Active',
    licenseNumber: 'DL/FPS/2018/1234',
    lastRestockDate: '2026-01-05'
  },
  { 
    id: 2, 
    shopId: 'SHP002', 
    name: 'Ganesh Store', 
    location: 'Sector 22, Dwarka', 
    phone: '9123456790', 
    assignedUsers: 98, 
    currentStock: 645, 
    status: 'Active',
    licenseNumber: 'DL/FPS/2019/2345',
    lastRestockDate: '2026-01-03'
  },
  { 
    id: 3, 
    shopId: 'SHP003', 
    name: 'Krishna Stores', 
    location: 'Sector 8, Vasundhara', 
    phone: '9123456791', 
    assignedUsers: 142, 
    currentStock: 234, 
    status: 'Low Stock',
    licenseNumber: 'DL/FPS/2017/3456',
    lastRestockDate: '2025-12-28'
  },
  { 
    id: 4, 
    shopId: 'SHP004', 
    name: 'Lakshmi Traders', 
    location: 'Sector 11, Pitampura', 
    phone: '9123456792', 
    assignedUsers: 87, 
    currentStock: 723, 
    status: 'Active',
    licenseNumber: 'DL/FPS/2020/4567',
    lastRestockDate: '2026-01-06'
  },
  { 
    id: 5, 
    shopId: 'SHP005', 
    name: 'Radha Store', 
    location: 'Sector 19, Narela', 
    phone: '9123456793', 
    assignedUsers: 115, 
    currentStock: 156, 
    status: 'Low Stock',
    licenseNumber: 'DL/FPS/2018/5678',
    lastRestockDate: '2025-12-30'
  },
];

export default function AuthorityShops({ user, onLogout }: AuthorityShopsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredShops = ALL_SHOPS.filter((shop) => {
    const matchesSearch =
      shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.shopId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || shop.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={user.name} role="authority" onLogout={onLogout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Building2 className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">Fair Price Shops</h1>
          </div>
          <p className="text-gray-600">Monitor and manage all registered shops in the district</p>
        </div>

        {/* Summary Cards - Only Low Stock and Total Shops */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">Total Shops</p>
            <p className="text-2xl font-bold text-gray-900">{ALL_SHOPS.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">Low Stock Shops</p>
            <p className="text-2xl font-bold text-red-600">
              {ALL_SHOPS.filter(s => s.status === 'Low Stock').length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Shops
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Shop name, ID, or location..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter - Only Low Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="Low Stock">Low Stock</option>
              </select>
            </div>
          </div>
        </div>

        {/* Shops Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredShops.map((shop) => (
            <div key={shop.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{shop.name}</h3>
                      <p className="text-sm text-gray-500 font-mono">{shop.shopId}</p>
                    </div>
                  </div>
                  {shop.status === 'Low Stock' && (
                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {shop.status}
                    </span>
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-3 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{shop.location}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">+91 {shop.phone}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{shop.assignedUsers} assigned users</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Package className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{shop.currentStock} kg current stock</span>
                </div>
              </div>

              {/* Stats */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 text-xs mb-1">License Number</p>
                    <p className="font-medium text-gray-900 text-xs">{shop.licenseNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs mb-1">Last Restock</p>
                    <p className="font-medium text-gray-900 text-xs">
                      {new Date(shop.lastRestockDate).toLocaleDateString('en-IN', { 
                        day: '2-digit', 
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
                <button className="flex-1 inline-flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                  <Eye className="w-4 h-4" />
                  <span>View Details</span>
                </button>
                {shop.status === 'Low Stock' && (
                  <button className="flex-1 inline-flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                    <Package className="w-4 h-4" />
                    <span>Restock</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredShops.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No shops found</p>
          </div>
        )}
      </div>
    </div>
  );
}
