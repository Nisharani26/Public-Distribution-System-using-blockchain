import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

// Mock data for complaints and shop stock (you can replace with real API later)
const PREVIOUS_COMPLAINTS = [
  { id: 1, date: "2026-01-05", description: "Long waiting time", status: "Pending" },
  { id: 2, date: "2025-12-28", description: "Ration quality issue", status: "Resolved" },
];

const SHOP_STOCK = [
  { id: 1, item: "Wheat", quantity: "50 kg" },
  { id: 2, item: "Rice", quantity: "30 kg" },
  { id: 3, item: "Sugar", quantity: "20 kg" },
];

export default function CitizenDashboard({ user, onLogout }) {
  const [family, setFamily] = useState([]);
  const [complaints, setComplaints] = useState(PREVIOUS_COMPLAINTS);
  const [newComplaint, setNewComplaint] = useState("");
  const [showComplaintModal, setShowComplaintModal] = useState(false);

  // Fetch family data from backend
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
        console.error("Failed to fetch family:", err);
      }
    }

    if (user?.rationId) fetchFamily();
  }, [user]);

  const handleSubmitComplaint = () => {
    if (!newComplaint.trim()) return;

    const complaint = {
      id: complaints.length + 1,
      date: new Date().toISOString().split("T")[0],
      description: newComplaint,
      status: "Pending",
    };

    setComplaints([complaint, ...complaints]);
    setNewComplaint("");
    setShowComplaintModal(false);
  };

  const headMember = family?.[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        userName={headMember?.memberName || user.fullName || "Citizen"}
        role="citizen"
        onLogout={onLogout}
      />

      <div className="w-full px-6 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-2">
            Welcome, {headMember?.memberName || user.fullName || "Citizen"}!
          </h1>
          {headMember && <p className="text-blue-100">Relation: {headMember.relation}</p>}
        </div>

        {/* Live Stock Table */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Live Shop Stock</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border text-left text-gray-600">Item</th>
                  <th className="px-4 py-2 border text-left text-gray-600">Available Quantity</th>
                </tr>
              </thead>
              <tbody>
                {SHOP_STOCK.map((stock) => (
                  <tr key={stock.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-2 border">{stock.item}</td>
                    <td className="px-4 py-2 border">{stock.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Complaint Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Complaints</h2>
            <button
              onClick={() => setShowComplaintModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Make Complaint
            </button>
          </div>

          <div className="space-y-3">
            {complaints.length === 0 ? (
              <p className="text-gray-500">No previous complaints.</p>
            ) : (
              complaints.map((c) => (
                <div
                  key={c.id}
                  className="p-3 border rounded-lg flex justify-between items-center hover:shadow-sm transition"
                >
                  <div>
                    <p className="font-medium text-gray-900">{c.description}</p>
                    <p className="text-xs text-gray-500">{c.date}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      c.status === "Resolved"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Complaint Modal */}
        {showComplaintModal && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Submit Complaint</h3>
              <textarea
                rows={4}
                value={newComplaint}
                onChange={(e) => setNewComplaint(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your complaint..."
              />
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={() => setShowComplaintModal(false)}
                  className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitComplaint}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
