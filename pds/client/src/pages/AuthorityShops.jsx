import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import {
  Search,
  Eye,
  Users,
  X,
  Undo2,
  Package,
  Store,
  Calendar,
} from "lucide-react";

export default function AuthShopPage({ user, onLogout }) {
  const [shops, setShops] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedShop, setSelectedShop] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const today = new Date();
  const currentMonthKey = `${today.getFullYear()}-${today.getMonth() + 1}`;
  const [selectedMonth, setSelectedMonth] = useState(currentMonthKey);
  const isCurrentMonth = selectedMonth === currentMonthKey;
  const [items, setItems] = useState([]);
  const [inputQty, setInputQty] = useState({});
  const [undoStack, setUndoStack] = useState([]);
  const [history, setHistory] = useState([]);

  /* ---------------- FETCH SHOPS ---------------- */
  useEffect(() => {
    const fetchShops = async () => {
      const token = localStorage.getItem("token");
      if (!token) return setLoading(false);
      try {
        const res = await fetch("http://localhost:5000/api/auth/authShops/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const shopArray = Array.isArray(data) ? data : [];
        setShops(shopArray);
      } catch {
        setShops([]);
      } finally {
        setLoading(false);
      }
    };
    fetchShops();
  }, []);

  /* ---------------- FETCH USERS COUNT ---------------- */
  const fetchUsersCount = async (shopNo) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/auth/authUsers/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const usersArray = Array.isArray(data) ? data : data.users || [];
      const count = usersArray.filter((u) => u.shopNo === shopNo).length;
      setTotalUsers(count);
    } catch {
      setTotalUsers(0);
    }
  };

  /* ---------------- FETCH SHOP STOCK ---------------- */
  const fetchShopStock = async (shopNo, monthYear = selectedMonth) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const [year, monthIndex] = monthYear.split("-");
      const monthName = new Date(year, monthIndex - 1).toLocaleString("default", { month: "long" });

      const res = await fetch(
        `http://localhost:5000/api/shopStock/${shopNo}/${monthName}/${year}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (!data?.items) return setItems([]);

      const formatted = data.items.map((i) => ({
        itemId: i.stockId || i._id,
        name: i.itemName || i.name,
        allocated: i.allocatedQty || 0,
      }));
      setItems(formatted);
    } catch (err) {
      console.error("Stock fetch error", err);
      setItems([]);
    }
  };

  /* ---------------- FETCH SHOP HISTORY ---------------- */
  const fetchShopHistory = async (shopNo) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/shopTransaction/shop/${shopNo}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      const formatted = data.map((t) => ({
        month: new Date(t.transactionDate).toLocaleString("default", {
          month: "short",
          year: "numeric",
        }),
        items: t.items.map((i) => ({ name: i.itemName, qty: i.quantity })),
      }));
      setHistory(formatted);
    } catch (err) {
      console.error(err);
      setHistory([]);
    }
  };

  /* ---------------- OPEN SHOP ---------------- */
  const openShop = (shop) => {
    setSelectedShop(shop);
    fetchUsersCount(shop.shopNo);
    fetchShopStock(shop.shopNo, selectedMonth);
    fetchShopHistory(shop.shopNo);
  };

  /* ---------------- REFETCH STOCK ON MONTH CHANGE ---------------- */
  useEffect(() => {
    if (selectedShop) {
      fetchShopStock(selectedShop.shopNo, selectedMonth);
    }
  }, [selectedMonth]);

  /* ---------------- FILTERED SHOPS ---------------- */
  const filteredShops = shops.filter(
    (s) =>
      s.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.shopNo.includes(searchQuery)
  );

  /* ---------------- ALLOCATION ---------------- */
  const confirmAllocation = async (itemId) => {
    const qty = Number(inputQty[itemId]);
    if (!qty || qty <= 0) return;

    setUndoStack([...undoStack, items]);
    const updatedItems = items.map((i) =>
      i.itemId === itemId ? { ...i, allocated: i.allocated + qty } : i
    );
    setItems(updatedItems);
    setInputQty({ ...inputQty, [itemId]: "" });

    const item = items.find((i) => i.itemId === itemId);
    const payload = {
      shopNo: selectedShop.shopNo,
      month: new Date(
        selectedMonth.split("-")[0],
        selectedMonth.split("-")[1] - 1
      ).toLocaleString("default", { month: "long" }),
      year: parseInt(selectedMonth.split("-")[0]),
      items: [
        {
          stockId: item.itemId,
          itemName: item.name,
          quantity: qty,
        },
      ],
      allocatedBy: "authority",
    };

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/shopStock/allocate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        fetchShopStock(selectedShop.shopNo, selectedMonth);
        fetchShopHistory(selectedShop.shopNo);
      } else {
        console.error("Allocation failed:", data);
      }
    } catch (err) {
      console.error("Error saving allocation:", err);
    }
  };

  const undoAllocation = () => {
    if (undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    setItems(prev);
    setUndoStack(undoStack.slice(0, -1));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">Loading...</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={user?.name || "Authority"} role="authority" onLogout={onLogout} />

      <div className="p-6 w-full">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-400 rounded-xl p-6 mb-6 shadow-lg w-full">
          <div className="flex items-center space-x-3">
            <Store className="w-8 h-8 text-white" />
            <div>
              <h1 className="text-2xl font-bold text-white">Registered Shops</h1>
              <p className="text-white/90">Manage all shops and stock allocations in your district</p>
            </div>
          </div>
        </div>

        {/* SHOP LIST AND SEARCH */}
        <div className="bg-white p-4 rounded-xl shadow mb-6 w-full">
          <div className="relative max-w-xl mb-4">
            <Search className="absolute left-3 top-3 text-gray-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search shops..."
              className="pl-10 w-full border p-2 rounded-lg"
            />
          </div>

          <table className="w-full text-sm text-center border">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-4 text-left">Shop</th>
                <th className="p-4 text-left">District</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredShops.map((shop) => (
                <tr key={shop.shopNo} className="border-t hover:bg-gray-50">
                  <td className="p-4 text-left">
                    <p className="font-semibold">{shop.shopName}</p>
                    <p className="text-xs text-gray-500">{shop.shopNo}</p>
                  </td>
                  <td className="p-4 text-left">{shop.district}</td>
                  <td className="p-4">
                    <button onClick={() => openShop(shop)} className="text-blue-600 inline-flex items-center gap-1">
                      <Eye size={16} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {selectedShop && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-start z-50 pt-10">
          <div className="bg-white w-[900px] max-h-[90vh] overflow-y-auto rounded-xl shadow-xl p-6 relative">
            {/* CLOSE */}
            <button onClick={() => setSelectedShop(null)} className="absolute top-4 right-4 text-gray-600">
              <X />
            </button>

            {/* HEADER */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="col-span-2">
                <h2 className="text-xl font-bold">{selectedShop.shopName}</h2>
                <h2 className="text-xl font-bold">Shop No: {selectedShop.shopNo}</h2>
                <p className="text-sm text-gray-500">{selectedShop.address}</p>
                <p className="text-sm">📞 {selectedShop.phone}</p>
              </div>
              <div className="bg-gray-50 rounded p-4 text-center">
                <Users className="mx-auto mb-1" />
                <p className="text-sm">Total Users</p>
                <p className="text-xl font-bold">{totalUsers}</p>
              </div>
            </div>

            {/* MONTH SELECT */}
            <div className="flex justify-between items-center mb-4">
              <p className="font-medium">
                Allocation Period:{" "}
                <b>
                  {new Date(selectedMonth.split("-")[0], selectedMonth.split("-")[1] - 1).toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })}
                </b>
                {!isCurrentMonth && <span className="ml-2 text-red-500">(Read Only)</span>}
              </p>
              <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="border p-1 rounded">
                <option value={currentMonthKey}>Current Month</option>
                <option value="2025-2">Feb 2025</option>
                <option value="2025-3">Mar 2025</option>
              </select>
            </div>

            {/* ALLOCATION TABLE */}
            <div className="border rounded mb-4 overflow-hidden">
              <table className="w-full text-center text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3">Item</th>
                    <th className="p-3">Allocated</th>
                    <th className="p-3">Add Qty</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center py-4">No stock items found</td>
                    </tr>
                  )}
                  {items.map((item) => (
                    <tr key={item.itemId} className="border-t">
                      <td className="p-3 flex justify-center gap-2 items-center">
                        <Package size={16} /> {item.name}
                      </td>
                      <td className="p-3">{item.allocated} kg</td>
                      <td className="p-3">
                        <input
                          disabled={!isCurrentMonth}
                          value={inputQty[item.itemId] || ""}
                          onChange={(e) => setInputQty({ ...inputQty, [item.itemId]: e.target.value })}
                          className="border p-1 w-20 rounded text-center"
                        />
                      </td>
                      <td className="p-3">
                        <button
                          disabled={!isCurrentMonth}
                          onClick={() => confirmAllocation(item.itemId)}
                          className="bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50"
                        >
                          Confirm
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* UNDO */}
            <button onClick={undoAllocation} className="flex items-center gap-2 text-orange-600 mb-6">
              <Undo2 size={16} /> Undo Last Allocation
            </button>

            {/* HISTORY */}
            <div className="flex items-center gap-4 mb-4">
              <Calendar size={18} />
              <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="border p-2 rounded" />
              <span>to</span>
              <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="border p-2 rounded" />
            </div>

            <div>
              <h3 className="font-bold mb-2">Previous Allocations</h3>
              <table className="w-full text-sm border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2">Month</th>
                    <th className="p-2">Item</th>
                    <th className="p-2">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {history
                    .filter(
                      (h) =>
                        (!fromDate || new Date(h.month) >= new Date(fromDate)) &&
                        (!toDate || new Date(h.month) <= new Date(toDate))
                    )
                    .map((m) =>
                      m.items.map((i, idx) => (
                        <tr key={m.month + i.name}>
                          {idx === 0 && <td rowSpan={m.items.length} className="p-2 font-semibold border">{m.month}</td>}
                          <td className="p-2 border">{i.name}</td>
                          <td className="p-2 border">{i.qty} kg</td>
                        </tr>
                      ))
                    )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
