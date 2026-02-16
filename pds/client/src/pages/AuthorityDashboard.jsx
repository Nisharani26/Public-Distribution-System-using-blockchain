import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Users, Building2 } from "lucide-react";
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

// Mock Data (unchanged)
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
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalShops, setTotalShops] = useState(0);

    useEffect(() => {
        const storedAuthority = localStorage.getItem("authority");
        if (storedAuthority) {
            setUser(JSON.parse(storedAuthority));
        }

        const fetchAuthorityData = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("No token found");
                return;
            }

            try {
                const res = await fetch("https://public-distribution-system-using.onrender.com/api/auth/authority/dashboard", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                const data = await res.json();

                if (!res.ok) {
                    console.error("Dashboard error:", data);
                    return;
                }

                localStorage.setItem("authority", JSON.stringify(data.authority));
                setUser(data.authority);

            } catch (err) {
                console.error("Dashboard fetch error:", err);
            }
        };

        const fetchCounts = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                // Fetch users
                const usersRes = await fetch("https://public-distribution-system-using.onrender.com/api/auth/authUsers/all", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const usersData = await usersRes.json();
                setTotalUsers(Array.isArray(usersData) ? usersData.length : 0);

                // Fetch shops
                const shopsRes = await fetch("https://public-distribution-system-using.onrender.com/api/auth/authShops/all", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const shopsData = await shopsRes.json();
                setTotalShops(Array.isArray(shopsData) ? shopsData.length : 0);

            } catch (err) {
                console.error("Error fetching counts:", err);
            }
        };

        fetchAuthorityData();
        fetchCounts();
    }, []);

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
            <Navbar userName={user.name || user.authorityId} role="authority" onLogout={handleLogout} />

            <div className="max-w-full px-4 sm:px-6 lg:px-8 py-8">

                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-purple-500 to-purple-400 rounded-xl p-6 mb-8 shadow-lg flex flex-col sm:flex-row items-center justify-between">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
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

                {/* Stats Cards (ONLY 2 CARDS NOW) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">

                    {/* Total Users */}
                    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{totalUsers}</h3>
                        <p className="text-sm sm:text-base text-gray-600">Total Users</p>
                    </div>

                    {/* Total Shops */}
                    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                            <Building2 className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{totalShops}</h3>
                        <p className="text-sm sm:text-base text-gray-600">Total Shops</p>
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
