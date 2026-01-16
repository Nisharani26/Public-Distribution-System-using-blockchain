import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from "../components/Navbar";
import { Package, TrendingDown, History, CheckCircle, Bell } from 'lucide-react';

// Mock quota data
const QUOTA_DATA = [
  { item: 'Rice', allocated: 10, consumed: 6, unit: 'kg', color: 'bg-blue-500' },
  { item: 'Wheat', allocated: 8, consumed: 5, unit: 'kg', color: 'bg-amber-500' },
  { item: 'Sugar', allocated: 2, consumed: 1, unit: 'kg', color: 'bg-pink-500' },
  { item: 'Cooking Oil', allocated: 1, consumed: 0.5, unit: 'liter', color: 'bg-green-500' },
];

const RECENT_TRANSACTIONS = [
  { id: 1, date: '2026-01-05', item: 'Rice', weight: 3, amount: 10, smsStatus: 'Sent' },
  { id: 2, date: '2026-01-03', item: 'Wheat', weight: 2, amount: 8, smsStatus: 'Sent' },
  { id: 3, date: '2025-12-28', item: 'Sugar', weight: 1, amount: 5, smsStatus: 'Sent' },
];

export default function CitizenDashboard({ user, onLogout }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        userName={user?.name || "Citizen"} 
        role="user" 
        onLogout={onLogout} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {user?.name || "Citizen"}!
          </h1>
          <p className="text-gray-600">
            Ration Card: <span className="font-medium">{user?.rationId || "N/A"}</span> • 
            Assigned Shop: <span className="font-medium">{user?.assignedShop || "Not Assigned"}</span>
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm text-gray-500">This Month</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">4 Items</h3>
            <p className="text-sm text-gray-600">Total allocated items</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm text-gray-500">Consumed</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">12.5 kg</h3>
            <p className="text-sm text-gray-600">Total consumed this month</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-amber-600" />
              </div>
              <span className="text-sm text-gray-500">Remaining</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">8.5 kg</h3>
            <p className="text-sm text-gray-600">Available to collect</p>
          </div>
        </div>

        {/* Current Month Quota */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Current Month Quota</h2>
            <p className="text-sm text-gray-600 mt-1">
              January 2026 - Track your monthly allocation
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {QUOTA_DATA.map((quota) => {
                const percentage = (quota.consumed / quota.allocated) * 100;
                const remaining = quota.allocated - quota.consumed;

                return (
                  <div key={quota.item} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">{quota.item}</h3>
                      <span className="text-sm text-gray-600">
                        {quota.consumed}/{quota.allocated} {quota.unit}
                      </span>
                    </div>
                    <div className="relative pt-1">
                      <div className="overflow-hidden h-4 text-xs flex rounded-full bg-gray-200">
                        <div
                          style={{ width: `${percentage}%` }}
                          className={`${quota.color} shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500`}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-green-600 font-medium">
                        {remaining} {quota.unit} remaining
                      </span>
                      <span className="text-gray-500">
                        {percentage.toFixed(0)}% used
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Transactions & Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Transactions */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
                <p className="text-sm text-gray-600 mt-1">Your last 3 distributions</p>
              </div>
              <Link
                to="/user/transactions"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All
              </Link>
            </div>
            <div className="divide-y divide-gray-200">
              {RECENT_TRANSACTIONS.map((transaction) => (
                <div key={transaction.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium text-gray-900">
                          {transaction.item}
                        </h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {transaction.smsStatus}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{transaction.date}</span>
                        <span>•</span>
                        <span>{transaction.weight} kg</span>
                        <span>•</span>
                        <span className="font-medium">₹{transaction.amount}</span>
                      </div>
                    </div>
                    <History className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-900 mb-1">
                  SMS Notification
                </p>
                <p className="text-xs text-blue-700">
                  "Rice 3kg received on 05-Jan-2026. Paid ₹10. Thank you!"
                </p>
                <p className="text-xs text-blue-600 mt-2">✓ Sent successfully</p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm font-medium text-green-900 mb-1">
                  Monthly Quota
                </p>
                <p className="text-xs text-green-700">
                  Your January 2026 quota has been allocated. Visit your assigned shop to collect.
                </p>
              </div>

              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-sm font-medium text-amber-900 mb-1">
                  Reminder
                </p>
                <p className="text-xs text-amber-700">
                  8.5 kg of items remaining for this month. Collect before 31st January.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
