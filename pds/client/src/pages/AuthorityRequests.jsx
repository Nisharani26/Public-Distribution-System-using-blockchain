import React, { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
import { Eye, Clock, CheckCircle, AlertCircle, FileText, Building2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AuthorityRequests({ user, onLogout }) {
  const [complaints, setComplaints] = useState([]);
  const [shops, setShops] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterShop, setFilterShop] = useState('all');
  const [loadingShops, setLoadingShops] = useState(true);
  const [loadingComplaints, setLoadingComplaints] = useState(true);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");


  /* ---------------- DEBUG: Log user ---------------- */
  useEffect(() => {
    console.log("Current user object:", user);
  }, [user]);

  /* ---------------- FETCH SHOPS FOR THIS AUTHORITY ---------------- */
  useEffect(() => {
    if (!user?.authorityId) return;

    async function fetchShops() {
      console.log("Fetching shops for authorityId:", user.authorityId);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/api/shopkeeper/authority/${user.authorityId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("Failed to fetch shops:", text);
          toast.error("Failed to fetch shops");
          setLoadingShops(false);
          return;
        }

        const data = await res.json();
        console.log("Fetched shops:", data);
        setShops(data);
      } catch (err) {
        console.error("Failed to fetch shops:", err);
        toast.error("Failed to fetch shops");
      } finally {
        setLoadingShops(false);
      }
    }

    fetchShops();
  }, [user?.authorityId]);

  /* ---------------- FETCH COMPLAINTS FOR THIS AUTHORITY ---------------- */
  useEffect(() => {
    if (!user?.authorityId) return;

    async function fetchComplaints() {
      console.log("Fetching complaints for authorityId:", user.authorityId);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/api/complaints/authority/${user.authorityId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("Fetch complaints failed:", text);
          toast.error("Failed to fetch complaints");
          setLoadingComplaints(false);
          return;
        }

        const data = await res.json();
        console.log("Fetched complaints:", data);
        setComplaints(data);
      } catch (err) {
        console.error("Failed to fetch complaints:", err);
        toast.error("Could not fetch complaints");
      } finally {
        setLoadingComplaints(false);
      }
    }

    fetchComplaints();
  }, [user?.authorityId]);

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


  const shopStats = uniqueShops.map(shopNo => {
    const shopComplaints = complaints.filter(c => c.shopNo === shopNo);
    return {
      shopNo,
      total: shopComplaints.length,
      pending: shopComplaints.filter(c => c.status === 'Pending').length,
      resolved: shopComplaints.filter(c => c.status === 'Resolved').length
    };
  });

  /* ---------------- UPDATE STATUS ---------------- */
  const handleUpdateStatus = async (_id, status) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/complaints/${_id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Update status failed:", text);
        toast.error("Failed to update status");
        return;
      }

      const updated = await res.json();
      console.log("Updated complaint:", updated);
      setComplaints(prev => prev.map(c => c._id === updated._id ? updated : c));
      toast.success(`Complaint marked as ${status}`);
    } catch (err) {
      console.error("Failed to update status", err);
      toast.error("Failed to update status");
    }
  };

  /* ---------------- RENDER ---------------- */
  if (!user?.authorityId) {
    return <p className="text-gray-500 p-6">Loading user information...</p>;
  }

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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

          <div className="bg-white rounded-lg shadow p-6 flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {shopStats.reduce((max, s) => s.total > max ? s.total : max, 0)}
              </p>
              <p className="text-sm text-gray-600">Top Shop Complaints</p>
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
            disabled={loadingShops}
          >
            <option value="all">All Shops</option>
            {uniqueShops.map(shopNo => (
              <option key={shopNo} value={shopNo}>{shopNo}</option>
            ))}
          </select>

          {/* ✅ ONLY ADDITION — MONTH FILTER */}
          <input
            type="date"
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
            className="px-4 py-2 border rounded"
            placeholder="From date"
          />

          <input
            type="date"
            value={toDate}
            onChange={e => setToDate(e.target.value)}
            className="px-4 py-2 border rounded"
            placeholder="To date"
          />

        </div>

        {/* Complaints List */}
        {loadingComplaints ? (
          <p className="text-gray-500">Loading complaints...</p>
        ) : filteredComplaints.length === 0 ? (
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
