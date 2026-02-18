import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Users, Search, Eye, Building2 } from "lucide-react";

export default function AuthorityUsers({ user, onLogout }) {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterShop, setFilterShop] = useState("all");
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // ================= FETCH USERS =================
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "http://localhost:5000/api/auth/authUsers/all",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        if (Array.isArray(data)) setUsers(data);
        else if (Array.isArray(data.users)) setUsers(data.users);
        else setUsers([]);
      } catch (err) {
        console.error("Error fetching users:", err);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // ================= FILTERING =================
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      (u.fullName || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (u.rationId || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesShop = filterShop === "all" || u.shopNo === filterShop;
    return matchesSearch && matchesShop;
  });

  const uniqueShops = Array.from(
    new Set(users.map((u) => u.shopNo).filter(Boolean))
  ).sort();

  // ================= VIEW DETAILS =================
  const handleViewDetails = async (user) => {
    try {
      setDetailsLoading(true);
      const token = localStorage.getItem("token");

      // Fetch allocated items from shopStock template
      const resStock = await fetch(
        `http://localhost:5000/api/userStock/template`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const stockTemplate = await resStock.json();
      const totalMembers = user.familyMembers?.length || 1;

      const allocatedItems = stockTemplate.map((item) => {
        const perMember = item.perMemberQty || 0;
        const perFamily = item.perFamilyQty || 0;
        const allocatedQty = perMember * totalMembers + perFamily;
        return {
          itemName: item.itemName || "Unknown",
          allocatedQty,
          unit: item.unit || "-",
        };
      });

      setSelectedUser({ ...user, allocatedItems });
      setShowDetails(true);

      // Fetch transactions for the user
      const resTransactions = await fetch(
        `http://localhost:5000/api/transactions/user/${user.rationId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const dataTransactions = await resTransactions.json();
      setTransactions(dataTransactions || []);
    } catch (err) {
      console.error(err);
      setSelectedUser({ ...user, allocatedItems: [] });
      setTransactions([]);
      setShowDetails(true);
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedUser(null);
    setTransactions([]);
    setFromDate("");
    setToDate("");
  };

  // ================= FILTER TRANSACTIONS BY DATE =================
  const filteredTransactions = transactions.filter((t) => {
    if (fromDate && new Date(t.transactionDate) < new Date(fromDate))
      return false;
    if (toDate && new Date(t.transactionDate) > new Date(toDate)) return false;
    return true;
  });

  // ================= SAFE FAMILY MEMBERS =================
  const family = selectedUser
    ? selectedUser.familyMembers && selectedUser.familyMembers.length > 0
      ? selectedUser.familyMembers
      : [
          {
            memberName: selectedUser.fullName || "-",
            relation: "Self",
            age: selectedUser.age || "-",
            gender: selectedUser.gender || "-",
          },
        ]
    : [];

  // ================= UI =================
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar
        userName={user?.name || "Authority"}
        role="authority"
        onLogout={onLogout}
      />

      <div className="w-full px-6 py-6">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-400 rounded-xl p-6 mb-6 shadow-lg w-full">
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8 text-white" />
            <div>
              <h1 className="text-2xl font-bold text-white">
                Registered Users
              </h1>
              <p className="text-white/90">
                Manage all ration card holders in your district
              </p>
            </div>
          </div>
        </div>

        {/* TOTAL USERS */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 border-l-4 border-purple-500 w-[320px]">
          <p className="text-sm text-gray-600">Total Users</p>
          <p className="text-3xl font-bold text-gray-900">{users.length}</p>
        </div>

        {/* FILTER PANEL */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* SEARCH */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Users
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Name or Ration ID..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* SHOP FILTER */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Shop
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={filterShop}
                  onChange={(e) => setFilterShop(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Shops</option>
                  {uniqueShops.map((shop) => (
                    <option key={shop} value={shop}>
                      {shop}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* USERS TABLE */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden w-full">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-blue-900 uppercase">
                    User Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-blue-900 uppercase">
                    Ration ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-blue-900 uppercase">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-blue-900 uppercase">
                    Assigned Shop
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-blue-900 uppercase">
                    Family Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-blue-900 uppercase">
                    View Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((u, index) => (
                  <tr key={index} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{u.fullName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-900">{u.rationId}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">+91 {u.phone}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{u.shopNo}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{u.familyMembers?.length || 1} members</td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleViewDetails(u)}
                        className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Details</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {loading && <div className="text-center py-6">Loading users...</div>}

          {!loading && filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No users found</p>
            </div>
          )}
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {showDetails && selectedUser && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white w-[900px] max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl relative p-8">
            <button
              onClick={closeDetails}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-xl font-bold"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-purple-700 mb-6">Citizen Detailed Profile</h2>

            {/* BASIC INFO */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p><b>Name:</b> {selectedUser.fullName}</p>
                <p><b>Ration ID:</b> {selectedUser.rationId}</p>
                <p><b>Phone:</b> +91 {selectedUser.phone}</p>
              </div>
              <div>
                <p><b>Shop No:</b> {selectedUser.shopNo}</p>
                <p><b>District:</b> {selectedUser.district}</p>
                <p><b>State:</b> {selectedUser.state}</p>
              </div>
            </div>

            {/* FAMILY MEMBERS */}
            <h3 className="text-lg font-semibold mb-2">Family Members</h3>
            <table className="w-full border mb-6">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Relation</th>
                  <th className="border p-2">Age</th>
                  <th className="border p-2">Gender</th>
                </tr>
              </thead>
              <tbody>
                {family.map((m, i) => (
                  <tr key={i}>
                    <td className="border p-2">{m.memberName}</td>
                    <td className="border p-2">{m.relation}</td>
                    <td className="border p-2">{m.age}</td>
                    <td className="border p-2">{m.gender}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* ALLOCATED ITEMS */}
            <h3 className="text-lg font-semibold mb-2">Allocated Items</h3>
            <table className="w-full border mb-6">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2">Item</th>
                  <th className="border p-2">Quantity</th>
                  <th className="border p-2">Unit</th>
                </tr>
              </thead>
              <tbody>
                {selectedUser.allocatedItems && selectedUser.allocatedItems.length > 0 ? (
                  selectedUser.allocatedItems.map((item, idx) => (
                    <tr key={idx}>
                      <td className="border p-2">{item.itemName}</td>
                      <td className="border p-2">{item.allocatedQty}</td>
                      <td className="border p-2">{item.unit}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="border p-4 text-center text-gray-500">
                      No allocation template configured
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* TRANSACTIONS */}
            <h3 className="text-lg font-semibold mb-3">Transaction History</h3>
            <div className="flex gap-4 mb-4">
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

            <table className="w-full border rounded-xl overflow-hidden shadow">
              <thead className="bg-gradient-to-r from-purple-600 to-purple-500 text-white">
                <tr>
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Items Received</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((t, i) => {
                    const receivedItems = t.items || [];
                    return (
                      <tr key={i} className="border-t hover:bg-purple-50 transition">
                        <td className="p-4 font-semibold text-gray-800">
                          {new Date(t.transactionDate).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="p-4">
                          {receivedItems.length > 0 ? (
                            receivedItems.map((r, idx) => (
                              <div key={idx} className="flex justify-between bg-green-100 text-green-800 px-3 py-1 rounded-lg">
                                <span>{r.itemName}</span>
                                <span className="font-medium">{r.quantity} {r.unit || ""}</span>
                              </div>
                            ))
                          ) : (
                            <div className="text-gray-500">No items received</div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="2" className="text-center p-6 text-gray-500">
                      No transactions in selected date range
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
