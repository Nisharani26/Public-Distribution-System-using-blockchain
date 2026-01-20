import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from "../components/Navbar";
import { Package, Users, TrendingUp, Scale, Eye, CheckCircle } from 'lucide-react';

const STOCK_DATA = [
  { item: 'Rice', current: 450, allocated: 800, unit: 'kg', status: 'good' },
  { item: 'Wheat', current: 320, allocated: 600, unit: 'kg', status: 'good' },
  { item: 'Sugar', current: 45, allocated: 150, unit: 'kg', status: 'low' },
  { item: 'Cooking Oil', current: 28, allocated: 80, unit: 'liter', status: 'low' },
];

const ASSIGNED_USERS = [
  { id: 1, name: 'Rajesh Kumar', rationId: 'RAT123456', quota: { rice: 10, wheat: 8, sugar: 2 }, remaining: { rice: 4, wheat: 3, sugar: 1 }, status: 'Active' },
  { id: 2, name: 'Priya Sharma', rationId: 'RAT123457', quota: { rice: 10, wheat: 8, sugar: 2 }, remaining: { rice: 7, wheat: 5, sugar: 2 }, status: 'Active' },
  { id: 3, name: 'Amit Patel', rationId: 'RAT123458', quota: { rice: 10, wheat: 8, sugar: 2 }, remaining: { rice: 10, wheat: 8, sugar: 2 }, status: 'Pending' },
  { id: 4, name: 'Sunita Devi', rationId: 'RAT123459', quota: { rice: 10, wheat: 8, sugar: 2 }, remaining: { rice: 2, wheat: 0, sugar: 0 }, status: 'Active' },
  { id: 5, name: 'Ramesh Gupta', rationId: 'RAT123460', quota: { rice: 10, wheat: 8, sugar: 2 }, remaining: { rice: 6, wheat: 4, sugar: 1 }, status: 'Active' },
];

export default function ShopkeeperDashboard({ user, onLogout }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={user?.name} role="shopkeeper" onLogout={onLogout} />

      {/* === FULL WIDTH CONTAINER (AS YOU ASKED) === */}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {user?.name || "Shopkeeper"}!
          </h1>
          <p className="text-gray-600">
            Shop ID: <span className="font-medium">{user?.shopId || "N/A"}</span> • 
            Today: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">125</h3>
            <p className="text-sm text-gray-600">Total Assigned Users</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">843 kg</h3>
            <p className="text-sm text-gray-600">Total Stock Available</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">38</h3>
            <p className="text-sm text-gray-600">Distributions Today</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">₹12,450</h3>
            <p className="text-sm text-gray-600">Revenue This Month</p>
          </div>
        </div>

        {/* Stock Summary */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Stock Summary</h2>
              <p className="text-sm text-gray-600 mt-1">Current inventory status</p>
            </div>
            <Link
              to="/shopkeeper/weight-monitor"
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Scale className="w-4 h-4" />
              <span>Start Distribution</span>
            </Link>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {STOCK_DATA.map((stock) => {
                const percentage = (stock.current / stock.allocated) * 100;
                const statusBg =
                  stock.status === 'good'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200';

                return (
                  <div key={stock.item} className={`border rounded-lg p-4 ${statusBg}`}>
                    <h3 className="font-bold text-gray-900 mb-2">{stock.item}</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Current:</span>
                        <span className="font-medium text-gray-900">
                          {stock.current} {stock.unit}
                        </span>
                      </div>

                      <div className="relative pt-1">
                        <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-200">
                          <div
                            style={{ width: `${percentage}%` }}
                            className={`${
                              stock.status === 'good' ? 'bg-green-500' : 'bg-red-500'
                            } h-2`}
                          />
                        </div>
                      </div>

                      <div className="flex justify-between text-xs">
                        <span
                          className={
                            stock.status === 'good'
                              ? 'text-green-600'
                              : 'text-red-600'
                          }
                        >
                          {stock.status === 'good' ? 'Good Stock' : 'Low Stock'}
                        </span>
                        <span className="text-gray-500">{percentage.toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Assigned Users Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Assigned Users</h2>
            <p className="text-sm text-gray-600 mt-1">
              Recent 5 users - Manage their distributions
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ration ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monthly Quota
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Remaining
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {ASSIGNED_USERS.map((assignedUser) => (
                  <tr key={assignedUser.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">
                            {assignedUser.name}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                      {assignedUser.rationId}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      R: {assignedUser.quota.rice}kg, W: {assignedUser.quota.wheat}kg, S: {assignedUser.quota.sugar}kg
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      R: {assignedUser.remaining.rice}kg, W: {assignedUser.remaining.wheat}kg, S: {assignedUser.remaining.sugar}kg
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          assignedUser.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {assignedUser.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link
                        to="/shopkeeper/weight-monitor"
                        className="inline-flex items-center space-x-1 text-green-600 hover:text-green-700 font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Distribute</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}