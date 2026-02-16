import React, { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
import { Eye, Clock, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { toast } from 'sonner';

export default function AuthorityRequests({ user, onLogout }) {
  const [complaints, setComplaints] = useState([]);
  const [shops, setShops] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterShop, setFilterShop] = useState('all');
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  /* ---------------- FETCH SHOPS & COMPLAINTS ---------------- */
 useEffect(() => {
  const authorityId = user?.authorityId || localStorage.getItem("authorityId");
  const token = localStorage.getItem("token");

  if (!authorityId || !token) return;

  const fetchData = async () => {
    try {
      // Fetch shops
      const shopsRes = await fetch(`https://public-distribution-system-using.onrender.com/api/shopkeeper/authority/${authorityId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (shopsRes.ok) {
        const shopsData = await shopsRes.json();
        setShops(shopsData);
      }

      // Fetch complaints
      const complaintsRes = await fetch(`https://public-distribution-system-using.onrender.com/api/complaints/authority/${authorityId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (complaintsRes.ok) {
        const complaintsData = await complaintsRes.json();
        setComplaints(complaintsData);
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
      toast.error("Could not fetch data");
    }
  };

  fetchData();
}, [user]); // user prop change hone pe fetch kare


  /* ---------------- FILTERS ---------------- */
  const uniqueShops = shops.map(s => s.shopNo).sort();

  const filteredComplaints = complaints.filter(c => {
    const complaintDate = new Date(c.createdAt);
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    return (
      (filterStatus === 'all' || c.status === filterStatus) &&
      (filterShop === 'all' || c.shopNo === filterShop) &&
      (!from || complaintDate >= from) &&
      (!to || complaintDate <= to)
    );
  });

  /* ---------------- UPDATE STATUS ---------------- */
  const handleUpdateStatus = async (_id, status) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://public-distribution-system-using.onrender.com/api/complaints/${_id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        const updated = await res.json();
        setComplaints(prev => prev.map(c => c._id === updated._id ? updated : c));
        toast.success(`Complaint marked as ${status}`);
      } else {
        const text = await res.text();
        console.error("Update status failed:", text);
        toast.error("Failed to update status");
      }
    } catch (err) {
      console.error("Failed to update status", err);
      toast.error("Failed to update status");
    }
  };

  /* ---------------- RENDER ---------------- */
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={user?.name || "Authority"} role="authority" onLogout={onLogout} />

      <div className="w-full px-6 py-6">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <FileText className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">User Complaints</h1>
          </div>
          <p className="text-gray-600">Monitor and resolve complaints shop-wise</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 flex items-center space-x-4">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{complaints.length}</p>
              <p className="text-sm text-gray-600">Total Complaints</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {complaints.filter(c => c.status === 'Pending').length}
              </p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {complaints.filter(c => c.status === 'Resolved').length}
              </p>
              <p className="text-sm text-gray-600">Resolved</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6 flex flex-col md:flex-row gap-4">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Resolved">Resolved</option>
          </select>

          <select
            value={filterShop}
            onChange={e => setFilterShop(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
            disabled={shops.length === 0}
          >
            <option value="all">All Shops</option>
            {uniqueShops.map(shopNo => (
              <option key={shopNo} value={shopNo}>{shopNo}</option>
            ))}
          </select>

          <input
            type="date"
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
            className="px-4 py-2 border rounded"
          />

          <input
            type="date"
            value={toDate}
            onChange={e => setToDate(e.target.value)}
            className="px-4 py-2 border rounded"
          />
        </div>

        {/* Complaints List */}
        {filteredComplaints.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium mb-2">No Complaints</p>
            <p className="text-sm text-gray-500">All complaints have been processed</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredComplaints.map(c => (
              <div key={c._id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900">{c.citizenName}</h3>
                    <p className="text-sm text-gray-500">
                      Ration ID: {c.rationId} | Phone: {c.phone}
                    </p>
                    <p className="text-sm text-gray-500">Shop No: {c.shopNo}</p>
                  </div>
                  <span className="px-4 py-1 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-700">
                    {c.status}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <p>{c.description}</p>
                  <p className="text-xs text-gray-500">
                    Date: {new Date(c.createdAt).toLocaleDateString()}
                  </p>

                  {c.status !== 'Resolved' && (
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleUpdateStatus(c._id, 'Resolved')}
                        className="px-3 py-1 bg-green-600 text-white rounded"
                      >
                        Resolve
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
