import React, { useEffect, useState } from 'react';
import Navbar from "../components/Navbar";
import { Package, Users } from 'lucide-react';
import axios from 'axios';

export default function ShopkeeperDashboard({ user, onLogout }) {
  const [stockData, setStockData] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalStock, setTotalStock] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      console.log("USER OBJECT:", user);

      if (!user?.shopNo) {
        setError("Shop number not found.");
        setLoading(false);
        return;
      }

      const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];

      const today = new Date();
      const month = months[today.getMonth()];
      const year = today.getFullYear();

      setLoading(true);
      setError("");

      /* ==========================
         1️⃣ USERS COUNT (ALWAYS)
      ========================== */
      try {
        const userRes = await axios.get(
          `https://public-distribution-system-using.onrender.com/api/shopUsers/${user.shopNo}/count`
        );
        setTotalUsers(userRes.data.totalUsers);
      } catch (err) {
        console.error("User count error:", err);
        setTotalUsers(0);
      }

      /* ==========================
         2️⃣ STOCK (MAY OR MAY NOT EXIST)
      ========================== */
      try {
        const stockRes = await axios.get(
          `https://public-distribution-system-using.onrender.com/api/shopStock/${user.shopNo}/${month}/${year}`
        );

        const stock = stockRes.data;
        const totalQty = stock.items.reduce(
          (sum, item) => sum + item.availableQty,
          0
        );

        setStockData(stock.items);
        setTotalStock(totalQty);
      } catch (err) {
        if (err.response?.status === 404) {
          setStockData([]);
          setTotalStock(0);
        } else {
          console.error("Stock fetch error:", err);
          setError("Failed to load stock data");
        }
      }

      setLoading(false);
    };

    fetchDashboardData();
  }, [user]);

  const handleStockSubmission = async (itemsGiven) => {
    try {
      if (!user?.shopNo) return;

      const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];

      const today = new Date();
      const month = months[today.getMonth()];
      const year = today.getFullYear();

      for (const item of itemsGiven) {
        await axios.put(
          `https://public-distribution-system-using.onrender.com/api/shopStock/reduceStock/${user.shopNo}/${month}/${year}`,
          {
            stockId: item.stockId,
            quantity: item.quantity
          }
        );
      }

      alert("Stock updated successfully!");

      const stockRes = await axios.get(
        `https://public-distribution-system-using.onrender.com/api/shopStock/${user.shopNo}/${month}/${year}`
      );

      const stock = stockRes.data;
      const totalQty = stock.items.reduce(
        (sum, item) => sum + item.availableQty,
        0
      );

      setStockData(stock.items);
      setTotalStock(totalQty);
    } catch (err) {
      console.error("Error updating stock:", err);
      alert("Failed to update stock.");
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={user?.name} role="shopkeeper" onLogout={onLogout} />

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {user?.name || "Shopkeeper"}!
          </h1>
          <p className="text-gray-600">
            Shop ID: <span className="font-medium">{user?.shopNo}</span> •
            Today: {new Date().toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {totalUsers}
            </h3>
            <p className="text-sm text-gray-600">Total Assigned Users</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {totalStock} kg
            </h3>
            <p className="text-sm text-gray-600">Total Stock Available</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">Stock Summary</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium">Item</th>
                  <th className="px-6 py-3 text-left text-xs font-medium">Allocated</th>
                  <th className="px-6 py-3 text-left text-xs font-medium">Available</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {stockData.map(item => (
                  <tr key={item.stockId}>
                    <td className="px-6 py-4 font-medium">{item.itemName}</td>
                    <td className="px-6 py-4">{item.allocatedQty} kg</td>
                    <td className="px-6 py-4">{item.availableQty} kg</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {stockData.length === 0 && (
              <div className="p-6 text-center text-gray-500">
                No stock allocated for this month
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
