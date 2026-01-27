import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Users, Search, Eye, X, Check } from "lucide-react";

// Dummy users data
const USERS = [
  { rationId: "RAT123456", name: "Rajesh Kumar", phone: "9876543210", status: "Requested" },
  { rationId: "RAT123457", name: "Priya Sharma", phone: "9123456780", status: "Taken" },
  { rationId: "RAT123458", name: "Amit Patel", phone: "9988776655", status: "Not Taken" },
  { rationId: "RAT123459", name: "Sunita Devi", phone: "9090909090", status: "Requested" },
];

// Dummy entitlements
const DUMMY_ENTITLEMENTS = [
  { itemName: "Wheat", allocatedQty: 20, unit: "kg" },
  { itemName: "Rice", allocatedQty: 15, unit: "kg" },
];

// Dummy requested items
const DUMMY_REQUESTS = [
  { itemName: "Wheat", requestedQty: 10, status: "Pending", weight: null, verified: false },
  { itemName: "Rice", requestedQty: 15, status: "Pending", weight: null, verified: false },
];

// Dummy transactions
const DUMMY_TRANSACTIONS = [
  { date: "2026-01-05", itemName: "Wheat", quantity: 5 },
  { date: "2026-01-15", itemName: "Rice", quantity: 10 },
];

export default function ShopkeeperUsers({ user, onLogout }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [modalUser, setModalUser] = useState(null);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [requests, setRequests] = useState([]);

  const filteredUsers = USERS.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.rationId.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || u.status === filter;
    return matchSearch && matchFilter;
  });

  const handleAcceptRequests = () => {
    setShowOtpInput(true);
  };

  const handleOtpSubmit = () => {
    if (!otp) {
      alert("Enter OTP first!");
      return;
    }
    // Load requested items without weight yet
    const loadedRequests = DUMMY_REQUESTS.map((r) => ({ ...r, weight: null }));
    setRequests(loadedRequests);
    setShowOtpInput(false);
  };

  // Fetch weight on button click
  const fetchWeight = (idx) => {
    const updated = [...requests];
    updated[idx].weight = Math.min(updated[idx].requestedQty, Math.floor(Math.random() * updated[idx].requestedQty) + 1);
    setRequests(updated);
  };

  const verifyItem = (idx) => {
    const updated = [...requests];
    updated[idx].verified = true;
    setRequests(updated);
  };

  const allVerified = requests.length > 0 && requests.every((r) => r.verified);

  const handleSubmitAll = () => {
    if (!allVerified) {
      alert("Verify all items first!");
      return;
    }
    alert(`All requests for ${modalUser.name} submitted successfully!`);
    setModalUser(null);
    setOtp("");
    setRequests([]);
  };

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

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <StatCard title="Total Users" value={USERS.length} />
          <StatCard title="Requested" value={USERS.filter(u => u.status === "Requested").length} />
          <StatCard title="Stock Taken" value={USERS.filter(u => u.status === "Taken").length} />
          <StatCard title="Not Taken" value={USERS.filter(u => u.status === "Not Taken").length} />
        </div>

        {/* Search & Filter */}
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

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500"
          >
            <option value="All">All</option>
            <option value="Requested">Requested</option>
            <option value="Taken">Taken</option>
            <option value="Not Taken">Not Taken</option>
          </select>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto w-full">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3">Ration ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Details</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.rationId} className="border-t">
                  <td className="p-3">{u.rationId}</td>
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.phone}</td>
                  <td className="p-3">
                    <button
                      className="flex items-center gap-1 text-green-600 hover:underline"
                      onClick={() => setModalUser(u)}
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  </td>
                  <td className="p-3">
                    <StatusBadge status={u.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {modalUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20 z-50">
            <div className="bg-white rounded-lg shadow w-full max-w-4xl p-6 relative overflow-y-auto max-h-[90vh]">
              <button
                onClick={() => { setModalUser(null); setRequests([]); setOtp(""); setShowOtpInput(false); }}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-bold mb-4">{modalUser.name} Details</h2>

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
                  {DUMMY_ENTITLEMENTS.map((e) => (
                    <tr key={e.itemName}>
                      <td className="p-2 border">{e.itemName}</td>
                      <td className="p-2 border">{e.allocatedQty} {e.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* OTP Section */}
              {requests.length === 0 && !showOtpInput && (
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

              {/* Requested Items Table */}
              {requests.length > 0 && (
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
                      {requests.map((r, idx) => (
                        <tr key={r.itemName}>
                          <td className="p-2 border">{r.itemName}</td>
                          <td className="p-2 border">{r.requestedQty}</td>
                          <td className="p-2 border text-center">
                            {r.weight !== null ? (
                              r.weight
                            ) : (
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

                  {/* Submit All */}
                  <button
                    onClick={handleSubmitAll}
                    disabled={!allVerified}
                    className={`px-4 py-2 rounded text-white ${allVerified ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"}`}
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
                  {DUMMY_TRANSACTIONS.map((t, idx) => (
                    <tr key={idx}>
                      <td className="p-2 border">{t.date}</td>
                      <td className="p-2 border">{t.itemName}</td>
                      <td className="p-2 border">{t.quantity}</td>
                    </tr>
                  ))}
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
