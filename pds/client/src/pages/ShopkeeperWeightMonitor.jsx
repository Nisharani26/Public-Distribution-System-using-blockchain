import React, { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
import { Scale, User, Package, DollarSign, CheckCircle, MessageSquare, Shield } from 'lucide-react';
import { toast } from 'sonner';

const USERS_LIST = [
  { rationId: 'RAT123456', name: 'Rajesh Kumar' },
  { rationId: 'RAT123457', name: 'Priya Sharma' },
  { rationId: 'RAT123458', name: 'Amit Patel' },
  { rationId: 'RAT123459', name: 'Sunita Devi' },
  { rationId: 'RAT123460', name: 'Ramesh Gupta' },
];

const ITEMS_LIST = [
  { name: 'Rice', pricePerKg: 3.5, unit: 'kg' },
  { name: 'Wheat', pricePerKg: 4, unit: 'kg' },
  { name: 'Sugar', pricePerKg: 5, unit: 'kg' },
  { name: 'Cooking Oil', pricePerKg: 12, unit: 'liter' },
];

export default function ShopkeeperWeightMonitor({ user, onLogout }) {
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [liveWeight, setLiveWeight] = useState(0);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [transactionComplete, setTransactionComplete] = useState(false);

  // Simulate IoT weight sensor
  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(() => {
        // Simulate fluctuating weight reading
        const randomWeight = (Math.random() * 0.5 + 2.5).toFixed(2);
        setLiveWeight(Number(randomWeight));
      }, 500);

      return () => clearInterval(interval);
    } else {
      setLiveWeight(0);
    }
  }, [isMonitoring]);

  const handleStartMonitoring = () => {
    if (!selectedUser || !selectedItem) {
      toast.error('Please select both user and item');
      return;
    }
    setIsMonitoring(true);
    toast.success('Weight monitoring started');
  };

  const handleStopMonitoring = () => {
    setIsMonitoring(false);
    if (liveWeight > 0) {
      setShowConfirmModal(true);
    }
  };

  const handleConfirmTransaction = () => {
    // Simulate transaction processing
    toast.success('Transaction confirmed! SMS sent to user.');
    setShowConfirmModal(false);
    setTransactionComplete(true);
    setIsMonitoring(false);
    
    setTimeout(() => {
      setTransactionComplete(false);
      setSelectedUser('');
      setSelectedItem('');
      setLiveWeight(0);
    }, 3000);
  };

  const selectedItemData = ITEMS_LIST.find((item) => item.name === selectedItem);
  const calculatedAmount = selectedItemData ? (liveWeight * selectedItemData.pricePerKg).toFixed(2) : '0.00';
  const selectedUserData = USERS_LIST.find((u) => u.rationId === selectedUser);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={user.name} role="shopkeeper" onLogout={onLogout} />

      <div className="max-w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Scale className="w-8 h-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">IoT Weight Monitor</h1>
          </div>
          <p className="text-gray-600">Real-time weight measurement and distribution tracking</p>
        </div>

        {/* Selection Panel */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Select User & Item</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Select User */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select User
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  disabled={isMonitoring}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                >
                  <option value="">Choose a user...</option>
                  {USERS_LIST.map((u) => (
                    <option key={u.rationId} value={u.rationId}>
                      {u.name} ({u.rationId})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Select Item */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Item
              </label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={selectedItem}
                  onChange={(e) => setSelectedItem(e.target.value)}
                  disabled={isMonitoring}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                >
                  <option value="">Choose an item...</option>
                  {ITEMS_LIST.map((item) => (
                    <option key={item.name} value={item.name}>
                      {item.name} (₹{item.pricePerKg}/{item.unit})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Weight Monitor Display */}
        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg shadow-xl p-8 mb-6 text-white">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Live Weight Reading</h2>
            <div className="flex items-center space-x-2">
              <Scale className="w-6 h-6" />
              <span className="text-green-200">IoT Device Connected</span>
            </div>
          </div>

          {/* Weight Display */}
          <div className="bg-white bg-opacity-20 rounded-lg p-8 mb-6 backdrop-blur-sm">
            <div className="text-center">
              <div className="text-7xl font-bold mb-2 font-mono">
                {liveWeight.toFixed(2)}
              </div>
              <div className="text-2xl font-medium opacity-90">
                {selectedItemData?.unit || 'kg'}
              </div>
              {isMonitoring && (
                <div className="mt-4 flex items-center justify-center space-x-2">
                  <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse"></div>
                  <span className="text-sm">Measuring...</span>
                </div>
              )}
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex gap-4">
            {!isMonitoring ? (
              <button
                onClick={handleStartMonitoring}
                disabled={!selectedUser || !selectedItem}
                className="flex-1 bg-white text-green-700 py-4 rounded-lg hover:bg-green-50 transition-colors font-bold text-lg disabled:bg-gray-300 disabled:text-gray-500"
              >
                Start Weighing
              </button>
            ) : (
              <button
                onClick={handleStopMonitoring}
                className="flex-1 bg-red-500 text-white py-4 rounded-lg hover:bg-red-600 transition-colors font-bold text-lg"
              >
                Stop & Confirm
              </button>
            )}
          </div>
        </div>

        {/* Transaction Summary */}
        {selectedUser && selectedItem && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Transaction Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">User</p>
                  <p className="font-medium text-gray-900">{selectedUserData?.name}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Item</p>
                  <p className="font-medium text-gray-900">{selectedItem}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Scale className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Weight</p>
                  <p className="font-medium text-gray-900">{liveWeight.toFixed(2)} {selectedItemData?.unit}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Amount</p>
                  <p className="font-medium text-gray-900">₹{calculatedAmount}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transaction Complete */}
        {transactionComplete && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-green-900 mb-1">Transaction Completed Successfully!</h3>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-green-700">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4" />
                    <span>SMS sent to user</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>Blockchain record created</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Transaction Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
              Confirm Distribution
            </h2>
            <p className="text-center text-gray-600 mb-6">
              Please verify the transaction details
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">User:</span>
                <span className="font-medium text-gray-900">{selectedUserData?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Item:</span>
                <span className="font-medium text-gray-900">{selectedItem}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Weight:</span>
                <span className="font-medium text-gray-900">{liveWeight.toFixed(2)} {selectedItemData?.unit}</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="text-gray-900 font-medium">Amount to Pay:</span>
                <span className="text-xl font-bold text-green-600">₹{calculatedAmount}</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleConfirmTransaction}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Confirm & Complete Transaction
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
