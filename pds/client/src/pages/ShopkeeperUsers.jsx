import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Users, Search, Eye, X, Check } from "lucide-react";
import axios from "axios";

export default function ShopkeeperUsers({ user, onLogout }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [modalUser, setModalUser] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [requests, setRequests] = useState([]);
  const [verifiedRequests, setVerifiedRequests] = useState([]); // Show after OTP
  const [entitlements, setEntitlements] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // Fetch all users for this shop
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const shopNo = user?.shopNo;
        if (!shopNo) return;

        const res = await axios.get(`http://localhost:5000/api/shopUsers/${shopNo}/all`);
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, [user]);

  // Fetch full citizen info (profile + family) when clicking "View"
  const fetchCitizenDetails = async (rationId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/citizen/shopkeeper/profile/${rationId}`);
      setModalUser(res.data);
      setFamilyMembers(res.data.familyMembers || []);

      const stockRes = await axios.get("http://localhost:5000/api/userStock/template");
      setEntitlements(stockRes.data);

      const requestsRes = await axios.get(`http://localhost:5000/api/userRequests/myRequests/${rationId}`);
      setRequests(requestsRes.data.map(r => ({ ...r, weight: null, verified: false })));
      setVerifiedRequests([]);

      const transactionsRes = await axios.get(`http://localhost:5000/api/transactions/user/${rationId}`);
      const flatTransactions = [];
      transactionsRes.data.forEach(t => {
        if (t.items && Array.isArray(t.items)) {
          t.items.forEach(item => {
            flatTransactions.push({
              ...t,
              itemName: item.itemName,
              quantity: item.quantity,
              transactionDate: t.transactionDate
            });
          });
        } else {
          flatTransactions.push(t);
        }
      });
      setTransactions(flatTransactions);

    } catch (err) {
      console.error("Failed to fetch user details:", err.response ? err.response.data : err.message);
      alert("Failed to fetch user details.");
    }
  };

  /* Handle accepting requests -> generate OTP via backend */
  const handleAcceptRequests = async () => {
    try {
      const res = await axios.post(`http://localhost:5000/api/shopUsers/generateOtp/${modalUser.rationId}`);
      setShowOtpInput(true);
      alert("OTP has been generated. Check server terminal."); // frontend info
    } catch (err) {
      console.error(err);
      alert("Failed to generate OTP.");
    }
  };

  /* Handle OTP submission -> verify via backend */
  const handleOtpSubmit = async () => {
    if (!otp) return alert("Enter OTP!");
    try {
      const res = await axios.post(`http://localhost:5000/api/shopUsers/verifyOtp/${modalUser.rationId}`, { otp });
      if (res.data.success) {
        setVerifiedRequests(requests); // show items
        setShowOtpInput(false);
        setOtp("");
        alert("OTP verified. Requested items are now visible.");
      } else {
        alert("Invalid OTP!");
      }
    } catch (err) {
      console.error(err);
      alert("OTP verification failed.");
    }
  };

 const fetchWeight = async (idx) => {
  try {
    const res = await fetch("http://localhost:5001/api/weight");
    const data = await res.json();

    if (data.message) {
      alert("Weight data abhi nahi aaya");
      return;
    }

    const updated = [...verifiedRequests];
    updated[idx].weight = data.weight; // ✅ store in item
    setVerifiedRequests(updated);

  } catch (err) {
    console.error("Error fetching weight", err);
    alert("Failed to fetch weight");
  }
};





  /* Verify a requested item */
  const verifyItem = (idx) => {
    const updated = [...verifiedRequests];
    updated[idx].verified = true;
    setVerifiedRequests(updated);
  };

  const allVerified = verifiedRequests.length > 0 && verifiedRequests.every(r => r.verified);

  /* Submit all verified items */
  const handleSubmitAll = async () => {
  if (!allVerified) return alert("Verify all items first!");

  try {
    const items = verifiedRequests.map(r => ({
      stockId: r.stockId || r._id,
      itemName: r.itemName,
      quantity: r.weight, // 🔥 actual measured weight
    }));

    // 1️⃣ Save transaction
    await axios.post("http://localhost:5000/api/transactions/create", {
      shopNo: user.shopNo,
      rationId: modalUser.rationId,
      items,
    });

    // 2️⃣ Update request status
    await axios.put(
      `http://localhost:5000/api/userRequests/mark-received/${modalUser.rationId}`
    );

    alert("Transaction completed successfully!");

    // RESET UI
    setModalUser(null);
    setRequests([]);
    setVerifiedRequests([]);
    setFamilyMembers([]);
    setOtp("");

  } catch (err) {
    console.error(err);
    alert("Failed to submit transaction");
  }
};


  /* Filter users based on search query */
  const filteredUsers = users.filter(
    (u) =>
      u.rationId.toLowerCase().includes(search.toLowerCase()) ||
      (u.fullName || "").toLowerCase().includes(search.toLowerCase())
  );

  /* Total family members excluding self */
  const totalMembers = (familyMembers?.length || 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={user?.name} role="shopkeeper" onLogout={onLogout} />

      <div className="px-6 py-8 max-w-full mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-7 h-7 text-green-600" />
            Users Management
          </h1>
          <p className="text-gray-600 mt-1">
            View and manage ration users, their request and distribution status.
          </p>
        </div>

        {/* Total Users */}
        <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 mb-6">
          <StatCard title="Total Users" value={users.length} />
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-lg shadow flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Name or Ration ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto w-full">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3">Ration ID</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.rationId} className="border-t">
                  <td className="p-3">{u.rationId}</td>
                  <td className="p-3">{u.phone}</td>
                  <td className="p-3">
                    <button
                      className="flex items-center gap-1 text-green-600 hover:underline"
                      onClick={() => fetchCitizenDetails(u.rationId)}
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* User Details Modal */}
        {modalUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20 z-50">
            <div className="bg-white rounded-lg shadow w-full max-w-4xl p-6 relative overflow-y-auto max-h-[90vh]">
              <button
                onClick={() => {
                  setModalUser(null);
                  setRequests([]);
                  setVerifiedRequests([]);
                  setOtp("");
                  setShowOtpInput(false);
                  setFamilyMembers([]);
                  setEntitlements([]);
                  setTransactions([]);
                }}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-bold mb-4">{modalUser.fullName || modalUser.rationId} Details</h2>

              {/* Citizen Info */}
              <div className="mb-4">
                <p><strong>Ration ID:</strong> {modalUser.rationId}</p>
                <p><strong>Phone:</strong> {modalUser.phone}</p>
                <p><strong>Age:</strong> {modalUser.age}</p>
                <p><strong>Gender:</strong> {modalUser.gender}</p>
                <p><strong>Email:</strong> {modalUser.email || "-"}</p>
                <p><strong>Address:</strong> {modalUser.address || "-"}</p>
                <p><strong>District:</strong> {modalUser.district || "-"}</p>
                <p><strong>State:</strong> {modalUser.state || "-"}</p>
                <p><strong>Assigned Shop:</strong> {modalUser.assignedShop || "-"}</p>
              </div>

              {/* Family Members */}
              <h3 className="font-semibold mb-2">Family Members</h3>
              {familyMembers.length > 0 ? (
                <table className="w-full text-left mb-4 border">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="p-2 border">Name</th>
                      <th className="p-2 border">Relation</th>
                      <th className="p-2 border">Age</th>
                      <th className="p-2 border">Gender</th>
                    </tr>
                  </thead>
                  <tbody>
                    {familyMembers.map((m, idx) => (
                      <tr key={idx}>
                        <td className="p-2 border">{m.memberName}</td>
                        <td className="p-2 border">{m.relation}</td>
                        <td className="p-2 border">{m.age}</td>
                        <td className="p-2 border">{m.gender}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="mb-4">No family members found.</p>
              )}

              {/* Monthly Entitlements */}
              <h3 className="font-semibold mb-2">Monthly Entitlements</h3>
              <table className="w-full text-left mb-4 border">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="p-2 border">Item</th>
                    <th className="p-2 border">Allocated Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {entitlements.length > 0 ? (
                    entitlements.map((e) => (
                      <tr key={e.itemName}>
                        <td className="p-2 border">{e.itemName}</td>
                        <td className="p-2 border">
                          {e.perMemberQty * totalMembers} {e.unit ?? ""}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="p-2 border text-center">No entitlements found</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* OTP Section */}
              {verifiedRequests.length === 0 && !showOtpInput && requests.length > 0 && (
                <button
                  onClick={handleAcceptRequests}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-4"
                >
                  Accept Request
                </button>
              )}

              {showOtpInput && (
                <div className="flex gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="border px-4 py-2 rounded w-1/2 focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    onClick={handleOtpSubmit}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Submit OTP
                  </button>
                </div>
              )}

              {/* Requested Items (only after OTP) */}
              {verifiedRequests.length > 0 && (
                <>
                  <h3 className="font-semibold mb-2">Requested Items</h3>
                  <table className="w-full text-left mb-4 border">
                    <thead className="bg-gray-100 text-gray-700">
                      <tr>
                        <th className="p-2 border">Item</th>
                        <th className="p-2 border">Requested Qty</th>
                        <th className="p-2 border">Fetch Weight</th>
                        <th className="p-2 border">Verify</th>
                      </tr>
                    </thead>
                    <tbody>
                      {verifiedRequests.map((r, idx) => (
                        <tr key={r._id}>
                          <td className="p-2 border">{r.itemName}</td>
                          <td className="p-2 border">{r.requestedQty}</td>
                          <td className="p-2 border text-center">
                            {r.weight ?? (
                              <button
                                onClick={() => fetchWeight(idx)}
                                className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                              >
                                Fetch
                              </button>
                            )}
                          </td>
                          <td className="p-2 border text-center">
                            {r.verified ? (
                              <Check className="w-5 h-5 text-green-600 mx-auto" />
                            ) : (
                              <button
                                onClick={() => verifyItem(idx)}
                                disabled={r.weight === null}
                                className={`px-2 py-1 rounded ${r.weight !== null ? "bg-green-600 text-white hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"}`}
                              >
                                Verify
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button
                    onClick={handleSubmitAll}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-4"
                  >
                    Submit All
                  </button>
                </>
              )}

              {/* Transaction History */}
              <h3 className="font-semibold mt-6 mb-2">Transaction History</h3>
              <table className="w-full text-left mb-4 border">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="p-2 border">Date</th>
                    <th className="p-2 border">Item</th>
                    <th className="p-2 border">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length > 0 ? (
                    transactions.map((t, idx) => (
                      <tr key={t._id ?? idx}>
                        <td className="p-2 border">{new Date(t.transactionDate ?? t.date).toLocaleDateString()}</td>
                        <td className="p-2 border">{t.itemName}</td>
                        <td className="p-2 border">{t.quantity}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="p-2 border text-center">No transactions found</td>
                    </tr>
                  )}
                </tbody>
              </table>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* Small Components */
function StatCard({ title, value }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const color =
    status === "Requested"
      ? "bg-yellow-100 text-yellow-800"
      : status === "Taken"
        ? "bg-green-100 text-green-800"
        : "bg-red-100 text-red-800";

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${color}`}>
      {status}
    </span>
  );
}
