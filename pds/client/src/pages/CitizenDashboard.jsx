import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

export default function CitizenDashboard({ user, onLogout }) {
  const [family, setFamily] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [newComplaint, setNewComplaint] = useState("");
  const [showComplaintModal, setShowComplaintModal] = useState(false);

  const [shopStock, setShopStock] = useState([]);
  const [loadingStock, setLoadingStock] = useState(true);

  const [authorityId, setAuthorityId] = useState(null);
  const [loadingAuthority, setLoadingAuthority] = useState(true); // ✅ Loading state

  /* ---------------- FETCH FAMILY ---------------- */
  useEffect(() => {
    async function fetchFamily() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://localhost:5000/api/citizen/family/${user.rationId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setFamily(data.members || []);
      } catch (err) {
        console.error("Failed to fetch family:", err);
      }
    }
    if (user?.rationId) fetchFamily();
  }, [user]);

  /* ---------------- FETCH SHOP DETAILS (authorityId) ---------------- */
  useEffect(() => {
    async function fetchShopDetails() {
      try {
        if (!user?.assignedShop) return;

        const token = localStorage.getItem("token");

        const res = await fetch(
          `http://localhost:5000/api/shopkeeper/shop/${user.assignedShop}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) throw new Error("Shop not found");

        const shop = await res.json();
        setAuthorityId(shop.authorityId); // ✅ Save authorityId
      } catch (err) {
        console.error("Failed to fetch shop details:", err);
      } finally {
        setLoadingAuthority(false); // ✅ Done loading authority
      }
    }

    fetchShopDetails();
  }, [user]);

  /* ---------------- FETCH LIVE SHOP STOCK ---------------- */
  useEffect(() => {
    async function fetchShopStock() {
      try {
        const token = localStorage.getItem("token");
        if (!token || !user?.assignedShop) return;

        const today = new Date();
        const monthName = today.toLocaleString("default", { month: "long" });
        const year = today.getFullYear();

        const res = await fetch(
          `http://localhost:5000/api/shop-stock/${user.assignedShop}/${monthName}/${year}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = await res.json();
        setShopStock(data?.items || []);
      } catch (err) {
        console.error("Failed to fetch shop stock:", err);
        setShopStock([]);
      } finally {
        setLoadingStock(false);
      }
    }

    fetchShopStock();
  }, [user]);

  /* ---------------- FETCH COMPLAINTS ---------------- */
  useEffect(() => {
    async function fetchComplaints() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://localhost:5000/api/complaints/citizen/${user.rationId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setComplaints(data);
      } catch (err) {
        console.error("Failed to fetch complaints:", err);
      }
    }

    if (user?.rationId) fetchComplaints();
  }, [user]);

  /* ---------------- SUBMIT COMPLAINT ---------------- */
  const handleSubmitComplaint = async () => {
    if (!newComplaint.trim() || !authorityId) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/complaints/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rationId: user.rationId,
          shopNo: user.assignedShop,
          citizenName: user.name,
          phone: user.phone,
          description: newComplaint,
          authorityId, // ✅ Send authorityId
        }),
      });

      if (!res.ok) throw new Error("Failed to submit complaint");

      const saved = await res.json();
      setComplaints([saved, ...complaints]);
      setNewComplaint("");
      setShowComplaintModal(false);
    } catch (err) {
      console.error("Failed to submit complaint", err);
      alert("Failed to submit complaint. Please try again.");
    }
  };

  const headMember = family?.[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        userName={headMember?.memberName || user.name || "Citizen"}
        role="citizen"
        onLogout={onLogout}
      />

      <div className="w-full px-6 py-8 space-y-8">
        {/* WELCOME */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg shadow">
          <h1 className="text-3xl font-bold">
            Welcome, {headMember?.memberName || user.name}!
          </h1>
        </div>

        {/* LIVE SHOP STOCK */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Live Shop Stock</h2>

          {loadingStock ? (
            <p className="text-gray-500">Loading stock...</p>
          ) : shopStock.length === 0 ||
            shopStock.every((i) => Number(i.availableQty) === 0) ? (
            <p className="text-gray-500">No stock available this month</p>
          ) : (
            <table className="w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border text-left">Item</th>
                  <th className="p-2 border text-left">Available Qty</th>
                </tr>
              </thead>
              <tbody>
                {shopStock
                  .filter((i) => Number(i.availableQty) > 0)
                  .map((i) => (
                    <tr key={i.stockId}>
                      <td className="p-2 border">{i.itemName}</td>
                      <td className="p-2 border">{i.availableQty} kg</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>

        {/* COMPLAINTS */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold">Complaints</h2>
            <button
              onClick={() => setShowComplaintModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Make Complaint
            </button>
          </div>

          {complaints.length === 0 ? (
            <p className="text-gray-500">No complaints raised yet</p>
          ) : (
            <div className="space-y-3">
              {complaints.map((c) => (
                <div
                  key={c._id}
                  className="flex justify-between items-center border p-3 rounded"
                >
                  <div>
                    <p className="font-medium">{c.description}</p>
                    <p className="text-xs text-gray-500">
                      {c.createdAt
                        ? new Date(c.createdAt).toLocaleDateString("en-IN")
                        : "—"}
                    </p>
                  </div>

                  <span
                    className={`px-4 py-1 text-sm font-semibold rounded-full ${
                      c.status === "Resolved"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* COMPLAINT MODAL */}
        {showComplaintModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-6 rounded w-full max-w-md">
              <h3 className="text-lg font-bold mb-3">Submit Complaint</h3>
              <textarea
                rows={4}
                value={newComplaint}
                onChange={(e) => setNewComplaint(e.target.value)}
                className="w-full border p-2 rounded"
              />
              <div className="mt-4 flex justify-end gap-3">
                <button onClick={() => setShowComplaintModal(false)}>
                  Cancel
                </button>
                <button
                  onClick={handleSubmitComplaint}
                  disabled={loadingAuthority} // ✅ Disable until authorityId is loaded
                  className={`px-4 py-2 rounded text-white ${
                    loadingAuthority ? "bg-gray-400" : "bg-blue-600"
                  }`}
                >
                  {loadingAuthority ? "Loading..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
