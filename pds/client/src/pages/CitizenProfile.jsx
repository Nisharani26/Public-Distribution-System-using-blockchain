import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { User } from "lucide-react";

export default function CitizenProfile({ user, onLogout }) {
  const [family, setFamily] = useState(user.family || []);
  const [loading, setLoading] = useState(!user.family || user.family.length === 0);

  useEffect(() => {
    async function fetchFamily() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/api/citizen/family/${user.rationId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setFamily(data.members || []);
      } catch (err) {
        console.error("Failed to fetch family members", err);
      } finally {
        setLoading(false);
      }
    }

    if (!user.family || user.family.length === 0) fetchFamily();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={user.fullName || user.name || "Citizen"} role="citizen" onLogout={onLogout} />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">Your personal information and ration card details</p>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12 text-white">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <User className="w-12 h-12" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">{user.fullName || user.name}</h2>
                <p className="text-blue-100">Ration Card Holder</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <table className="w-full border-collapse mb-6">
              <tbody>
                <tr className="border-b">
                  <td className="py-2 font-medium text-gray-600">Ration Card ID</td>
                  <td className="py-2">{user.rationId}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium text-gray-600">Phone Number</td>
                  <td className="py-2">+91 {user.phone}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium text-gray-600">Assigned Shop</td>
                  <td className="py-2">{user.assignedShop || "Not Assigned"}</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium text-gray-600">Family Members</td>
                  <td className="py-2">{family.length}</td>
                </tr>
              </tbody>
            </table>

            {/* Family Members Table */}
            <div className="mt-6">
              <h3 className="font-bold text-gray-900 mb-3">Family Members</h3>
              {loading ? (
                <p className="text-gray-500">Loading family details...</p>
              ) : family.length === 0 ? (
                <p className="text-gray-500">No family members found.</p>
              ) : (
                <table className="w-full border-collapse table-auto">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 border text-left">Name</th>
                      <th className="px-4 py-2 border text-left">Relation</th>
                      <th className="px-4 py-2 border text-left">Age</th>
                    </tr>
                  </thead>
                  <tbody>
                    {family.map((member, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border">{member.memberName}</td>
                        <td className="px-4 py-2 border">{member.relation}</td>
                        <td className="px-4 py-2 border">{member.age}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Monthly Entitlement */}
            <div className="mt-8">
              <h3 className="font-bold text-gray-900 mb-2">Monthly Entitlement</h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 border">Item</th>
                    <th className="px-4 py-2 border">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {user.monthlyEntitlement?.map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-2 border">{item.name}</td>
                      <td className="px-4 py-2 border">{item.quantity}</td>
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
