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

  // REQUEST FEATURE STATES
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestStock, setRequestStock] = useState([]);
  const [loadingRequestStock, setLoadingRequestStock] = useState(true);
  const [requestedItems, setRequestedItems] = useState({}); // { itemName: status }
  const [entitlement, setEntitlement] = useState([]); // calculated allocated qty
  const [loadingEntitlement, setLoadingEntitlement] = useState(true);

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
        console.error(err);
      }
    }
    if (user?.rationId) fetchFamily();
  }, [user]);

  /* ---------------- FETCH SHOP DETAILS ---------------- */
  useEffect(() => {
    async function fetchShopDetails() {
      try {
        if (!user?.assignedShop) return;

        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://localhost:5000/api/shopkeeper/shop/${user.assignedShop}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const shop = await res.json();
        setAuthorityId(shop.authorityId);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingAuthority(false);
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
        console.error(err);
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
        console.error(err);
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
          authorityId,
        }),
      });

      const saved = await res.json();
      setComplaints([saved, ...complaints]);
      setNewComplaint("");
      setShowComplaintModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to submit complaint");
    }
  };

  /* ---------------- FETCH ENTITLEMENT FOR REQUEST ---------------- */
  useEffect(() => {
    async function fetchEntitlement() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/api/userStock/template`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch stock template");
        const data = await res.json();

        const totalMembers = family.length || 1;

        const calculated = data.map((item) => {
          let qty = 0;
          if (item.perMemberQty != null) {
            qty = item.perMemberQty * totalMembers;
          }
          return {
            itemName: item.itemName,
            allocatedQty: qty,
            unit: item.unit || "",
          };
        });

        setEntitlement(calculated);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingEntitlement(false);
      }
    }

    if (family.length) fetchEntitlement();
  }, [family]);
  // Fetch already requested items when dashboard loads
  useEffect(() => {
    async function fetchRequestedItems() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://localhost:5000/api/user-request/myRequests/${user.rationId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();

        // Map into { itemName: status } format
        const map = {};
        data.forEach((r) => {
          map[r.itemName] = r.status;
        });
        setRequestedItems(map);
      } catch (err) {
        console.error("Failed to fetch requested items", err);
      }
    }

    if (user?.rationId) fetchRequestedItems();
  }, [user]);

  /* ---------------- HANDLE ITEM REQUEST ---------------- */
  const handleRequestItem = async (item) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/user-request/create", {
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

      setRequestedItems((prev) => ({ ...prev, [item.itemName]: "Pending" }));
    } catch (err) {
      console.error(err);
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
            className={`px-4 py-2 rounded font-semibold transition ${Object.keys(requestedItems).length > 0
              ? "bg-blue-300 text-white hover:bg-blue-400" // color change if some requests exist
              : "bg-white text-blue-700 hover:bg-blue-50" // normal color
              }`}
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
                {shopStock
                  .filter((i) => Number(i.availableQty) > 0)
                  .map((i) => (
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
                      {c.createdAt
                        ? new Date(c.createdAt).toLocaleDateString("en-IN")
                        : "—"}
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
                  {entitlement.map((i) => (
                    <tr key={i.itemName}>
                      <td className="border p-2">{i.itemName}</td>
                      <td className="border p-2">{i.allocatedQty} {i.unit}</td>
                      <td className="border p-2">{requestedItems[i.itemName] || "-"}</td>
                      <td className="border p-2">
                        <button
                          disabled={!!requestedItems[i.itemName]}
                          onClick={() => handleRequestItem(i)}
                          className={`px-3 py-1 rounded text-white font-semibold transition ${requestedItems[i.itemName]
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        >
                          {requestedItems[i.itemName] ? "Requested" : "Request"}
                        </button>
                      </td>
                    </tr>
                  ))}
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
                className={`px-4 py-2 rounded text-white font-semibold ${loadingAuthority ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
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
