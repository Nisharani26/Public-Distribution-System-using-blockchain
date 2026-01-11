import React, { useState, useEffect } from "react";
import { Building2 } from "lucide-react";
import OTPModal from "../components/OTPModal";
import PasswordSetupModal from "../components/PasswordSetupModal";
import { Link } from "react-router-dom";

const MOCK_USERS = {
    "123456789012": {
        name: "Rajesh Kumar",
        role: "user",
        phone: "9876543210",
        isFirstLogin: false,
    },
    "999999999999": {
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

export default function LoginPage() {
    const [role, setRole] = useState("user");
    const [userId, setUserId] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [showOTP, setShowOTP] = useState(false);
    const [showPasswordSetup, setShowPasswordSetup] = useState(false);
    const [pendingUser, setPendingUser] = useState(null);
    const [error, setError] = useState("");
    const [redirectToAuthority, setRedirectToAuthority] = useState(false);

    useEffect(() => {
        if (redirectToAuthority) {
            const link = document.getElementById("redirect-link");
            link.click();
        }
    }, [redirectToAuthority]);

    const handleSendOTP = (e) => {
        e.preventDefault();
        setError("");

        const twelveDigitRegex = /^\d{12}$/;
        const authorityRegex = /^ADM\d{3}$/;
        const phoneRegex = /^\d{10}$/;
        const passwordRegex = /^.{8,}$/;

        if ((role === "user" || role === "shopkeeper") && !twelveDigitRegex.test(userId)) {
            setError("ID must be a valid 12-digit number");
            return;
        }

        if (role === "authority" && !authorityRegex.test(userId)) {
            setError("Invalid Authority ID format");
            return;
        }

        if (role !== "authority" && !phoneRegex.test(phone)) {
            setError("Mobile number must be 10 digits");
            return;
        }

        if (role === "authority" && !passwordRegex.test(password)) {
            setError("Password must be at least 8 characters");
            return;
        }

        const user = MOCK_USERS[userId];

        if (role === "authority") {
            fetch("http://localhost:5000/api/auth/authority/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    authorityId: userId,
                    password: password,
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (!data.token) {
                        setError(data.message || "Login failed");
                        return;
                    }

                    // Save JWT
                    localStorage.setItem("token", data.token);

                    // Redirect to dashboard
                    setPendingUser(data.authority);
                    setRedirectToAuthority(true);
                })
                .catch(() => {
                    setError("Server error. Try again.");
                });

            return;
        }


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
            setShowOTP(false);
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
                        placeholder={
                            role === "user"
                                ? "12-digit Ration Card No"
                                : role === "shopkeeper"
                                    ? "12-digit Shop No"
                                    : "ADM001"
                        }
                        value={userId}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (role === "authority") {
                                setUserId(value.toUpperCase());
                            } else {
                                if (/^\d*$/.test(value) && value.length <= 12) {
                                    setUserId(value);
                                }
                            }
                        }}
                        className="w-full p-2 border rounded"
                    />

                    {role !== "authority" && (
                        <input
                            type="text"
                            placeholder="10-digit Phone Number"
                            value={phone}
                            onChange={(e) => {
                                if (/^\d*$/.test(e.target.value) && e.target.value.length <= 10) {
                                    setPhone(e.target.value);
                                }
                            }}
                            className="w-full p-2 border rounded"
                        />
                    )}

                    {role === "authority" && (
                        <input
                            type="password"
                            placeholder="Minimum 8 characters"
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
                    onComplete={() => setShowPasswordSetup(false)}
                    onClose={() => setShowPasswordSetup(false)}
                />
            )}

            {redirectToAuthority && (
                <Link
                    to="/authority/dashboard"
                    state={{ user: pendingUser }}
                    style={{ display: "none" }}
                    id="redirect-link"
                />
            )}
        </div>
    );
}
