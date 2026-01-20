import React, { useState, useEffect } from "react";
import { Building2 } from "lucide-react";
import AuthorityOTPModal from "../components/AuthorityOTPModal";
import CitizenOTPModal from "../components/CitizenOTPModal";
import ShopkeeperOTPModal from "../components/ShopkeeperOTPModal";
import PasswordSetupModal from "../components/PasswordSetupModal";
import { Link } from "react-router-dom";

export default function LoginPage({ onLogin }) {
  const [role, setRole] = useState("user");
  const [userId, setUserId] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [showCitizenOTP, setShowCitizenOTP] = useState(false);
  const [showShopkeeperOTP, setShowShopkeeperOTP] = useState(false);
  const [showPasswordSetup, setShowPasswordSetup] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);
  const [pendingCitizen, setPendingCitizen] = useState(null);
  const [pendingShopkeeper, setPendingShopkeeper] = useState(null);
  const [error, setError] = useState("");
  const [redirectToAuthority, setRedirectToAuthority] = useState(false);

  useEffect(() => {
    if (redirectToAuthority) {
      const link = document.getElementById("redirect-link");
      link?.click();
    }
  }, [redirectToAuthority]);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");

    const userIdTrimmed = userId.trim();
    const phoneTrimmed = phone.trim();

    const twelveDigitRegex = /^\d{12}$/;
    const authorityRegex = /^[A-Za-z0-9]{6}$/;
    const phoneRegex = /^\d{10}$/;
    const passwordRegex = /^.{8,}$/;

    if ((role === "user" || role === "shopkeeper") && !twelveDigitRegex.test(userIdTrimmed)) {
      setError("ID must be a valid 12-digit number");
      return;
    }

    if (role === "authority" && !authorityRegex.test(userIdTrimmed)) {
      setError("Authority ID must be 6 characters long and contain letters & numbers");
      return;
    }

    if (role === "authority" && !passwordRegex.test(password)) {
      setError("Password must be at least 8 characters");
      return;
    }

    // ===== AUTHORITY LOGIN =====
    if (role === "authority") {
      try {
        const res = await fetch("http://localhost:5000/api/auth/authority/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ authorityId: userIdTrimmed, password }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || "Login failed");
          return;
        }

        setPendingUser({
          authorityId: data.authorityId,
          mobile: data.mobile,
          name: data.name,
        });

        await fetch("http://localhost:5000/api/auth/authority/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ authorityId: data.authorityId }),
        });

        setShowOTP(true);
      } catch (err) {
        console.error(err);
        setError("Server error. Try again.");
      }
      return;
    }

    // ===== CITIZEN LOGIN =====
    if (role === "user") {
      try {
        const res = await fetch("http://localhost:5000/api/citizen/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rationId: userIdTrimmed, phone: phoneTrimmed }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || "Failed to send OTP");
          return;
        }

        setPendingCitizen({
          rationId: data.rationId,
          name: data.name,
          mobile: data.phone,
          assignedShop: data.assignedShop || "Not Assigned",
        });

        setShowCitizenOTP(true);
      } catch (err) {
        console.error(err);
        setError("Server error. Try again.");
      }
      return;
    }

    // ===== SHOPKEEPER LOGIN =====
    if (role === "shopkeeper") {
      try {
        const res = await fetch("http://localhost:5000/api/shopkeeper/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ shopNo: userIdTrimmed, phone: phoneTrimmed }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || "Failed to send OTP");
          return;
        }

        setPendingShopkeeper({
          shopNo: data.shopNo,
          shopName: data.shopName,
          shopOwnerName: data.shopOwnerName,
          phone: data.phone,
        });

        setShowShopkeeperOTP(true);
      } catch (err) {
        console.error(err);
        setError("Server error. Try again.");
      }
      return;
    }
  };

  // ===== OTP VERIFY HANDLERS =====
  const handleOTPVerify = (token) => {
    localStorage.setItem("token", token);
    if (pendingUser) localStorage.setItem("authority", JSON.stringify(pendingUser));
    setShowOTP(false);
    setRedirectToAuthority(true);
  };

  const handleCitizenOTPVerify = (token) => {
    localStorage.setItem("token", token);
    if (pendingCitizen) localStorage.setItem("citizen", JSON.stringify(pendingCitizen));
    setShowCitizenOTP(false);
    onLogin && onLogin({ role: "citizen", ...pendingCitizen });
  };

  const handleShopkeeperOTPVerify = (token) => {
    localStorage.setItem("token", token);
    if (pendingShopkeeper) localStorage.setItem("shopkeeper", JSON.stringify(pendingShopkeeper));
    setShowShopkeeperOTP(false);
    onLogin && onLogin({ role: "shopkeeper", ...pendingShopkeeper });
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
            placeholder={role === "user" ? "12-digit Ration Card No" : "Authority / Shop No"}
            value={userId}
            onChange={(e) => {
              const val = e.target.value;
              if (role === "authority") setUserId(val.toUpperCase());
              else if (/^\d*$/.test(val) && val.length <= 12) setUserId(val);
            }}
            className="w-full p-2 border rounded"
          />

          {role !== "authority" && (
            <input
              type="text"
              placeholder="10-digit Phone Number (Optional)"
              value={phone}
              onChange={(e) => {
                const val = e.target.value;
                if (/^\d*$/.test(val) && val.length <= 10) setPhone(val);
              }}
              className="w-full p-2 border rounded"
            />
          )}

          {role === "authority" && (
            <input
              type="password"
              placeholder="Password (min 8 chars)"
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

      {showOTP && pendingUser && (
        <AuthorityOTPModal
          phone={pendingUser.mobile}
          authorityId={pendingUser.authorityId}
          onVerify={handleOTPVerify}
          onClose={() => setShowOTP(false)}
        />
      )}

      {showCitizenOTP && pendingCitizen && (
        <CitizenOTPModal
          phone={pendingCitizen.mobile}
          rationId={pendingCitizen.rationId}
          onVerify={handleCitizenOTPVerify}
          onClose={() => setShowCitizenOTP(false)}
        />
      )}

      {showShopkeeperOTP && pendingShopkeeper && (
        <ShopkeeperOTPModal
          phone={pendingShopkeeper.phone}
          shopNo={pendingShopkeeper.shopNo}
          onVerify={handleShopkeeperOTPVerify}
          onClose={() => setShowShopkeeperOTP(false)}
        />
      )}

      {showPasswordSetup && (
        <PasswordSetupModal
          onComplete={() => setShowPasswordSetup(false)}
          onClose={() => setShowPasswordSetup(false)}
        />
      )}

      {redirectToAuthority && (
        <Link to="/authority/dashboard" style={{ display: "none" }} id="redirect-link" />
      )}
    </div>
  );
}
