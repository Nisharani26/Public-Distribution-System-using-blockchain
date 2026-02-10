import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Users, Store, Eye, Search, Calendar } from "lucide-react";

export default function AuthorityAudit({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("shop"); // "shop" or "user"
  const [shops, setShops] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedShop, setSelectedShop] = useState("");
  const [searchShop, setSearchShop] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [shopTransactions, setShopTransactions] = useState([]);
  const [userTransactions, setUserTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // ---------------- FETCH SHOPS ----------------
  useEffect(() => {
    const fetchShops = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/authShops/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setShops(Array.isArray(data) ? data : []);
      } catch {
        setShops([]);
      }
    };
    fetchShops();
  }, []);

  // ---------------- FETCH USERS ----------------
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/authUsers/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (Array.isArray(data)) setUsers(data);
        else if (Array.isArray(data.users)) setUsers(data.users);
        else setUsers([]);
      } catch {
        setUsers([]);
      }
    };
    fetchUsers();
  }, []);

  // ---------------- FETCH SHOP TRANSACTIONS WITH HASH ----------------
  const fetchShopTransactions = async (shopNo) => {
    if (!shopNo) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/shopTransaction/transactions/${shopNo}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();

      // Format transactions for table
      const formatted = data.map(t => ({
        transactionDate: t.transactionDate,
        items: t.items,
        blockchainHash: t.blockchainHash,
        currentHash: t.currentHash,
        tampered: t.tampered,
      }));

      setShopTransactions(formatted);
    } catch {
      setShopTransactions([]);
    }
  };

  // ---------------- FETCH USER TRANSACTIONS ----------------
  const fetchUserTransactions = async (userId) => {
    if (!userId) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/transactions/user/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setUserTransactions(Array.isArray(data) ? data : []);
    } catch {
      setUserTransactions([]);
    }
  };

  // ---------------- FILTERED SHOPS/USERS ----------------
  const filteredShops = shops.filter((s) =>
    s.shopNo.toLowerCase().includes(searchShop.toLowerCase())
  );

  const filteredUsers = users.filter((u) =>
    (u.fullName || "").toLowerCase().includes(searchUser.toLowerCase()) ||
    (u.rationId || "").toLowerCase().includes(searchUser.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={user?.name || "Authority"} role="authority" onLogout={onLogout} />

      {/* ---------------- TAB SWITCH ---------------- */}
      <div className="flex justify-center gap-4 mt-6 mb-4">
        <button
          className={`px-4 py-2 rounded ${activeTab === "shop" ? "bg-purple-600 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("shop")}
        >
          Shop Transactions
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === "user" ? "bg-purple-600 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("user")}
        >
          User Transactions
        </button>
      </div>

      {/* ---------------- SHOP TRANSACTIONS ---------------- */}
      {activeTab === "shop" && (
        <div className="px-6">
          <div className="mb-4 flex gap-4 items-center">
            <select
              value={selectedShop}
              onChange={(e) => {
                setSelectedShop(e.target.value);
                fetchShopTransactions(e.target.value);
              }}
              className="border p-2 rounded"
            >
              <option value="">Select Shop</option>
              {shops.map((s) => (
                <option key={s.shopNo} value={s.shopNo}>
                  {s.shopNo} {/* Showing only shop ID */}
                </option>
              ))}
            </select>

            <Calendar />
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="border p-2 rounded"
            />
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="border p-2 rounded"
            />
          </div>

          <table className="w-full text-sm border rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Date</th>
                <th className="p-2">Items</th>
                <th className="p-2">Blockchain Hash</th>
                <th className="p-2">Current Hash</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {shopTransactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-4">No transactions</td>
                </tr>
              ) : (
                shopTransactions.map((t, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="p-2">{new Date(t.transactionDate).toLocaleDateString()}</td>
                    <td className="p-2">
                      {t.items.map((i, iidx) => (
                        <div key={iidx} className="flex justify-between">
                          <span>{i.itemName}</span>
                          <span>{i.quantity}</span>
                        </div>
                      ))}
                    </td>
                    <td className="p-2 font-mono text-xs break-words">{t.blockchainHash}</td>
                    <td className="p-2 font-mono text-xs break-words">{t.currentHash}</td>
                    <td className="p-2">
                      {t.tampered ? (
                        <span className="text-red-600 font-bold">Tampered</span>
                      ) : (
                        <span className="text-green-600 font-bold">Valid</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ---------------- USER TRANSACTIONS ---------------- */}
      {activeTab === "user" && (
        <div className="px-6">
          <div className="mb-4 flex gap-4">
            <Search />
            <input
              placeholder="Search user..."
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              className="border p-2 rounded w-1/3"
            />
          </div>

          <table className="w-full text-sm border rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">User</th>
                <th className="p-2">Ration ID</th>
                <th className="p-2">Shop No</th>
                <th className="p-2">Transactions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center p-4">No users found</td>
                </tr>
              ) : (
                filteredUsers.map((u, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="p-2">{u.fullName}</td>
                    <td className="p-2">{u.rationId}</td>
                    <td className="p-2">{u.shopNo}</td>
                    <td className="p-2">
                      <button
                        className="text-blue-600"
                        onClick={() => fetchUserTransactions(u.rationId)}
                      >
                        View
                      </button>
                      {userTransactions.length > 0 &&
                        userTransactions.map((ut, iidx) => (
                          <div key={iidx} className="flex justify-between text-sm">
                            <span>{new Date(ut.transactionDate).toLocaleDateString()}</span>
                            <span>{ut.items.map(it => `${it.itemName}: ${it.quantity}`).join(", ")}</span>
                          </div>
                        ))}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
