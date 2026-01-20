import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Building2, Search, Eye, MapPin, Phone, Users, Package } from "lucide-react";

export default function AuthShopPage({ user, onLogout }) {
  const [shops, setShops] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch shops from backend
  useEffect(() => {
    const fetchShops = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("You are not logged in! Please login first.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/auth/authShops/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          alert("Unauthorized! Please login again.");
          setLoading(false);
          return;
        }

        const data = await res.json();

        // Ensure shops is always an array
        setShops(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching shops:", err);
        setShops([]); // fallback
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  // Filter shops based on search
  const filteredShops = shops.filter(
    (shop) =>
      shop.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.shopNo.includes(searchQuery) ||
      shop.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading shops...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={user?.name || "Authority"} role="authority" onLogout={onLogout} />

      <div className="w-full px-6 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Building2 className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">Fair Price Shops</h1>
          </div>
          <p className="text-gray-600">Monitor and manage all registered shops in the district</p>
        </div>
        {/* TOTAL SHOPS CARD */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 border-l-4 border-purple-500 w-[320px]">
          <p className="text-sm text-gray-600">Total Shops</p>
          <p className="text-3xl font-bold text-gray-900">{shops.length}</p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Search Shops</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Shop name, number, address, district, or state..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Shops Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredShops.map((shop) => (
            <div
              key={shop.shopNo}
              className="bg-white rounded-xl shadow-lg p-6 overflow-hidden hover:shadow-2xl transition-all"
            >
              {/* Header */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{shop.shopName}</h3>
                  <p className="text-sm text-gray-500 font-mono">{shop.shopNo}</p>
                  <p className="text-xs text-gray-400">{shop.shopOwnerName}</p>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{shop.address}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>+91 {shop.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span>Authority: {shop.authorityId}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4 text-gray-400" />
                  <span>
                    {shop.district}, {shop.state}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex justify-end">
                <button className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  <Eye className="w-4 h-4" />
                  <span>View</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No shops found */}
        {filteredShops.length === 0 && (
          <div className="bg-white rounded-xl shadow p-12 text-center mt-6">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No shops found</p>
          </div>
        )}
      </div>
    </div>
  );
}
