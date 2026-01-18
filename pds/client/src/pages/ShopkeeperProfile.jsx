import React from 'react';
import Navbar from "../components/Navbar";
import { Store, Phone, IdCard, MapPin, Calendar, Users, Package } from 'lucide-react';

export default function ShopkeeperProfile({ user, onLogout }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={user.name} role="shopkeeper" onLogout={onLogout} />

      <div className="max-w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shop Profile</h1>
          <p className="text-gray-600">Fair Price Shop information and details</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-12 text-white">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Store className="w-12 h-12" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">{user.name}</h2>
                <p className="text-green-100">Fair Price Shop - Authorized Dealer</p>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Shop ID */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <IdCard className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Shop ID</p>
                  <p className="text-lg font-bold text-gray-900">{user.shopId}</p>
                  <p className="text-xs text-gray-500 mt-1">Verified & Licensed</p>
                </div>
              </div>

              {/* Phone Number */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Contact Number</p>
                  <p className="text-lg font-bold text-gray-900">+91 {user.phone}</p>
                  <p className="text-xs text-green-600 mt-1">✓ Verified</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Shop Address</p>
                  <p className="text-lg font-bold text-gray-900">Sector 15, Rohini</p>
                  <p className="text-xs text-gray-500 mt-1">New Delhi - 110085</p>
                </div>
              </div>

              {/* License Date */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">License Issue Date</p>
                  <p className="text-lg font-bold text-gray-900">10 January 2018</p>
                  <p className="text-xs text-gray-500 mt-1">Valid till: 09 January 2028</p>
                </div>
              </div>

              {/* Assigned Users */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Assigned Users</p>
                  <p className="text-lg font-bold text-gray-900">125 Families</p>
                  <p className="text-xs text-gray-500 mt-1">Active beneficiaries</p>
                </div>
              </div>

              {/* License Number */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Package className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">License Number</p>
                  <p className="text-lg font-bold text-gray-900">DL/FPS/2018/1234</p>
                  <p className="text-xs text-gray-500 mt-1">Food & Supply Department</p>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Stats */}
          <div className="border-t border-gray-200 px-8 py-6 bg-gray-50">
            <h3 className="font-bold text-gray-900 mb-4">This Month Performance</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Distributions</p>
                <p className="text-xl font-bold text-gray-900">342</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Revenue</p>
                <p className="text-xl font-bold text-gray-900">₹12,450</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Users Served</p>
                <p className="text-xl font-bold text-gray-900">98</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Stock Remaining</p>
                <p className="text-xl font-bold text-gray-900">843 kg</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-8 py-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
            <button className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
              Update Contact Details
            </button>
            <button className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              Download License
            </button>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="font-bold text-green-900 mb-2">Support & Assistance</h3>
          <p className="text-sm text-green-700 mb-4">
            For technical support, stock inquiries, or license renewal, please contact the district PDS office.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 text-sm">
            <div className="flex items-center space-x-2 text-green-700">
              <Phone className="w-4 h-4" />
              <span>District Office: 1800-XXX-YYYY</span>
            </div>
            <div className="flex items-center space-x-2 text-green-700">
              <Store className="w-4 h-4" />
              <span>Stock Helpline: 1800-XXX-ZZZZ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}