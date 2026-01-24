import React from "react";
import Navbar from "../components/Navbar";
import { User, Phone, IdCard, Store, MapPin, Calendar } from "lucide-react";

export default function CitizenProfile({ user, onLogout }) {
  // Mock data for family members and shop details (fetch from DB in real)
  const familyMembers = user.familyMembers || 4;
  const shopDetails = {
    name: user.assignedShop,
    address: "Sector 15, Rohini, New Delhi - 110085",
    phone: user.shopPhone || user.phone,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={user.name} role="citizen" onLogout={onLogout} />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">
            Your personal information and ration card details
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
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

          {/* Details */}
          <div className="p-8">
            <table className="w-full text-left table-auto border-collapse">
              <tbody>
                <tr className="border-b">
                  <td className="py-2 font-medium text-gray-600">Ration Card ID</td>
                  <td className="py-2 text-gray-900">{user.rationId}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium text-gray-600">Phone Number</td>
                  <td className="py-2 text-gray-900">+91 {user.phone}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium text-gray-600">Assigned Shop</td>
                  <td className="py-2 text-gray-900">{shopDetails.name}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium text-gray-600">Shop Address</td>
                  <td className="py-2 text-gray-900">{shopDetails.address}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium text-gray-600">Shop Contact</td>
                  <td className="py-2 text-gray-900">+91 {shopDetails.phone}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium text-gray-600">Registration Date</td>
                  <td className="py-2 text-gray-900">15 March 2020</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium text-gray-600">Family Members</td>
                  <td className="py-2 text-gray-900">{familyMembers}</td>
                </tr>
              </tbody>
            </table>

            {/* Monthly Entitlement Table */}
            <div className="mt-6">
              <h3 className="font-bold text-gray-900 mb-2">Monthly Entitlement</h3>
              <table className="w-full border-collapse table-auto">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 border text-left">Item</th>
                    <th className="px-4 py-2 border text-left">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {user.monthlyEntitlement?.map((item, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="px-4 py-2">{item.name}</td>
                      <td className="px-4 py-2">{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
