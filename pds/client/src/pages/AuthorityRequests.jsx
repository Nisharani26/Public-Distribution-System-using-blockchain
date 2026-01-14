import React, { useState } from 'react';
import Navbar from "../components/Navbar";
import { FileText, Eye, User, Building2, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const ALL_COMPLAINTS = [
  { 
    id: 1,
    type: 'Service',
    userName: 'Mohan Lal',
    rationId: 'RAT123465',
    phone: '9876543220',
    shopName: 'Sunita Provisions',
    shopId: 'SHP001',
    address: 'Sector 12, Rohini, New Delhi',
    description: 'Stock of wheat not sufficient for the month',
    date: '2026-01-06',
    status: 'Pending'
  },
  { 
    id: 2,
    type: 'Allocation',
    userName: 'Kavita Sharma',
    rationId: 'RAT123466',
    phone: '9876543221',
    shopName: 'Ganesh Store',
    shopId: 'SHP002',
    address: 'Sector 25, Dwarka, New Delhi',
    description: 'Received wrong quantity of sugar',
    date: '2026-01-05',
    status: 'Pending'
  },
  { 
    id: 3,
    type: 'General',
    userName: 'Deepak Kumar',
    rationId: 'RAT123467',
    phone: '9876543222',
    shopName: 'Sunita Provisions',
    shopId: 'SHP001',
    address: 'Sector 5, Pitampura, New Delhi',
    description: 'Ration card not updated in system',
    date: '2026-01-04',
    status: 'Resolved'
  },
  { 
    id: 4,
    type: 'Service',
    userName: 'Meera Singh',
    rationId: 'RAT123468',
    phone: '9876543223',
    shopName: 'Krishna Stores',
    shopId: 'SHP003',
    address: 'Sector 8, Vasundhara, New Delhi',
    description: 'Long wait time at shop counter',
    date: '2026-01-03',
    status: 'In Progress'
  },
];

export default function AuthorityRequests({ user, onLogout }) {
  const [complaints, setComplaints] = useState(ALL_COMPLAINTS);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterShop, setFilterShop] = useState('all');

  const uniqueShops = Array.from(new Set(ALL_COMPLAINTS.map(c => c.shopName))).sort();

  const filteredComplaints = complaints.filter(c => 
    (filterType === 'all' || c.type === filterType) &&
    (filterStatus === 'all' || c.status === filterStatus) &&
    (filterShop === 'all' || c.shopName === filterShop)
  );

  const shopStats = uniqueShops.map(shop => {
    const shopComplaints = complaints.filter(c => c.shopName === shop);
    return {
      shop,
      total: shopComplaints.length,
      pending: shopComplaints.filter(c => c.status === 'Pending').length,
      resolved: shopComplaints.filter(c => c.status === 'Resolved').length
    };
  });

  const handleUpdateStatus = (id, status) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    toast.success(`Complaint marked as ${status}`);
  };

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
          <p className="text-gray-600">Monitor and resolve complaints from users shop-wise</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 flex items-center space-x-4">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600" />
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
              <p className="text-2xl font-bold text-gray-900">{complaints.filter(c => c.status === 'Pending').length}</p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{complaints.filter(c => c.status === 'Resolved').length}</p>
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
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Types</option>
            <option value="Service">Service Issues</option>
            <option value="Allocation">Incorrect Allocation</option>
            <option value="General">General Complaints</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          <select
            value={filterShop}
            onChange={(e) => setFilterShop(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Shops</option>
            {uniqueShops.map(shop => (
              <option key={shop} value={shop}>{shop}</option>
            ))}
          </select>
        </div>

        {/* Shop-wise Complaints */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-4">Shop-wise Complaint Summary</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Shop</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Total</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Pending</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Resolved</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {shopStats.map(shop => (
                  <tr key={shop.shop}>
                    <td className="px-4 py-2">{shop.shop}</td>
                    <td className="px-4 py-2">{shop.total}</td>
                    <td className="px-4 py-2">{shop.pending}</td>
                    <td className="px-4 py-2">{shop.resolved}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Complaints List */}
        <div className="space-y-6">
          {filteredComplaints.map(c => (
            <div key={c.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    c.type === 'Service' ? 'bg-blue-100' :
                    c.type === 'Allocation' ? 'bg-yellow-100' : 'bg-green-100'
                  }`}>
                    <FileText className="w-6 h-6 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{c.userName}</h3>
                    <p className="text-sm text-gray-500">{c.shopName} ({c.shopId})</p>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      c.type === 'Service' ? 'bg-blue-100 text-blue-800' :
                      c.type === 'Allocation' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {c.type} Complaint
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium text-gray-900">{c.status}</p>
                </div>
              </div>

              <div className="p-6 space-y-3">
                <p className="text-gray-700">{c.description}</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => toast(`Viewing full complaint for ${c.userName}`)}
                    className="flex-1 inline-flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                  >
                    <Eye className="w-5 h-5" />
                    <span>View</span>
                  </button>

                  {c.status !== 'Resolved' && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(c.id, 'In Progress')}
                        className="flex-1 inline-flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        <Clock className="w-5 h-5" />
                        <span>Mark In Progress</span>
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(c.id, 'Resolved')}
                        className="flex-1 inline-flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                      >
                        <CheckCircle className="w-5 h-5" />
                        <span>Resolve</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredComplaints.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium mb-2">No Complaints</p>
            <p className="text-sm text-gray-500">All complaints have been processed</p>
          </div>
        )}
      </div>
    </div>
  );
}
