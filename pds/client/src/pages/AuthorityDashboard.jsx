import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Users, Building2, TrendingUp, Package } from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";

// Mock Data
const monthlyDistribution = [
    { month: "Jul", rice: 1200, wheat: 950, sugar: 280 },
    { month: "Aug", rice: 1350, wheat: 1020, sugar: 310 },
    { month: "Sep", rice: 1280, wheat: 980, sugar: 290 },
    { month: "Oct", rice: 1400, wheat: 1100, sugar: 330 },
    { month: "Nov", rice: 1320, wheat: 1050, sugar: 305 },
    { month: "Dec", rice: 1450, wheat: 1150, sugar: 340 },
];

const stockByItem = [
    { name: "Rice", value: 4500, color: "#3b82f6" },
    { name: "Wheat", value: 3200, color: "#f59e0b" },
    { name: "Sugar", value: 890, color: "#ec4899" },
    { name: "Cooking Oil", value: 240, color: "#10b981" },
];

const pendingActions = [
    { id: 1, title: "3 Pending Complaints", status: "pending" },
    { id: 2, title: "2 Shops Low Stock", status: "warning" },
    { id: 3, title: "5 Unverified Transactions", status: "alert" },
];

export default function AuthorityDashboard() {
    const [user, setUser] = useState(null);

    // Get user info from localStorage
    useEffect(() => {
        const storedAuthority = localStorage.getItem("authority");
        if (storedAuthority) {
            setUser(JSON.parse(storedAuthority)); // now name, mobile, etc. are available
        }
    }, []);


    // Logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("authority");
        window.location.href = "/";
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <h1 className="text-xl font-bold text-red-600">
                    Error: User not found. Please login first.
                </h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar userName={user.name} role="authority" onLogout={handleLogout} />

            <div className="max-w-full px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-purple-500 to-purple-400 rounded-xl p-6 mb-8 shadow-lg flex flex-col sm:flex-row items-center justify-between">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 drop-shadow-lg">
                            Welcome, {user.name}!
                        </h1>
                        <p className="text-white/90 text-sm sm:text-base drop-shadow-sm">
                            District Overview:{" "}
                            <span className="font-semibold">
                                {new Date().toLocaleDateString("en-IN", {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </span>
                        </p>
                    </div>

                    <div className="mt-4 sm:mt-0 flex items-center">
                        <Users className="w-14 h-14 text-white opacity-90 mr-4" />
                        <div className="text-white/90 text-sm sm:text-base">
                            Have a productive day managing distributions!
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">1,847</h3>
                        <p className="text-sm sm:text-base text-gray-600">Total Registered Users</p>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                            <Building2 className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">15</h3>
                        <p className="text-sm sm:text-base text-gray-600">Active Fair Price Shops</p>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                        <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-2">
                            <TrendingUp className="w-6 h-6 text-amber-600" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">4,283</h3>
                        <p className="text-sm sm:text-base text-gray-600">Distributions This Month</p>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                            <Package className="w-6 h-6 text-purple-600" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">8,830 kg</h3>
                        <p className="text-sm sm:text-base text-gray-600">Total Stock Remaining</p>
                    </div>
                </div>

                {/* Pending Complaints */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Pending Actions Required</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {pendingActions.map((complaint) => (
                            <div
                                key={complaint.id}
                                className={`p-5 rounded-xl border-l-4 shadow-md flex flex-col justify-center ${complaint.status === "pending"
                                        ? "border-blue-400 bg-blue-50 text-blue-800"
                                        : complaint.status === "warning"
                                            ? "border-amber-400 bg-amber-50 text-amber-800"
                                            : "border-red-400 bg-red-50 text-red-800"
                                    } hover:scale-105 transition-transform duration-300`}
                            >
                                <p className="font-semibold text-base sm:text-lg">{complaint.title}</p>
                                <p className="text-xs text-gray-500 mt-1">Click to view details</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Monthly Distribution Chart */}
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Monthly Distribution Trends</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={monthlyDistribution}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="rice" fill="#3b82f6" name="Rice (kg)" />
                            <Bar dataKey="wheat" fill="#f59e0b" name="Wheat (kg)" />
                            <Bar dataKey="sugar" fill="#ec4899" name="Sugar (kg)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Current Stock Distribution Pie Chart */}
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Current Stock Distribution</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={stockByItem}
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                dataKey="value"
                                label={({ name, value }) => `${name}: ${value}kg`}
                            >
                                {stockByItem.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
