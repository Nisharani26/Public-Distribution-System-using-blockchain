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
  const [loadingAuthority, setLoadingAuthority] = useState(true);

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [entitlement, setEntitlement] = useState([]);
  const [loadingEntitlement, setLoadingEntitlement] = useState(true);

  const [requestedItems, setRequestedItems] = useState({}); // { itemName: status }

  /* ---------------- FETCH FAMILY ---------------- */
  useEffect(() => {
    const fetchFamily = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `https://public-distribution-system-using.onrender.com/api/citizen/family/${user.rationId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setFamily(data.members || []);
      } catch (err) {
        console.error("Failed to fetch family:", err);
      }
    };
    if (user?.rationId) fetchFamily();
  }, [user]);

  /* ---------------- FETCH SHOP DETAILS ---------------- */
  useEffect(() => {
    const fetchShopDetails = async () => {
      if (!user?.assignedShop) return;
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `https://public-distribution-system-using.onrender.com/api/shopkeeper/shop/${user.assignedShop}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const shop = await res.json();
        if (!res.ok) {
          console.error("Shop fetch failed:", shop.message);
          return;
        }
        setAuthorityId(shop.authorityId);
      } catch (err) {
        console.error("Failed to fetch shop details:", err);
      } finally {
        setLoadingAuthority(false);
      }
    };
    fetchShopDetails();
  }, [user]);

  /* ---------------- FETCH LIVE SHOP STOCK ---------------- */
  useEffect(() => {
    const fetchShopStock = async () => {
      try {
        if (!user?.assignedShop) return;

        const token = localStorage.getItem("token");
        const today = new Date();
        const monthName = today.toLocaleString("default", { month: "long" });
        const year = today.getFullYear();

        const res = await fetch(
          `https://public-distribution-system-using.onrender.com/api/shopStock/${user.assignedShop}/${monthName}/${year}`,
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
    };
    fetchShopStock();
  }, [user]);

  /* ---------------- FETCH COMPLAINTS ---------------- */
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        if (!user?.rationId) return;
        const token = localStorage.getItem("token");
        const res = await fetch(
          `https://public-distribution-system-using.onrender.com/api/complaints/citizen/${user.rationId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setComplaints(data || []);
      } catch (err) {
        console.error("Failed to fetch complaints:", err);
      }
    };
    fetchComplaints();
  }, [user]);

  /* ---------------- SUBMIT COMPLAINT ---------------- */
  const handleSubmitComplaint = async () => {
    if (!newComplaint.trim()) {
      alert("Please enter complaint");
      return;
    }

    if (!authorityId) {
      alert("Authority not loaded yet. Please wait.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://public-distribution-system-using.onrender.com/api/complaints/add", {
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
          authorityId,
        }),
      });

      const saved = await res.json();
      if (!res.ok) {
        alert(saved.message || "Complaint submit failed");
        return;
      }

      setComplaints((prev) => [saved, ...prev]);
      setNewComplaint("");
      setShowComplaintModal(false);
    } catch (err) {
      console.error("Error submitting complaint:", err);
      alert("Failed to submit complaint");
    }
  };

  /* ---------------- FETCH ENTITLEMENT ---------------- */
  useEffect(() => {
    const fetchEntitlement = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`https://public-distribution-system-using.onrender.com/api/userStock/template`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch stock template");
        const data = await res.json();

        const totalMembers = family.length || 1;
        const calculated = data.map((item) => ({
          itemName: item.itemName,
          allocatedQty: item.perMemberQty * totalMembers || 0,
          unit: item.unit || "",
        }));

        setEntitlement(calculated);
      } catch (err) {
        console.error("Failed to fetch entitlement:", err);
      } finally {
        setLoadingEntitlement(false);
      }
    };

    if (family.length) fetchEntitlement();
  }, [family]);

  /* ---------------- FETCH REQUESTED ITEMS ---------------- */
  useEffect(() => {
    const fetchRequestedItems = async () => {
      try {
        if (!user?.rationId) return;
        const token = localStorage.getItem("token");
        const res = await fetch(
          `https://public-distribution-system-using.onrender.com/api/userRequests/myRequests/${user.rationId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();

        // Map item names normalized (trim & lower case) => status
        const map = {};
        data.forEach((r) => {
          map[r.itemName.trim().toLowerCase()] = r.status;
        });

        setRequestedItems(map);
      } catch (err) {
        console.error("Failed to fetch requested items:", err);
      }
    };
    fetchRequestedItems();
  }, [user]);

  /* ---------------- HANDLE ITEM REQUEST ---------------- */
  const handleRequestItem = async (item) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://public-distribution-system-using.onrender.com/api/userRequests/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rationId: user.rationId,
          shopNo: user.assignedShop,
          itemName: item.itemName,
          requestedQty: item.allocatedQty,
          status: "Pending",
        }),
      });

      if (!res.ok) throw new Error("Request failed");

      // Update status to Pending
      setRequestedItems((prev) => ({
        ...prev,
        [item.itemName.trim().toLowerCase()]: "Pending",
      }));
    } catch (err) {
      console.error("Request failed:", err);
      alert("Request failed");
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
        {/* WELCOME + REQUEST BUTTON */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg shadow flex justify-between">
          <h1 className="text-3xl font-bold">
            Welcome, {headMember?.memberName || user.name}!
          </h1>
          <button
            onClick={() => setShowRequestModal(true)}
            className="px-4 py-2 rounded bg-white text-blue-700 hover:bg-blue-50 font-semibold"
          >
            Request Items
          </button>
        </div>

        {/* LIVE SHOP STOCK */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Live Shop Stock</h2>
          {loadingStock ? (
            <p>Loading...</p>
          ) : (
            <table className="w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2">Item</th>
                  <th className="border p-2">Available Qty</th>
                </tr>
              </thead>
              <tbody>
                {shopStock.filter((i) => Number(i.availableQty) > 0).map((i) => (
                  <tr key={i.stockId}>
                    <td className="border p-2">{i.itemName}</td>
                    <td className="border p-2">{i.availableQty} kg</td>
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
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString("en-IN") : "—"}
                    </p>
                  </div>
                  <span
                    className={`px-4 py-1 text-sm font-semibold rounded-full ${c.status === "Resolved"
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
      </div>

      {/* REQUEST MODAL */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">Request Items</h2>

            {loadingEntitlement ? (
              <p>Loading...</p>
            ) : (
              <table className="w-full border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">Item</th>
                    <th className="border p-2">Allocated Qty</th>
                    <th className="border p-2">Status</th>
                    <th className="border p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {entitlement.map((i) => {
                    const key = i.itemName.trim().toLowerCase();
                    const status = requestedItems[key] || "-";
                    const canRequest = status === "-" || status === "Received"; // enable if not requested or received

                    return (
                      <tr key={i.itemName}>
                        <td className="border p-2">{i.itemName}</td>
                        <td className="border p-2">{i.allocatedQty} {i.unit}</td>
                        <td className="border p-2">{status}</td>
                        <td className="border p-2">
                          <button
                            disabled={!canRequest}
                            onClick={() => handleRequestItem(i)}
                            className={`px-3 py-1 rounded text-white font-semibold transition ${canRequest
                                ? "bg-blue-600 hover:bg-blue-700"
                                : "bg-gray-400 cursor-not-allowed"
                              }`}
                          >
                            {status === "Pending"
                              ? "Pending"
                              : status === "Received"
                              ? "Request "
                              : "Request"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            <div className="mt-4 text-right">
              <button
                onClick={() => setShowRequestModal(false)}
                className="px-4 py-2 rounded border hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COMPLAINT MODAL */}
      {showComplaintModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-md">
            <h3 className="text-lg font-bold mb-3">Submit Complaint</h3>
            <textarea
              rows={4}
              value={newComplaint}
              onChange={(e) => setNewComplaint(e.target.value)}
              className="w-full border p-2 rounded"
            />
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setShowComplaintModal(false)}
                className="px-4 py-2 rounded border hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitComplaint}
                disabled={loadingAuthority}
                className={`px-4 py-2 rounded text-white font-semibold ${
                  loadingAuthority ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loadingAuthority ? "Loading..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
