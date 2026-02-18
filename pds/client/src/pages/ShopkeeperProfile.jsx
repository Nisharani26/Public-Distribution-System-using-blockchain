import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Store, Phone, IdCard, MapPin, Users } from "lucide-react";

export default function ShopkeeperProfile({ onLogout }) {
  const [shop, setShop] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/shopkeeper/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      setShop(data);
    };

    fetchProfile();
  }, []);

  if (!shop) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={shop.name} role="shopkeeper" onLogout={onLogout} />

      <div className="max-w-full px-6 py-8">
        <h1 className="text-3xl font-bold mb-6">Shop Profile</h1>

        <div className="bg-white rounded-lg shadow">
          <div className="bg-green-600 p-8 text-white flex gap-6">
            <Store size={48} />
            <div>
              <h2 className="text-2xl font-bold">{shop.name}</h2>
              <p>Fair Price Shop</p>
            </div>
          </div>

          <div className="p-8 grid md:grid-cols-2 gap-6">
            <Info icon={<IdCard />} label="Shop ID" value={shop.shopId} />
            <Info icon={<Phone />} label="Phone" value={shop.phone} />
            <Info icon={<MapPin />} label="Address" value={shop.address || "N/A"} />
            <Info icon={<Users />} label="Assigned Users" value={shop.totalUsers} />
          </div>
        </div>
      </div>
    </div>
  );
}

const Info = ({ icon, label, value }) => (
  <div className="flex gap-4">
    <div className="bg-gray-100 p-3 rounded">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-bold">{value}</p>
    </div>
  </div>
);
