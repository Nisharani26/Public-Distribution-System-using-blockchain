import React, { useState } from "react";
import { User, Lock, Phone, Building2 } from "lucide-react";
import OTPModal from "../components/OTPModal";
import PasswordSetupModal from "../components/PasswordSetupModal";

// Mock users
const MOCK_USERS = {
    RAT123456: {
        name: "Rajesh Kumar",
        role: "user",
        phone: "9876543210",
        isFirstLogin: false,
    },
    SHP001: {
        name: "Sunita Provisions",
        role: "shopkeeper",
        phone: "9123456789",
        isFirstLogin: false,
    },
    ADM001: {
        name: "District Administrator",
        role: "authority",
        phone: "9000000001",
        password: "admin123",
        isFirstLogin: false,
    },
};

export default function LoginPage({ onLogin }) {
    const [role, setRole] = useState("user");
    const [userId, setUserId] = useState("");
    const [phone, setPhone] = useState("");
    const [showOTP, setShowOTP] = useState(false);
    const [showPasswordSetup, setShowPasswordSetup] = useState(false);
    const [password, setPassword] = useState("");
    const [pendingUser, setPendingUser] = useState(null);
    const [error, setError] = useState("");

    const handleSendOTP = (e) => {
        e.preventDefault();
        setError("");

        const user = MOCK_USERS[userId];

        // Authority login using password
        if (role === "authority") {
            if (!user || user.password !== password) {
                setError("Invalid Authority ID or Password");
                return;
            }
            onLogin({ id: userId, ...user });
            return;
        }

        // OTP login for others
        if (!user || user.role !== role || user.phone !== phone) {
            setError("Invalid credentials");
            return;
        }

        setPendingUser({ id: userId, ...user });
        setShowOTP(true);
    };

    const handleOTPVerify = () => {
        if (pendingUser.isFirstLogin) {
            setShowOTP(false);
            setShowPasswordSetup(true);
        } else {
            onLogin(pendingUser);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-100 px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
                <div className="text-center mb-6">
                    <Building2 className="mx-auto w-12 h-12 text-blue-600" />
                    <h1 className="text-2xl font-bold">Smart PDS Portal</h1>
                </div>

                <form onSubmit={handleSendOTP} className="space-y-4">
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full p-2 border rounded"
                    >
                        <option value="user">Citizen</option>
                        <option value="shopkeeper">Shopkeeper</option>
                        <option value="authority">Authority</option>
                    </select>

                    <input
                        type="text"
                        placeholder="ID"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value.toUpperCase())}
                        className="w-full p-2 border rounded"
                    />

                    {role !== "authority" && (
                        <input
                            type="text"
                            placeholder="Phone Number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    )}
                    {role === "authority" && (
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    )}


                    {error && <p className="text-red-600 text-sm">{error}</p>}

                    <button className="w-full bg-blue-600 text-white py-2 rounded">
                        {role === "authority" ? "Login" : "Send OTP"}
                    </button>
                </form>
            </div>

            {showOTP && (
                <OTPModal
                    phone={phone}
                    onVerify={handleOTPVerify}
                    onClose={() => setShowOTP(false)}
                />
            )}

            {showPasswordSetup && (
                <PasswordSetupModal
                    onComplete={() => onLogin(pendingUser)}
                    onClose={() => setShowPasswordSetup(false)}
                />
            )}
        </div>
    );
}
