import React, { useState, useEffect } from "react";
import { Building2 } from "lucide-react";
import AuthorityOTPModal from "../components/AuthorityOTPModal";
import CitizenOTPModal from "../components/CitizenOTPModal";
import ShopkeeperOTPModal from "../components/ShopkeeperOTPModal";
import { Link } from "react-router-dom";

export default function LoginPage({ onLogin }) {
  const [role, setRole] = useState("user");
  const [userId, setUserId] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [showOTP, setShowOTP] = useState(false);
  const [showCitizenOTP, setShowCitizenOTP] = useState(false);
  const [showShopkeeperOTP, setShowShopkeeperOTP] = useState(false);

  const [pendingUser, setPendingUser] = useState(null);
  const [pendingCitizen, setPendingCitizen] = useState(null);
  const [pendingShopkeeper, setPendingShopkeeper] = useState(null);

  const [error, setError] = useState("");

  const [redirectToAuthority, setRedirectToAuthority] = useState(false);
  const [redirectToCitizen, setRedirectToCitizen] = useState(false);

  // ===== REDIRECT LOGIC =====
  useEffect(() => {
    if (redirectToAuthority) document.getElementById("redirect-authority")?.click();
  }, [redirectToAuthority]);

  useEffect(() => {
    if (redirectToCitizen) document.getElementById("redirect-citizen")?.click();
  }, [redirectToCitizen]);

  // ===== SEND OTP =====
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");

    const userIdTrimmed = userId.trim();
    const phoneTrimmed = phone.trim();

    const twelveDigitRegex = /^\d{12}$/;
    const authorityRegex = /^[A-Za-z0-9]{6}$/;
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

    // ===== AUTHORITY =====
    if (role === "authority") {
      try {
        const res = await fetch("https://public-distribution-system-using.onrender.com/api/auth/authority/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ authorityId: userIdTrimmed, password }),
        });

        const data = await res.json();
        if (!res.ok) return setError(data.message || "Login failed");

        setPendingUser({ authorityId: data.authorityId, mobile: data.mobile, name: data.name });

        await fetch("https://public-distribution-system-using.onrender.com/api/auth/authority/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ authorityId: data.authorityId }),
        });

        setShowOTP(true);
      } catch {
        setError("Server error. Try again.");
      }
      return;
    }

    // ===== CITIZEN =====
    if (role === "user") {
      try {
        const res = await fetch("https://public-distribution-system-using.onrender.com/api/citizen/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rationId: userIdTrimmed, phone: phoneTrimmed }),
        });

        const data = await res.json();
        if (!res.ok) return setError(data.message || "Failed to send OTP");

        setPendingCitizen({
          rationId: data.rationId,
          mobile: data.phone,
          assignedShop: data.assignedShop || "Not Assigned",
        });

        setShowCitizenOTP(true);
      } catch {
        setError("Server error. Try again.");
      }
      return;
    }

    // ===== SHOPKEEPER =====
    if (role === "shopkeeper") {
      try {
        const res = await fetch("https://public-distribution-system-using.onrender.com/api/shopkeeper/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ shopNo: userIdTrimmed, phone: phoneTrimmed }),
        });

        const data = await res.json();
        if (!res.ok) return setError(data.message || "Failed to send OTP");

        setPendingShopkeeper({
          shopNo: data.shopNo,
          shopName: data.shopName,
          shopOwnerName: data.shopOwnerName,
          phone: data.phone,
        });

        setShowShopkeeperOTP(true);
      } catch {
        setError("Server error. Try again.");
      }
    }
  };

  // ===== VERIFY CITIZEN OTP =====
  const handleCitizenOTPVerify = async (token) => {
    localStorage.setItem("token", token);
    const tokenStr = localStorage.getItem("token");

    try {
      // Fetch profile
      const profileRes = await fetch(
        `https://public-distribution-system-using.onrender.com/api/citizen/profile/${pendingCitizen.rationId}`,
        { headers: { Authorization: `Bearer ${tokenStr}` } }
      );
      const profileData = await profileRes.json();

      // Fetch family
      const familyRes = await fetch(
        `https://public-distribution-system-using.onrender.com/api/citizen/family/${pendingCitizen.rationId}`,
        { headers: { Authorization: `Bearer ${tokenStr}` } }
      );
      const familyData = familyRes.ok ? await familyRes.json() : { members: [] };

      console.log("DEBUG: profileData", profileData);
      console.log("DEBUG: familyData", familyData);

      // Build full user object
      const fullUser = {
        name: profileData.fullName || pendingCitizen.fullName || "Citizen",
        rationId: profileData.rationId,
        phone: profileData.phone || pendingCitizen.mobile,
        assignedShop: pendingCitizen.assignedShop || profileData.assignedShop || "Not Assigned",
        monthlyEntitlement: profileData.monthlyEntitlement || [],
        family: familyData.members || [],
      };

      console.log("DEBUG: fullUser object", fullUser);

      // Save and login
      localStorage.setItem("citizen", JSON.stringify(fullUser));
      onLogin({ role: "citizen", ...fullUser });

      setShowCitizenOTP(false);
      setRedirectToCitizen(true);
    } catch (err) {
      console.error("Citizen login failed", err);
      setError("Failed to fetch citizen profile. Check console.");
    }
  };

  // ===== VERIFY AUTHORITY OTP =====
  const handleOTPVerify = (token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("authority", JSON.stringify(pendingUser));
    setShowOTP(false);
    setRedirectToAuthority(true);
  };

  // ===== VERIFY SHOPKEEPER OTP =====
  const handleShopkeeperOTPVerify = (token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("shopkeeper", JSON.stringify(pendingShopkeeper));
    setShowShopkeeperOTP(false);
    onLogin({ role: "shopkeeper", ...pendingShopkeeper });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
        <div className="text-center mb-6">
          <Building2 className="mx-auto w-12 h-12 text-blue-600" />
          <h1 className="text-2xl font-bold">Smart PDS Portal</h1>
        </div>

        <form onSubmit={handleSendOTP} className="space-y-4">
          <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-2 border rounded">
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
              placeholder="10-digit Phone Number"
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

      {showOTP && <AuthorityOTPModal phone={pendingUser.mobile} authorityId={pendingUser.authorityId} onVerify={handleOTPVerify} onClose={() => setShowOTP(false)} />}
      {showCitizenOTP && <CitizenOTPModal phone={pendingCitizen.mobile} rationId={pendingCitizen.rationId} onVerify={handleCitizenOTPVerify} onClose={() => setShowCitizenOTP(false)} />}
      {showShopkeeperOTP && <ShopkeeperOTPModal phone={pendingShopkeeper.phone} shopNo={pendingShopkeeper.shopNo} onVerify={handleShopkeeperOTPVerify} onClose={() => setShowShopkeeperOTP(false)} />}

      {redirectToAuthority && <Link to="/authority/dashboard" id="redirect-authority" style={{ display: "none" }} />}
      {redirectToCitizen && <Link to="/citizen/dashboard" id="redirect-citizen" style={{ display: "none" }} />}
    </div>
  );
}
