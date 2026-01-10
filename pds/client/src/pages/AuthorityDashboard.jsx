import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Users, Building2, TrendingUp, Package } from "lucide-react";

const monthlyDistribution = [
  { month: "Jul", rice: 1200, wheat: 950, sugar: 280 },
  { month: "Aug", rice: 1350, wheat: 1020, sugar: 310 },
  { month: "Sep", rice: 1280, wheat: 980, sugar: 290 },
  { month: "Oct", rice: 1400, wheat: 1100, sugar: 330 },
  { month: "Nov", rice: 1320, wheat: 1050, sugar: 305 },
  { month: "Dec", rice: 1450, wheat: 1150, sugar: 340 },
];

const stockByItem = [
  { name: "Rice", value: 4500, color: "#3b82f6" },
  { name: "Wheat", value: 3200, color: "#f59e0b" },
  { name: "Sugar", value: 890, color: "#ec4899" },
  { name: "Cooking Oil", value: 240, color: "#10b981" },
];

export default function AuthorityDashboard() {
  const location = useLocation();
  const user = location.state?.user;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-xl font-bold text-red-600">
          Error: User data not found. Please login first.
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={user.name} role="authority" onLogout={() => window.location.reload()} />

      <div className="max-w-full px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Authority Dashboard</h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Welcome, {user.name} • District Overview: {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">1,847</h3>
            <p className="text-sm sm:text-base text-gray-600">Total Registered Users</p>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-2">
              <Building2 className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">15</h3>
            <p className="text-sm sm:text-base text-gray-600">Active Fair Price Shops</p>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-2">
              <TrendingUp className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">4,283</h3>
            <p className="text-sm sm:text-base text-gray-600">Distributions This Month</p>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">8,830 kg</h3>
            <p className="text-sm sm:text-base text-gray-600">Total Stock Remaining</p>
          </div>
        </div>
      </div>
    </div>
  );
}
