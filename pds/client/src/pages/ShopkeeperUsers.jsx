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
  const [verifiedRequests, setVerifiedRequests] = useState([]);
  const [entitlements, setEntitlements] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [shopStock, setShopStock] = useState([]);

  // Fetch all users for this shop
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const shopNo = user?.shopNo;
        if (!shopNo) return;

        const res = await axios.get(
          `http://localhost:5000/api/shopUsers/${shopNo}/all`
        );
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, [user]);

  // Fetch full citizen info
  const fetchCitizenDetails = async (rationId) => {
    try {
      setShowModal(true);

      const res = await axios.get(
        `http://localhost:5000/api/citizen/shopkeeper/profile/${rationId}`
      );
      setModalUser(res.data);
      setFamilyMembers(res.data.familyMembers || []);

      const userstockRes = await axios.get(
        "http://localhost:5000/api/userStock/template"
      );
      setEntitlements(userstockRes.data);

      const requestsRes = await axios.get(
        `http://localhost:5000/api/userRequests/myRequests/${rationId}`
      );

      setRequests(
        requestsRes.data.map((r) => ({
          ...r,
          fetchedWeight: undefined,
          verified: false,
        }))
      );

      setVerifiedRequests([]); // reset verified requests
      const stockRes = await axios.get(
        `http://localhost:5000/api/shopStock/${user.shopNo}/${new Date().toLocaleString(
          "default",
          { month: "long" }
        )}/${new Date().getFullYear()}`
      );
      setShopStock(stockRes.data.items);

      const transactionsRes = await axios.get(
        `http://localhost:5000/api/transactions/user/${rationId}`
      );
      const flatTransactions = [];
      transactionsRes.data.forEach((t) => {
        if (t.items && Array.isArray(t.items)) {
          t.items.forEach((item) => {
            flatTransactions.push({
              ...t,
              itemName: item.itemName,
              quantity: item.quantity,
              transactionDate: t.transactionDate,
            });
          });
        } else {
          flatTransactions.push(t);
        }
      });
      setTransactions(flatTransactions);
    } catch (err) {
      console.error(
        "Failed to fetch user details:",
        err.response ? err.response.data : err.message
      );
      alert("Failed to fetch user details.");
    }
  };

  // Accept request -> generate OTP
  const handleAcceptRequests = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/shopUsers/generateOtp/${modalUser.rationId}`
      );
      setShowOtpInput(true);
      alert("OTP has been generated. Check server terminal.");
    } catch (err) {
      console.error(err);
      alert("Failed to generate OTP.");
    }
  };

  // OTP verification
  const handleOtpSubmit = async () => {
    if (!otp) return alert("Enter OTP!");
    try {
      const res = await axios.post(
        `http://localhost:5000/api/shopUsers/verifyOtp/${modalUser.rationId}`,
        { otp }
      );
      if (res.data.success) {
        setVerifiedRequests(requests); // show all requests after OTP
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
  //Fetch weight
  const fetchWeight = async (id) => {
    try {
      const res = await fetch("http://10.123.81.162:5001/api/weight");

      if (!res.ok) {
        alert("Failed to connect to weight device.");
        return;
      }

      const data = await res.json();
      console.log("Weight API Response:", data);

      const weightValue = data.weight ?? data.currentWeight ?? null;

      if (!weightValue || weightValue <= 0) {
        alert("Weight not ready yet.");
        return;
      }

      // ✅ Store internally but DO NOT display
      setVerifiedRequests((prev) =>
        prev.map((r) =>
          r._id === id
            ? { ...r, machineWeight: Number(weightValue) }
            : r
        )
      );

      alert(`Fetched Weight: ${weightValue} g`);

    } catch (err) {
      console.error(err);
      alert("Failed to fetch weight from Raspberry Pi.");
    }
  };





  const verifyItem = (id) => {
    const item = verifiedRequests.find((r) => r._id === id);
    if (!item) return;

    const stockItem = shopStock.find(
      (s) =>
        s.stockId === item.stockId ||
        s.itemName.toLowerCase() === (item.itemName || "").toLowerCase()
    );

    const qtyToVerify = item.requestedQty; // ✅ Always requestedQty

    if (!stockItem || stockItem.availableQty < qtyToVerify) {
      return alert(
        `Not enough stock. Available: ${stockItem ? stockItem.availableQty : 0}`
      );
    }

    // ✅ Mark item as verified
    setVerifiedRequests((prev) =>
      prev.map((r) =>
        r._id === id ? { ...r, verified: true } : r
      )
    );

    // ✅ Subtract stock based on requestedQty only
    setShopStock((prev) =>
      prev.map((s) =>
        s.stockId === stockItem.stockId
          ? { ...s, availableQty: s.availableQty - qtyToVerify }
          : s
      )
    );
  };




  const anyVerified = verifiedRequests.some(
    (r) => r.status === "Pending" && r.verified
  );

  const pendingRequests = verifiedRequests.filter((r) => r.status === "Pending");

  const handleSubmitAll = async () => {
    const verifiedItems = verifiedRequests.filter(
      (r) => r.status === "Pending" && r.verified
    );
    if (verifiedItems.length === 0)
      return alert("Verify at least one item first!");

    try {
      const month = new Date().toLocaleString("default", { month: "long" });
      const year = new Date().getFullYear();

      const successfulItems = [];

      for (const r of verifiedItems) {
        const stockItem = shopStock.find(
          (s) =>
            s.stockId === r.stockId ||
            s.itemName.toLowerCase() === (r.itemName || "").toLowerCase()
        );

        const qtyToSubmit = r.requestedQty; // Always requestedQty

        if (!stockItem || stockItem.availableQty < qtyToSubmit) {
          alert(
            `Cannot submit ${r.itemName}. Not enough stock available: ${stockItem?.availableQty ?? 0}`
          );
          continue;
        }

        // Reduce stock in backend
        await axios.put(
          `http://localhost:5000/api/shopStock/reduceStock/${user.shopNo}/${month}/${year}`,
          { stockId: stockItem.stockId, quantity: qtyToSubmit }
        );

        successfulItems.push({
          stockId: stockItem.stockId,
          itemName: r.itemName,
          quantity: qtyToSubmit,
        });
      }

      if (successfulItems.length === 0) {
        return alert("No items could be submitted due to insufficient stock.");
      }

      // Create transaction
      await axios.post("http://localhost:5000/api/transactions/create", {
        shopNo: user.shopNo,
        rationId: modalUser.rationId,
        items: successfulItems,
      });

      const successfulItemNames = successfulItems.map((i) => i.itemName);
      await axios.put(
        `http://localhost:5000/api/userRequests/mark-received/${modalUser.rationId}`,
        { items: successfulItemNames }
      );

      alert("Transaction completed successfully!");
      await fetchCitizenDetails(modalUser.rationId);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to submit transaction");
    }
  };


  const filteredUsers = users.filter(
    (u) =>
      u.rationId.toLowerCase().includes(search.toLowerCase()) ||
      (u.fullName || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalMembers = familyMembers?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={user?.name} role="shopkeeper" onLogout={onLogout} />

      <div className="px-6 py-8 max-w-full mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-7 h-7 text-green-600" />
            Users Management
          </h1>
          <p className="text-gray-600 mt-1">
            View and manage ration users, their request and distribution status.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 mb-6">
          <StatCard title="Total Users" value={users.length} />
        </div>

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

        {/* User Modal */}
        {showModal && modalUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20 z-50">
            <div className="bg-white rounded-lg shadow w-full max-w-4xl p-6 relative overflow-y-auto max-h-[90vh]">
              <button
                onClick={() => {
                  setShowModal(false);
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

              <h2 className="text-xl font-bold mb-4">
                {modalUser.fullName || modalUser.rationId} Details
              </h2>

              {/* Citizen Info */}
              <div className="mb-4">
                <p>
                  <strong>Ration ID:</strong> {modalUser.rationId}
                </p>
                <p>
                  <strong>Phone:</strong> {modalUser.phone}
                </p>
                <p>
                  <strong>Age:</strong> {modalUser.age}
                </p>
                <p>
                  <strong>Gender:</strong> {modalUser.gender}
                </p>
                <p>
                  <strong>Email:</strong> {modalUser.email || "-"}
                </p>
                <p>
                  <strong>Address:</strong> {modalUser.address || "-"}
                </p>
                <p>
                  <strong>District:</strong> {modalUser.district || "-"}
                </p>
                <p>
                  <strong>State:</strong> {modalUser.state || "-"}
                </p>
                <p>
                  <strong>Assigned Shop:</strong> {modalUser.assignedShop || "-"}
                </p>
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

              {/* Entitlements */}
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
                      <td colSpan={2} className="p-2 border text-center">
                        No entitlements found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* OTP Section */}
              {verifiedRequests.length === 0 &&
                !showOtpInput &&
                requests.length > 0 && (
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

              {/* Requested Items (Only Pending) */}
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
                      {verifiedRequests
                        .filter((r) => r.status === "Pending")
                        .map((r, idx) => {
                          const stockItem = shopStock.find(
                            (s) =>
                              s.stockId === r.stockId ||
                              s.itemName.toLowerCase() ===
                              (r.itemName || "").toLowerCase()
                          );

                          const available = stockItem
                            ? stockItem.availableQty
                            : 0;

                          // Fetch must happen first
                          const hasFetched = r.machineWeight !== undefined && r.machineWeight !== null;

                          // Quantity to verify
                          const qtyToVerify = r.machineWeight ?? r.requestedQty; // fallback to requestedQty
                          const canVerify = r.requestedQty > 0 && available >= r.requestedQty;





                          return (
                            <tr key={`${r._id}-${idx}`}>
                              {/* Item */}
                              <td className="p-2 border">{r.itemName}</td>

                              {/* Requested Qty (UNCHANGED) */}
                              <td className="p-2 border">
                                {r.requestedQty}
                              </td>

                              {/* Fetch Weight Column */}
                              <td className="p-2 border text-center">
                                {r.machineWeight !== undefined && r.machineWeight !== null ? (
                                  <span className="text-black font-medium">
                                    {r.requestedQty}g
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => fetchWeight(r._id)}
                                    disabled={available === 0}
                                    className={`px-2 py-1 rounded ${available === 0
                                      ? "bg-gray-400 cursor-not-allowed"
                                      : "bg-blue-600 text-white hover:bg-blue-700"
                                      }`}
                                  >
                                    {available === 0 ? "No Stock" : "Fetch"}
                                  </button>
                                )}
                              </td>


                              {/* Verify */}
                              <td className="p-2 border text-center">
                                {r.verified ? (
                                  <Check className="w-5 h-5 text-green-600 mx-auto" />
                                ) : (
                                  <button
                                    onClick={() => verifyItem(r._id)}
                                    disabled={!canVerify}
                                    className={`px-3 py-1 rounded ${!canVerify
                                      ? "bg-gray-400 text-white cursor-not-allowed opacity-70"
                                      : "bg-green-600 text-white hover:bg-green-700"
                                      }`}
                                  >
                                    Verify
                                  </button>


                                )}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>

                  </table>

                  <button
                    onClick={handleSubmitAll}
                    disabled={!anyVerified || pendingRequests.length === 0}
                    className={`px-4 py-2 rounded mb-4 ${!anyVerified || pendingRequests.length === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                      }`}
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
                      <tr key={`${t._id}-${idx}`}>
                        <td className="p-2 border">
                          {new Date(
                            t.transactionDate ?? t.date
                          ).toLocaleDateString()}
                        </td>
                        <td className="p-2 border">{t.itemName}</td>
                        <td className="p-2 border">{t.quantity}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="p-2 border text-center">
                        No transactions found
                      </td>
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
