import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Search, Calendar } from "lucide-react";

export default function AuthorityAudit({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("shop");

  const [shops, setShops] = useState([]);
  const [users, setUsers] = useState([]);

  const [selectedShop, setSelectedShop] = useState("");
  const [selectedUser, setSelectedUser] = useState("");

  const [searchUser, setSearchUser] = useState("");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [shopTransactions, setShopTransactions] = useState([]);
  const [userTransactions, setUserTransactions] = useState([]);

  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // ================= FETCH SHOPS =================
  useEffect(() => {
    const fetchShops = async () => {
      try {
        const res = await fetch(
          "https://public-distribution-system-using.onrender.com/api/auth/authShops/all",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setShops(Array.isArray(data) ? data : []);
      } catch {
        setShops([]);
      }
    };
    fetchShops();
  }, [token]);

  // ================= FETCH USERS =================
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(
          "https://public-distribution-system-using.onrender.com/api/auth/authUsers/all",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : data.users || []);
      } catch {
        setUsers([]);
      }
    };
    fetchUsers();
  }, [token]);

  // ================= FETCH SHOP TRANSACTIONS =================
  const fetchShopTransactions = async (shopNo) => {
    if (!shopNo) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://public-distribution-system-using.onrender.com/api/shopStock/transactions/${shopNo}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setShopTransactions(Array.isArray(data) ? data : []);
    } catch {
      setShopTransactions([]);
    }
    setLoading(false);
  };

  // ================= FETCH USER TRANSACTIONS =================
  const fetchUserTransactions = async (rationId) => {
    if (!rationId) return;
    setSelectedUser(rationId);
    setLoading(true);

    try {
      const res = await fetch(
        `https://public-distribution-system-using.onrender.com/api/transactions/blockchain/${rationId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setUserTransactions(Array.isArray(data) ? data : []);
    } catch {
      setUserTransactions([]);
    }

    setLoading(false);
  };

  // ================= DATE FILTER =================
  const filterByDate = (transactions) => {
    return transactions.filter((t) => {
      if (!fromDate && !toDate) return true;

      const txDate = new Date(t.transactionDate);
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;

      if (from && txDate < from) return false;
      if (to && txDate > to) return false;

      return true;
    });
  };

  const filteredShopTransactions = filterByDate(shopTransactions);
  const filteredUserTransactions = filterByDate(userTransactions);

  const filteredUsers = users.filter(
    (u) =>
      (u.fullName || "").toLowerCase().includes(searchUser.toLowerCase()) ||
      (u.rationId || "").toLowerCase().includes(searchUser.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        userName={user?.name || "Authority"}
        role="authority"
        onLogout={onLogout}
      />

      {/* TAB SWITCH */}
      <div className="flex justify-center gap-4 mt-6 mb-6">
        <button
          onClick={() => setActiveTab("shop")}
          className={`px-4 py-2 rounded ${
            activeTab === "shop"
              ? "bg-purple-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Shop Transactions
        </button>
        <button
          onClick={() => setActiveTab("user")}
          className={`px-4 py-2 rounded ${
            activeTab === "user"
              ? "bg-purple-600 text-white"
              : "bg-gray-200"
          }`}
        >
          User Transactions
        </button>
      </div>

      {/* ================= SHOP TAB ================= */}
      {activeTab === "shop" && (
        <div className="px-6">
          <div className="flex gap-4 mb-4 items-center">
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
                  {s.shopNo}
                </option>
              ))}
            </select>

            <Calendar size={18} />

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

          {loading ? (
            <p>Loading...</p>
          ) : (
            <TransactionTable transactions={filteredShopTransactions} />
          )}
        </div>
      )}

      {/* ================= USER TAB ================= */}
      {activeTab === "user" && (
        <div className="px-6">
          <div className="flex gap-4 mb-4 items-center">
            <Search size={18} />
            <input
              placeholder="Search user..."
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              className="border p-2 rounded w-1/3"
            />
          </div>

          <div className="flex gap-4 mb-4">
            <select
              value={selectedUser}
              onChange={(e) => fetchUserTransactions(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">Select User</option>
              {filteredUsers.map((u) => (
                <option key={u.rationId} value={u.rationId}>
                  {u.fullName} ({u.rationId})
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <TransactionTable transactions={filteredUserTransactions} />
          )}
        </div>
      )}
    </div>
  );
}

/* ================= COMMON TABLE COMPONENT ================= */
function TransactionTable({ transactions }) {
  return (
    <table className="w-full text-sm border">
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
        {transactions.length === 0 ? (
          <tr>
            <td colSpan="5" className="text-center p-4">
              No transactions found
            </td>
          </tr>
        ) : (
          transactions.map((t, idx) => (
            <tr key={idx} className="border-t">
              <td className="p-2">
                {new Date(t.transactionDate).toLocaleDateString()}
              </td>
              <td className="p-2">
                {t.items.map((i, iidx) => (
                  <div key={iidx}>
                    {i.itemName} - {i.quantity}
                  </div>
                ))}
              </td>
              <td className="p-2 text-xs break-words font-mono">
                {t.blockchainHash}
              </td>
              <td className="p-2 text-xs break-words font-mono">
                {t.currentHash}
              </td>
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
  );
}
