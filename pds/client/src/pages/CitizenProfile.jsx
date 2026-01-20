import React from 'react';
import Navbar from "../components/Navbar";
import { User, Phone, IdCard, Store, MapPin, Calendar } from 'lucide-react';

export default function CitizenProfile({ user, onLogout }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={user.name} role="citizen" onLogout={onLogout} />

      <div className="max-w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">Your personal information and ration card details</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12 text-white">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <User className="w-12 h-12" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">{user.name}</h2>
                <p className="text-blue-100">Ration Card Holder</p>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Ration Card ID */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <IdCard className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Ration Card ID</p>
                  <p className="text-lg font-bold text-gray-900">{user.rationId}</p>
                  <p className="text-xs text-gray-500 mt-1">APL Category</p>
                </div>
              </div>

              {/* Phone Number */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Phone Number</p>
                  <p className="text-lg font-bold text-gray-900">+91 {user.phone}</p>
                  <p className="text-xs text-green-600 mt-1">✓ Verified</p>
                </div>
              </div>

              {/* Assigned Shop */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Store className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Assigned Fair Price Shop</p>
                  <p className="text-lg font-bold text-gray-900">{user.assignedShop}</p>
                  <p className="text-xs text-gray-500 mt-1">Sunita Provisions</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Address</p>
                  <p className="text-lg font-bold text-gray-900">Sector 15, Rohini</p>
                  <p className="text-xs text-gray-500 mt-1">New Delhi - 110085</p>
                </div>
              </div>

              {/* Registration Date */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Registration Date</p>
                  <p className="text-lg font-bold text-gray-900">15 March 2020</p>
                  <p className="text-xs text-gray-500 mt-1">Active for 5+ years</p>
                </div>
              </div>

              {/* Family Members */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Family Members</p>
                  <p className="text-lg font-bold text-gray-900">4 Members</p>
                  <p className="text-xs text-gray-500 mt-1">Eligible for household quota</p>
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Entitlement Section */}
          <div className="border-t border-gray-200 px-8 py-6 bg-gray-50">
            <h3 className="font-bold text-gray-900 mb-4">Monthly Entitlement</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Rice</p>
                <p className="text-xl font-bold text-gray-900">10 kg</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Wheat</p>
                <p className="text-xl font-bold text-gray-900">8 kg</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Sugar</p>
                <p className="text-xl font-bold text-gray-900">2 kg</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Cooking Oil</p>
                <p className="text-xl font-bold text-gray-900">1 liter</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-8 py-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
            <button className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Update Phone Number
            </button>
            <button className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              Download Ration Card
            </button>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 mb-2">Need Help?</h3>
          <p className="text-sm text-blue-700 mb-4">
            For any updates to your profile or issues with your ration card, please contact your assigned shop or visit your local PDS office.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 text-sm">
            <div className="flex items-center space-x-2 text-blue-700">
              <Phone className="w-4 h-4" />
              <span>Helpline: 1800-XXX-XXXX</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-700">
              <Store className="w-4 h-4" />
              <span>Shop Contact: {user.phone}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}